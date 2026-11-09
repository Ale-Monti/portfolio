# Modulo /brief: configurazione

La pagina `/brief` raccoglie le richieste dei nuovi clienti. Ogni invio:

1. viene verificato con Cloudflare Turnstile e con un campo honeypot;
2. salva su R2 i file, `brief.md` e `brief.json` in una cartella `AAAA-MM-GG-slug-attivita/`;
3. ti manda un'email a bento box con `brief.md` allegato;
4. manda al cliente una breve email di conferma.

La pagina non è linkata da nessuna parte del sito e ha `noindex, nofollow`, sia nel meta tag che nell'header `X-Robots-Tag` (file `_headers`). Anche `/privacy` ha `noindex`.

## File

| File | Cosa fa |
|---|---|
| `brief.html`, `brief.css`, `brief.js` | Il modulo a step |
| `privacy.html` | Informativa privacy (**da completare**: sostituisci tutti i `[SEGNAPOSTO]`) |
| `functions/api/brief.js` | `POST /api/brief`: validazione, R2, email |
| `functions/api/file/[[path]].js` | `GET /api/file/...?sig=...`: serve i file del bucket privato solo con link firmato |
| `_headers` | `X-Robots-Tag: noindex` per le pagine statiche |
| `.dev.vars.example` | Modello delle variabili per i test in locale |

## Cosa ti serve configurare

| Nome | Tipo | Valore |
|---|---|---|
| `BRIEF_UPLOADS` | Binding R2 | il bucket `brief-uploads` |
| `RESEND_API_KEY` | Secret | API key di Resend |
| `TURNSTILE_SECRET_KEY` | Secret | Secret key del widget Turnstile |
| `BRIEF_FILE_SECRET` | Secret | Stringa casuale lunga, firma i link ai file |
| `BRIEF_TO_EMAIL` | Variabile | Dove ricevi i brief (anche più indirizzi separati da virgola) |
| `BRIEF_FROM_EMAIL` | Variabile | Mittente, es. `Alessandro Monticelli <brief@tuodominio.it>` |
| `SITE_URL` | Variabile (facoltativa) | es. `https://tuodominio.it`. Se manca, i link usano il dominio da cui arriva la richiesta |

Più la **site key** di Turnstile dentro `brief.html`.

---

## 1. Crea il bucket R2

