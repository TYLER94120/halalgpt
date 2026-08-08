import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

// Pont de l'écosystème : halalgpt.fr/e/E471 → la fiche correspondante.
// HalalCheck (le scanner) n'a ainsi AUCUNE table de correspondance à maintenir :
// il connaît le code additif, il construit l'URL, on s'occupe du reste.
// Accepte « E471 », « e471 », « 471 » et les variantes à lettre (« E472a »).
export const runtime = 'edge';

function findByCode(code: string) {
  const num = code
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^e/, '');
  if (!num) return undefined;

  // Un slug peut porter plusieurs codes (ex. « e631-e627-halal ») : on compare
  // segment par segment plutôt que par préfixe.
  const exact = QUESTIONS.find((q) => q.slug.split('-').includes(`e${num}`));
  if (exact) return exact;

  // « E472a » → on retente sur « E472 ».
  const base = num.replace(/[a-z]+$/, '');
  if (base && base !== num) {
    return QUESTIONS.find((q) => q.slug.split('-').includes(`e${base}`));
  }
  return undefined;
}

export function GET(_request: Request, { params }: { params: { code: string } }) {
  const hit = findByCode(params.code ?? '');
  // Code inconnu : on renvoie vers la catégorie Additifs plutôt qu'une 404.
  const target = hit ? `${SITE_URL}/q/${hit.slug}` : `${SITE_URL}/categorie/additifs`;
  return NextResponse.redirect(target, 308);
}
