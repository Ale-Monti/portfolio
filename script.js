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
    title:       'NewsQuest: GenZ News App',
    category:    { en: 'UI/UX', it: 'UI/UX' },
    date:        { en: 'November 2025', it: 'Novembre 2025' },
    client:      'Talent Garden',
    description: {
      en: 'News aggregation app for Gen Z. From research insights to tested interactive prototype: a full UX/UI case study covering discovery, information architecture, visual design, and usability testing.',
      it: 'App di aggregazione notizie per la Gen Z - da insights di ricerca a prototipo interattivo testato. Case study UX/UI completo: discovery, architettura informativa, visual design e test di usabilità.',
    },
    preview: "url('images/news.png')",
    images:  ["url('images/newsquest-cover.png')", "url('images/newsquest-2.png')"],
    url: 'https://www.behance.net/gallery/216882651/NewsQuest-GenZ-News-App-UX-UI-Design-Project',
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
    preview: "url('images/learn-cover.png')",
    images:  ["url('images/learn-cover.png')", "url('images/learn-2.png')"],
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
    images:  ["url('images/vidia-cover.png')", "url('images/vidia-2.png')"],
    url: 'https://www.behance.net/gallery/168516875/Vidia-Club-Cesena-Brand-Identity',
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
    preview: "url('images/beeside-cover.png')",
    images:  ["url('images/beeside-cover.png')", "url('images/beeside-2.png')"],
    url: 'https://www.behance.net/gallery/163046285/BeeSide-Electromagnetic-Health',
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
    preview: "url('images/nations.png')",
    images:  ["url('images/nations.png')", "url('images/imaginations-2.png')", "url('images/imaginations-3.png')"],
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
    images:  ["url('images/china-sanmarino-cover.png')", "url('images/china-sanmarino-2.png')"],
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
    images:  ["url('images/comic-cover.png')", "url('images/comic-2.png')"],
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
    images:  ["url('images/climate-cover.png')", "url('images/climate-2.png')", "url('images/climate-3.png')"],
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
}

function clearBg() {
  if (!bgLayerA || !bgLayerB) return;
  currentBgIndex = -1;
  bgLayerA.classList.remove('is-active');
  bgLayerB.classList.remove('is-active');
}

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

  // Gallery (skip first = hero)
  if (modalGallery) {
    modalGallery.innerHTML = '';
    const extras = p.images.slice(1);
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
