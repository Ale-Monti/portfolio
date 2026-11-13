// ═══════════════════════════════════════════════════════════════════
//  LISTINO DEL MODULO /brief
//
//  Unica fonte dei prezzi: la usano sia il modulo (brief.js) sia la
//  Function (functions/api/brief.js). Per cambiare un prezzo basta
//  modificarlo qui.
//
//  Tutte le cifre sono PREZZI DI LANCIO in euro. Il prezzo di listino
//  (mostrato barrato) si ricava moltiplicando per LAUNCH_FACTOR.
// ═══════════════════════════════════════════════════════════════════

// Listino = lancio × 1,5 (es. lancio 200 € → listino 300 €)
export const LAUNCH_FACTOR = 1.5;

// Lavoro a ore: 30 €/h, 25 €/h da 4 ore in su (4 ore = 100 €)
export const RATE = { hour: 30, bulk: 25, bulkFrom: 4 };

export const DEPOSIT = 0.4;      // acconto alla conferma
export const REVISIONS = 2;      // revisioni incluse (logo e grafica)

// ─── Sito vetrina ────────────────────────────────────────────────
export const SITE = {
  min: 180, max: 270,            // fino a SITE.sections sezioni
  sections: 4,
  perSection: [25, 40],          // ogni sezione in più
  perLanguage: [20, 20],         // ogni lingua oltre la prima (struttura, non traduzione)
  features: {                    // funzionalità scelte allo step 3
    // Con più varianti la scelta arriva dal campo <id>_tipo; senza risposta vale l'ultima
    prenotazioni: { richiesta: [25, 50], calendario: [40, 80] },
    newsletter: [25, 50],
    whatsapp: [0, 0],
    download: { libero: [0, 0], email: [15, 30] },
    ecommerce: null,             // null = da valutare a parte
    area_riservata: null,
  },
};

// ─── Servizi extra ───────────────────────────────────────────────
//  min/max   forbice di lancio
//  unit      testo breve sotto il prezzo
//  hourly    lavoro stimato a ore (la forbice è indicativa)
//  onDemand  non entra nella stima: si paga a ore quando serve
//  perItem   la forbice vale per ogni formato / lingua indicata
export const SERVICES = {
  logo:       { min: 80,  max: 150, unit: '2-3 proposte, 2 revisioni' },
  brand:      { min: 200, max: 350, unit: 'logo compreso', includes: ['logo'] },
  foto:       { min: 100, max: 150, unit: 'mezza giornata, 10-15 foto editate' },
  biglietti:  { min: 40,  max: 80,  unit: 'grafica, stampa esclusa' },
  stampati:   { min: 50,  max: 120, unit: 'a formato, stampa esclusa', perItem: true },
  social:     { min: 50,  max: 100, unit: 'set di 5-8 formati' },
  copy:       { min: 100, max: 200, unit: 'da 4 ore a 25 €/h', hourly: true },
  gbp:        { min: 30,  max: 60,  unit: 'creazione o ottimizzazione' },
  qr:         { min: 20,  max: 40,  unit: 'con i tuoi colori' },
  firma:      { min: 20,  max: 40,  unit: 'coordinata al logo' },
  traduzioni: { min: 60,  max: 150, unit: 'a lingua, in base ai testi', hourly: true, perItem: true },
  supporto:   { onDemand: true,     unit: 'a richiesta, 30 €/h' },
};

// ─── Pacchetti ───────────────────────────────────────────────────
export const BUNDLES = [
  { id: 'identita', label: 'Pacchetto identità', items: ['logo', 'biglietti', 'firma'], min: 120, max: 220 },
];

// ─── Budget indicato dal cliente (step 6) ────────────────────────
export const BUDGET = {
  b1: [200, 200], b2: [200, 300], b3: [300, 500], b4: [500, 700], b5: [700, 1000], b6: [1000, Infinity],
};

// ═════════════════════════════════════════════════════════════════
//  Funzioni di calcolo (stesse nel browser e sul server)
// ═════════════════════════════════════════════════════════════════
export const FEATURE_LABEL = {
  prenotazioni: 'prenotazioni online', newsletter: 'newsletter', whatsapp: 'WhatsApp',
  download: 'download di un file', ecommerce: 'e-commerce', area_riservata: 'area riservata',
};
const VARIANT_LABEL = {
  prenotazioni: { richiesta: 'richieste di prenotazione', calendario: 'calendario prenotazioni' },
  download: { libero: 'download di un file', email: 'download in cambio dell\'email' },
};

