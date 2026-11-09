// ═══════════════════════════════════════════════════════════════════
//  POST /api/brief  –  Cloudflare Pages Function
//
//  Riceve il brief (multipart/form-data), verifica Turnstile, valida,
//  salva file + brief.md + brief.json su R2 (binding BRIEF_UPLOADS),
//  invia via Resend l'email a bento box a te e la conferma al cliente.
//
//  Binding / variabili (vedi README_BRIEF.md):
//    BRIEF_UPLOADS         R2 bucket
//    RESEND_API_KEY        secret
//    TURNSTILE_SECRET_KEY  secret
//    BRIEF_FILE_SECRET     secret (firma i link ai file)
//    BRIEF_TO_EMAIL        destinatario (anche più indirizzi separati da virgola)
//    BRIEF_FROM_EMAIL      mittente su dominio verificato in Resend
//    SITE_URL              (facoltativa) es. https://tuodominio.it
// ═══════════════════════════════════════════════════════════════════

const MAX_FILES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_BODY = 45 * 1024 * 1024;
const MAX_INSPO = 5;

const FILE_TYPES = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  svg:  'image/svg+xml',
  pdf:  'application/pdf',
};

// ─── Etichette (stesse del form) ─────────────────────────────────
const L = {
  settore: {
    ristorazione: 'Ristorazione / bar', ospitalita: 'Hotel / B&B / ospitalità', negozio: 'Negozio / commercio',
    benessere: 'Benessere / estetica', salute: 'Salute / studio medico', professionista: 'Libero professionista / studio',
    artigianato: 'Artigianato / produzione', casa: 'Casa / edilizia / impianti', sport: 'Sport / fitness',
    eventi: 'Eventi / intrattenimento', associazione: 'Associazione / no profit', altro: 'Altro',
  },
  obiettivo: {
    trovare: 'Farsi trovare online', contatti: 'Ricevere contatti e richieste', portfolio: 'Mostrare i lavori (portfolio)',
    prenotazioni: 'Ricevere prenotazioni', vendere: 'Vendere online', altro: 'Altro',
  },
  sezioni: {
    home: 'Home', chi_siamo: 'Chi siamo', servizi: 'Servizi', portfolio: 'Portfolio / gallery', menu: 'Menu / listino',
    recensioni: 'Recensioni', faq: 'FAQ', contatti: 'Contatti', blog: 'Blog / news', altro: 'Altro',
  },
  lingue: { it: 'Italiano', en: 'Inglese', de: 'Tedesco', fr: 'Francese', es: 'Spagnolo', altro: 'Altra' },
  possesso: { si: 'Sì', in_parte: 'In parte', no: 'No' },
  logo: { si: 'Sì', in_parte: 'Da sistemare', no: 'No' },
  aggettivi: {
    minimal: 'Minimal', elegante: 'Elegante', accogliente: 'Accogliente', moderno: 'Moderno', classico: 'Classico',
    audace: 'Audace', giocoso: 'Giocoso', naturale: 'Naturale', lussuoso: 'Lussuoso', artigianale: 'Artigianale',
    tecnico: 'Tecnico', colorato: 'Colorato',
  },
  extra: {
    logo: 'Logo', brand: 'Mini brand identity', foto: 'Servizio fotografico sul posto', biglietti: 'Biglietti da visita',
    stampati: 'Materiale stampato', social: 'Kit grafico social', copy: 'Testi del sito (copywriting)',
    gbp: 'Scheda Google Business Profile', qr: 'QR code personalizzato', firma: 'Firma email coordinata',
    traduzioni: 'Traduzioni', supporto: 'Supporto su richiesta dopo la consegna',
  },
  logo_tipo: { nuovo: 'Nuovo logo', restyling: 'Restyling del logo esistente' },
  foto_soggetti: { locale: 'Locale', prodotti: 'Prodotti', staff: 'Staff', piatti: 'Piatti', altro: 'Altro' },
  tempistiche: {
    asap: 'Il prima possibile', '1mese': 'Entro 1 mese', '3mesi': 'Entro 3 mesi', flessibile: 'Nessuna fretta', data: 'Data precisa',
  },
  budget: { b1: 'Meno di 1.000 €', b2: '1.000 – 2.500 €', b3: '2.500 – 5.000 €', b4: 'Oltre 5.000 €', nd: 'Preferisce parlarne' },
  dominio: { si: 'Sì', no: 'No', non_so: 'Non sa' },
  funzionalita: { form: 'Form contatti', mappa: 'Mappa', prenotazioni: 'Prenotazioni', newsletter: 'Newsletter' },
};

// Servizi che pesano su tempi e preventivo: evidenziati nell'email
const IMPACT = ['logo', 'foto', 'copy'];

// ─── Utility ─────────────────────────────────────────────────────
const enc = new TextEncoder();

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escBr = s => esc(s).replace(/\r?\n/g, '<br>');
const lab = (map, v) => map[v] || v || '';
const labs = (map, arr) => arr.map(v => lab(map, v));

function slugify(s, max = 50) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/, '');
}

function romeDate(d = new Date()) {
  // en-CA → AAAA-MM-GG
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function itDate(iso) {
  const [y, m, d] = String(iso).split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function normalizeUrl(raw) {
  const v = String(raw || '').trim();
  if (!v) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!['http:', 'https:'].includes(u.protocol) || !u.hostname.includes('.')) return '';
    return u.href;
  } catch {
    return '';
  }
}

