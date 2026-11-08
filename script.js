// ═══════════════════════════════════════════════════════════════════
//  TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════
const T = {
  en: {
    navWork:          'Work',
    navAbout:         'About',
    tableProject:     'Project',
    tableCat:         'Category',
    tableYear:        'Year',
    greeting:         'Hi.',
    bio:              'Designer with roots in visual and digital communication. I work across interfaces, brand identities, and editorial projects - with a precise eye and a curiosity for what makes things work.',
    footerLocation:   'Rimini, Italy',
    introLabel:       'UI / Graphic Designer, Rimini, Italy',
    introHeadline:    'Digital products, brand identities &amp; visual communication.',
    bioP1:            'Hi, I\'m Alessandro, a designer with a background in Communication Design and a strong focus on visual and digital communication. My skill set has evolved from a broad design education into solid graphic design expertise through hands-on experience, and is now increasingly focused on UI/UX design and digital channels.',
    bioP2:            'A background in language mediation strengthens my communication and listening skills, allowing me to collaborate effectively across different teams and cultural contexts.',
    disciplinesLabel: 'Disciplines',
    toolsLabel:       'Tools',
    languagesLabel:   'Languages',
    contactLabel:     'Contact',
    experienceLabel:  'Experience',
    educationLabel:   'Education',
    modalCat:         'Category',
    modalDate:        'Date',
    modalClient:      'Client',
    modalClose:       'Close',
    viewProject:      'View on Behance',
    exp1Period:       'Feb 2024 - Present · Rimini, Italy',
    exp1Desc:         'Works closely with the Brand Specialist to define and evolve Terranova\'s visual communication for the Men\'s department. Oversees the brand\'s online presence across terranova.com, Instagram, Facebook, and digital advertising channels.',
    exp2Period:       'Mar 2022 - Feb 2023 · Amsterdam, Netherlands',
    exp2Desc:         'Developed new visual language for the Garment Care category (irons, steamers). Created packaging prototypes using Illustrator and Photoshop, and participated in workshops to define the next packaging standard.',
    edu1Period:       'Sep 2025 - Dec 2025 · Rome, Italy',
    edu1Desc:         '11-week blended programme covering user-centred interface design, modular UI systems, prototyping, and user testing. Mentored by industry professionals throughout.',
    edu2Period:       'Oct 2019 - Mar 2023 · San Marino',
    edu2Desc:         'Degree covering the history of product and communication design alongside practical workshops in web design, motion design, and sketching.',
    edu3Period:       'Sep 2015 - Oct 2018 · Italy',
    edu3Desc:         'Inter-linguistic and intercultural communication in Italian and three foreign languages. Practical translation and language mediation skills.',
  },
  it: {
    navWork:          'Lavori',
    navAbout:         'About',
    tableProject:     'Progetto',
    tableCat:         'Categoria',
    tableYear:        'Anno',
    greeting:         'Ciao.',
    bio:              'Designer con radici nel visual e nel digitale. Lavoro su interfacce, identità di marca e progetti editoriali - con un occhio preciso e la curiosità di capire cosa fa funzionare le cose.',
    footerLocation:   'Rimini, Italia',
    introLabel:       'UI / Graphic Designer, Rimini, Italia',
    introHeadline:    'Prodotti digitali, Brand Identity &amp; comunicazione visiva.',
    bioP1:            'Ciao, sono Alessandro, un designer con un background in Communication Design e un forte focus sulla comunicazione visiva e digitale. Il mio skill set si è evoluto da una formazione ampia in design verso una solida esperienza nel graphic design, sempre più orientata verso UI/UX e i canali digitali.',
    bioP2:            'Un background in mediazione linguistica rafforza le mie capacità comunicative, permettendomi di collaborare efficacemente con team diversi e in contesti culturali differenti.',
    disciplinesLabel: 'Discipline',
    toolsLabel:       'Strumenti',
    languagesLabel:   'Lingue',
    contactLabel:     'Contatti',
    experienceLabel:  'Esperienza',
    educationLabel:   'Formazione',
    modalCat:         'Categoria',
    modalDate:        'Data',
    modalClient:      'Cliente',
    modalClose:       'Chiudi',
    viewProject:      'Vedi su Behance',
    exp1Period:       'Feb 2024 - Presente · Rimini, Italia',
    exp1Desc:         'Collabora con il Brand Specialist per definire e sviluppare la comunicazione visiva di Terranova per il reparto uomo. Gestisce la presenza online del brand su terranova.com, Instagram, Facebook e canali pubblicitari digitali.',
    exp2Period:       'Mar 2022 - Feb 2023 · Amsterdam, Paesi Bassi',
    exp2Desc:         'Ha sviluppato nuovo linguaggio visivo per la categoria Garment Care (ferro da stiro, vaporizzatori). Ha creato prototipi di packaging con Illustrator e Photoshop, partecipando a workshop per definire il nuovo standard di packaging.',
    edu1Period:       'Set 2025 - Dic 2025 · Roma, Italia',
    edu1Desc:         'Programma blended di 11 settimane su UI design centrato sull\'utente, sistemi UI modulari, prototipazione e user testing. Mentorship da professionisti del settore.',
    edu2Period:       'Ott 2019 - Mar 2023 · San Marino',
    edu2Desc:         'Laurea con materie che spaziano dalla storia del design di prodotto e comunicativo a workshop pratici in web design, motion design e sketching.',
    edu3Period:       'Set 2015 - Ott 2018 · Italia',
    edu3Desc:         'Comunicazione interlinguistica e interculturale in italiano e tre lingue straniere. Competenze pratiche di traduzione e mediazione linguistica.',
  }
};