// Prezzo di una funzionalità: [min, max], null (da valutare) o undefined (sconosciuta)
function featurePrice(f, b) {
  const p = SITE.features[f];
  if (p === undefined || p === null || Array.isArray(p)) return { price: p, label: FEATURE_LABEL[f] };
  const keys = Object.keys(p);
  const v = keys.includes(b[`${f}_tipo`]) ? b[`${f}_tipo`] : keys[keys.length - 1];
  return { price: p[v], label: VARIANT_LABEL[f]?.[v] || FEATURE_LABEL[f] };
}

const round = n => (n < 100 ? Math.round(n / 5) * 5 : Math.round(n / 10) * 10);
export const listino = n => round(n * LAUNCH_FACTOR);

// 1740 → "1.740" (toLocaleString in italiano non separa le migliaia sotto 10.000)
const num = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export function euro(n) {
  return `${num(n)} €`;
}
export function range(min, max) {
  if (max === Infinity) return `da ${euro(min)}`;
  return min === max ? euro(min) : `${num(min)} – ${euro(max)}`;
}

const arr = v => (Array.isArray(v) ? v : []);
const str = v => (typeof v === 'string' ? v.trim() : '');

// "menu A4, volantino A5 e locandina" → 3
function countItems(text) {
  const t = str(text);
  if (!t) return 1;
  return Math.min(6, Math.max(1, t.split(/\s*(?:,|;|\+|\/|\be\b|\bed\b|\n)\s*/i).filter(Boolean).length));
}

// Servizi effettivamente da prezzare, con i pacchetti applicati
function resolveExtras(b) {
  const picked = arr(b.extra).filter(id => SERVICES[id]);
  // Inclusi in altri servizi (es. brand identity comprende il logo)
  const included = new Set();
  picked.forEach(id => (SERVICES[id].includes || []).forEach(x => picked.includes(x) && included.add(x)));
  const active = picked.filter(id => !included.has(id));
  const bundle = BUNDLES.find(p => p.items.every(id => active.includes(id))) || null;
  return { picked, included: [...included], active, bundle };
}

// ─── Stima per il cliente ────────────────────────────────────────
//  b: dati del modulo (stessi nomi dei campi: extra, sezioni, ...)
//
//  Sezioni: le indispensabili (b.sezioni) entrano sempre, anche oltre
//  il budget. Le facoltative (b.sezioni_opt) riempiono prima i posti
//  liberi tra le SITE.sections comprese; le altre entrano una alla
//  volta solo se il centro della stima resta nel budget del cliente.
export function estimate(b) {
  // Sito
  const must = arr(b.sezioni);
  const opt = arr(b.sezioni_opt).filter(v => !must.includes(v));
  const freeSlots = Math.max(0, SITE.sections - must.length);
  const optional = { free: opt.slice(0, freeSlots), added: [], out: [], pending: [], overBudget: false };
  const optPaid = opt.slice(freeSlots);
  const extraSections = Math.max(0, must.length - SITE.sections);
  const lingue = Math.max(0, arr(b.lingue).length - 1);
  const site = { min: SITE.min, max: SITE.max, notes: [], tbd: [] };
  site.min += extraSections * SITE.perSection[0];
  site.max += extraSections * SITE.perSection[1];
  if (extraSections) site.notes.push(`${extraSections} ${extraSections === 1 ? 'sezione' : 'sezioni'} oltre le ${SITE.sections} incluse`);
  if (lingue) {
    site.min += lingue * SITE.perLanguage[0];
    site.max += lingue * SITE.perLanguage[1];
    site.notes.push(`${lingue} ${lingue === 1 ? 'lingua' : 'lingue'} in più`);
  }
  arr(b.funzionalita).forEach(f => {
    const { price: p, label } = featurePrice(f, b);
    if (p === undefined) return;
    if (p === null) { site.tbd.push(label); return; }
    if (!p[1]) return;
    site.min += p[0];
    site.max += p[1];
    site.notes.push(label);
  });
  // Extra
  const { picked, included, active, bundle } = resolveExtras(b);
  const qty = id => (id === 'stampati' ? countItems(b.stampati_cosa)
    : id === 'traduzioni' ? countItems(b.traduzioni_lingue) : 1);

  const items = [];
  const onDemand = [];
  active.forEach(id => {
    const s = SERVICES[id];
    if (s.onDemand) { onDemand.push(id); return; }
    if (bundle && bundle.items.includes(id)) return;
    const n = s.perItem ? qty(id) : 1;
    items.push({ id, qty: n, min: s.min * n, max: s.max * n });
  });
  if (bundle) {
    const separate = bundle.items.reduce((t, id) => [t[0] + SERVICES[id].min, t[1] + SERVICES[id].max], [0, 0]);
    items.unshift({ id: bundle.id, bundle: true, label: bundle.label, items: bundle.items, qty: 1, min: bundle.min, max: bundle.max, separate });
  }

  const extras = items.reduce((t, i) => ({ min: t.min + i.min, max: t.max + i.max }), { min: 0, max: 0 });

  // Facoltative oltre le sezioni comprese: solo se restano nel budget
  const budget = BUDGET[b.budget] || null;
  if (budget && site.min + extras.min > budget[1]) optional.overBudget = true;
  optPaid.forEach(v => {
    if (!budget) { optional.pending.push(v); return; }
    // Conta il centro della forbice, così la stima non sfora troppo il budget
    const mid = (site.min + site.max + extras.min + extras.max + SITE.perSection[0] + SITE.perSection[1]) / 2;
    if (mid <= budget[1]) {
      site.min += SITE.perSection[0];
      site.max += SITE.perSection[1];
      optional.added.push(v);
    } else optional.out.push(v);
  });
  if (optional.added.length) {
    const n = optional.added.length;
    site.notes.push(`${n} ${n === 1 ? 'facoltativa' : 'facoltative'} oltre le ${SITE.sections} incluse`);
  }
  const inSite = [...must, ...optional.free, ...optional.added];
  site.sections = inSite.length;
  site.included = inSite;
  site.optional = optional;

  // Blog: se il cliente vuole pubblicare da solo serve un pannello (CMS), da valutare
  if (inSite.includes('blog')) {
    if (b.blog_gestione === 'autonomo') site.tbd.push('blog aggiornabile da te');
    else if (b.blog_gestione === 'io') site.notes.push(`articoli caricati da me a ${RATE.hour} €/h`);
  }

  const total = { min: site.min + extras.min, max: site.max + extras.max };

  return { site, items, included, onDemand, picked, extras, total, costs: liveCosts(b) };
}