function base64(str) {
  const bytes = typeof str === 'string' ? enc.encode(str) : str;
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function base64url(buf) {
  return base64(new Uint8Array(buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const fmtSize = b => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

// ─── Link firmati ai file su R2 (verificati da /api/file/...) ────
async function signer(secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return async (origin, objectKey) => {
    const sig = base64url(await crypto.subtle.sign('HMAC', key, enc.encode(objectKey)));
    const path = objectKey.split('/').map(encodeURIComponent).join('/');
    return `${origin}/api/file/${path}?sig=${sig}`;
  };
}

// ─── Controllo dei byte iniziali (il MIME del browser non basta) ─
function sniff(bytes, ext) {
  const b = bytes;
  const ascii = (from, to) => String.fromCharCode(...b.subarray(from, to));
  switch (ext) {
    case 'jpg':
    case 'jpeg': return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'png':  return b[0] === 0x89 && ascii(1, 4) === 'PNG';
    case 'webp': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    case 'pdf':  return ascii(0, 5) === '%PDF-';
    case 'svg': {
      const head = new TextDecoder().decode(b.subarray(0, 2048)).replace(/^﻿/, '').trimStart().toLowerCase();
      return head.startsWith('<') && head.includes('<svg');
    }
    default: return false;
  }
}

// ═════════════════════════════════════════════════════════════════
//  Normalizzazione + validazione server-side
// ═════════════════════════════════════════════════════════════════
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s./()-]{6,20}$/;
const CAP_RE = /^\d{5}$/;

function normalize(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const s = (k, max = 300) => (typeof r[k] === 'string' ? r[k].trim().slice(0, max) : '');
  const one = (k, map) => (typeof r[k] === 'string' && Object.hasOwn(map, r[k]) ? r[k] : '');
  const many = (k, map) => (Array.isArray(r[k]) ? [...new Set(r[k].filter(v => typeof v === 'string' && Object.hasOwn(map, v)))] : []);

  const b = {
    nome: s('nome', 120), attivita: s('attivita', 120), email: s('email', 160), telefono: s('telefono', 30),
    settore: one('settore', L.settore), settore_altro: s('settore_altro', 80),
    descrizione: s('descrizione', 1500), sito_attuale: s('sito_attuale', 300),
    via: s('via', 160), civico: s('civico', 12), cap: s('cap', 5), citta: s('citta', 80),

    obiettivo: one('obiettivo', L.obiettivo), obiettivo_altro: s('obiettivo_altro', 200),
    pubblico: s('pubblico', 1000), cta: s('cta', 200),

    sezioni: many('sezioni', L.sezioni), sezioni_altro: s('sezioni_altro', 200),
    sezioni_facoltative: s('sezioni_facoltative', 800),
    lingue: many('lingue', L.lingue), lingue_altro: s('lingue_altro', 120),
    ha_testi: one('ha_testi', L.possesso), ha_foto: one('ha_foto', L.possesso), ha_logo: one('ha_logo', L.logo),

    ispirazioni: (Array.isArray(r.ispirazioni) ? r.ispirazioni : [])
      .slice(0, MAX_INSPO)
      .map(i => ({ url: normalizeUrl(i?.url), nota: typeof i?.nota === 'string' ? i.nota.trim().slice(0, 300) : '' }))
      .filter(i => i.url),
    aggettivi: many('aggettivi', L.aggettivi), aggettivi_altri: s('aggettivi_altri', 200),
    colori_preferiti: s('colori_preferiti', 200), colori_evitare: s('colori_evitare', 200),

    extra: many('extra', L.extra).sort((a, z) => Object.keys(L.extra).indexOf(a) - Object.keys(L.extra).indexOf(z)),
    extraNote: {},
    logo_tipo: '', foto_soggetti: [], foto_soggetti_altro: '', foto_disponibilita: '',
    stampati_cosa: '', traduzioni_lingue: '',
    altro_bisogno: s('altro_bisogno', 1500),

    tempistiche: one('tempistiche', L.tempistiche), scadenza_data: s('scadenza_data', 10),
    budget: one('budget', L.budget),
    dominio: one('dominio', L.dominio), dominio_nome: s('dominio_nome', 120),
    funzionalita: many('funzionalita', L.funzionalita), funzionalita_altro: s('funzionalita_altro', 200),
    note: s('note', 3000),
    privacy: r.privacy === true,
  };

  // Dettagli solo per i servizi davvero selezionati
  for (const id of b.extra) {
    const n = s(`note_${id}`, 800);
    if (n) b.extraNote[id] = n;
  }
  if (b.extra.includes('logo')) b.logo_tipo = one('logo_tipo', L.logo_tipo);
  if (b.extra.includes('foto')) {
    b.foto_soggetti = many('foto_soggetti', L.foto_soggetti);
    if (b.foto_soggetti.includes('altro')) b.foto_soggetti_altro = s('foto_soggetti_altro', 200);
    b.foto_disponibilita = s('foto_disponibilita', 200);
  }
  if (b.extra.includes('stampati')) b.stampati_cosa = s('stampati_cosa', 300);
  if (b.extra.includes('traduzioni')) b.traduzioni_lingue = s('traduzioni_lingue', 200);
  if (b.settore !== 'altro') b.settore_altro = '';
  if (b.obiettivo !== 'altro') b.obiettivo_altro = '';
  if (!b.sezioni.includes('altro')) b.sezioni_altro = '';
  if (!b.lingue.includes('altro')) b.lingue_altro = '';
  if (b.tempistiche !== 'data') b.scadenza_data = '';
  if (b.dominio !== 'si') b.dominio_nome = '';
  b.sito_attuale_url = normalizeUrl(b.sito_attuale);
  b.fotoSulPosto = b.extra.includes('foto');

  // ─── Regole ────────────────────────────────────────────────────
  const errors = {};
  const req = (k, msg = 'Questo campo è obbligatorio.') => { if (!b[k]) errors[k] = msg; };

  req('nome');
  req('attivita');
  if (!b.email) errors.email = 'Questo campo è obbligatorio.';
  else if (!EMAIL_RE.test(b.email)) errors.email = 'Inserisci un\'email valida.';
  if (b.telefono && !PHONE_RE.test(b.telefono)) errors.telefono = 'Inserisci un numero di telefono valido.';
  req('settore', 'Seleziona un settore.');
  if (b.settore === 'altro') req('settore_altro');
  req('descrizione');
  req('citta');
  if (b.fotoSulPosto) {
    const msg = 'Obbligatorio per il servizio fotografico sul posto.';
    // (il modulo mostra già il perché nel callout; il messaggio resta esplicito per chi chiama l'API)
    req('via', msg); req('civico', msg); req('cap', msg);
  }
  if (b.cap && !CAP_RE.test(b.cap)) errors.cap = 'Il CAP è formato da 5 cifre.';

  req('obiettivo', 'Seleziona un\'opzione.');
  if (b.obiettivo === 'altro') req('obiettivo_altro');

  if (!b.sezioni.length) errors.sezioni = 'Seleziona almeno un\'opzione.';
  if (b.sezioni.includes('altro')) req('sezioni_altro');

  req('tempistiche', 'Seleziona un\'opzione.');
  if (b.tempistiche === 'data') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.scadenza_data) || isNaN(Date.parse(b.scadenza_data))) {
      errors.scadenza_data = 'Inserisci una data valida.';
    } else if (b.scadenza_data < romeDate(new Date(Date.now() - 86400000))) {
      errors.scadenza_data = 'Scegli una data da oggi in poi.';
    }
  }
  if (b.dominio === 'si') req('dominio_nome');
  if (!b.privacy) errors.privacy = 'Per inviare il brief devi accettare l\'informativa sulla privacy.';

  return { b, errors };
}