// ═══════════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════════
const projects = [
  {
    title:       'Bugonia: Promotional Website',
    category:    { en: 'UI Design', it: 'UI Design' },
    date:        { en: 'April 2026', it: 'Aprile 2026' },
    client:      'Talent Garden',
    description: {
      en: 'Fictional website promoting the theatrical release of the film Bugonia, designed for the UI Challenge with Mirko Santangelo at Talent Garden. A cinematic, editorial landing page built in Figma, with a full-screen menu, serif typography and a persistent call to action for tickets.',
      it: 'Sito fittizio per promuovere l\'uscita in sala del film Bugonia, progettato per la UI Challenge con Mirko Santangelo di Talent Garden. Una landing page editoriale e cinematografica realizzata in Figma, con menu a schermo intero, tipografia serif e una call to action sempre visibile per i biglietti.',
    },
    preview: "url('images/bugonia-cover.jpg')",
    images:  ["url('images/bugonia-cover.jpg')", "url('images/bugonia-2.jpg')", "url('images/bugonia-3.jpg')"],
    url: 'https://www.behance.net/gallery/247463845/Bugonia-promotional-Website-UI-Challenge',
  },
  {
    title:       'NewsQuest: GenZ News App',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'November 2025', it: 'Novembre 2025' },
    client:      'Talent Garden',
    description: {
      en: 'News aggregation app for Gen Z. From research insights to tested interactive prototype: a full UX/UI case study covering discovery, information architecture, visual design, and usability testing.',
      it: 'App di aggregazione notizie per la Gen Z - da insights di ricerca a prototipo interattivo testato. Case study UX/UI completo: discovery, architettura informativa, visual design e test di usabilità.',
    },
    preview: "url('images/newsquest-cover.jpg')",
    images:  ["url('images/newsquest-cover.jpg')", "url('images/newsquest-2.jpg')", "url('images/newsquest-3.jpg')", "url('images/newsquest-4.jpg')"],
    url: 'https://www.behance.net/gallery/241354399/NewsQuest-GenZ-News-App-UX-UI-Design-Project',
  },
  {
    title:       'leARn: English for Kids in AR',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'May 2023', it: 'Maggio 2023' },
    client:      'University Project',
    description: {
      en: 'UX/UI design for leARn, an augmented reality app teaching English to children. Designed to be age-appropriate, engaging, and technically innovative - combining physical play with digital learning.',
      it: 'UX/UI design per leARn, un\'app in realtà aumentata per l\'apprendimento dell\'inglese per bambini. Progettata per essere adatta all\'età, coinvolgente e innovativa - tra gioco fisico e apprendimento digitale.',
    },
    preview: "url('images/learn-cover.jpg')",
    images:  ["url('images/learn-cover.jpg')", "url('images/learn-2.jpg')", "url('images/learn-3.jpg')", "url('images/learn-4.jpg')"],
    url: 'https://www.behance.net/gallery/167692593/leARn-English-for-kids-in-AR',
  },
  {
    title:       'Vidia Club Cesena',
    category:    { en: 'Branding', it: 'Branding' },
    date:        { en: 'June 2023', it: 'Giugno 2023' },
    client:      'Vidia Club Cesena',
    description: {
      en: 'Brand identity for Vidia Club Cesena. A bold visual system built around a distinctive logotype and a warm red-pink palette, with the tagline "disobbedisciti" (disobey yourself) at its core.',
      it: 'Identità visiva per Vidia Club Cesena. Un sistema visivo audace basato su un logotipo distintivo e una palette rosso-rosa caldo, con il payoff "disobbedisciti" al centro del progetto.',
    },
    preview: "url('images/vidia-cover.jpg')",
    images:  ["url('images/vidia-cover.jpg')", "url('images/vidia-2.jpg')", "url('images/vidia-3.jpg')", "url('images/vidia-4.jpg')"],
    url: 'https://www.behance.net/gallery/168405025/Vidia-Club-Cesena-Brand-Identity',
  },
  {
    title:       'BeeSide: Electromagnetic Health',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'October 2023', it: 'Ottobre 2023' },
    client:      'BeeSide',
    description: {
      en: 'UX/UI design for BeeSide, a "friend app" designed to raise awareness of electromagnetic field threats hidden in everyday technology. Inspired by the bee - a natural EMF indicator - it guides users towards healthy habits to protect physical and mental well-being.',
      it: 'UX/UI design per BeeSide, una "friend app" pensata per sensibilizzare sui rischi dei campi elettromagnetici nascosti nella tecnologia di ogni giorno. Ispirata all\'ape - naturale indicatore di EMF - guida l\'utente verso abitudini sane per proteggere salute fisica e mentale.',
    },
    preview: "url('images/beeside-cover.jpg')",
    images:  ["url('images/beeside-cover.jpg')", "url('images/beeside-2.jpg')", "url('images/beeside-3.jpg')"],
    url: 'https://www.behance.net/gallery/169424935/BeeSide-Electromagnetic-Health',
  },
  {
    title:       'Philips DA: Sustainable Packaging',
    category:    { en: 'Packaging', it: 'Packaging' },
    date:        { en: '2022', it: '2022' },
    client:      'Philips Domestic Appliances',
    description: {
      en: 'New packaging standard for Philips Domestic Appliances, developed with the Versuni Design team during my internship in Amsterdam, where I worked on idea creation and implementation. Products now ship in a 100% recycled kraft box with art printed directly on the board and much less ink. A universal pack with global information can be sold anywhere in the world, while plastic bags are replaced by recycled paper and a QR code on the inner flaps leads to the Home.id portal, cutting printed in-box material.',
      it: 'Nuovo standard di packaging per Philips Domestic Appliances, sviluppato con il team Versuni Design durante il tirocinio ad Amsterdam, dove ho lavorato all\'ideazione e all\'implementazione. I prodotti arrivano ora in una scatola di cartone kraft riciclato al 100%, con la grafica stampata direttamente sul cartone e molto meno inchiostro. Un packaging universale con informazioni globali permette di venderlo in tutto il mondo, mentre i sacchetti di plastica sono sostituiti da carta riciclata e un QR code sulle alette interne porta al portale Home.id, riducendo il materiale stampato nella scatola.',
    },
    preview: "url('images/philips-cover.jpg')",
    images:  ["url('images/philips-cover.jpg')", "url('images/philips-range.jpg')", "url('images/philips-airfryer.jpg')", "url('images/philips-dieline.jpg')", "url('images/philips-journey.jpg')"],
    url: '',
  },
  {
    title:       'ImagiNations',
    category:    { en: 'Branding', it: 'Branding' },
    date:        { en: 'January 2022', it: 'Gennaio 2022' },
    client:      'University Project',
    description: {
      en: 'Visual identity system for micronations - small political entities that come into existence for subversive reasons, issuing their own coins, stamps, passports, and emblems.',
      it: 'Sistema di identità visiva per micronazioni - piccole entità politiche nate per ragioni sovversive, dotate di proprie monete, francobolli, passaporti ed emblemi.',
    },
    preview: "url('images/imaginations-cover.jpg')",
    images:  ["url('images/imaginations-cover.jpg')", "url('images/imaginations-2.jpg')", "url('images/imaginations-3.jpg')", "url('images/imaginations-4.jpg')"],
    url: 'https://www.behance.net/gallery/168854265/ImagiNations-Visual-Identity',
  },
  {
    title:       'China & San Marino 50th Anniversary',
    category:    { en: 'Branding', it: 'Branding' },
    date:        { en: 'October 2021', it: 'Ottobre 2021' },
    client:      'University Project',
    description: {
      en: 'Visual identity for the 50th anniversary of diplomatic relations between the People\'s Republic of China and the Republic of San Marino. A geometric system merging Eastern and Western design traditions.',
      it: 'Identità visiva per il 50° anniversario delle relazioni diplomatiche tra la RPC e la Repubblica di San Marino. Un sistema geometrico che unisce tradizioni di design orientali e occidentali.',
    },
    preview: "url('images/china-cover.jpg')",
    images:  ["url('images/china-cover.jpg')", "url('images/china-2.jpg')", "url('images/china-3.jpg')", "url('images/china-4.jpg')"],
    url: 'https://www.behance.net/gallery/169164871/China-and-San-Marino-50th-Anniversary-Visual-Identity',
  },
  {
    title:       '.COMIC',
    category:    { en: 'Web Design', it: 'Web Design' },
    date:        { en: 'March 2022', it: 'Marzo 2022' },
    client:      'University Project',
    description: {
      en: 'Web design for a comic book collecting e-commerce platform. Built around Italian comics culture, with a bold editorial aesthetic blending dark backgrounds, red accents, and dynamic typography.',
      it: 'Web design per una piattaforma e-commerce di collezionismo fumetti. Costruita attorno alla cultura del fumetto italiano, con un\'estetica editoriale audace: sfondi scuri, accenti rossi, tipografia dinamica.',
    },
    preview: "url('images/comic-cover.jpg')",
    images:  ["url('images/comic-cover.jpg')", "url('images/comic-2.jpg')"],
    url: 'https://www.behance.net/gallery/169624267/COMIC-Comic-Book-Website',
  },
  {
    title:       'Climate Change',
    category:    { en: 'Photography', it: 'Fotografia' },
    date:        { en: 'April 2020', it: 'Aprile 2020' },
    client:      'Personal Project',
    description: {
      en: 'A series of staged photographs prompting reflection on human impact on the environment. Created during the Covid-19 lockdown, the work highlights links between environmental emergencies and human health.',
      it: 'Una serie di fotografie allestite per riflettere sull\'impatto dell\'uomo sull\'ambiente, realizzata durante il lockdown da Covid-19. Il progetto evidenzia i legami tra emergenze ambientali e salute umana.',
    },
    preview: "url('images/climate-cover.jpg')",
    images:  ["url('images/climate-cover.jpg')", "url('images/climate-2.jpg')", "url('images/climate-3.jpg')", "url('images/climate-4.jpg')"],
    url: 'https://www.behance.net/gallery/168463065/Climate-Change-Photography-Project',
  },
];

