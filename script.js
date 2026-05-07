// ═══════════════════════════════════════════════════════════════════
//  TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════
const T = {
  en: {
    navWork:          'Work',
    navAbout:         'About',    // stays "About" in both languages
    tableProject:     'Project',
    tableCat:         'Category',
    tableYear:        'Year',
    greeting:         'Hi.',
    bio:              'Designer with roots in visual and digital communication. I work across interfaces, brand identities, and editorial projects — with a precise eye and a curiosity for what makes things work.',
    footerLocation:   'Rimini, Italy',
    introLabel:       'UI / Graphic Designer — Rimini, Italy',
    introHeadline:    'Digital products, brand identities &amp; visual communication.',
    bioP1:            'Hi, I\'m Alessandro — a designer with a background in Communication Design and a strong focus on visual and digital communication. My skill set has evolved from a broad design education into solid graphic design expertise through hands-on experience, and is now increasingly focused on UI/UX design and digital channels.',
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
    exp1Period:       'Feb 2024 — Present · Rimini, Italy',
    exp1Desc:         'Works closely with the Brand Specialist to define and evolve Terranova\'s visual communication for the Men\'s department. Oversees the brand\'s online presence across terranova.com, Instagram, Facebook, and digital advertising channels.',
    exp2Period:       'Mar 2022 — Feb 2023 · Amsterdam, Netherlands',
    exp2Desc:         'Developed new visual language for the Garment Care category (irons, steamers). Created packaging prototypes using Illustrator and Photoshop, and participated in workshops to define the next packaging standard.',
    edu1Period:       'Sep 2025 — Dec 2025 · Rome, Italy',
    edu1Desc:         '11-week blended programme covering user-centred interface design, modular UI systems, prototyping, and user testing. Mentored by industry professionals throughout.',
    edu2Period:       'Oct 2019 — Mar 2023 · San Marino',
    edu2Desc:         'Degree covering the history of product and communication design alongside practical workshops in web design, motion design, and sketching.',
    edu3Period:       'Sep 2015 — Oct 2018 · Italy',
    edu3Desc:         'Inter-linguistic and intercultural communication in Italian and three foreign languages. Practical translation and language mediation skills.',
  },
  it: {
    navWork:          'Lavori',
    navAbout:         'About',    // stays "About" in Italian too
    tableProject:     'Progetto',
    tableCat:         'Categoria',
    tableYear:        'Anno',
    greeting:         'Ciao.',
    bio:              'Designer con radici nel visual e nel digitale. Lavoro su interfacce, identità di marca e progetti editoriali — con un occhio preciso e la curiosità di capire cosa fa funzionare le cose.',
    footerLocation:   'Rimini, Italia',
    introLabel:       'UI / Graphic Designer — Rimini, Italia',
    introHeadline:    'Prodotti digitali, Brand Identity &amp; comunicazione visiva.',
    bioP1:            'Ciao, sono Alessandro — un designer con un background in Communication Design e un forte focus sulla comunicazione visiva e digitale. Il mio skill set si è evoluto da una formazione ampia in design verso una solida esperienza nel graphic design, sempre più orientata verso UI/UX e i canali digitali.',
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
    exp1Period:       'Feb 2024 — Presente · Rimini, Italia',
    exp1Desc:         'Collabora con il Brand Specialist per definire e sviluppare la comunicazione visiva di Terranova per il reparto uomo. Gestisce la presenza online del brand su terranova.com, Instagram, Facebook e canali pubblicitari digitali.',
    exp2Period:       'Mar 2022 — Feb 2023 · Amsterdam, Paesi Bassi',
    exp2Desc:         'Ha sviluppato nuovo linguaggio visivo per la categoria Garment Care (ferro da stiro, vaporizzatori). Ha creato prototipi di packaging con Illustrator e Photoshop, partecipando a workshop per definire il nuovo standard di packaging.',
    edu1Period:       'Set 2025 — Dic 2025 · Roma, Italia',
    edu1Desc:         'Programma blended di 11 settimane su UI design centrato sull\'utente, sistemi UI modulari, prototipazione e user testing. Mentorship da professionisti del settore.',
    edu2Period:       'Ott 2019 — Mar 2023 · San Marino',
    edu2Desc:         'Laurea con materie che spaziano dalla storia del design di prodotto e comunicativo a workshop pratici in web design, motion design e sketching.',
    edu3Period:       'Set 2015 — Ott 2018 · Italia',
    edu3Desc:         'Comunicazione interlinguistica e interculturale in italiano e tre lingue straniere. Competenze pratiche di traduzione e mediazione linguistica.',
  }
};