// Testi derivati usati in md ed email
function derived(b) {
  const settore = b.settore === 'altro' ? `Altro: ${b.settore_altro}` : lab(L.settore, b.settore);
  const obiettivo = b.obiettivo === 'altro' ? `Altro: ${b.obiettivo_altro}` : lab(L.obiettivo, b.obiettivo);
  const sezioni = b.sezioni.map(v => (v === 'altro' ? `Altro: ${b.sezioni_altro}` : lab(L.sezioni, v)));
  const lingue = b.lingue.map(v => (v === 'altro' ? `Altra: ${b.lingue_altro || 'non specificata'}` : lab(L.lingue, v)));
  const scadenza = b.tempistiche === 'data' ? itDate(b.scadenza_data) : lab(L.tempistiche, b.tempistiche);
  const indirizzo = [[b.via, b.civico].filter(Boolean).join(' '), [b.cap, b.citta].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const aggettivi = [...labs(L.aggettivi, b.aggettivi), ...(b.aggettivi_altri ? [b.aggettivi_altri] : [])];
  const funzionalita = [...labs(L.funzionalita, b.funzionalita), ...(b.funzionalita_altro ? [b.funzionalita_altro] : [])];
  const fotoSoggetti = b.foto_soggetti.map(v => (v === 'altro' ? `Altro: ${b.foto_soggetti_altro || 'non specificato'}` : lab(L.foto_soggetti, v)));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo)}`;
  const impact = b.extra.filter(id => IMPACT.includes(id));

  // Dettagli per ogni servizio extra: [[etichetta, valore], ...]
  const extraDetails = b.extra.map(id => {
    const rows = [];
    if (id === 'logo' && b.logo_tipo) rows.push(['Tipo', lab(L.logo_tipo, b.logo_tipo)]);
    if (id === 'foto') {
      rows.push(['Indirizzo', indirizzo]);
      if (fotoSoggetti.length) rows.push(['Cosa fotografare', fotoSoggetti.join(', ')]);
      if (b.foto_disponibilita) rows.push(['Disponibilità', b.foto_disponibilita]);
    }
    if (id === 'stampati' && b.stampati_cosa) rows.push(['Cosa', b.stampati_cosa]);
    if (id === 'traduzioni' && b.traduzioni_lingue) rows.push(['Lingue', b.traduzioni_lingue]);
    if (b.extraNote[id]) rows.push(['Note', b.extraNote[id]]);
    return { id, label: L.extra[id], rows };
  });

  return { settore, obiettivo, sezioni, lingue, scadenza, indirizzo, aggettivi, funzionalita, fotoSoggetti, mapsUrl, impact, extraDetails };
}

// ═════════════════════════════════════════════════════════════════
//  brief.md
// ═════════════════════════════════════════════════════════════════
function buildMarkdown(b, d, ctx) {
  const NA = '_Non indicato_';
  const y = v => JSON.stringify(v); // stringhe JSON = scalari YAML validi
  const oneLine = v => String(v || '').replace(/\s*\r?\n\s*/g, ' / ');
  const para = v => (v ? String(v).replace(/\r?\n/g, '  \n') : NA);
  const item = (k, v) => `- **${k}:** ${v ? oneLine(v) : NA}`;

  const extraFm = d.extraDetails.map(e => (e.id === 'logo' && b.logo_tipo ? `${e.label} (${lab(L.logo_tipo, b.logo_tipo).toLowerCase()})` : e.label));

  const out = [];
  out.push('---');
  out.push(`cliente: ${y(b.nome)}`);
  out.push(`attivita: ${y(b.attivita)}`);
  out.push(`email: ${y(b.email)}`);
  if (b.telefono) out.push(`telefono: ${y(b.telefono)}`);
  out.push(`settore: ${y(d.settore)}`);
  out.push(`citta: ${y(b.citta)}`);
  out.push(`data: ${y(ctx.date)}`);
  out.push(`scadenza: ${y(b.tempistiche === 'data' ? b.scadenza_data : lab(L.tempistiche, b.tempistiche))}`);
  out.push(`budget: ${y(b.budget ? lab(L.budget, b.budget) : 'Non indicato')}`);
  out.push(`lingue: [${d.lingue.map(y).join(', ')}]`);
  out.push(`extra: [${extraFm.map(y).join(', ')}]`);
  out.push(`cartella_r2: ${y(ctx.folder)}`);
  out.push('---');
  out.push('');
  out.push(`# Brief – ${oneLine(b.attivita)}`);
  out.push('');
  out.push(`Ricevuto il ${itDate(ctx.date)} tramite il modulo /brief.`);
  out.push('');

  out.push('## Cliente');
  out.push(item('Nome', b.nome));
  out.push(item('Attività / brand', b.attivita));
  out.push(item('Settore', d.settore));
  out.push(item('Email', b.email));
  out.push(item('Telefono', b.telefono));
  out.push(item('Sito o social attuali', b.sito_attuale));
  out.push(item('Città', b.citta));
  if (b.via || b.cap) out.push(item('Indirizzo', d.indirizzo));
  out.push('');
  out.push('**Descrizione dell\'attività**');
  out.push('');
  out.push(para(b.descrizione));
  out.push('');

  out.push('## Obiettivo');
  out.push(item('Obiettivo principale', d.obiettivo));
  out.push(item('Call to action principale', b.cta));
  out.push('');

  out.push('## Pubblico');
  out.push(para(b.pubblico));
  out.push('');

  out.push('## Sezioni must-have');
  out.push(d.sezioni.length ? d.sezioni.map(s => `- ${oneLine(s)}`).join('\n') : NA);
  out.push('');

  out.push('## Sezioni facoltative');
  out.push(para(b.sezioni_facoltative));
  out.push('');
  out.push(item('Lingue del sito', d.lingue.join(', ')));
  out.push(item('Testi già pronti', lab(L.possesso, b.ha_testi)));
  out.push(item('Foto già pronte', lab(L.possesso, b.ha_foto)));
  out.push(item('Logo esistente', lab(L.logo, b.ha_logo)));
  out.push('');

  out.push('## Stile e ispirazioni');
  out.push(item('Aggettivi', d.aggettivi.join(', ')));
  out.push(item('Colori preferiti', b.colori_preferiti));
  out.push(item('Colori da evitare', b.colori_evitare));
  out.push('');
  out.push('### Siti di ispirazione');
  out.push(b.ispirazioni.length
    ? b.ispirazioni.map((i, n) => `${n + 1}. <${i.url}>${i.nota ? ` — ${oneLine(i.nota)}` : ''}`).join('\n')
    : NA);
  out.push('');

  out.push('## Reference visive');
  if (ctx.files.length) {
    ctx.files.forEach(f => out.push(`- [${f.name}](${f.url}) — ${f.type}, ${fmtSize(f.size)} (originale: ${oneLine(f.original)})`));
    out.push('');
    out.push('_I link sono firmati e restano validi finché non cambia il secret BRIEF_FILE_SECRET._');
  } else {
    out.push('_Nessun file caricato._');
  }
  out.push('');

  out.push('## Funzionalità');
  out.push(item('Funzionalità richieste', d.funzionalita.join(', ')));
  out.push(item('Dominio già posseduto', b.dominio ? `${lab(L.dominio, b.dominio)}${b.dominio_nome ? ` (${b.dominio_nome})` : ''}` : ''));
  out.push('');

  out.push('## Servizi extra richiesti');
  if (d.extraDetails.length) {
    d.extraDetails.forEach(e => {
      out.push(`### ${e.label}${IMPACT.includes(e.id) ? ' ⚠️ impatta tempi e preventivo' : ''}`);
      if (e.rows.length) e.rows.forEach(([k, v]) => out.push(item(k, v)));
      else out.push('- Nessun dettaglio aggiuntivo.');
      if (e.id === 'foto') out.push(`- **Google Maps:** <${d.mapsUrl}>`);
      out.push('');
    });
  } else {
    out.push('_Nessun servizio extra richiesto._');
    out.push('');
  }
  if (b.altro_bisogno) {
    out.push('**Altro di cui ha bisogno**');
    out.push('');
    out.push(para(b.altro_bisogno));
    out.push('');
  }

  out.push('## Tempistiche');
  out.push(item('Scadenza', d.scadenza));
  out.push(item('Budget indicativo', lab(L.budget, b.budget)));
  out.push('');

  out.push('## Note');
  out.push(para(b.note));
  out.push('');

  // ─── Istruzioni per Claude Code ────────────────────────────────
  const copy = b.extra.includes('copy');
  const mainLang = d.lingue[0] || 'Italiano';
  out.push('---');
  out.push('');
  out.push('## Istruzioni per Claude Code');
  out.push('');
  out.push(`Usa questo brief per creare una **prima bozza statica** del sito di ${oneLine(b.attivita)}.`);
  out.push('');
  out.push('1. **Tecnologia:** HTML, CSS e JavaScript puri, senza framework né build step. File di partenza: `index.html`, `style.css`, `script.js`. Se le sezioni sono poche, preferisci una one-page con ancore; altrimenti una pagina per sezione.');
  out.push('2. **Struttura:** includi tutte le sezioni must-have in un ordine logico per l\'obiettivo principale. Aggiungi le sezioni facoltative solo se non appesantiscono il sito.');
  out.push('3. **Obiettivo e CTA:** ogni scelta (gerarchia, posizione dei pulsanti, contenuti in evidenza) deve servire l\'obiettivo principale e la call to action indicata.');
  out.push('4. **Stile:** segui aggettivi e colori indicati ed evita i colori da escludere. Usa i siti di ispirazione e le reference visive per capire il gusto del cliente, senza copiarli.');
  out.push('5. **Qualità:** mobile-first e responsive, HTML semantico, accessibile (contrasti AA, testi alternativi, navigazione da tastiera), SEO di base (`title`, meta description, `lang`), immagini leggere.');
  out.push('6. **Funzionalità:** realizza solo la parte frontend (es. form contatti con validazione, mappa come embed segnaposto, pulsante prenotazioni). Niente backend.');
  out.push(`7. **Lingue:** crea la bozza in ${mainLang}. Se sono richieste altre lingue, predisponi solo il selettore e la struttura, senza tradurre.`);
  out.push('8. **Non inventare informazioni.** Dove manca un dato (orari, prezzi, indirizzo, numeri, nomi, recensioni, servizi specifici…) inserisci un segnaposto evidente come `[DA FORNIRE: orari di apertura]` invece di inventarlo.');
  if (copy) {
    out.push('9. **Testi:** il cliente ha richiesto il copywriting. Scrivi testi segnaposto realistici, coerenti con attività, pubblico e obiettivo, e marca ogni blocco di testo con `[DA REVISIONARE]`.');
  } else {
    out.push(`9. **Testi:** il cliente non ha richiesto il copywriting (testi già pronti: ${lab(L.possesso, b.ha_testi) || 'non indicato'}). Usa le informazioni del brief dove possibile; per il resto inserisci segnaposto brevi come \`[TESTO DEL CLIENTE: presentazione]\`.`);
  }
  out.push('10. **Immagini e logo:** usa segnaposto con proporzioni corrette e `alt` descrittivi. Non usare foto stock. Se il logo va creato o rifatto, metti il nome dell\'attività in testo come segnaposto.');
  out.push('11. **Servizi extra:** i servizi extra elencati sopra (logo, brand identity, foto, stampati, kit social, Google Business, QR code, firma email, traduzioni, supporto) **non fanno parte della bozza del sito**: non realizzarli. Unica eccezione sono i testi del sito, se è richiesto il copywriting (punto 9).');
  out.push('12. **Alla fine** crea `NOTE_BOZZA.md` con: le scelte fatte, l\'elenco di tutte le informazioni mancanti o segnaposto da completare, e le domande da fare al cliente.');
  out.push('');

  return out.join('\n');
}