// ═══════════════════════════════════════════════════════════════════
//  LANGUAGE
// ═══════════════════════════════════════════════════════════════════
function detectLanguage() {
  const saved = localStorage.getItem('am_lang');
  if (saved === 'en' || saved === 'it') return saved;
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

let currentLang = detectLanguage();

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('am_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang][key] !== undefined) {
      if (el.dataset.i18nHtml) el.innerHTML = T[lang][key];
      else el.textContent = T[lang][key];
    }
  });

  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'en' ? 'IT' : 'EN';

  // Update project row categories
  document.querySelectorAll('.project-row').forEach(row => {
    const idx = parseInt(row.dataset.index);
    if (!isNaN(idx)) {
      const catEl = row.querySelector('.project-cat');
      if (catEl) catEl.textContent = projects[idx].category[lang];
    }
  });

  // Update modal close button text
  const closeTextEl = document.getElementById('modalCloseText');
  if (closeTextEl) closeTextEl.textContent = T[lang].modalClose;

  // Update modal link text if visible
  const linkTextEl = document.getElementById('modalLinkText');
  if (linkTextEl) linkTextEl.textContent = T[lang].viewProject;
}

// ═══════════════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════════════
const THEME_LABELS = { auto: 'Auto', light: 'Light', dark: 'Dark' };
let currentTheme = localStorage.getItem('am_theme') || 'auto';

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('am_theme', theme);
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = THEME_LABELS[theme];
}

