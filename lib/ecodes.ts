import type { QA } from './questions';

// La passerelle de l'ecosysteme, isolee ici pour une raison precise : tant
// qu'elle vivait dans `app/e/[code]/route.ts`, on ne pouvait la verifier
// qu'avec un serveur en marche — donc jamais dans le controle automatique.
//
// Le catalogue arrive en argument plutot que par un import : c'est ce qui
// permet a Node d'executer ce fichier directement (seuls les imports de TYPE
// se laissent effacer sans extension), et accessoirement de tester ces
// fonctions sur un catalogue fabrique pour l'occasion.

/** « E472a », « e472a », « 472a » → « 472a ». */
export function normaliser(code: string): string {
  return code
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^e/, '');
}

/** Le code tel qu'on l'affiche : « 472a » → « E472a ». */
export function enClair(code: string): string {
  return `E${normaliser(code)}`;
}

/** Un code plausible : E suivi de 3 ou 4 chiffres, avec une lettre optionnelle. */
export function estUnCodePlausible(code: string): boolean {
  return /^[0-9]{3,4}[a-z]?$/.test(normaliser(code));
}

/** La fiche qui repond exactement a ce code, ou celle de son code de base. */
export function chercherParCode(questions: QA[], code: string): QA | undefined {
  const num = normaliser(code);
  if (!num) return undefined;

  // Un slug peut porter plusieurs codes (ex. « e631-e627-halal ») : on compare
  // segment par segment plutot que par prefixe.
  const exact = questions.find((q) => q.slug.split('-').includes(`e${num}`));
  if (exact) return exact;

  // « E472a » → on retente sur « E472 ».
  const base = num.replace(/[a-z]+$/, '');
  if (base && base !== num) {
    return questions.find((q) => q.slug.split('-').includes(`e${base}`));
  }
  return undefined;
}

/**
 * Les fiches d'additifs les plus proches par leur NUMERO.
 *
 * ATTENTION a ce que cette fonction est, et surtout a ce qu'elle n'est PAS :
 * c'est un rapprochement par numero, pas par verdict. Deux additifs voisins
 * dans la nomenclature peuvent avoir des statuts opposes. La page qui s'en
 * sert doit donc les presenter comme « questions voisines » et jamais comme
 * la reponse — sinon on publie un avis qu'on n'a pas ecrit, ce qui est
 * exactement ce que la charte interdit.
 */
export function fichesVoisines(questions: QA[], code: string, combien = 6): QA[] {
  const num = parseInt(normaliser(code), 10);
  if (!Number.isFinite(num)) return [];

  return questions
    .filter((q) => q.category === 'Additifs')
    .map((q) => {
      const seg = q.slug.split('-').find((s) => /^e[0-9]{3,4}$/.test(s));
      return seg ? { q, n: parseInt(seg.slice(1), 10) } : null;
    })
    .filter((x): x is { q: QA; n: number } => x !== null)
    .sort((a, b) => Math.abs(a.n - num) - Math.abs(b.n - num))
    .slice(0, combien)
    .map((x) => x.q);
}

/** Tous les codes qui atterrissent aujourd'hui sur une vraie fiche. */
export function codesCouverts(questions: QA[]): string[] {
  const codes = new Set<string>();
  for (const q of questions) {
    for (const seg of q.slug.split('-')) {
      if (/^e[0-9]{3,4}$/.test(seg)) codes.add(seg.toUpperCase());
    }
  }
  return [...codes].sort();
}