// ═════════════════════════════════════════════════════════════════
//  Email a bento box (tabelle, stili inline)
// ═════════════════════════════════════════════════════════════════
const C = {
  bg: '#f4f4f2', card: '#ffffff', line: '#e1e1dd', ink: '#141413', soft: '#2b2a28', muted: '#5a5955',
  accent: '#c8f03a', dark: '#141413', darkInk: '#f4f4f2', darkMuted: '#a7a39a',
};
const FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const DISPLAY = "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function label(text, dark = false) {
  return `<div style="font-family:${FONT};font-size:11px;line-height:16px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${dark ? C.darkMuted : C.muted};margin:0 0 12px;">${esc(text)}</div>`;
}

function kv(k, v, { dark = false, html = false } = {}) {
  if (!v) return '';
  return `<div style="margin:0 0 10px;font-family:${FONT};font-size:14px;line-height:21px;color:${dark ? C.darkInk : C.ink};">
    <span style="color:${dark ? C.darkMuted : C.muted};">${esc(k)}</span><br>${html ? v : escBr(v)}</div>`;
}

function chips(items, dark = false) {
  if (!items.length) return '';
  return `<div style="margin:0 0 6px;">${items.map(t =>
    `<span style="display:inline-block;margin:0 4px 6px 0;padding:4px 10px;border:1px solid ${dark ? '#3a3630' : C.line};border-radius:999px;font-family:${FONT};font-size:12px;line-height:16px;color:${dark ? C.darkInk : C.soft};">${esc(t)}</span>`).join('')}</div>`;
}

