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
  min: 200, max: 300,            // fino a SITE.sections sezioni
  sections: 4,
  perSection: [30, 50],          // ogni sezione in più
  perLanguage: [30, 50],         // ogni lingua oltre la prima (struttura, non traduzione)
  features: {                    // funzionalità scelte allo step 3
    prenotazioni: [50, 100],
    newsletter: [30, 60],
    whatsapp: [0, 0],
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
  ecommerce: 'e-commerce', area_riservata: 'area riservata',
};

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
export function estimate(b) {
  // Sito
  const sezioni = arr(b.sezioni).length;
  const extraSections = Math.max(0, sezioni - SITE.sections);
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
    const p = SITE.features[f];
    if (p === undefined) return;
    if (p === null) { site.tbd.push(FEATURE_LABEL[f]); return; }
    if (!p[1]) return;
    site.min += p[0];
    site.max += p[1];
    site.notes.push(FEATURE_LABEL[f]);
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
  const total = { min: site.min + extras.min, max: site.max + extras.max };

  return { site, items, included, onDemand, picked, extras, total, costs: liveCosts(b) };
}

// ─── Costi vivi a carico del cliente ─────────────────────────────
export function liveCosts(b) {
  const extra = arr(b.extra);
  const funz = arr(b.funzionalita);
  const yearly = [];
  const once = [];

  yearly.push(b.dominio === 'si'
    ? { id: 'dominio', label: 'Rinnovo del dominio', min: 10, max: 20, note: 'lo paghi già oggi' }
    : { id: 'dominio', label: 'Dominio (.it o .com)', min: 10, max: 20 });
  if (funz.includes('ecommerce') || funz.includes('area_riservata')) {
    yearly.push({ id: 'hosting', label: 'Hosting', min: 0, max: null, note: 'per e-commerce o area riservata' });
  } else {
    yearly.push({ id: 'hosting', label: 'Hosting', min: 0, max: 0, note: 'gratuito per un sito vetrina' });
  }
  yearly.push({ id: 'email', label: 'Email con il tuo dominio', min: 0, max: 75, note: 'facoltativa' });
  if (funz.includes('newsletter')) yearly.push({ id: 'newsletter', label: 'Servizio newsletter', min: 0, max: 120, note: 'gratis fino a qualche centinaio di iscritti' });
  if (funz.includes('prenotazioni')) yearly.push({ id: 'prenotazioni', label: 'Servizio prenotazioni', min: 0, max: 240, note: 'molti hanno un piano gratuito' });
  if (funz.includes('ecommerce')) yearly.push({ id: 'ecommerce', label: 'Piattaforma e-commerce', min: 0, max: null, note: 'più le commissioni sulle vendite' });

  if (extra.includes('biglietti')) once.push({ id: 'stampa_biglietti', label: 'Stampa biglietti da visita', min: 20, max: 50, note: '250-500 pezzi' });
  if (extra.includes('stampati')) once.push({ id: 'stampa_materiali', label: 'Stampa dei materiali', min: 30, max: 150, note: 'in base a formato e quantità' });
  if (extra.includes('logo') || extra.includes('brand')) once.push({ id: 'font', label: 'Font a pagamento', min: 0, max: 100, note: 'solo se ne scegliamo uno' });

  const sum = list => list.reduce((t, c) => ({
    min: t.min + c.min,
    max: t.max === null || c.max === null ? null : t.max + c.max,
  }), { min: 0, max: 0 });

  return { yearly, once, yearlyTotal: sum(yearly), onceTotal: sum(once) };
}

// ─── Prezzo suggerito (solo per il titolare, nel brief e nell'email) ─
//  Sceglie un punto della forbice in base a ciò che il cliente ha
//  scritto. È un punto di partenza per il preventivo, non un calcolo esatto.
export function suggest(b) {
  const est = estimate(b);
  const at = (min, max, t) => round(min + (max - min) * Math.min(1, Math.max(0, t)));
  const sezioni = arr(b.sezioni).length;

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