1. Dashboard Cloudflare → **R2 Object Storage**. Se è la prima volta, attiva R2 (c'è un piano gratuito, ma chiede un metodo di pagamento).
2. **Create bucket** → nome `brief-uploads` → Location: *Automatic* (oppure il suggerimento *Western Europe*) → **Create bucket**.
3. Lascia il bucket **privato**: non attivare né l'accesso pubblico né `r2.dev`. I file si aprono dai link firmati nell'email.
4. *(Consigliato)* Nel bucket → **Settings** → **Object lifecycle rules** → **Add rule**: elimina gli oggetti dopo 365 giorni. Deve corrispondere al periodo di conservazione scritto nella privacy.

## 2. Collega il bucket al progetto Pages

1. Dashboard → **Workers & Pages** → il progetto del portfolio → **Settings** → **Bindings** → **Add** → **R2 bucket**.
2. Variable name: `BRIEF_UPLOADS` · R2 bucket: `brief-uploads` → **Save**.
3. Ripeti per l'ambiente **Preview**, se usi i deploy di anteprima. In alto nella pagina Settings puoi scegliere tra Production e Preview.

## 3. Account Resend e verifica del dominio

1. Registrati su [resend.com](https://resend.com).
2. **Domains** → **Add Domain**. Ti conviene un sottodominio dedicato, ad esempio `mail.tuodominio.it`, così non tocchi la posta del dominio principale. Region: *Ireland (eu-west-1)*.
3. Resend ti mostra alcuni record DNS: MX e TXT per lo SPF, TXT per il DKIM, e facoltativamente il DMARC.
   - Se il dominio è su Cloudflare, puoi usare **Auto configure** oppure aggiungerli a mano da Dashboard → il tuo dominio → **DNS** → **Records**.
   - I record vanno lasciati in **DNS only** (nuvola grigia), non in Proxied.
4. Torna su Resend → **Verify DNS Records**. Di solito bastano pochi minuti, a volte qualche ora.
5. **API Keys** → **Create API Key** → permesso *Sending access*, limitato al dominio appena verificato → copia la chiave (`re_...`). Viene mostrata una volta sola.
6. Il mittente `BRIEF_FROM_EMAIL` deve usare il dominio verificato, ad esempio `Alessandro Monticelli <brief@mail.tuodominio.it>`.

> Per un test veloce prima della verifica puoi usare `onboarding@resend.dev` come mittente, ma Resend consegna solo all'email del tuo account. La conferma al cliente quindi non arriva, e il modulo la salta senza bloccare l'invio.

## 4. Chiavi Turnstile

1. Dashboard Cloudflare → **Turnstile** → **Add widget**.
2. Nome: `Brief portfolio`. Hostnames: il tuo dominio (es. `tuodominio.it`) **e** il dominio `*.pages.dev` del progetto, es. `portfolio-xyz.pages.dev`. Widget mode: **Managed** → **Create**.
3. Copia la **Site Key** in `brief.html`, al posto di `INSERISCI_LA_SITE_KEY_TURNSTILE`:
   ```html
   <div class="turnstile-wrap" id="turnstileBox" data-sitekey="0x4AAAAAAA..."></div>
   ```
   La site key è pubblica, può stare nel codice.
4. La **Secret Key** va nel secret `TURNSTILE_SECRET_KEY` (passo 5).

Su `localhost`, `brief.js` usa in automatico la chiave di test di Cloudflare, quindi in locale non serve la site key vera.

## 5. Variabili e secret

1. Genera la stringa per `BRIEF_FILE_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
2. Dashboard → **Workers & Pages** → progetto → **Settings** → **Variables and Secrets** → **Add**:
   - `RESEND_API_KEY`, tipo **Secret**
   - `TURNSTILE_SECRET_KEY`, tipo **Secret**
   - `BRIEF_FILE_SECRET`, tipo **Secret**
   - `BRIEF_TO_EMAIL`, tipo **Text**
   - `BRIEF_FROM_EMAIL`, tipo **Text**
   - `SITE_URL`, tipo **Text** (facoltativa)
3. Fai le stesse impostazioni per **Preview**, se lo usi.
4. Binding e variabili si applicano **al deploy successivo**: fai un nuovo push, oppure **Deployments** → ultimo deploy → **Retry deployment**.

In alternativa, da terminale:
```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=NOME_PROGETTO
```

> Se cambi `BRIEF_FILE_SECRET`, tutti i link ai file nelle email già ricevute smettono di funzionare. I file però restano su R2 e li trovi dalla dashboard.

## 6. Test in locale con wrangler

Serve Node.js 18 o superiore ([nodejs.org](https://nodejs.org)).

1. Crea le variabili locali partendo dal modello:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   Poi compila `.dev.vars` con la tua API key Resend e la tua email. `.dev.vars` è in `.gitignore`. Il secret Turnstile nel modello è quello **di test**, che accetta sempre.
2. Avvia il sito con le Functions e un R2 simulato in locale:
   ```bash
   npx wrangler pages dev . --r2=BRIEF_UPLOADS --compatibility-date=2024-09-23
   ```
3. Apri `http://localhost:8788/brief`, compila e invia.
4. Controlla:
   - che arrivino l'email con il riepilogo e `brief.md` allegato, e la conferma al cliente;
   - che i link alle reference nell'email si aprano. In locale funzionano solo mentre `wrangler pages dev` è attivo;
   - i file salvati nel bucket simulato, dentro `.wrangler/state/` (anche questa cartella è in `.gitignore`).
5. Casi da provare:
   - Seleziona **Servizio fotografico sul posto** allo step 5, poi vai al riepilogo: il modulo ti riporta allo step 1 con l'indirizzo obbligatorio.
   - Ricarica la pagina a metà compilazione: la bozza viene ripristinata. I file vanno ricaricati, e il modulo lo segnala.
   - Prova a caricare un file `.gif` o più grande di 5 MB: viene rifiutato con un messaggio.

### Test del deploy

Dopo il push, apri `https://tuodominio.it/brief` e invia un brief di prova con la tua email come cliente.
Se qualcosa non va: **Workers & Pages** → progetto → **Deployments** → ultimo deploy → **Functions** → **Real-time logs**. Gli errori della Function iniziano con `brief:`.

## Risposte dell'API

`POST /api/brief` risponde sempre in JSON:

| Status | Quando |
|---|---|
| `200 { ok: true, id }` | Brief salvato e notificato (`id` = cartella R2) |
| `400` | Dati non leggibili |
| `403` | Turnstile non valido o scaduto |
| `413` | Upload troppo pesante |
| `415` | La richiesta non è `multipart/form-data` |
| `422 { fields: { campo: messaggio } }` | Errori di validazione: il modulo li mostra sui campi |
| `500` | Configurazione mancante o errore imprevisto |
| `502` | Brief salvato su R2 ma email non inviata (vedi i log) |

## Note

- I file statici del repository sono tutti pubblici, compreso questo README. Il codice non contiene segreti: sono tutti nelle variabili d'ambiente.
- Per limitare gli abusi puoi aggiungere una regola di **Rate limiting** (Dashboard → dominio → Security → WAF), ad esempio 5 richieste al minuto per IP su `/api/brief`.
- I prezzi dei servizi extra non sono mostrati da nessuna parte. Le fasce di budget si modificano in `brief.html`, e le etichette corrispondenti nell'oggetto `L.budget` di `functions/api/brief.js`.