// ─── Costi vivi a carico del cliente ─────────────────────────────
//  yearly / once   costi sicuri, dati dalle risposte
//  optional        solo se il cliente sceglie un piano a pagamento o
//                  un'opzione non ancora decisa (per: 'anno' | 'una tantum')
export function liveCosts(b) {
  const extra = arr(b.extra);
  const funz = arr(b.funzionalita);
  const yearly = [];
  const once = [];
  const optional = [];

  yearly.push(b.dominio === 'si'
    ? { id: 'dominio', label: 'Rinnovo del dominio', min: 10, max: 20, note: 'lo paghi già oggi' }
    : { id: 'dominio', label: 'Dominio (.it o .com)', min: 10, max: 20 });
  if (funz.includes('ecommerce') || funz.includes('area_riservata')) {
    yearly.push({ id: 'hosting', label: 'Hosting', min: 0, max: null, note: 'per e-commerce o area riservata' });
  } else {
    yearly.push({ id: 'hosting', label: 'Hosting', min: 0, max: 0, note: 'gratuito per un sito vetrina' });
  }

  const mail = { id: 'email', label: 'Email con il tuo dominio', min: 0, max: 75, note: 'gratis se inoltri alla tua casella attuale, circa 70 € per una casella a parte' };
  if (b.email_dominio === 'si') yearly.push(mail);
  else if (b.email_dominio !== 'no') optional.push({ ...mail, per: 'anno' });

  if (funz.includes('newsletter')) {
    const nl = { id: 'newsletter', label: 'Servizio newsletter' };
    if (b.newsletter_iscritti === 'pochi') yearly.push({ ...nl, min: 0, max: 0, note: 'gratis sotto i 500 iscritti' });
    else if (b.newsletter_iscritti === 'tanti') yearly.push({ ...nl, min: 60, max: 150, note: 'con più di 500 iscritti' });
    else optional.push({ ...nl, min: 0, max: 120, note: 'gratis sotto i 500 iscritti', per: 'anno' });
  }
  if (funz.includes('prenotazioni') && b.prenotazioni_tipo !== 'richiesta') {
    optional.push({ id: 'prenotazioni', label: 'Calendario prenotazioni', min: 0, max: 240, note: 'molti hanno un piano gratuito', per: 'anno' });
  }
  if (funz.includes('ecommerce')) yearly.push({ id: 'ecommerce', label: 'Piattaforma e-commerce', min: 0, max: null, note: 'più le commissioni sulle vendite' });

  if (extra.includes('biglietti')) once.push({ id: 'stampa_biglietti', label: 'Stampa biglietti da visita', min: 20, max: 50, note: '250-500 pezzi' });
  if (extra.includes('stampati')) once.push({ id: 'stampa_materiali', label: 'Stampa dei materiali', min: 30, max: 150, note: 'in base a formato e quantità' });
  if (extra.includes('logo') || extra.includes('brand')) optional.push({ id: 'font', label: 'Font a pagamento', min: 0, max: 100, note: 'solo se ne scegliamo uno', per: 'una tantum' });

  const sum = list => list.reduce((t, c) => ({
    min: t.min + c.min,
    max: t.max === null || c.max === null ? null : t.max + c.max,
  }), { min: 0, max: 0 });

  return {
    yearly, once, optional,
    yearlyTotal: sum(yearly),
    onceTotal: sum(once),
    optionalYearly: sum(optional.filter(c => c.per === 'anno')),
  };
}

