// ═══════════════════════════════════════════════════════════════════
//  GET /api/file/<chiave R2>?sig=<firma>  –  Cloudflare Pages Function
//
//  Serve i file del bucket privato BRIEF_UPLOADS solo con un link
//  firmato (HMAC-SHA256 della chiave con il secret BRIEF_FILE_SECRET),
//  generato da /api/brief. Cambiare il secret invalida tutti i link.
// ═══════════════════════════════════════════════════════════════════

const enc = new TextEncoder();

function notFound() {
  return new Response('File non trovato.', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}

function fromBase64url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function onRequestGet({ request, env, params }) {
  if (!env.BRIEF_UPLOADS || !env.BRIEF_FILE_SECRET) return notFound();

  const segments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const key = segments.join('/');
  const sig = new URL(request.url).searchParams.get('sig') || '';
  if (!key || !sig || key.includes('..')) return notFound();

  let valid = false;
  try {
    const hmac = await crypto.subtle.importKey('raw', enc.encode(env.BRIEF_FILE_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    // verify() confronta in tempo costante
    valid = await crypto.subtle.verify('HMAC', hmac, fromBase64url(sig), enc.encode(key));
  } catch {
    valid = false;
  }
  if (!valid) return notFound();

  const obj = await env.BRIEF_UPLOADS.get(key);
  if (!obj) return notFound();

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('ETag', obj.httpEtag);
  headers.set('Cache-Control', 'private, max-age=86400');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  // I file arrivano da sconosciuti (es. SVG): niente script, niente risorse esterne
  headers.set('Content-Security-Policy', "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox");
  if (!headers.get('Content-Type')) headers.set('Content-Type', 'application/octet-stream');

  return new Response(obj.body, { headers });
}