// ═══════════════════════════════════════════════════════════════════
//  CURSOR
// ═══════════════════════════════════════════════════════════════════
const cursorEl  = document.getElementById('cursor');
const dotGridEl = document.querySelector('.dot-grid');
const SIZE = 10;
const HALF = SIZE / 2;

let mouse     = { x: 0, y: 0 };
let lastMouse = { x: 0, y: 0 };
let vel       = { x: 0, y: 0 };
let hoverScale       = 1;
let targetHoverScale = 1;
let cursorActive     = false;

document.addEventListener('mousemove', e => {
  vel.x = e.clientX - lastMouse.x;
  vel.y = e.clientY - lastMouse.y;
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (dotGridEl) {
    dotGridEl.style.setProperty('--cx', `${e.clientX}px`);
    dotGridEl.style.setProperty('--cy', `${e.clientY}px`);
  }

  if (!cursorActive) {
    cursorActive = true;
    document.documentElement.classList.add('has-mouse');
  }
});

document.addEventListener('mouseover', e => {
  const clickable = e.target.closest('a, button, [role="button"], .project-row');
  targetHoverScale = clickable ? 2.2 : 1;
});

function cursorTick() {
  if (cursorEl && cursorActive) {
    hoverScale += (targetHoverScale - hoverScale) * 0.13;

    const speed   = Math.sqrt(vel.x ** 2 + vel.y ** 2);
    const stretch = 1 + Math.min(speed, 28) * 0.038;
    const squish  = 1 / Math.sqrt(stretch);
    const angle   = Math.atan2(vel.y, vel.x) * (180 / Math.PI);

    vel.x *= 0.80;
    vel.y *= 0.80;

    cursorEl.style.transform =
      `translate(${mouse.x - HALF}px, ${mouse.y - HALF}px)` +
      ` rotate(${angle}deg)` +
      ` scale(${hoverScale})` +
      ` scaleX(${stretch}) scaleY(${squish})`;
  }
  requestAnimationFrame(cursorTick);
}
cursorTick();