// Costo in testo: "gratis", "10 – 20 €", "da valutare"
export const costText = c => (c.max === null ? (c.min ? `da ${euro(c.min)}` : 'da valutare') : c.max === 0 ? 'gratis' : range(c.min, c.max));

// Riassunto dei costi vivi in una frase (email al cliente e al titolare)
export function costSummary(c) {
  let t = `${costText(c.yearlyTotal)} all'anno`;
  if (c.once.length) t += ` + ${costText(c.onceTotal)} una tantum`;
  if (c.optionalYearly.max) t += `; i servizi facoltativi (${c.optional.filter(x => x.per === 'anno').map(x => x.label.toLowerCase()).join(', ')}) sono gratis col piano base, a pagamento fino a ${euro(c.optionalYearly.max)} all'anno in tutto`;
  return t;
}

// ─── Prezzo suggerito (solo per il titolare, nel brief e nell'email) ─
//  Sceglie un punto della forbice in base a ciò che il cliente ha
//  scritto. È un punto di partenza per il preventivo, non un calcolo esatto.
export function suggest(b) {
  const est = estimate(b);
  const at = (min, max, t) => round(min + (max - min) * Math.min(1, Math.max(0, t)));
  const sezioni = est.site.sections;

  const site = {
    price: at(est.site.min, est.site.max, sezioni >= 6 ? 0.7 : sezioni <= 3 ? 0.3 : 0.5),
    why: [`${sezioni} ${sezioni === 1 ? 'sezione' : 'sezioni'}`, ...est.site.notes].join(', '),
  };
  if (est.site.tbd.length) site.why += ` · da valutare a parte: ${est.site.tbd.join(', ')}`;

  const lines = est.items.map(i => {
    let t = 0.5;
    let why = 'centro della forbice';
    switch (i.id) {
      case 'logo':
        if (b.logo_tipo === 'restyling') { t = 0.3; why = 'restyling di un logo esistente'; }
        else if (b.logo_tipo === 'nuovo') { t = 0.6; why = 'logo nuovo da zero'; }
        break;
      case 'brand':
        if (b.ha_logo === 'si') { t = 0.3; why = 'parte da un logo che il cliente ha già'; }
        else { t = 0.6; why = 'logo da creare insieme alla brand identity'; }
        break;
      case 'foto': {
        const n = arr(b.foto_soggetti).length;
        t = n >= 3 ? 1 : n === 2 ? 0.6 : 0.3;
        why = n ? `${n} ${n === 1 ? 'soggetto' : 'soggetti'} da fotografare` : 'soggetti non indicati';
        break;
      }
      case 'stampati':
        why = `${i.qty} ${i.qty === 1 ? 'formato' : 'formati'} stimati da “${str(b.stampati_cosa) || 'non specificato'}”`;
        break;
      case 'traduzioni':
        why = `${i.qty} ${i.qty === 1 ? 'lingua' : 'lingue'} stimate da “${str(b.traduzioni_lingue) || 'non specificato'}”`;
        break;
      case 'copy': {
        const hours = Math.min(8, Math.max(RATE.bulkFrom, Math.round(sezioni * 0.8 + 1)));
        return { ...i, price: hours * RATE.bulk, why: `circa ${hours} ore a ${RATE.bulk} €/h per ${sezioni} sezioni` };
      }
      default:
        if (i.bundle) { why = `invece di ${range(i.separate[0], i.separate[1])} separati`; }
    }
    return { ...i, price: at(i.min, i.max, t), why };
  });

  const total = site.price + lines.reduce((t, l) => t + l.price, 0);
  const budget = BUDGET[b.budget] || null;
  let budgetNote = '';
  if (budget) {
    if (est.total.min > budget[1]) budgetNote = 'La stima minima supera il budget indicato: valuta cosa togliere o proporre in un secondo momento.';
    else if (total > budget[1]) budgetNote = 'Il prezzo suggerito supera il budget indicato, ma la stima minima ci sta dentro.';
    else budgetNote = 'Il prezzo suggerito rientra nel budget indicato.';
    const o = est.site.optional;
    if (o.added.length) budgetNote += ` Facoltative aggiunte perché ci stanno: ${o.added.length}.`;
    if (o.out.length) budgetNote += ` Facoltative escluse per restare nel budget: ${o.out.length}.`;
  }

  return {
    estimate: est,
    site,
    lines,
    total,
    totalListino: listino(total),
    deposit: round(total * DEPOSIT),
    budgetNote,
  };
}