function card(title, body, { width = '50%', colspan = 1, dark = false, bg } = {}) {
  const background = bg || (dark ? C.dark : C.card);
  return `<td class="col" width="${width}" colspan="${colspan}" valign="top" style="padding:6px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${background};border:1px solid ${dark ? C.dark : C.line};border-radius:16px;">
    <tr><td style="padding:20px 22px 14px;">${label(title, dark)}${body}</td></tr>
  </table></td>`;
}

const row = (...cells) => `<tr>${cells.join('')}</tr>`;
const full = (title, body, opts = {}) => row(card(title, body, { ...opts, width: '100%', colspan: 2 }));

function link(href, text, dark = false) {
  return `<a href="${esc(href)}" style="color:${dark ? C.accent : C.ink};text-decoration:underline;">${esc(text)}</a>`;
}

function emailShell(inner, preheader) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(preheader)}</title>
<style>
  @media (max-width: 620px) {
    .col { display:block !important; width:100% !important; box-sizing:border-box; }
    .wrap { padding:12px 6px !important; }
  }
</style></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr><td align="center" class="wrap" style="padding:28px 12px;">
    <table role="presentation" width="660" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:660px;">
      ${inner}
    </table>
  </td></tr>
</table></body></html>`;
}

function buildOwnerEmail(b, d, ctx) {
  const parts = [];

  // Testata
  parts.push(row(`<td colspan="2" style="padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.dark};border-radius:16px;">
      <tr><td style="padding:26px 24px 24px;">
        ${label('Nuovo brief', true)}
        <div style="font-family:${DISPLAY};font-size:32px;line-height:36px;font-weight:700;letter-spacing:-0.5px;color:${C.darkInk};margin:0 0 10px;">${esc(b.attivita)}</div>
        <div style="font-family:${FONT};font-size:14px;line-height:21px;color:${C.darkMuted};">
          da ${esc(b.nome)} · ${esc(d.settore)} · ${esc(b.citta)} · ricevuto il ${esc(itDate(ctx.date))}
        </div>
        <div style="margin-top:16px;">
          <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${C.accent};font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${C.ink};">Scadenza: ${esc(d.scadenza)}</span>
        </div>
      </td></tr>
    </table></td>`));

  // Cliente | Tempistiche e budget
  const contatti = [
    `<div style="font-family:${DISPLAY};font-size:19px;line-height:24px;font-weight:600;color:${C.ink};margin:0 0 4px;">${esc(b.nome)}</div>`,
    `<div style="font-family:${FONT};font-size:14px;line-height:21px;color:${C.muted};margin:0 0 12px;">${esc(b.attivita)}</div>`,
    kv('Email', link(`mailto:${b.email}`, b.email), { html: true }),
    b.telefono ? kv('Telefono', link(`tel:${b.telefono.replace(/[^\d+]/g, '')}`, b.telefono), { html: true }) : '',
    kv('Settore', d.settore),
    kv('Città', b.citta),
    b.sito_attuale ? kv('Sito o social', b.sito_attuale_url ? link(b.sito_attuale_url, b.sito_attuale) : esc(b.sito_attuale), { html: true }) : '',
    kv('Descrizione', b.descrizione),
  ].join('');

  const tempi = [
    `<div style="font-family:${DISPLAY};font-size:24px;line-height:28px;font-weight:700;color:${C.ink};margin:0 0 14px;">${esc(d.scadenza)}</div>`,
    kv('Budget indicativo', lab(L.budget, b.budget) || 'Non indicato'),
    kv('Dominio', b.dominio ? `${lab(L.dominio, b.dominio)}${b.dominio_nome ? ` · ${b.dominio_nome}` : ''}` : 'Non indicato'),
    kv('Funzionalità', d.funzionalita.join(', ') || 'Nessuna indicata'),
  ].join('');
  parts.push(row(card('Cliente', contatti), card('Tempistiche e budget', tempi)));

  // Extra (evidenziata se ci sono servizi che impattano)
  const hot = d.impact.length > 0;
  let extraBody = '';
  if (hot) {
    extraBody += `<div style="margin:0 0 16px;"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${C.accent};font-family:${FONT};font-size:12px;font-weight:600;color:${C.ink};">⚠ Impatta tempi e preventivo: ${esc(d.impact.map(id => L.extra[id]).join(' · '))}</span></div>`;
  }
  if (d.extraDetails.length) {
    extraBody += d.extraDetails.map(e => {
      const strong = IMPACT.includes(e.id);
      const rows = e.rows.map(([k, v]) => {
        if (e.id === 'foto' && k === 'Indirizzo') {
          return kv(k, `${esc(v)}<br>${link(d.mapsUrl, 'Apri in Google Maps →', hot)}`, { dark: hot, html: true });
        }
        return kv(k, v, { dark: hot });
      }).join('');
      return `<div style="padding:12px 0 4px;border-top:1px solid ${hot ? '#3a3630' : C.line};">
        <div style="font-family:${DISPLAY};font-size:17px;line-height:22px;font-weight:600;color:${hot ? (strong ? C.accent : C.darkInk) : C.ink};margin:0 0 8px;">${esc(e.label)}</div>${rows}</div>`;
    }).join('');
  } else {
    extraBody += `<div style="font-family:${FONT};font-size:14px;color:${C.muted};margin:0 0 8px;">Nessun servizio extra richiesto.</div>`;
  }
  if (b.altro_bisogno) extraBody += kv('Altro di cui ha bisogno', b.altro_bisogno, { dark: hot });
  parts.push(full(`Servizi extra${d.extraDetails.length ? ` (${d.extraDetails.length})` : ''}`, extraBody, { dark: hot }));

  // Obiettivo | Sezioni
  const obiettivo = [
    `<div style="font-family:${DISPLAY};font-size:19px;line-height:24px;font-weight:600;color:${C.ink};margin:0 0 12px;">${esc(d.obiettivo)}</div>`,
    kv('Pubblico', b.pubblico || 'Non indicato'),
    kv('Call to action', b.cta || 'Non indicata'),
  ].join('');
  const sezioni = [
    chips(d.sezioni),
    kv('Facoltative', b.sezioni_facoltative),
    kv('Lingue', d.lingue.join(', ') || 'Non indicate'),
    kv('Materiali pronti', `Testi: ${lab(L.possesso, b.ha_testi) || '–'} · Foto: ${lab(L.possesso, b.ha_foto) || '–'} · Logo: ${lab(L.logo, b.ha_logo) || '–'}`),
  ].join('');
  parts.push(row(card('Obiettivo', obiettivo), card('Sezioni', sezioni)));

  // Stile
  const stile = [
    d.aggettivi.length ? chips(d.aggettivi) : kv('Aggettivi', 'Non indicati'),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" width="50%" valign="top" style="padding-right:8px;">${kv('Colori preferiti', b.colori_preferiti || 'Non indicati')}</td>
      <td class="col" width="50%" valign="top">${kv('Colori da evitare', b.colori_evitare || 'Non indicati')}</td>
    </tr></table>`,
  ].join('');
  parts.push(full('Stile', stile));

  // Reference (miniature cliccabili)
  if (ctx.files.length) {
    const cells = ctx.files.map(f => {
      const isImg = ['image/jpeg', 'image/png', 'image/webp'].includes(f.type);
      const thumb = isImg
        ? `<img src="${esc(f.url)}" width="138" height="138" alt="${esc(f.original)}" style="display:block;width:138px;height:138px;object-fit:cover;border-radius:10px;border:1px solid ${C.line};">`
        : `<div style="width:138px;height:138px;line-height:138px;text-align:center;border-radius:10px;border:1px solid ${C.line};background:${C.bg};font-family:${FONT};font-size:13px;font-weight:600;letter-spacing:1px;color:${C.muted};">${f.ext.toUpperCase()}</div>`;
      return `<td valign="top" width="25%" style="padding:0 6px 10px 0;">
        <a href="${esc(f.url)}" style="text-decoration:none;">${thumb}</a>
        <div style="width:138px;margin-top:4px;font-family:${FONT};font-size:11px;line-height:15px;color:${C.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(f.original)}</div></td>`;
    });
    let grid = '';
    for (let i = 0; i < cells.length; i += 4) {
      const chunk = cells.slice(i, i + 4);
      while (chunk.length < 4) chunk.push('<td width="25%"></td>');
      grid += `<tr>${chunk.join('')}</tr>`;
    }
    parts.push(full(`Reference (${ctx.files.length})`,
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${grid}</table>`));
  }

  // Ispirazioni
  if (b.ispirazioni.length) {
    const list = b.ispirazioni.map((i, n) => {
      let host = i.url;
      try { host = new URL(i.url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
      return `<div style="padding:10px 0;border-top:${n ? `1px solid ${C.line}` : 'none'};font-family:${FONT};font-size:14px;line-height:21px;">
        ${link(i.url, host)}${i.nota ? `<br><span style="color:${C.muted};">${escBr(i.nota)}</span>` : ''}</div>`;
    }).join('');
    parts.push(full('Ispirazioni', list));
  }

  // Note
  if (b.note) parts.push(full('Note', `<div style="font-family:${FONT};font-size:14px;line-height:22px;color:${C.ink};margin:0 0 8px;">${escBr(b.note)}</div>`));

  // Piede
  parts.push(row(`<td colspan="2" style="padding:14px 8px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">
    In allegato <strong>brief.md</strong>, pronto per Claude Code.<br>
    Cartella R2: <code>${esc(ctx.folder)}</code> · ${link(ctx.mdUrl, 'brief.md')} · ${link(ctx.jsonUrl, 'brief.json')}<br>
    Rispondi a questa email per scrivere direttamente a ${esc(b.nome)}.
  </td>`));

  return emailShell(parts.join('\n'), `${b.nome} · ${d.obiettivo} · scadenza ${d.scadenza}`);
}

function buildClientEmail(b, d) {
  const first = b.nome.split(/\s+/)[0];
  const rows = [
    ['Attività', b.attivita],
    ['Obiettivo', d.obiettivo],
    ['Sezioni', d.sezioni.join(', ')],
    ['Servizi extra', d.extraDetails.map(e => e.label).join(', ') || 'Nessuno'],
    ['Tempistiche', d.scadenza],
  ];
  const inner = row(`<td colspan="2" style="padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border:1px solid ${C.line};border-radius:16px;">
      <tr><td style="padding:32px 28px 28px;">
        ${label('Brief ricevuto')}
        <div style="font-family:${DISPLAY};font-size:30px;line-height:34px;font-weight:700;letter-spacing:-0.5px;color:${C.ink};margin:0 0 18px;">Grazie ${esc(first)}, ho ricevuto il tuo brief.</div>
        <div style="font-family:${FONT};font-size:15px;line-height:24px;color:${C.soft};margin:0 0 24px;">
          Lo leggo con calma e ti ricontatto nei prossimi giorni lavorativi con domande o una prima proposta.
          Se nel frattempo ti viene in mente qualcos'altro, rispondi pure a questa email.
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};">
          ${rows.map(([k, v]) => `<tr>
            <td width="34%" valign="top" style="padding:10px 12px 10px 0;border-bottom:1px solid ${C.line};font-family:${FONT};font-size:12px;line-height:18px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${esc(k)}</td>
            <td valign="top" style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${FONT};font-size:14px;line-height:20px;color:${C.ink};">${esc(v)}</td></tr>`).join('')}
        </table>
        <div style="margin-top:28px;font-family:${FONT};font-size:14px;line-height:21px;color:${C.ink};">
          A presto,<br><strong style="font-family:${DISPLAY};font-size:16px;">Alessandro Monticelli</strong><br>
          <span style="color:${C.muted};">UI / Graphic Designer · Rimini</span>
        </div>
      </td></tr>
    </table></td>`);

  const text = [
    `Grazie ${first}, ho ricevuto il tuo brief.`,
    '',
    'Lo leggo con calma e ti ricontatto nei prossimi giorni lavorativi con domande o una prima proposta.',
    'Se nel frattempo ti viene in mente qualcos\'altro, rispondi pure a questa email.',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'A presto,',
    'Alessandro Monticelli',
    'UI / Graphic Designer · Rimini',
  ].join('\n');

  return { html: emailShell(inner, `Ho ricevuto il brief di ${b.attivita}`), text };
}

// ─── Resend ──────────────────────────────────────────────────────
async function sendEmail(env, payload, idempotencyKey) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 500)}`);
  }
  return res.json().catch(() => ({}));
}