// ═══════════════════════════════════════════════════════════════════
//  PROJECTS
//  preview: used for hover image and modal hero
//  images:  additional photos shown in the modal gallery
// ═══════════════════════════════════════════════════════════════════
const projects = [
  {
    title:       'NewsQuest — GenZ News App',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'November 2025', it: 'Novembre 2025' },
    client:      'Talent Garden',
    description: {
      en: 'News aggregation app for Gen Z — from research insights to tested interactive prototype. Full UX/UI case study covering discovery, information architecture, visual design, and usability testing.',
      it: 'App di aggregazione notizie per la Gen Z — da insights di ricerca a prototipo interattivo testato. Case study UX/UI completo: discovery, architettura informativa, visual design e test di usabilità.',
    },
    preview: "url('images/news.png')",
    images:  ["url('images/news.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/216882651/NewsQuest-GenZ-News-App-UX-UI-Design-Project',
  },
  {
    title:       'leARn — English for Kids in AR',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'May 2023', it: 'Maggio 2023' },
    client:      'University Project',
    description: {
      en: 'UX/UI design for leARn, an augmented reality app teaching English to children. Designed to be age-appropriate, engaging, and technically innovative — combining physical play with digital learning.',
      it: 'UX/UI design per leARn, un\'app in realtà aumentata per l\'apprendimento dell\'inglese per bambini. Progettata per essere adatta all\'età, coinvolgente e innovativa — tra gioco fisico e apprendimento digitale.',
    },
    preview: "url('images/learn-cover.png')",
    images:  ["url('images/learn-cover.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/169441153/leARn-English-for-kids-in-AR',
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
    preview: "url('images/vidia-cover.png')",
    images:  ["url('images/vidia-cover.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/168516875/Vidia-Club-Cesena-Brand-Identity',
  },
  {
    title:       'BeeSide — Electromagnetic Health',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'October 2023', it: 'Ottobre 2023' },
    client:      'BeeSide',
    description: {
      en: 'UX/UI design for BeeSide, a "friend app" designed to raise awareness of electromagnetic field threats hidden in everyday technology. Inspired by the bee — a natural EMF indicator — it guides users towards healthy habits to protect physical and mental well-being.',
      it: 'UX/UI design per BeeSide, una "friend app" pensata per sensibilizzare sui rischi dei campi elettromagnetici nascosti nella tecnologia di ogni giorno. Ispirata all\'ape — naturale indicatore di EMF — guida l\'utente verso abitudini sane per proteggere salute fisica e mentale.',
    },
    preview: "url('images/beeside-cover.png')",
    images:  ["url('images/beeside-cover.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/163046285/BeeSide-Electromagnetic-Health',
  },
  {
    title:       'ImagiNations',
    category:    { en: 'Branding', it: 'Branding' },
    date:        { en: 'January 2022', it: 'Gennaio 2022' },
    client:      'University Project',
    description: {
      en: 'Visual identity system for micronations — small political entities that come into existence for subversive reasons, issuing their own coins, stamps, passports, and emblems.',
      it: 'Sistema di identità visiva per micronazioni — piccole entità politiche nate per ragioni sovversive, dotate di proprie monete, francobolli, passaporti ed emblemi.',
    },
    preview: "url('images/nations.png')",
    images:  ["url('images/nations.png')", 'placeholder', 'placeholder'],
    url: 'https://www.behance.net/gallery/137753221/ImagiNations-Visual-Identity',
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
    preview: "url('images/china-sanmarino-cover.png')",
    images:  ["url('images/china-sanmarino-cover.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/131399963/China-and-San-Marino-50th-Anniversary-Visual-Identity',
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
    preview: "url('images/comic-cover.png')",
    images:  ["url('images/comic-cover.png')", 'placeholder'],
    url: 'https://www.behance.net/gallery/143007031/COMIC-Comic-Book-Website',
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
    preview: "url('images/climate-cover.png')",
    images:  ["url('images/climate-cover.png')", 'placeholder', 'placeholder'],
    url: 'https://www.behance.net/gallery/100033059/Climate-Change-Photography-Project',
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
const cursorEl   = document.getElementById('cursor');
const dotGridEl  = document.querySelector('.dot-grid');
const SIZE = 9;
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

  // Update dot grid position
  if (dotGridEl) {
    dotGridEl.style.setProperty('--cx', `${e.clientX}px`);
    dotGridEl.style.setProperty('--cy', `${e.clientY}px`);
  }

  if (!cursorActive) {
    cursorActive = true;
    document.documentElement.classList.add('has-mouse');
  }
});

// Track hovered element type
document.addEventListener('mouseover', e => {
  const clickable = e.target.closest('a, button, [role="button"], .project-row');
  targetHoverScale = clickable ? 2.4 : 1;
});

function cursorTick() {
  if (cursorEl && cursorActive) {
    hoverScale += (targetHoverScale - hoverScale) * 0.12;

    // Velocity-based oval — more noticeable
    const speed   = Math.sqrt(vel.x ** 2 + vel.y ** 2);
    const stretch = 1 + Math.min(speed, 30) * 0.04;  // max ~2.2x
    const squish  = 1 / Math.sqrt(stretch);
    const angle   = Math.atan2(vel.y, vel.x) * (180 / Math.PI);

    vel.x *= 0.82;
    vel.y *= 0.82;

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
    setTimeout(() => row.classList.add('is-revealed'), 60 + i * 70);
    row.addEventListener('click', () => openModal(i));
  });

  initHover();
}

// ═══════════════════════════════════════════════════════════════════
//  HOVER PREVIEW
// ═══════════════════════════════════════════════════════════════════
const cursorPreview = document.getElementById('cursorPreview');
const previewMedia  = document.getElementById('previewMedia');

const PREVIEW_W = 440;
const PREVIEW_H = 280;
const OFFSET_X  = 32;
const LERP      = 0.09;

let previewPos       = { x: 0, y: 0 };
let isPreviewVisible = false;

function showPreview() {
  if (!cursorPreview) return;
  if (!isPreviewVisible) { previewPos.x = mouse.x; previewPos.y = mouse.y; }
  isPreviewVisible = true;
  cursorPreview.classList.add('is-visible');
}
function hidePreview() {
  if (!cursorPreview) return;
  isPreviewVisible = false;
  cursorPreview.classList.remove('is-visible');
}

function previewTick() {
  if (isPreviewVisible && cursorPreview) {
    previewPos.x += (mouse.x - previewPos.x) * LERP;
    previewPos.y += (mouse.y - previewPos.y) * LERP;

    let x = previewPos.x + OFFSET_X;
    let y = previewPos.y - PREVIEW_H / 2;
    if (x + PREVIEW_W > window.innerWidth - 16) x = previewPos.x - PREVIEW_W - OFFSET_X;
    if (y < 80) y = 80;
    if (y + PREVIEW_H > window.innerHeight - 16) y = window.innerHeight - PREVIEW_H - 16;

    cursorPreview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  requestAnimationFrame(previewTick);
}
previewTick();

function initHover() {
  const rows = workList.querySelectorAll('.project-row');

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const p = projects[parseInt(row.dataset.index)];
      previewMedia.style.background     = p.preview;
      previewMedia.style.backgroundSize = 'cover';
      previewMedia.style.backgroundPosition = 'center';
      showPreview();
      rows.forEach(r => {
        r.style.transition = 'opacity 0.25s ease';
        r.style.opacity    = r === row ? '1' : '0.18';
      });
      const arrow = row.querySelector('.project-arrow');
      if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translateX(0)'; }
    });

    row.addEventListener('mouseleave', () => {
      const arrow = row.querySelector('.project-arrow');
      if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translateX(-5px)'; }
    });
  });

  workList.addEventListener('mouseleave', () => {
    rows.forEach(r => { r.style.transition = 'opacity 0.32s ease'; r.style.opacity = '1'; });
    hidePreview();
  });
}

