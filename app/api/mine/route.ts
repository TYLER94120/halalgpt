import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';

// ─── La salle des coffres 💎 ──────────────────────────────────────────────────
//
// Affiche le classement des questions réellement posées (FR + EN), pour
// décider des prochaines pages SEO à créer.
//
// Protégée par la variable d'environnement MINE_SECRET (choisissez un mot de
// passe sur Vercel) : https://halalgpt.fr/api/mine?key=VOTRE_MOT_DE_PASSE

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function rows(flat: (string | number)[]): { question: string; count: number }[] {
  const out: { question: string; count: number }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    out.push({ question: String(flat[i]), count: Number(flat[i + 1]) });
  }
  return out;
}

function section(title: string, items: { question: string; count: number }[]): string {
  if (items.length === 0) {
    return `<h2>${title}</h2><p class="empty">Rien encore — la mine se remplit à chaque question posée ⛏</p>`;
  }
  const lines = items
    .map(
      (r, i) =>
        `<tr><td class="rank">${i + 1}</td><td class="q">${esc(r.question)}</td><td class="n">×${r.count}</td></tr>`
    )
    .join('');
  return `<h2>${title}</h2><table><thead><tr><th>#</th><th>Question posée</th><th>Fois</th></tr></thead><tbody>${lines}</tbody></table>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') ?? '';
  const secret = process.env.MINE_SECRET;

  if (!secret) {
    return new Response(
      'La salle des coffres est fermée : ajoutez la variable MINE_SECRET (un mot de passe de votre choix) sur Vercel, puis Redeploy.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }
  if (key !== secret) {
    return new Response('Accès refusé 🔒', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const redis = getRedis();
  if (!redis) {
    return new Response('Redis non connecté (variables KV_REST_API_* absentes).', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const [fr, en, totalFr, totalEn, passerelles, detail] = await Promise.all([
    redis.zrange<(string | number)[]>('halalgpt:questions', 0, 49, { rev: true, withScores: true }),
    redis.zrange<(string | number)[]>('halalgpt:en:questions', 0, 49, { rev: true, withScores: true }),
    redis.zcard('halalgpt:questions'),
    redis.zcard('halalgpt:en:questions'),
    // Les passerelles : combien de visiteurs arrivent depuis un autre site de
    // la famille. C'est la seule facon pour un agent de repondre seul a « est-ce
    // que mon lien amene quelqu'un ? » — le tableau de bord Vercel, lui, n'est
    // ouvrable que par Mohamed.
    redis.zrange<(string | number)[]>('halalgpt:passerelles', 0, 19, { rev: true, withScores: true }),
    redis.zrange<(string | number)[]>('halalgpt:passerelles:detail', 0, 29, { rev: true, withScores: true }),
  ]);
  // zrange withScores rend [membre, score, membre, score…] : les scores sont
  // aux rangs impairs.
  const totalPasserelles = passerelles
    .filter((_, i) => i % 2 === 1)
    .reduce((n: number, v) => n + Number(v), 0);

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>💎 La Mine — HalalGPT</title>
<style>
  body { background: #0b1a0f; color: #fdfaf3; font-family: system-ui, sans-serif; margin: 0; padding: 24px 16px 64px; }
  .wrap { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 28px; } h1 .or { color: #c9a84c; }
  .sub { color: rgba(253,250,243,0.6); margin-bottom: 8px; }
  h2 { color: #c9a84c; font-size: 20px; margin-top: 36px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(253,250,243,0.5); padding: 8px; }
  td { padding: 10px 8px; border-top: 1px solid rgba(201,168,76,0.2); font-size: 16px; }
  .rank { color: #c9a84c; font-weight: 700; width: 36px; }
  .n { color: #c9a84c; font-weight: 700; text-align: right; width: 60px; }
  .empty { color: rgba(253,250,243,0.6); }
  .tip { margin-top: 40px; padding: 16px; border: 1px solid #c9a84c; border-radius: 12px; background: #1b4332; font-size: 15px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>💎 La Mine <span class="or">HalalGPT</span></h1>
  <p class="sub">${totalFr} question(s) distincte(s) en français · ${totalEn} en anglais — top 50 par fréquence.</p>
  ${section('🇫🇷 Questions françaises (halalgpt.fr)', rows(fr))}
  ${section('🇬🇧 Questions anglaises (gohalaltravel.com)', rows(en))}
  ${section(`🔗 Passerelles — ${totalPasserelles} arrivée(s) depuis un autre site de la famille`, rows(passerelles))}
  ${section('🔗 Le détail (source · campagne · page d’arrivée)', rows(detail))}
  <div class="tip">💡 Copiez les questions les plus posées et envoyez-les à Claude : « crée les pages pour ces questions » — elles deviendront des pages SEO et des réponses instantanées gratuites.</div>
</div>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