// ═══════════════════════════════════════════════════════════════════
//  PROJECT LIST  (index page only)
// ═══════════════════════════════════════════════════════════════════
const workList = document.getElementById('workList');

if (workList) {
  projects.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'project-row';
    row.dataset.index = i;
    row.innerHTML = `
      <span class="project-title">${p.title}</span>
      <span class="project-cat">${p.category[currentLang]}</span>
      <span class="project-year">${p.date[currentLang].split(' ').pop()}</span>
      <span class="project-arrow">&#x2192;</span>
    `;
    workList.appendChild(row);

    // Stagger reveal after hero finishes
    setTimeout(() => row.classList.add('is-revealed'), 550 + i * 65);

    row.addEventListener('click', () => openModal(i));
  });

  // Hover: dim other rows
  workList.addEventListener('mouseenter', () => {
    workList.classList.add('is-hovering');
  }, true);

  workList.addEventListener('mouseleave', () => {
    workList.classList.remove('is-hovering');
    clearBg();
  });

  workList.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      setBgProject(parseInt(row.dataset.index));
    });
  });

  initScrollBg();
}

// ═══════════════════════════════════════════════════════════════════
//  FULLSCREEN BACKGROUND
// ═══════════════════════════════════════════════════════════════════
const bgLayerA = document.getElementById('bgLayerA');
const bgLayerB = document.getElementById('bgLayerB');
let bgActiveLayer  = 'A';
let currentBgIndex = -1;

function setBgProject(index) {
  if (!bgLayerA || !bgLayerB || index === currentBgIndex) return;
  currentBgIndex = index;
  const p        = projects[index];
  const incoming = bgActiveLayer === 'A' ? bgLayerB : bgLayerA;
  const outgoing = bgActiveLayer === 'A' ? bgLayerA : bgLayerB;

  incoming.style.background         = p.preview;
  incoming.style.backgroundSize     = 'cover';
  incoming.style.backgroundPosition = 'center';
  incoming.classList.add('is-active');
  outgoing.classList.remove('is-active');
  bgActiveLayer = bgActiveLayer === 'A' ? 'B' : 'A';
  logoFieldVisible(false);
}

function clearBg() {
  if (!bgLayerA || !bgLayerB) return;
  currentBgIndex = -1;
  bgLayerA.classList.remove('is-active');
  bgLayerB.classList.remove('is-active');
  logoFieldVisible(true);
}

// ═══════════════════════════════════════════════════════════════════
//  PARTICLE LOGO  (index page: shown when no project is previewed)
// ═══════════════════════════════════════════════════════════════════
const logoFieldEl = document.getElementById('logoField');

function logoFieldVisible(show) {
  if (logoFieldEl) logoFieldEl.classList.toggle('is-hidden', !show);
}

