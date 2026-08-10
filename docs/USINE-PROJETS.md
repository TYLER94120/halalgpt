# L'usine à projets

Décidé par Mohamed le 10 août 2026 : lancer plusieurs écosystèmes en parallèle,
sur des sujets sans rapport avec le halal, avec un critère qu'il a posé
lui-même :

> *« Je veux un sujet qui dépende le moins possible de ma personne, que toi et
> les autres agents puissiez scaler sans ma présence. »*

Ce document est le moule. Il sert au premier projet comme au dixième.

---

## Le critère, rendu technique

« Sans sa présence » ne veut pas dire « sans vérification » — la règle
`ne-jamais-inventer` ne se relâche jamais. Ça veut dire que **la vérification ne
doit pas passer par un humain.**

Un sujet entre dans l'usine s'il remplit les quatre conditions :

1. **La vérité est publique** — publiée par une source officielle ou un jeu de
   données ouvert, pas par un expert qu'il faudrait croire.
2. **Elle est récupérable par une machine** — une adresse qui répond, un format
   lisible.
3. **Elle est datable** — on sait de quand elle date, donc quand elle a pourri.
4. **Se tromper ne blesse personne.** Santé, médecine, droit, finance sont hors
   de l'usine, définitivement. Une donnée fausse y fait un dégât réel, et c'est
   exactement la responsabilité que Mohamed a refusée pour la finance.

---

## L'obstacle central, et sa solution

**Les agents ne voient pas le web.** La sortie réseau de leur atelier est
filtrée : la plupart des adresses répondent 403.

C'est l'agent VoyagesHalal qui a trouvé la parade, et elle devient la base de
toute l'usine : **un robot GitHub, lui, a le réseau.** Il va chercher les
données, les dépose dans le dépôt, et l'agent travaille sur des fichiers.

```
source publique  →  robot GitHub (planifié)  →  données/*.json dans le dépôt
                                                        ↓
                                          site statique généré depuis ces fichiers
```

Conséquence : **le site ne dépend d'aucune API en direct.** Si la source tombe,
le site continue d'afficher la dernière donnée connue, avec sa date. Rien ne
casse, rien ne ment.

---

## La règle d'or de l'usine

**Chaque fait publié porte sa source et sa date de récupération.**

Concrètement, dans les données :

```json
{
  "valeur": "…",
  "source": "https://…",
  "recupere_le": "2026-08-10"
}
```

Et à l'écran : *« Source : … · vérifié le 10 août 2026 »*.

Ce qui n'a pas pu être récupéré est marqué **non vérifié** et n'est jamais
affirmé. Trois états, jamais deux — c'est la compétence `ne-jamais-inventer`,
appliquée à un site qu'aucun humain ne relit.

---

## Le premier robot ne construit rien

**Il vérifie que la source répond.** C'est tout.

Il tente la récupération, écrit ce qu'il a obtenu — le code de réponse, le
format, un échantillon, le volume — dans `donnees/verification-source.json`, et
s'arrête.

Rien d'autre n'est construit avant que ce fichier existe et soit bon. La raison
est simple et vient d'une erreur réelle : le responsable a proposé ces sujets de
mémoire, **sans pouvoir vérifier que les sources existent**. Bâtir un site
entier avant de savoir si la donnée arrive serait exactement l'erreur que la
compétence `mesurer-avant-daffirmer` décrit.

Si la source ne répond pas : le projet s'arrête là. On a perdu une heure, pas
une semaine.

---

## Ce que Mohamed fait, par projet

**Deux gestes, et rien d'autre :**

1. acheter un domaine ;
2. créer un dépôt GitHub vide et le connecter à Vercel.

Le reste — squelette, robots, contenu, référencement, mesure — appartient à
l'usine.

---

## Ce que l'usine installe dans chaque nouveau dépôt

- `.claude/skills/` — les compétences partagées, à l'identique ;
- `docs/FILE-ATTENTE.md` — la file qui ne se vide jamais ;
- `docs/MOTEUR.md` — le cycle et sa règle : un cycle sans mesure n'a rien produit ;
- `.github/workflows/verifier-source.yml` — le premier robot ;
- `.github/workflows/recuperer.yml` — la récupération planifiée, activée seulement
  après la vérification ;
- un agent dédié, avec son cycle de deux heures.

---

## La règle de sortie

**Six semaines sans aucun signe de vie → on arrête le projet.**

Un signe de vie, c'est une mesure : des impressions dans la Search Console, des
visites, un lien entrant. Pas une impression personnelle.

Sans cette règle, on accumule des sites morts qui ne servent qu'à se rassurer —
et chacun coûte des cycles d'agent que les projets vivants n'ont plus.

---

## Ce qui ne change pas, même ici

Maximum 2 à 3 contenus par jour et par domaine. Jamais de fait sans source.
Jamais de sujet où l'erreur blesse. Et la règle qui vaut pour tout l'empire :
**un cycle qui ne produit pas une mesure n'a rien produit.**