// ═══════════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════════
const modalOverlay   = document.getElementById('modalOverlay');
const modalBox       = document.getElementById('modalBox');
const modalHero      = document.getElementById('modalHero');
const modalTitle     = document.getElementById('modalTitle');
const modalCatVal    = document.getElementById('modalCatVal');
const modalDateVal   = document.getElementById('modalDateVal');
const modalClientVal = document.getElementById('modalClientVal');
const modalDesc      = document.getElementById('modalDesc');
const modalClose     = document.getElementById('modalClose');
const modalGallery   = document.getElementById('modalGallery');

function openModal(index) {
  if (!modalOverlay) return;
  const p    = projects[index];
  const lang = currentLang;

  // Hero
  modalHero.style.background     = p.preview;
  modalHero.style.backgroundSize = 'cover';
  modalHero.style.backgroundPosition = 'center';

  // Content
  modalTitle.textContent     = p.title;
  modalCatVal.textContent    = p.category[lang];
  modalDateVal.textContent   = p.date[lang];
  modalClientVal.textContent = p.client;
  modalDesc.textContent      = p.description[lang];

  // Update labels
  document.querySelectorAll('.modal-meta-label[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang][key]) el.textContent = T[lang][key];
  });

  // Gallery (skip first image = hero)
  if (modalGallery) {
    modalGallery.innerHTML = '';
    const extras = p.images.slice(1);
    extras.forEach(img => {
      const div = document.createElement('div');
      if (img === 'placeholder') {
        div.className = 'modal-gallery-img is-placeholder';
      } else {
        div.className = 'modal-gallery-img';
        div.style.background = img;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
      }
      modalGallery.appendChild(div);
    });
    modalGallery.style.display = extras.length ? 'grid' : 'none';
  }

  document.body.style.overflow = 'hidden';
  modalOverlay.classList.add('is-open');
  modalBox.scrollTop = 0;
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ═══════════════════════════════════════════════════════════════════
//  CONTROLS INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);

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