if (logoFieldEl) (function initLogoField() {
  // Same path as favicon.svg, clipped flat at top and bottom like logo.png
  const LOGO = new Path2D('M0.00992366 24.1499L8.3179 -0.357261C8.49984 -0.894806 9.08369 -1.18425 9.62289 -1.00066C9.9388 -0.893152 10.1637 -0.650016 10.2679 -0.357261L19.6808 23.5941L16.5729 23.5379L26.0156 -0.779027C26.8773 -2.88951 29.957 -2.30069 29.9967 -0.0380411C30.0281 0.0248103 29.9752 24.2044 29.9967 24.2921C29.9967 25.9841 28.6255 27.3553 26.9335 27.3569C25.2415 27.3569 23.8687 25.9858 23.8687 24.2938C23.9166 23.8984 25.8121 0.282832 25.865 -0.0843527L29.8445 0.779028C29.8181 0.840225 19.656 24.7999 19.6312 24.8561C19.0407 26.2504 17.0245 26.1611 16.5481 24.7403L8.31459 0.357262H10.2646L0.830301 24.4509C0.62686 24.957 -0.158783 24.7072 0.00992366 24.1515V24.1499Z');
  const BOX = { x: 0, y: 0, w: 30, h: 24.2 };

  const ctx = logoFieldEl.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let W = 0, H = 0, dpr = 1, N = 0;
  let hx, hy, x, y, vx, vy, z, ph;   // typed arrays, sorted by depth bucket
  let bucketEnd = [0, 0, 0];
  let ink = '#141210', baseAlpha = 0.3;
  let startTime = performance.now();
  const INTRO_S = 3.6; // seconds for particles to gather into the logo

  // Pointer (mouse or touch), with its own smoothed velocity
  const ptr = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
  window.addEventListener('pointermove', e => {
    ptr.vx = e.clientX - (ptr.active ? ptr.x : e.clientX);
    ptr.vy = e.clientY - (ptr.active ? ptr.y : e.clientY);
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { ptr.active = false; });
  window.addEventListener('touchend', () => { ptr.active = false; }, { passive: true });

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue('--ink').trim() || ink;
    const bg = cs.getPropertyValue('--bg').trim();
    const dark = bg && parseInt(bg.replace('#', '').slice(0, 2), 16) < 0x50;
    baseAlpha = dark ? 0.34 : 0.4;
    if (reduceMotion.matches) draw();
  }

  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    logoFieldEl.width = Math.round(W * dpr);
    logoFieldEl.height = Math.round(H * dpr);

    const mobile = W <= 720;
    const logoH = mobile ? Math.min(H * 0.5, W * 0.8 * BOX.h / BOX.w) : Math.min(H * 0.8, W * 0.6 * BOX.h / BOX.w);
    const s = logoH / BOX.h;
    const ox = W * (mobile ? 0.5 : 0.56) - (BOX.x + BOX.w / 2) * s;
    const oy = H * 0.5 - (BOX.y + BOX.h / 2) * s;

    // Rasterise the logo once and sample points inside it
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d', { willReadFrequently: true });
    octx.setTransform(s, 0, 0, s, ox, oy);
    octx.beginPath();
    octx.rect(BOX.x, BOX.y, BOX.w, BOX.h);
    octx.clip();
    octx.fill(LOGO);
    const data = octx.getImageData(0, 0, W, H).data;
    const bx0 = Math.max(0, Math.floor(ox + BOX.x * s)), bx1 = Math.min(W, Math.ceil(ox + (BOX.x + BOX.w) * s));
    const by0 = Math.max(0, Math.floor(oy + BOX.y * s)), by1 = Math.min(H, Math.ceil(oy + (BOX.y + BOX.h) * s));
    const inside = (px, py) => {
      px |= 0; py |= 0;
      return px >= 0 && py >= 0 && px < W && py < H && data[(py * W + px) * 4 + 3] > 128;
    };

    N = Math.round((mobile ? 5500 : 13000) * Math.min(1.25, Math.max(0.6, logoH / 760)));
    const pts = [];
    let tries = 0;
    while (pts.length < N && tries < N * 40) {
      tries++;
      let px = bx0 + Math.random() * (bx1 - bx0);
      let py = by0 + Math.random() * (by1 - by0);
      if (!inside(px, py)) continue;
      const r = Math.random();
      if (r < 0.16) { px += gauss() * 7; py += gauss() * 7; }        // grainy edges
      else if (r < 0.19) { px += gauss() * 34; py += gauss() * 34; } // sparse strays
      const depth = Math.random() ** 1.6;
      pts.push([px, py, depth]);
    }
    N = pts.length;
    pts.sort((a, b) => a[2] - b[2]);

    hx = new Float32Array(N); hy = new Float32Array(N);
    x = new Float32Array(N);  y = new Float32Array(N);
    vx = new Float32Array(N); vy = new Float32Array(N);
    z = new Float32Array(N);  ph = new Float32Array(N);
    bucketEnd = [0, 0, N];
    const intro = !reduceMotion.matches;
    for (let i = 0; i < N; i++) {
      const [px, py, d] = pts[i];
      hx[i] = px; hy[i] = py; z[i] = d; ph[i] = Math.random() * Math.PI * 2;
      x[i] = intro ? Math.random() * W : px;
      y[i] = intro ? Math.random() * H : py;
      if (d < 0.45) bucketEnd[0] = i + 1;
      if (d < 0.8)  bucketEnd[1] = i + 1;
    }
    if (!intro) draw();
  }

  function step(now) {
    const t = (now - startTime) / 1000;
    const introK = Math.min(1, t / INTRO_S);
    // Strong pull while gathering, then a soft, near-critically damped return
    // (slow and not elastic) once the logo has formed
    const SETTLE_SPRING = 0.0025, SETTLE_DAMP = 0.9;
    const afterK = t < INTRO_S ? 0 : Math.min(1, (t - INTRO_S) / 1.5);
    const introSpring = 0.003 + 0.033 * introK * introK;
    const spring = introSpring + (SETTLE_SPRING - introSpring) * afterK;
    const damp = 0.87 + (SETTLE_DAMP - 0.87) * afterK;
    const cx = W * 0.5, cy = H * 0.5;
    const R = Math.min(260, W * 0.3), R2 = R * R;
    const px = ptr.x, py = ptr.y, pvx = ptr.vx, pvy = ptr.vy;
    const moveK = Math.min(1, Math.hypot(pvx, pvy) / 12);
    const usePtr = ptr.active && moveK > 0.01;
    const parX = ptr.active ? (px - cx) * 0.018 : 0;
    const parY = ptr.active ? (py - cy) * 0.018 : 0;

    for (let i = 0; i < N; i++) {
      const d = z[i];
      const tx = hx[i] + Math.sin(t * 0.55 + ph[i]) * 1.4 * d + parX * (d - 0.4);
      const ty = hy[i] + Math.cos(t * 0.47 + ph[i] * 1.3) * 1.4 * d + parY * (d - 0.4);
      let ax = (tx - x[i]) * spring;
      let ay = (ty - y[i]) * spring;

      if (usePtr) {
        const dx = x[i] - px, dy = y[i] - py;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < R2 && dist2 > 0.01) {
          // Push only while the pointer moves: a still cursor leaves the logo at rest
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / R) ** 2 * moveK;
          ax += (dx / dist) * 1.1 * f + pvx * f * 0.035;
          ay += (dy / dist) * 1.1 * f + pvy * f * 0.035;
        }
      }
      vx[i] = (vx[i] + ax) * damp;
      vy[i] = (vy[i] + ay) * damp;
      x[i] += vx[i];
      y[i] += vy[i];
    }
    ptr.vx *= 0.85; ptr.vy *= 0.85;
  }

  function draw(introAlpha = 1) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    const sizes = [1, 1.15, 1.6];
    const alphas = [0.45, 0.7, 1];
    let from = 0;
    for (let b = 0; b < 3; b++) {
      ctx.globalAlpha = baseAlpha * alphas[b] * introAlpha;
      const sz = sizes[b];
      for (let i = from; i < bucketEnd[b]; i++) ctx.fillRect(x[i], y[i], sz, sz);
      from = bucketEnd[b];
    }
    ctx.globalAlpha = 1;
  }

  let hiddenAt = 0, lastFrame = 0, acc = 0;
  const STEP_MS = 1000 / 60;
  function frame(now) {
    if (!reduceMotion.matches) {
      const hidden = logoFieldEl.classList.contains('is-hidden');
      if (hidden && !hiddenAt) hiddenAt = now;
      if (!hidden) hiddenAt = 0;
      // Keep simulating while visible or still fading out; idle afterwards
      if (!hidden || now - hiddenAt < 700) {
        // Fixed 60 Hz physics so the motion feels the same on 60 and 120 Hz screens
        if (!lastFrame) lastFrame = now;
        acc = Math.min(acc + (now - lastFrame), 100);
        lastFrame = now;
        let steps = 0;
        while (acc >= STEP_MS && steps < 4) { step(now); acc -= STEP_MS; steps++; }
        draw(Math.min(1, (now - startTime) / 2200));
      } else {
        lastFrame = 0;
      }
    }
    requestAnimationFrame(frame);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { startTime = performance.now() - INTRO_S * 1000; build(); }, 150);
  });
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);

  readColors();
  build();
  requestAnimationFrame(frame);
})();

