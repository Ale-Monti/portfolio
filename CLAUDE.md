# Portfolio di Alessandro Monticelli

Contesto per Claude Code. Le conversazioni restano sul computer dove avvengono e non si condividono tra il Mac dell'ufficio e il MacBook Pro di casa. Qui va tutto quello che non si capisce leggendo il codice.

## Prima di iniziare
- Fai `git pull`: si lavora da due computer.
- Se Alessandro ha cambiato qualcosa nelle dashboard (Cloudflare, Resend, Turnstile), chiediglielo o verifica da fuori con `curl`. Le impostazioni delle dashboard non sono nel codice.
- Parla in italiano, con spiegazioni semplici: Alessandro è un designer, non uno sviluppatore.

## Online
- **Sito:** https://amonticelli.work (anche `www.`). Hosting su Cloudflare Pages, progetto `portfolio`, indirizzo di default `portfolio-be6.pages.dev`.
- **Deploy:** automatico da `main` su GitHub (`Ale-Monti/portfolio`). Ogni altro branch ottiene un'anteprima su `<branch>.portfolio-be6.pages.dev`.
- **Esito del deploy:** `gh api repos/Ale-Monti/portfolio/commits/<sha>/check-runs` (check "Cloudflare Pages").
- Nessuna build: HTML, CSS e JS puri, serviti dalla radice del repository.

## Struttura
- `index.html`, `about.html`, `style.css`, `script.js`: il portfolio. Nei link CSS e JS usa `?v=` per evitare la cache: aumentalo quando cambi quei file.
- `brief.html`, `brief.css`, `brief.js`, `pricing.js`: il modulo `/brief` per i nuovi clienti. Non è linkato da nessuna parte e ha `noindex`. Si manda a mano ai clienti: https://amonticelli.work/brief
- `functions/api/brief.js`, `functions/api/file/[[path]].js`: Pages Functions del modulo (R2, Turnstile, email Resend).
- `pricing.js`: unica fonte dei prezzi (prezzi di lancio, listino ×1,5, 30 €/h, 25 €/h da 4 ore, acconto 40%, costi vivi). La usano sia il modulo sia la Function.
- `privacy.html`: informativa del modulo. `_headers`: `noindex` per brief e privacy.
- `README_BRIEF.md`: guida completa alla configurazione del modulo.

## Configurazione su Cloudflare (già fatta, verificata l'11/11/2026)
- Binding R2 `BRIEF_UPLOADS`, secret `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `BRIEF_FILE_SECRET`, variabili `BRIEF_TO_EMAIL`, `BRIEF_FROM_EMAIL`. `SITE_URL` dovrebbe essere `https://amonticelli.work` (da confermare).
- Controllo rapido: `curl -F data='{}' https://amonticelli.work/api/brief` deve rispondere 403 (anti-spam). Un 500 vuol dire che manca una variabile.
- La site key di Turnstile è in `brief.html`. Il widget deve avere tra i domini `amonticelli.work`.

## Strumenti su questo Mac (ufficio)
- Non ci sono Node.js né Homebrew. GitHub CLI è in `~/.local/bin/gh`, già autenticato come `Ale-Monti`: i push funzionano.
- Per provare il sito in locale: `python3 -m http.server 8765` e il browser integrato. Le Functions si provano importandole nella pagina con `fetch`, R2 e Resend simulati.

## Regole
- Non modificare le pagine del portfolio quando il lavoro riguarda solo il modulo `/brief`, e viceversa, salvo richiesta esplicita.
- I commit si fanno su un branch e si portano su `main` con una pull request, a meno che Alessandro chieda di pubblicare subito.
