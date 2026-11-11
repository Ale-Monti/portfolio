// ═══════════════════════════════════════════════════════════════════
//  BRIEF FORM – multi-step, validazione inline, bozza in localStorage,
//  upload con anteprime, Turnstile, invio a /api/brief
//  (tema, cursore e nav arrivano da script.js; i prezzi da pricing.js)
// ═══════════════════════════════════════════════════════════════════
import { SERVICES, BUNDLES, RATE, DEPOSIT, SITE, estimate, listino, range, euro } from './pricing.js?v=3';

(() => {
  'use strict';

  const STORAGE_KEY = 'am_brief_v1';
  const TOTAL_STEPS = 7;
  const MAX_FILES = 8;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_INSPO = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
  const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];
  // Chiave di test ufficiale Cloudflare: passa sempre, usata solo in locale
  const TURNSTILE_TEST_KEY = '1x00000000000000000000AA';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const form        = $('#briefForm');
  if (!form) return;
  const steps       = $$('.step', form);
  const stepBtns    = $$('#stepList button');
  const prevBtn     = $('#prevBtn');
  const nextBtn     = $('#nextBtn');
  const reviewBtn   = $('#reviewBtn');
  const progress    = $('.brief-progress');
  const progressFill = $('#progressFill');
  const counter     = $('#stepCounter');
  const live        = $('#live');
  const reviewEl    = $('#review');
  const formError   = $('#formError');
  const inspoList   = $('#inspoList');
  const inspoTpl    = $('#inspoTemplate');
  const addInspoBtn = $('#addInspo');
  const fileInput   = $('#f-files');
  const dropzone    = $('#dropzone');
  const fileListEl  = $('#fileList');
  const filesCount  = $('#files-count');
  const turnstileEl = $('#turnstileBox');

  let current = 1;
  let maxVisited = 1;
  let files = [];            // { id, file, url }
  let uid = 0;
  let turnstileId = null;
  let turnstileToken = '';
  let sending = false;
  let finished = false;      // brief inviato: niente più bozze

  // ─── Storage (sempre in try/catch: può mancare o lanciare) ───────
  const storage = {
    get() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch { /* quota o privacy mode */ } },
    clear() { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } },
  };

  const announce = msg => {
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 60);
  };

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const formatDate = iso => {
    const d = new Date(`${iso}T00:00:00`);
    return isNaN(d) ? iso : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // ═════════════════════════════════════════════════════════════════
  //  Valori e condizioni
  // ═════════════════════════════════════════════════════════════════
  function values(name) {
    const out = [];
    $$(`[name="${name}"]`, form).forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) out.push(el.value); }
      else if (el.value.trim()) out.push(el.value.trim());
    });
    return out;
  }

  // "nome=valore": vero se il campo ha quel valore (o la checkbox è selezionata)
  function cond(expr) {
    if (!expr) return false;
    const [name, value] = expr.split('=');
    return values(name).includes(value);
  }

  const isShown = el => !el.closest('.reveal:not(.is-open)');

  function isRequired(el) {
    return el.required || cond(el.dataset.requiredWhen);
  }

  function updateConditions() {
    $$('.reveal[data-show-when]', form).forEach(r => {
      const open = cond(r.dataset.showWhen);
      const closing = !open && r.classList.contains('is-open');
      r.classList.toggle('is-open', open);
      r.inert = !open;
      r.setAttribute('aria-hidden', String(!open));
      if (closing) $$('[aria-invalid="true"], .has-error', r).forEach(clearError);
    });

    $$('input, select, textarea', form).forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'file' || el.name === 'website_url') return;
      const req = isRequired(el);
      el.setAttribute('aria-required', String(req));
      const field = el.closest('.field');
      // Le .field con un solo controllo mostrano l'asterisco se quel controllo è obbligatorio
      if (field && field.querySelector('input, select, textarea') === el) {
        field.classList.toggle('is-required', req);
      }
    });
    $$('fieldset[data-required]', form).forEach(fs => fs.classList.add('is-required'));
  }

  // ═════════════════════════════════════════════════════════════════
  //  Errori inline
  // ═════════════════════════════════════════════════════════════════
  let errUid = 0;
  function errorAnchor(target) {
    // target: controllo singolo o fieldset di gruppo
    if (target.tagName === 'FIELDSET') return $('.choices', target) || target.lastElementChild;
    if (target.id === 'f-files') return dropzone;
    return target.closest('.select-wrap') || target;
  }

  function setError(target, msg) {
    if (!target.id) target.id = `brief-auto-${++errUid}`;
    const errId = `${target.id}-err`;
    let err = document.getElementById(errId);
    if (!err) {
      err = document.createElement('p');
      err.className = 'field-error';
      err.id = errId;
      errorAnchor(target).insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
    const described = (target.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (!described.includes(errId)) described.push(errId);
    target.setAttribute('aria-describedby', described.join(' '));
    if (target.tagName === 'FIELDSET') target.classList.add('has-error');
    else target.setAttribute('aria-invalid', 'true');
  }

  function clearError(target) {
    const errId = `${target.id}-err`;
    const err = document.getElementById(errId);
    if (err) err.remove();
    const described = (target.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errId);
    if (described.length) target.setAttribute('aria-describedby', described.join(' '));
    else target.removeAttribute('aria-describedby');
    target.removeAttribute('aria-invalid');
    target.classList.remove('has-error');
  }

  const PATTERNS = {
    phone: [/^\+?[\d\s./()-]{6,20}$/, 'Inserisci un numero di telefono valido.'],
    cap:   [/^\d{5}$/, 'Il CAP è formato da 5 cifre.'],
    url:   [/^(https?:\/\/)?[^\s/$.?#]+\.[^\s]{2,}$/i, 'Inserisci un indirizzo valido, ad esempio www.esempio.it'],
  };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function checkControl(el) {
    if (!isShown(el)) return '';
    const v = el.value.trim();
    if (!v) {
      if (!isRequired(el)) return '';
      if (el.tagName === 'SELECT') return 'Seleziona un\'opzione.';
      if (el.closest('#addressGroup') && cond('extra=foto') && !el.required) {
        return 'Obbligatorio.'; // il perché è nel callout sopra l'indirizzo
      }
      return 'Questo campo è obbligatorio.';
    }
    if (el.type === 'email' && !EMAIL_RE.test(v)) return 'Inserisci un\'email valida, ad esempio nome@dominio.it';
    const p = el.dataset.pattern;
    if (p === 'future-date') return v < todayISO() ? 'Scegli una data da oggi in poi.' : '';
    if (p && PATTERNS[p] && !PATTERNS[p][0].test(v)) return PATTERNS[p][1];
    return '';
  }

  function checkGroup(fs) {
    if (!isShown(fs)) return '';
    const inputs = $$('input[type="checkbox"], input[type="radio"]', fs);
    if (inputs.some(i => i.checked)) return '';
    return inputs[0]?.type === 'radio' ? 'Seleziona un\'opzione.' : 'Seleziona almeno un\'opzione.';
  }

  function checkPrivacy(el) {
    return el.checked ? '' : 'Per inviare il brief devi accettare l\'informativa sulla privacy.';
  }

  function validateTarget(target) {
    let msg;
    if (target.tagName === 'FIELDSET') msg = checkGroup(target);
    else if (target.name === 'privacy') msg = checkPrivacy(target);
    else msg = checkControl(target);
    if (msg) setError(target, msg); else clearError(target);
    return !msg;
  }

  function targetsOf(step) {
    const t = [];
    $$('input, select, textarea', step).forEach(el => {
      if (el.type === 'radio' || el.type === 'file' || el.name === 'website_url') return;
      if (el.type === 'checkbox') { if (el.name === 'privacy') t.push(el); return; }
      t.push(el);
    });
    $$('fieldset[data-required]', step).forEach(fs => t.push(fs));
    return t;
  }

  function focusTarget(target) {
    const el = target.tagName === 'FIELDSET' ? $('input', target) : target;
    el.focus({ preventScroll: true });
    (target.closest('.field') || target).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Valida uno step: ritorna il primo elemento non valido (o null)
  function validateStep(n) {
    const step = steps[n - 1];
    let first = null;
    let count = 0;
    targetsOf(step).forEach(t => {
      if (!validateTarget(t)) { count++; if (!first) first = t; }
    });
    if (n === 4 && fileInput.getAttribute('aria-invalid') === 'true') {
      // errori di upload già mostrati: non bloccano (i file scartati non sono in lista)
      clearError(fileInput);
    }
    stepBtns[n - 1]?.classList.toggle('has-error', !!first);
    return { first, count };
  }

  // ═════════════════════════════════════════════════════════════════
  //  Navigazione
  // ═════════════════════════════════════════════════════════════════
  function showStep(n, { focus = true } = {}) {
    current = n;
    maxVisited = Math.max(maxVisited, n);
    steps.forEach(s => { s.hidden = +s.dataset.step !== n; });

    const title = steps[n - 1].dataset.title;
    progressFill.style.width = `${(n / TOTAL_STEPS) * 100}%`;
    progress.setAttribute('aria-valuenow', String(n));
    progress.setAttribute('aria-valuetext', `Step ${n} di ${TOTAL_STEPS}: ${title}`);
    counter.textContent = `Step ${n} di ${TOTAL_STEPS} · ${title}`;

    stepBtns.forEach((b, i) => {
      const s = i + 1;
      b.disabled = s > maxVisited;
      b.classList.toggle('is-visited', s <= maxVisited);
      if (s === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });

    prevBtn.hidden = n === 1;
    reviewBtn.hidden = !(maxVisited === TOTAL_STEPS && n < TOTAL_STEPS);
    nextBtn.textContent = n === TOTAL_STEPS ? 'Invia il brief' : n === TOTAL_STEPS - 1 ? 'Vai al riepilogo →' : 'Avanti →';

    if (n === TOTAL_STEPS) { buildReview(); renderTurnstile(); }
    if (n >= 5) renderEstimate();
    formError.hidden = true;

    if (focus) {
      const top = $('.brief-layout').getBoundingClientRect().top + window.scrollY - 70;
      if (window.scrollY > top || n !== 1) window.scrollTo({ top, behavior: 'smooth' });
      $('.step-title', steps[n - 1]).focus({ preventScroll: true });
    }
    saveDraft();
  }

  // Avanzare richiede gli step intermedi validi; tornare indietro è sempre libero
  function goTo(target) {
    if (target <= current) { showStep(target); return; }
    // Prima di arrivare al riepilogo ricontrolla tutto (es. indirizzo diventato obbligatorio)
    const from = target === TOTAL_STEPS ? 1 : current;
    for (let s = from; s < target; s++) {
      if (s > maxVisited) break;
      const { first, count } = validateStep(s);
      if (first) {
        if (s !== current) showStep(s, { focus: false });
        focusTarget(first);
        announce(s === 1 && cond('extra=foto') && first.closest?.('#addressGroup')
          ? 'Hai scelto il servizio fotografico sul posto: completa l\'indirizzo dell\'attività.'
          : `Controlla ${count === 1 ? 'il campo evidenziato' : `i ${count} campi evidenziati`}.`);
        return;
      }
    }
    showStep(Math.min(target, maxVisited + 1));
  }

  prevBtn.addEventListener('click', () => showStep(current - 1));
  reviewBtn.addEventListener('click', () => goTo(TOTAL_STEPS));
  stepBtns.forEach(b => b.addEventListener('click', () => goTo(+b.dataset.goto)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (current < TOTAL_STEPS) goTo(current + 1);
    else send();
  });

  // ═════════════════════════════════════════════════════════════════
  //  Ispirazioni (max 5)
  // ═════════════════════════════════════════════════════════════════
  function renumberInspo() {
    const rows = $$('.inspo-row', inspoList);
    rows.forEach((row, i) => {
      $('.inspo-n', row).textContent = i + 1;
      $('.inspo-remove', row).setAttribute('aria-label', `Rimuovi il sito ${i + 1}`);
    });
    addInspoBtn.hidden = rows.length >= MAX_INSPO;
  }

  function addInspo(url = '', nota = '', focus = false) {
    if ($$('.inspo-row', inspoList).length >= MAX_INSPO) return;
    const node = inspoTpl.content.firstElementChild.cloneNode(true);
    const id = ++uid;
    const [lblUrl, lblNota] = $$('label', node);
    const urlIn = $('[data-inspo="url"]', node);
    const notaIn = $('[data-inspo="nota"]', node);
    urlIn.id = `insp-url-${id}`; lblUrl.htmlFor = urlIn.id; urlIn.value = url;
    notaIn.id = `insp-nota-${id}`; lblNota.htmlFor = notaIn.id; notaIn.value = nota;
    $('.inspo-remove', node).addEventListener('click', () => {
      const rows = $$('.inspo-row', inspoList);
      const idx = rows.indexOf(node);
      node.remove();
      if (!$$('.inspo-row', inspoList).length) addInspo();
      renumberInspo();
      const next = $$('.inspo-row', inspoList)[Math.max(0, idx - 1)];
      $('[data-inspo="url"]', next)?.focus();
      saveDraft();
    });
    inspoList.appendChild(node);
    renumberInspo();
    if (focus) urlIn.focus();
  }

  addInspoBtn.addEventListener('click', () => addInspo('', '', true));

  // ═════════════════════════════════════════════════════════════════
  //  File: validazione, anteprime, rimozione
  // ═════════════════════════════════════════════════════════════════
  const extOf = name => (name.split('.').pop() || '').toLowerCase();
  const fmtSize = b => b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  function addFiles(list) {
    const rejected = [];
    for (const file of list) {
      const ext = extOf(file.name);
      const typeOk = ALLOWED_EXT.includes(ext) && (!file.type || ALLOWED_TYPES.includes(file.type));
      if (!typeOk) { rejected.push(`${file.name}: formato non supportato`); continue; }
      if (file.size > MAX_FILE_SIZE) { rejected.push(`${file.name}: supera 5 MB (${fmtSize(file.size)})`); continue; }
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) continue;
      if (files.length >= MAX_FILES) { rejected.push(`${file.name}: hai già raggiunto il massimo di ${MAX_FILES} file`); continue; }
      const isImage = ext !== 'pdf';
      files.push({ id: ++uid, file, url: isImage ? URL.createObjectURL(file) : '' });
    }
    renderFiles();
    if (rejected.length) {
      setError(fileInput, `Non ho potuto aggiungere: ${rejected.join('; ')}.`);
    } else {
      clearError(fileInput);
    }
    saveDraft();
  }

  function removeFile(id) {
    const idx = files.findIndex(f => f.id === id);
    if (idx < 0) return;
    if (files[idx].url) URL.revokeObjectURL(files[idx].url);
    const name = files[idx].file.name;
    files.splice(idx, 1);
    renderFiles();
    clearError(fileInput);
    const btns = $$('.icon-btn', fileListEl);
    (btns[Math.min(idx, btns.length - 1)] || fileInput).focus();
    announce(`${name} rimosso.`);
    saveDraft();
  }

  function renderFiles() {
    fileListEl.textContent = '';
    files.forEach(f => {
      const li = document.createElement('li');
      li.className = 'file-item';
      const thumb = document.createElement('div');
      thumb.className = 'file-thumb';
      if (f.url) {
        const img = document.createElement('img');
        img.src = f.url;
        img.alt = '';
        if (extOf(f.file.name) === 'svg') img.className = 'is-contain';
        thumb.appendChild(img);
      } else {
        thumb.textContent = 'PDF';
      }
      const name = document.createElement('span');
      name.className = 'file-name';
      name.textContent = f.file.name;
      name.title = `${f.file.name} · ${fmtSize(f.file.size)}`;
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'icon-btn';
      rm.setAttribute('aria-label', `Rimuovi ${f.file.name}`);
      rm.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      rm.addEventListener('click', () => removeFile(f.id));
      li.append(thumb, name, rm);
      fileListEl.appendChild(li);
    });
    filesCount.textContent = `${files.length} di ${MAX_FILES} file`;
    fileInput.disabled = files.length >= MAX_FILES;
  }

  fileInput.addEventListener('change', () => {
    addFiles(fileInput.files);
    fileInput.value = '';
  });
  ['dragenter', 'dragover'].forEach(ev => dropzone.addEventListener(ev, e => {
    e.preventDefault();
    dropzone.classList.add('is-over');
  }));
  ['dragleave', 'drop'].forEach(ev => dropzone.addEventListener(ev, e => {
    e.preventDefault();
    if (ev === 'dragleave' && dropzone.contains(e.relatedTarget)) return;
    dropzone.classList.remove('is-over');
  }));
  dropzone.addEventListener('drop', e => { if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); });
  // Evita che un file lasciato fuori dalla dropzone venga aperto dal browser
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => e.preventDefault());

  // ═════════════════════════════════════════════════════════════════
  //  Raccolta dati, bozza, ripristino
  // ═════════════════════════════════════════════════════════════════
  // Campi da non salvare né inviare come dati: honeypot, file e il token
  // che Turnstile inserisce nel form
  const skipName = name => !name || name === 'website_url' || name.startsWith('cf-');

  function collect() {
    const data = {};
    for (const el of form.elements) {
      if (skipName(el.name) || el.type === 'file') continue;
      if (el.type === 'checkbox') {
        if (el.name === 'privacy') { data.privacy = el.checked; continue; }
        (data[el.name] ||= []);
        if (el.checked) data[el.name].push(el.value);
      } else if (el.type === 'radio') {
        if (!(el.name in data)) data[el.name] = '';
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    }
    data.ispirazioni = $$('.inspo-row', inspoList).map(row => ({
      url: $('[data-inspo="url"]', row).value,
      nota: $('[data-inspo="nota"]', row).value,
    }));
    return data;
  }

  function restore(data) {
    for (const el of form.elements) {
      if (skipName(el.name) || !(el.name in data) || el.type === 'file') continue;
      const v = data[el.name];
      if (el.type === 'checkbox') el.checked = el.name === 'privacy' ? !!v : Array.isArray(v) && v.includes(el.value);
      else if (el.type === 'radio') el.checked = v === el.value;
      else if (typeof v === 'string') el.value = v;
    }
    inspoList.textContent = '';
    (Array.isArray(data.ispirazioni) ? data.ispirazioni : []).slice(0, MAX_INSPO)
      .forEach(i => addInspo(i?.url || '', i?.nota || ''));
    if (!$$('.inspo-row', inspoList).length) addInspo();
  }

  let saveTimer = null;
  function saveDraft() {
    if (sending || finished) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      storage.set({
        v: 1,
        savedAt: Date.now(),
        step: current,
        maxVisited,
        data: collect(),
        fileNames: files.map(f => f.file.name),
      });
    }, 300);
  }

  function hasContent(data) {
    return Object.entries(data).some(([k, v]) =>
      k === 'ispirazioni' ? v.some(i => i.url || i.nota) :
      Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : !!v);
  }

  function loadDraft() {
    const draft = storage.get();
    if (!draft || draft.v !== 1 || !draft.data) return false;
    restore(draft.data);
    if (!hasContent(draft.data)) return false;
    maxVisited = Math.min(Math.max(1, +draft.maxVisited || 1), TOTAL_STEPS);
    current = Math.min(Math.max(1, +draft.step || 1), maxVisited);
    $('#draftNotice').hidden = false;
    if (Array.isArray(draft.fileNames) && draft.fileNames.length) {
      const p = $('#draftFiles');
      p.hidden = false;
      p.textContent = `Avevi caricato ${draft.fileNames.join(', ')}. Il browser non conserva i file: ricaricali allo step 4.`;
    }
    return true;
  }

  $('#resetDraft').addEventListener('click', () => {
    if (!window.confirm('Vuoi cancellare tutte le risposte e ricominciare?')) return;
    storage.clear();
    form.reset();
    $$('[aria-invalid="true"], .has-error', form).forEach(clearError);
    stepBtns.forEach(b => b.classList.remove('has-error'));
    files.forEach(f => f.url && URL.revokeObjectURL(f.url));
    files = [];
    renderFiles();
    inspoList.textContent = '';
    addInspo();
    $('#draftNotice').hidden = true;
    maxVisited = 1;
    updateConditions();
    updateBundle();
    showStep(1);
    announce('Bozza cancellata.');
  });

  // ═════════════════════════════════════════════════════════════════
  //  Riepilogo
  // ═════════════════════════════════════════════════════════════════
  function choiceText(input) {
    const body = input.nextElementSibling;
    if (!body) return input.value;
    const strong = body.querySelector('strong');
    return (strong || body).textContent.trim();
  }

  function fieldValue(field) {
    const choices = [];
    const texts = [];
    $$('input, select, textarea', field).forEach(el => {
      if (el.closest('.field[data-label]') !== field || !isShown(el)) return;
      if (el.type === 'file' || el.name === 'website_url') return;
      if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) choices.push(choiceText(el)); return; }
      const v = el.value.trim();
      if (!v) return;
      if (el.tagName === 'SELECT') choices.push(el.selectedOptions[0].textContent.trim());
      else if (el.type === 'date') texts.push(formatDate(v));
      else texts.push(v);
    });
    return [choices.join(', '), ...texts].filter(Boolean).join(' · ');
  }

  function fieldIsRequired(field) {
    if (field.matches('fieldset[data-required]')) return true;
    return $$('input, select, textarea', field).some(el =>
      el.closest('.field[data-label]') === field && isShown(el) &&
      el.type !== 'checkbox' && el.type !== 'radio' && isRequired(el));
  }

  function buildReview() {
    reviewEl.textContent = '';
    steps.slice(0, TOTAL_STEPS - 1).forEach(step => {
      const n = +step.dataset.step;
      const block = document.createElement('section');
      block.className = 'review-block';
      const head = document.createElement('div');
      head.className = 'review-head';
      const h = document.createElement('h3');
      h.textContent = `${String(n).padStart(2, '0')} · ${step.dataset.title}`;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'review-edit';
      edit.textContent = 'Modifica';
      edit.setAttribute('aria-label', `Modifica: ${step.dataset.title}`);
      edit.addEventListener('click', () => showStep(n));
      head.append(h, edit);

      const dl = document.createElement('dl');
      $$('.field[data-label]', step).forEach(field => {
        if (!isShown(field)) return;
        let value = '';
        let node = null;

        if (field.id === 'inspoField') {
          value = $$('.inspo-row', inspoList)
            .map(r => [$('[data-inspo="url"]', r).value.trim(), $('[data-inspo="nota"]', r).value.trim()])
            .filter(([u]) => u)
            .map(([u, n]) => n ? `${u} — ${n}` : u)
            .join('\n');
        } else if (field.id === 'filesField') {
          if (files.length) {
            node = document.createElement('div');
            node.className = 'review-thumbs';
            files.forEach(f => {
              let t;
              if (f.url) { t = document.createElement('img'); t.src = f.url; t.alt = f.file.name; }
              else { t = document.createElement('span'); t.textContent = 'PDF'; t.title = f.file.name; }
              node.appendChild(t);
            });
            value = 'x';
          }
        } else {
          value = fieldValue(field);
        }

        const required = fieldIsRequired(field);
        if (!value && !required) return;

        const dt = document.createElement('dt');
        dt.textContent = field.dataset.label;
        const dd = document.createElement('dd');
        if (node) dd.appendChild(node);
        else if (value) dd.textContent = value;
        else { dd.textContent = 'Mancante'; dd.className = 'is-missing'; }
        dl.append(dt, dd);
      });

      if (!dl.children.length) {
        const dt = document.createElement('dt');
        dt.textContent = 'Nessuna risposta';
        dl.appendChild(dt);
      }
      block.append(head, dl);
      reviewEl.appendChild(block);
    });
  }

  // ═════════════════════════════════════════════════════════════════
  //  Turnstile (render esplicito quando si arriva al riepilogo)
  // ═════════════════════════════════════════════════════════════════
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');

  function turnstileTheme() {
    const t = document.documentElement.dataset.theme;
    return t === 'light' || t === 'dark' ? t : 'auto';
  }

  let turnstileLoading = null;
  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileLoading) return turnstileLoading;
    turnstileLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { turnstileLoading = null; reject(new Error('turnstile')); };
      document.head.appendChild(s);
    });
    return turnstileLoading;
  }

  function renderTurnstile() {
    if (turnstileId !== null) return;
    const sitekey = isLocal ? TURNSTILE_TEST_KEY : turnstileEl.dataset.sitekey;
    loadTurnstile().then(() => {
      if (turnstileId !== null) return;
      turnstileId = window.turnstile.render(turnstileEl, {
        sitekey,
        theme: turnstileTheme(),
        language: 'it',
        callback: token => { turnstileToken = token; formError.hidden = true; },
        'expired-callback': () => { turnstileToken = ''; },
        'error-callback': () => { turnstileToken = ''; },
      });
    }).catch(() => {
      showFormError('Non riesco a caricare la verifica anti-spam. Disattiva eventuali blocchi della pubblicità o ricarica la pagina.');
    });
  }

  function resetTurnstile() {
    turnstileToken = '';
    if (window.turnstile && turnstileId !== null) window.turnstile.reset(turnstileId);
  }

  // ═════════════════════════════════════════════════════════════════
  //  Invio
  // ═════════════════════════════════════════════════════════════════
  function showFormError(msg) {
    formError.textContent = msg;
    formError.hidden = false;
  }

  function payload() {
    const data = collect();
    for (const k of Object.keys(data)) if (typeof data[k] === 'string') data[k] = data[k].trim();
    data.ispirazioni = data.ispirazioni
      .map(i => ({ url: i.url.trim(), nota: i.nota.trim() }))
      .filter(i => i.url);
    return data;
  }

  function fieldTargetByName(name) {
    const els = $$(`[name="${name}"]`, form);
    if (!els.length) return null;
    if (els[0].type === 'radio' || (els[0].type === 'checkbox' && name !== 'privacy')) return els[0].closest('fieldset');
    return els[0];
  }

  function showServerErrors(fields) {
    let firstStep = null;
    let firstTarget = null;
    Object.entries(fields).forEach(([name, msg]) => {
      const t = name === 'files' ? fileInput : fieldTargetByName(name);
      if (!t) return;
      setError(t, msg);
      const n = +t.closest('.step').dataset.step;
      stepBtns[n - 1]?.classList.add('has-error');
      if (firstStep === null || n < firstStep) { firstStep = n; firstTarget = t; }
    });
    if (firstStep !== null) {
      if (firstStep !== current) showStep(firstStep, { focus: false });
      focusTarget(firstTarget);
      announce('Alcuni campi vanno corretti.');
      return true;
    }
    return false;
  }

  async function send() {
    if (sending) return;
    formError.hidden = true;

    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const { first } = validateStep(s);
      if (first) {
        if (s !== current) showStep(s, { focus: false });
        focusTarget(first);
        announce('Alcuni campi vanno completati prima dell\'invio.');
        return;
      }
    }
    if (!turnstileToken) {
      showFormError('Completa la verifica anti-spam qui sopra, poi premi di nuovo “Invia il brief”.');
      renderTurnstile();
      return;
    }

    const fd = new FormData();
    const data = payload();
    fd.append('data', JSON.stringify(data));
    files.forEach(f => fd.append('files', f.file, f.file.name));
    fd.append('cf-turnstile-response', turnstileToken);
    fd.append('website_url', $('#f-website-url').value);

    sending = true;
    nextBtn.classList.add('is-loading');
    nextBtn.textContent = 'Invio in corso';
    prevBtn.disabled = true;

    try {
      const res = await fetch('/api/brief', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) { done(data); return; }

      resetTurnstile();
      if (json?.fields && showServerErrors(json.fields)) return;
      showFormError(json?.error || `Qualcosa è andato storto (errore ${res.status}). Riprova tra poco: le tue risposte sono ancora qui.`);
    } catch {
      resetTurnstile();
      showFormError('Connessione non riuscita. Controlla la rete e riprova: le tue risposte sono ancora qui.');
    } finally {
      sending = false;
      nextBtn.classList.remove('is-loading');
      if (!$('#briefDone').hidden) return;
      nextBtn.textContent = current === TOTAL_STEPS ? 'Invia il brief' : 'Avanti →';
      prevBtn.disabled = false;
    }
  }

  function done(data) {
    finished = true;
    clearTimeout(saveTimer);
    storage.clear();
    files.forEach(f => f.url && URL.revokeObjectURL(f.url));
    const first = (data.nome || '').split(/\s+/)[0];
    form.hidden = true;
    $('#draftNotice').hidden = true;
    counter.hidden = true;
    $('.brief-aside').style.visibility = 'hidden';
    progressFill.style.width = '100%';
    progress.setAttribute('aria-valuetext', 'Brief inviato');
    const box = $('#briefDone');
    if (first) $('#done-title').textContent = `Grazie ${first}, ho ricevuto tutto.`;
    $('#doneText').textContent = `Leggo il brief di ${data.attivita} con calma e ti ricontatto nei prossimi giorni. Intanto ti ho mandato un'email di conferma a ${data.email}.`;
    box.hidden = false;
    window.scrollTo({ top: $('.brief-layout').offsetTop - 70, behavior: 'smooth' });
    box.focus({ preventScroll: true });
  }

  // ═════════════════════════════════════════════════════════════════
  //  Prezzi: cartellini, pacchetto, stima indicativa
  // ═════════════════════════════════════════════════════════════════
  const make = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Listino barrato + prezzo di lancio (con testo per gli screen reader)
  function priceNode(min, max, { cls = 'price' } = {}) {
    const p = make('span', cls);
    const s = make('s');
    s.append(make('span', 'sr-only', 'Listino '), range(listino(min), listino(max)));
    const b = make('b');
    b.append(make('span', 'sr-only', ', prezzo di lancio '), range(min, max));
    p.append(s, ' ', b);
    return p;
  }

  const serviceInputs = $$('.service input[name="extra"]', form);
  const serviceName = id => {
    const input = serviceInputs.find(i => i.value === id);
    return input ? choiceText(input) : id;
  };

  function renderServicePrices() {
    serviceInputs.forEach(input => {
      const s = SERVICES[input.value];
      const body = input.nextElementSibling;
      if (!s || !body || $('.service-price', body)) return;
      const wrap = make('span', 'service-price');
      if (s.onDemand) {
        const p = make('span', 'price');
        p.append(make('b', '', `${RATE.hour} €/h`));
        wrap.append(p);
      } else {
        wrap.append(priceNode(s.min, s.max));
      }
      wrap.append(make('span', 'service-unit', s.unit));
      body.appendChild(wrap);
    });
  }

  // ─── Pacchetto ───────────────────────────────────────────────────
  const bundle = BUNDLES[0];
  const bundleBtn = $('#bundleBtn');
  const bundleCard = $('#bundleCard');
  const bundleSeparate = () => bundle.items.reduce((t, id) => [t[0] + SERVICES[id].min, t[1] + SERVICES[id].max], [0, 0]);

  function setupBundle() {
    if (!bundle || !bundleCard) return;
    $('#bundlePrice').append(priceNode(bundle.min, bundle.max));
    bundleBtn.addEventListener('click', () => {
      const on = bundleBtn.getAttribute('aria-pressed') !== 'true';
      bundle.items.forEach(id => {
        const input = serviceInputs.find(i => i.value === id);
        if (input && input.checked !== on) {
          input.checked = on;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      announce(on ? 'Pacchetto aggiunto: logo, biglietti da visita e firma email.' : 'Pacchetto rimosso.');
    });
  }

  function updateBundle() {
    if (!bundle || !bundleCard) return;
    const extra = values('extra');
    const all = bundle.items.every(id => extra.includes(id));
    const blocked = all && extra.includes('brand');
    bundleBtn.setAttribute('aria-pressed', String(all));
    bundleBtn.textContent = all ? 'Pacchetto aggiunto ✓' : 'Aggiungi il pacchetto';
    bundleCard.classList.toggle('is-active', all && !blocked);
    const sep = bundleSeparate();
    $('#bundleNote').textContent = blocked
      ? 'Hai scelto anche la brand identity, che comprende già il logo: conto quella più biglietti e firma.'
      : `Presi separatamente costerebbero ${range(sep[0], sep[1])}.`;
  }

  // ─── Stima indicativa ────────────────────────────────────────────
  const costRange = (min, max) => (max === null ? (min ? `da ${euro(min)}` : 'da valutare') : max === 0 ? 'gratis' : range(min, max));

  function estRow(label, note, priceEl, cls = '') {
    const row = make('div', `est-row ${cls}`.trim());
    const left = make('span', 'est-label');
    left.append(make('span', '', label));
    if (note) left.append(make('small', '', note));
    row.append(left, priceEl);
    return row;
  }

  function costList(title, list, total, per) {
    const box = make('div', 'est-cost');
    box.append(make('h4', '', title));
    const ul = make('ul');
    list.forEach(c => {
      const li = make('li');
      const left = make('span');
      left.append(make('span', '', c.label));
      if (c.note) left.append(make('small', '', c.note));
      li.append(left, make('span', 'est-cost-val', costRange(c.min, c.max)));
      ul.appendChild(li);
    });
    box.append(ul, make('p', 'est-cost-total', `Totale: ${costRange(total.min, total.max)}${per}`));
    return box;
  }

  function buildEstimate() {
    const data = collect();
    const est = estimate(data);
    const frag = document.createDocumentFragment();
    const rows = make('div', 'est-rows');

    const sez = (data.sezioni || []).length;
    const siteNote = est.site.notes.length
      ? est.site.notes.join(' · ')
      : `${sez || 'nessuna'} ${sez === 1 ? 'sezione' : 'sezioni'}, fino a ${SITE.sections} comprese`;
    rows.append(estRow('Sito vetrina', siteNote, priceNode(est.site.min, est.site.max)));

    est.items.forEach(i => {
      if (i.bundle) {
        rows.append(estRow(i.label, `${i.items.map(serviceName).join(' + ')} · invece di ${range(i.separate[0], i.separate[1])}`, priceNode(i.min, i.max), 'is-bundle'));
        return;
      }
      const note = [SERVICES[i.id].unit, i.qty > 1 ? `× ${i.qty}` : ''].filter(Boolean).join(' ');
      rows.append(estRow(serviceName(i.id), note, priceNode(i.min, i.max)));
    });
    est.included.forEach(id => rows.append(estRow(serviceName(id), 'compreso nella brand identity', make('span', 'price', 'incluso'), 'is-muted')));
    if (!est.items.length && !est.included.length) rows.append(make('p', 'est-empty', 'Nessun servizio extra selezionato.'));

    const tbd = est.site.tbd.length ? `più ${est.site.tbd.join(' e ')}, da valutare a parte` : '';
    rows.append(estRow('Totale indicativo', tbd, priceNode(est.total.min, est.total.max, { cls: 'price price-lg' }), 'est-total'));
    frag.appendChild(rows);

    if (est.onDemand.length) {
      frag.appendChild(make('p', 'est-note', `${est.onDemand.map(serviceName).join(', ')}: a richiesta, ${RATE.hour} €/h solo quando ti serve.`));
    }

    const c = est.costs;
    const costs = make('div', 'est-costs');
    costs.append(costList('Ogni anno', c.yearly, c.yearlyTotal, ' all\'anno'));
    if (c.once.length) costs.append(costList('Una tantum', c.once, c.onceTotal, ''));
    const wrap = make('div', 'est-costs-wrap');
    wrap.append(
      make('h4', 'est-costs-title', 'Costi vivi a carico tuo'),
      make('p', 'est-costs-lead', 'Li paghi direttamente ai fornitori e non fanno parte del mio compenso. Sono stime.'),
      costs,
    );
    frag.appendChild(wrap);

    frag.appendChild(make('p', 'est-foot', `È una stima per orientarti, con i prezzi di lancio. Dopo aver letto il brief ti mando un preventivo definitivo. Acconto del ${Math.round(DEPOSIT * 100)}% alla conferma, saldo alla consegna.`));
    return frag;
  }

  // Raggruppa più modifiche ravvicinate in un solo aggiornamento
  let estimateTimer = 0;
  function renderEstimate() {
    clearTimeout(estimateTimer);
    estimateTimer = setTimeout(() => {
      updateBundle();
      $$('[data-estimate] .estimate-body', form).forEach(body => {
        if (body.closest('.step').hidden) return;
        body.textContent = '';
        body.appendChild(buildEstimate());
      });
    });
  }

  // ═════════════════════════════════════════════════════════════════
  //  Eventi dei campi
  // ═════════════════════════════════════════════════════════════════
  form.addEventListener('change', e => {
    const el = e.target;
    const before = cond('extra=foto');
    updateConditions();
    if (el.name === 'extra' && el.value === 'foto') {
      announce(cond('extra=foto')
        ? 'Servizio fotografico selezionato: allo step 1 l\'indirizzo completo ora è obbligatorio.'
        : 'Servizio fotografico rimosso: l\'indirizzo completo non è più obbligatorio.');
      if (before && !cond('extra=foto')) $$('#addressGroup [aria-invalid="true"]').forEach(clearError);
    }
    renderEstimate();
    if (el.type === 'radio' || el.type === 'checkbox') {
      const fs = el.closest('fieldset[data-required]');
      if (fs && fs.classList.contains('has-error')) validateTarget(fs);
      if (el.name === 'privacy' && el.getAttribute('aria-invalid')) validateTarget(el);
    } else if (el.type !== 'file' && el.getAttribute('aria-invalid')) {
      validateTarget(el);
    }
    saveDraft();
  });

  form.addEventListener('input', e => {
    const el = e.target;
    if (el.getAttribute('aria-invalid') === 'true' && el.type !== 'file') validateTarget(el);
    if (el.tagName === 'SELECT') updateConditions();
    if (['stampati_cosa', 'traduzioni_lingue'].includes(el.name)) renderEstimate();
    saveDraft();
  });

  // Validazione al blur, solo se il campo è stato toccato
  form.addEventListener('focusout', e => {
    const el = e.target;
    if (!el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), select, textarea')) return;
    if (el.name === 'website_url') return;
    if (el.value.trim() || el.dataset.touched) validateTarget(el);
    el.dataset.touched = '1';
  });

  // Modifiche alle reference ricostruiscono il riepilogo se visibile
  new MutationObserver(() => { if (current === TOTAL_STEPS) buildReview(); })
    .observe(fileListEl, { childList: true });

  // Il tema di Turnstile segue quello del sito
  new MutationObserver(() => {
    if (turnstileId !== null && window.turnstile) {
      window.turnstile.remove(turnstileId);
      turnstileId = null;
      turnstileToken = '';
      if (current === TOTAL_STEPS) renderTurnstile();
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ═════════════════════════════════════════════════════════════════
  //  Init
  // ═════════════════════════════════════════════════════════════════
  $('#f-scadenza').min = todayISO();
  const restored = loadDraft();
  if (!restored) { inspoList.textContent = ''; addInspo(); }
  renderFiles();
  renderServicePrices();
  setupBundle();
  updateBundle();
  // Le reveal partono già nello stato giusto, senza animazione
  form.classList.add('no-anim');
  updateConditions();
  showStep(current, { focus: false });
  requestAnimationFrame(() => requestAnimationFrame(() => form.classList.remove('no-anim')));

  document.addEventListener('DOMContentLoaded', () => {
    // script.js imposta la lingua del resto del sito: questa pagina è solo in italiano
    document.documentElement.lang = 'it';
  });
})();