function initScrollBg() {
  const rows = workList.querySelectorAll('.project-row');
  let isHovering = false;

  workList.addEventListener('mouseenter', () => { isHovering = true; }, true);
  workList.addEventListener('mouseleave', () => { isHovering = false; });

  function getClosestRowIndex() {
    const viewCenter = window.innerHeight / 2;
    let minDist = Infinity;
    let idx = -1;
    rows.forEach(row => {
      const rect = row.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - viewCenter);
      if (dist < minDist) { minDist = dist; idx = parseInt(row.dataset.index); }
    });
    return minDist < window.innerHeight * 0.6 ? idx : -1;
  }

  window.addEventListener('scroll', () => {
    if (isHovering) return;
    const idx = getClosestRowIndex();
    if (idx >= 0) setBgProject(idx);
    else clearBg();
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════════
const modalOverlay   = document.getElementById('modalOverlay');
const modalPanel     = document.getElementById('modalPanel');
const modalHero      = document.getElementById('modalHero');
const modalTitle     = document.getElementById('modalTitle');
const modalCatVal    = document.getElementById('modalCatVal');
const modalDateVal   = document.getElementById('modalDateVal');
const modalClientVal = document.getElementById('modalClientVal');
const modalDesc      = document.getElementById('modalDesc');
const modalClose     = document.getElementById('modalClose');
const modalGallery   = document.getElementById('modalGallery');
const modalLink      = document.getElementById('modalLink');
const modalLinkText  = document.getElementById('modalLinkText');

function openModal(index) {
  if (!modalOverlay) return;
  const p    = projects[index];
  const lang = currentLang;

  modalHero.style.background           = p.preview;
  modalHero.style.backgroundSize       = 'cover';
  modalHero.style.backgroundPosition   = 'center';

  modalTitle.textContent     = p.title;
  modalCatVal.textContent    = p.category[lang];
  modalDateVal.textContent   = p.date[lang];
  modalClientVal.textContent = p.client;
  modalDesc.textContent      = p.description[lang];

  // Update meta labels
  document.querySelectorAll('.modal-meta-label[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang][key]) el.textContent = T[lang][key];
  });

  // Gallery: all project images (the first one is also the cover)
  if (modalGallery) {
    modalGallery.innerHTML = '';
    const extras = p.images;
    extras.forEach(img => {
      const div = document.createElement('div');
      div.className = img === 'placeholder'
        ? 'modal-gallery-img is-placeholder'
        : 'modal-gallery-img';
      if (img !== 'placeholder') {
        div.style.background           = img;
        div.style.backgroundSize       = 'cover';
        div.style.backgroundPosition   = 'center';
      }
      modalGallery.appendChild(div);
    });
    modalGallery.style.display = extras.length ? 'grid' : 'none';
  }

  // Behance link
  if (modalLink) {
    if (p.url) {
      modalLink.href  = p.url;
      modalLink.style.display = '';
      if (modalLinkText) modalLinkText.textContent = T[lang].viewProject;
    } else {
      modalLink.style.display = 'none';
    }
  }

  document.body.style.overflow = 'hidden';
  modalOverlay.classList.add('is-open');
  if (modalPanel) modalPanel.scrollTop = 0;
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  // Double RAF ensures initial paint is committed before reveal transitions start
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });
  });

  // Theme dropdown
  const themeBtn  = document.getElementById('themeToggle');
  const themeMenu = document.getElementById('themeMenu');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', e => {
      e.stopPropagation();
      themeMenu.hidden = !themeMenu.hidden;
    });

    themeMenu.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
        themeMenu.hidden = true;
      });
    });

    document.addEventListener('click', () => { themeMenu.hidden = true; });
    themeMenu.addEventListener('click', e => e.stopPropagation());
  }

  // Language toggle
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'IT' : 'EN';
    langBtn.addEventListener('click', () => applyLanguage(currentLang === 'en' ? 'it' : 'en'));
  }

  // Footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
