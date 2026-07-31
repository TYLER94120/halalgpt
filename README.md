# 🌙 HalalGPT

**Le moteur de réponses halal** — un chat IA + des pages SEO qui répondent aux questions
halal les plus recherchées sur Google (additifs, produits, restaurants, voyage, Ramadan).

Projet frère de [VoyagesHalal](https://github.com/TYLER94120/voyageshalal-app).

## Stack

- **Next.js 14** (App Router) — pages statiques ultra-rapides, parfaites pour le SEO
- **API Claude** (`claude-opus-5`) pour le chat — avec repli automatique sur la base
  de connaissances locale si la clé API n'est pas configurée
- **Sitemap, robots.txt, données structurées FAQ** générés automatiquement

## Architecture SEO

- `/` — page d'accueil avec le chat
- `/q/[slug]` — une page par question (ex: `/q/e120-halal`), générée depuis
  `lib/questions.ts`. **Chaque nouvelle entrée dans ce fichier = une nouvelle page
  indexée par Google.**
- `/questions` — l'index de toutes les questions
- `/sitemap.xml` et `/robots.txt` — automatiques

## Déployer sur Vercel

1. Sur [vercel.com](https://vercel.com) → **Add New → Project** → importer ce dépôt GitHub
2. Dans **Environment Variables**, ajouter :
   - `ANTHROPIC_API_KEY` — clé API Anthropic ([console.anthropic.com](https://console.anthropic.com)).
     Sans elle, le chat répond quand même depuis la base locale.
   - `NEXT_PUBLIC_SITE_URL` — l'URL finale du site (ex: `https://halalgpt.com`)
3. **Deploy** 🚀
4. Dans **Settings → Domains**, ajouter le domaine halalgpt acheté et suivre les
   instructions DNS affichées par Vercel

## Développement local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vérification production
```

## Ajouter des questions (la machine SEO)

Ouvrir `lib/questions.ts` et ajouter une entrée : slug, question, verdict, réponse
en paragraphes, catégorie, questions liées. Commit → push → Vercel redéploie → la
page existe et entre dans le sitemap. C'est tout.
