# Les trois premiers projets de l'usine

Décidés par Mohamed le 10 août 2026. Il achète les trois domaines le soir même.

⚠️ **Avertissement, et il compte.** Les sources ci-dessous sont données **de
mémoire par l'agent responsable, sans avoir pu les vérifier** : la sortie réseau
de l'atelier est fermée. Ce ne sont pas des mesures, ce sont des souvenirs.
C'est exactement ce que la compétence `mesurer-avant-daffirmer` demande de
signaler plutôt que de laisser croire.

**Conséquence : le premier robot de chaque projet vérifie la source, et rien
n'est construit avant.** Si elle ne répond pas, ou si le format a changé, le
projet s'arrête avant d'avoir coûté quoi que ce soit.

---

## Projet 1 — Jours fériés, ponts et vacances scolaires

**Ce que le site répond :** quand tomber les ponts de l'année, quelles dates
pour quelle zone, combien de jours poser pour en gagner combien.

**Sources à vérifier :**
- `calendrier.api.gouv.fr` — l'API officielle des jours fériés (Étalab).
- `data.education.gouv.fr` — le calendrier scolaire par zone, en données
  ouvertes.

**Pourquoi il remplit le critère :** une date de jour férié est un fait
administratif publié. Il n'y a rien à interpréter, personne à croire, et se
tromper ne blesse personne — au pire on pose un jour au mauvais moment.

**Ce qui le rend durable :** la demande revient toute seule chaque année, et le
contenu se régénère par robot. C'est le projet qui demande le moins d'entretien
des trois.

**La difficulté honnête :** beaucoup de sites font déjà ça. Il faudra un angle —
le plus prometteur est le calcul des ponts (« poser 3 jours en mai 2027 pour en
avoir 9 »), qui est un service et pas une simple liste.

---

## Projet 2 — Prix des carburants

**Ce que le site répond :** la station la moins chère autour de moi, aujourd'hui.

**Source à vérifier :** le jeu de données officiel des prix des carburants,
publié quotidiennement pour toutes les stations de France (`data.economie.gouv.fr`
ou `donnees.roulez-eco.fr` selon l'adresse en vigueur).

**Pourquoi il remplit le critère :** un prix relevé et publié par l'État est
vérifiable sans expert, daté par construction, et se trompe sans danger.

**Ce qui le rend fort :** la demande est **quotidienne et locale**, c'est-à-dire
répétée — l'inverse d'un article qu'on lit une fois.

**La difficulté honnête, et elle est réelle :** ce marché a déjà des acteurs
solides et installés. C'est le projet des trois où la concurrence est la plus
forte. Le seul angle défendable est local et précis, pas national.

---

## Projet 3 — Fin de support et compatibilité

**Ce que le site répond :** jusqu'à quand tel appareil ou tel logiciel reçoit
des mises à jour, et par quoi le remplacer.

**Source à vérifier :** `endoflife.date` expose un jeu de données public et
maintenu sur les fins de support, avec une API. À compléter par les pages
constructeurs pour le matériel.

**Pourquoi il remplit le critère :** une date de fin de support est annoncée
publiquement par l'éditeur. Vérifiable, datable, et sans risque.

**Ce qui le rend intéressant :** presque rien n'existe en français sur ce sujet,
alors que la question revient à chaque rentrée et à chaque achat. C'est celui
des trois où la place est la plus libre.

**La difficulté honnête :** la donnée matérielle (téléphones, télés,
imprimantes) est éparpillée chez les constructeurs et bien plus difficile à
récupérer que la donnée logicielle. Commencer par le logiciel, où la source est
unique et propre.

---

## Ce que Mohamed fait ce soir

Pour chacun des trois : **un domaine, un dépôt GitHub vide connecté à Vercel.**

Et c'est tout. Le reste appartient à l'usine.

---

## L'ordre dans lequel je les monterais

1. **Fin de support** — la place est la plus libre, et la source logicielle est
   la plus propre à récupérer.
2. **Jours fériés** — le plus simple à automatiser entièrement, le moins
   d'entretien.
3. **Carburants** — le plus de demande, mais la concurrence la plus dure : à
   monter en dernier, quand l'usine aura fait ses preuves sur les deux autres.

Cet ordre n'est pas un refus de tout faire : les trois démarrent. Il dit
simplement lequel reçoit les cycles en premier si l'usine doit choisir.