// ─── Turnstile ───────────────────────────────────────────────────
async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await res.json();
    return out.success === true;
  } catch {
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════
//  Handler
// ═════════════════════════════════════════════════════════════════
export async function onRequestPost({ request, env }) {
  try {
    // Configurazione
    const required = ['BRIEF_UPLOADS', 'RESEND_API_KEY', 'TURNSTILE_SECRET_KEY', 'BRIEF_FILE_SECRET', 'BRIEF_TO_EMAIL', 'BRIEF_FROM_EMAIL'];
    const missing = required.filter(k => !env[k]);
    if (missing.length) {
      console.error('brief: configurazione mancante:', missing.join(', '));
      return json(500, { ok: false, error: 'Il modulo non è ancora configurato. Scrivimi direttamente via email, scusa il disagio.' });
    }

    const type = request.headers.get('Content-Type') || '';
    if (!type.toLowerCase().startsWith('multipart/form-data')) {
      return json(415, { ok: false, error: 'Formato della richiesta non valido.' });
    }
    const length = Number(request.headers.get('Content-Length') || 0);
    if (length > MAX_BODY) {
      return json(413, { ok: false, error: 'I file allegati sono troppo pesanti: massimo 8 file da 5 MB ciascuno.' });
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return json(400, { ok: false, error: 'Non riesco a leggere i dati inviati. Riprova.' });
    }

    // Honeypot: ai bot rispondo "ok" senza fare nulla
    if (String(form.get('website_url') || '').trim()) {
      return json(200, { ok: true });
    }

    // Turnstile
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const human = await verifyTurnstile(String(form.get('cf-turnstile-response') || ''), env.TURNSTILE_SECRET_KEY, ip);
    if (!human) {
      return json(403, { ok: false, error: 'La verifica anti-spam non è andata a buon fine o è scaduta. Completala di nuovo e reinvia.' });
    }

    // Dati
    let raw;
    try {
      raw = JSON.parse(String(form.get('data') || ''));
    } catch {
      return json(400, { ok: false, error: 'Dati del modulo non validi. Ricarica la pagina e riprova.' });
    }
    const { b, errors } = normalize(raw);

    // File
    const uploads = form.getAll('files').filter(f => f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.size > 0);
    const fileProblems = [];
    if (uploads.length > MAX_FILES) fileProblems.push(`puoi caricare al massimo ${MAX_FILES} file`);
    const prepared = [];
    for (const f of uploads.slice(0, MAX_FILES)) {
      const name = String(f.name || 'file');
      const ext = (name.split('.').pop() || '').toLowerCase();
      if (!FILE_TYPES[ext]) { fileProblems.push(`${name}: formato non supportato`); continue; }
      if (f.size > MAX_FILE_SIZE) { fileProblems.push(`${name}: supera 5 MB`); continue; }
      const buf = new Uint8Array(await f.arrayBuffer());
      if (!sniff(buf, ext)) { fileProblems.push(`${name}: il contenuto non corrisponde a un file ${ext.toUpperCase()}`); continue; }
      prepared.push({ original: name.slice(0, 120), ext: ext === 'jpeg' ? 'jpg' : ext, type: FILE_TYPES[ext], size: f.size, buf });
    }
    if (fileProblems.length) errors.files = `Controlla i file: ${fileProblems.join('; ')}.`;

    if (Object.keys(errors).length) {
      return json(422, { ok: false, error: 'Alcuni campi non sono validi.', fields: errors });
    }

    const d = derived(b);
    const bucket = env.BRIEF_UPLOADS;
    const date = romeDate();
    const base = `${date}-${slugify(b.attivita) || 'brief'}`;

    // Cartella per cliente: AAAA-MM-GG-slug-attivita (+ -2, -3… se esiste già)
    let folder = base;
    for (let i = 2; await bucket.head(`${folder}/brief.json`); i++) folder = `${base}-${i}`;

    const origin = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');
    const signUrl = await signer(env.BRIEF_FILE_SECRET);

    // Upload su R2
    const files = [];
    for (let i = 0; i < prepared.length; i++) {
      const p = prepared[i];
      const stem = slugify(p.original.replace(/\.[^.]+$/, ''), 40) || 'file';
      const name = `${String(i + 1).padStart(2, '0')}-${stem}.${p.ext}`;
      const key = `${folder}/reference/${name}`;
      await bucket.put(key, p.buf, {
        httpMetadata: { contentType: p.type, contentDisposition: `inline; filename="${name}"` },
        customMetadata: { original: encodeURIComponent(p.original) },
      });
      files.push({ name, key, original: p.original, ext: p.ext, type: p.type, size: p.size, url: await signUrl(origin, key) });
    }

    const mdKey = `${folder}/brief.md`;
    const jsonKey = `${folder}/brief.json`;
    const ctx = {
      date, folder, files,
      mdUrl: await signUrl(origin, mdKey),
      jsonUrl: await signUrl(origin, jsonKey),
    };

    const markdown = buildMarkdown(b, d, ctx);
    const record = {
      version: 1,
      receivedAt: new Date().toISOString(),
      folder,
      brief: b,
      labels: {
        settore: d.settore, obiettivo: d.obiettivo, sezioni: d.sezioni, lingue: d.lingue,
        scadenza: d.scadenza, budget: lab(L.budget, b.budget), extra: d.extraDetails,
      },
      files: files.map(({ name, key, original, type, size, url }) => ({ name, key, original, type, size, url })),
    };

    await bucket.put(mdKey, markdown, { httpMetadata: { contentType: 'text/markdown; charset=utf-8' } });
    await bucket.put(jsonKey, JSON.stringify(record, null, 2), { httpMetadata: { contentType: 'application/json; charset=utf-8' } });

    // Email a me
    const to = env.BRIEF_TO_EMAIL.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await sendEmail(env, {
        from: env.BRIEF_FROM_EMAIL,
        to,
        reply_to: b.email,
        subject: `Nuovo brief – ${b.attivita} – scadenza ${d.scadenza}`,
        html: buildOwnerEmail(b, d, ctx),
        text: markdown,
        attachments: [{ filename: 'brief.md', content: base64(markdown) }],
      }, `brief-owner-${folder}`);
    } catch (err) {
      console.error('brief: invio email al titolare fallito', folder, err);
      return json(502, {
        ok: false,
        error: 'Il brief è stato salvato ma non sono riuscito a inviare la notifica. Riprova tra qualche minuto o scrivimi via email.',
      });
    }

    // Conferma al cliente (un errore qui non blocca l'invio)
    try {
      const mail = buildClientEmail(b, d);
      await sendEmail(env, {
        from: env.BRIEF_FROM_EMAIL,
        to: [b.email],
        reply_to: to[0],
        subject: `Ho ricevuto il tuo brief – ${b.attivita}`,
        html: mail.html,
        text: mail.text,
      }, `brief-client-${folder}`);
    } catch (err) {
      console.error('brief: email di conferma al cliente non inviata', folder, err);
    }

    return json(200, { ok: true, id: folder });
  } catch (err) {
    console.error('brief: errore inatteso', err);
    return json(500, { ok: false, error: 'Errore imprevisto durante l\'invio. Riprova tra poco: le tue risposte sono ancora nel modulo.' });
  }
}

export function onRequest({ request }) {
  // Tutti i metodi diversi da POST
  return new Response(JSON.stringify({ ok: false, error: `Metodo ${request.method} non consentito.` }), {
    status: 405,
    headers: { 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST' },
  });
}
