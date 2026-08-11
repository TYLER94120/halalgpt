// La description que Google affiche sous le titre, sur les 193 fiches.
//
// Mesure du 11 aout : le champ `short` servait tel quel de description. Il est
// pourtant ecrit pour etre LU SUR LA PAGE, pas pour tenir dans un resultat de
// recherche. 51 fiches sur 193 depassaient 160 caracteres — jusqu'a 236 — et
// Google les coupait au milieu d'un mot.
//
// On ne peut pas raccourcir `short` : il est affiche sur la fiche ET sert de
// resume dans les reponses du chat. On en derive donc une description, comme
// `titre-seo.ts` derive un titre.
//
//   node --experimental-strip-types scripts/test-descriptions.mjs
//
// Aucun reseau : on lit le catalogue.

import { QUESTIONS } from '../lib/questions.ts';
import { descriptionDeFiche, LIMITE } from '../lib/description-seo.ts';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const toutes = QUESTIONS.map((q) => ({ q, d: descriptionDeFiche(q) }));

// ── 1. Aucune ne depasse ─────────────────────────────────────────────────
const trop = toutes.filter(({ d }) => d.length > LIMITE);
dire(trop.length === 0, `les ${QUESTIONS.length} descriptions tiennent en ${LIMITE} caracteres`,
  trop.map(({ q, d }) => `${q.slug} (${d.length})`).slice(0, 4).join(', '));

// ── 2. Aucune ne se termine au milieu d'un mot ───────────────────────────
// C'est tout l'objet de ce travail : Google coupe de toute facon, on choisit
// OU. Une coupe au milieu d'un mot est precisement l'aspect baclé qu'on evite.
// Premier essai de ce test : il cherchait le dernier mot avec `\b…\b`. Trois
// fiches echouaient a tort — en JavaScript, `\b` ne reconnait ni le « a »
// accentue ni le tiret cadratin, et une parenthese ouvrante casse le motif.
// Le test accusait le code alors qu'il coupait tres bien. On mesure donc
// exactement : la description tronquee doit etre un PREFIXE du texte
// d'origine, et ce qui suit dans l'original doit commencer par une espace.
// Aucune expression reguliere, aucune surprise d'accent.
const coupeSale = toutes.filter(({ q, d }) => {
  const source = q.short.trim();
  if (d === source) return false; // non coupee
  if (!d.endsWith('…')) return false; // coupee sur une fin de phrase : parfait
  const sans = d.slice(0, -1);
  // La coupe retire au passage une ponctuation en fin : on la remet pour
  // comparer.
  for (const fin of ['', ',', ';', ':', ' —', ' -', ' ', '(']) {
    const essai = sans + fin;
    if (source.startsWith(essai)) {
      const suite = source.slice(essai.length);
      if (suite === '' || /^[\s(]/.test(suite)) return false;
    }
  }
  return true;
});
dire(coupeSale.length === 0, 'aucune description ne s’arrete au milieu d’un mot',
  coupeSale.map(({ q }) => q.slug).slice(0, 4).join(', '));

// ── 3. Aucune n'est trop courte pour dire quelque chose ──────────────────
// Une description de 40 caracteres est complete et ne donne aucune raison de
// cliquer. Le decoupage ne doit pas produire ca.
const tropCourtes = toutes.filter(({ d }) => d.length < 80);
dire(tropCourtes.length === 0, 'aucune description ne descend sous 80 caracteres',
  tropCourtes.map(({ q, d }) => `${q.slug} (${d.length})`).slice(0, 4).join(', '));

// ── 4. Les courtes ne sont pas touchees ──────────────────────────────────
// Le risque de tout decoupage : abimer ce qui allait bien.
const courtes = QUESTIONS.filter((q) => q.short.trim().length <= LIMITE);
const abimees = courtes.filter((q) => descriptionDeFiche(q) !== q.short.trim());
dire(abimees.length === 0,
  `les ${courtes.length} descriptions deja assez courtes traversent inchangees`,
  abimees.map((q) => q.slug).slice(0, 4).join(', '));

// ── 5. Le texte de la page, lui, ne bouge pas ────────────────────────────
// `short` reste entier : c'est le resume lu sur la fiche et dans le chat. Si
// ce test venait a echouer, on aurait ampute le contenu pour plaire au moteur.
const ampute = QUESTIONS.filter((q) => q.short.length < 80);
dire(ampute.length === 0, 'le resume affiche sur la page reste entier',
  ampute.map((q) => q.slug).join(', '));

// ── 6. L'etat des lieux ──────────────────────────────────────────────────
const raccourcies = toutes.filter(({ q, d }) => d !== q.short.trim());
const surPhrase = raccourcies.filter(({ d }) => !d.endsWith('…')).length;
console.log(
  `\n   ${raccourcies.length} descriptions raccourcies sur ${QUESTIONS.length}.` +
  `\n   ${surPhrase} se terminent sur une phrase complete, ${raccourcies.length - surPhrase} sur un mot entier.`,
);

console.log(
  echecs === 0
    ? '\n✓ Google affichera une phrase finie, pas un morceau de phrase.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
