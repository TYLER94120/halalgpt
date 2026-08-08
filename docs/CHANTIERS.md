# Les deux grands chantiers de l'empire

Decides par Mohamed le 8 aout 2026 : **la traction totale entre les cinq sites**,
puis **la concentration de tous les sites sur le referencement**. Ce document est
la reference commune des quatre agents. Il ne contient que des choses mesurees.

Les cinq sites : **halalgpt.fr** (l'IA musulmane) · **halalcheck.fr** (le
scanner) · **voyageshalal.fr** (le guide FR) · **gohalaltravel.com** (le guide
EN) · **islampasapas.fr** (l'apprentissage, domaine pas encore achete).

---

## Etat mesure au 8 aout 2026

Audit des trois depots. Les chiffres sont des comptages de fichiers, pas des
impressions.

| | halalgpt | voyageshalal | halalcheck |
|---|---|---|---|
| Donnees structurees (JSON-LD) | 1 fichier | 5 fichiers | **0** |
| FAQPage | oui, 178 fiches | oui | **0** |
| Fil d'Ariane (BreadcrumbList) | ~~0~~ → fait | 5 fichiers | **0** |
| Date de mise a jour | ~~0~~ → fait, 178 fiches | 1 fichier | **0** |
| hreflang FR ↔ EN | sans objet | **sitemap seulement** | sans objet |
| Fiches orphelines | ~~18~~ → 0 | a mesurer | a mesurer |
| `force-dynamic` | 0 | **37 fichiers** | 0 |

Ce que ce tableau dit vraiment :

- **VoyagesHalal est le plus avance** en referencement. C'est coherent : c'est
  aussi le site qui a le plus de trafic. Ce n'est pas un hasard.
- **HalalCheck n'a rien du tout.** Zero donnee structuree, zero fil d'Ariane,
  zero date. C'est le trou le plus profond des trois, et le plus vite comble.
- **hreflang n'existe que dans le sitemap** de VoyagesHalal. Pour Google,
  voyageshalal.fr et gohalaltravel.com ne sont donc pas deux versions
  linguistiques d'un meme guide : ce sont deux sites qui se disputent les memes
  requetes. Ils se penalisent l'un l'autre. C'est le point le plus couteux du
  tableau.
- **37 fichiers en `force-dynamic`** : chaque page est refabriquee a chaque
  visite. La vitesse est un critere de classement, et c'est de la vitesse perdue.
  Prudence toutefois : ce reglage sert le fonctionnement bi-domaine, on ne le
  retire pas sans tester les deux domaines.

---

## Chantier 1 — La traction totale

### Le principe, avant les taches

**Un lien en pied de page ne vaut presque rien.** Personne ne descend en bas
d'une page pour decouvrir un autre site. Ce qui fait passer quelqu'un d'un site
a l'autre, c'est **d'etre pris en charge a l'instant precis ou son besoin
change**. Une seule proposition, au bon moment, jamais une liste de quatre liens.

### Les six moments ou le besoin change

| Le visiteur vient de… | Sa question suivante est… | On l'emmene vers |
|---|---|---|
| scanner un produit → verdict **douteux** | « pourquoi ? » | halalgpt.fr/e/E471 (le pont E-code existe deja) |
| lire « ou prier a Disney » | « comment prier en voyage ? » | fiche HalalGPT `priere-voyage` |
| lire une fiche **Voyage / Destinations** | « ou manger, ou dormir ? » | voyageshalal.fr ✔ fait |
| lire une fiche **Additifs / Produits** | « et ce produit-la ? » | halalcheck.fr ✔ fait |
| lire une fiche **Priere / Ramadan / Pratique** | « je veux apprendre » | islampasapas.fr *(en attente du domaine)* |
| finir une lecon d'apprentissage | « et dans mon cas a moi ? » | halalgpt.fr |

### Deux regles qui ne se negocient pas

1. **Toute passerelle est marquee** (`utm_source`, `utm_medium=passerelle`,
   `utm_campaign`). Sans mesure, on croirait les sites relies alors qu'ils
   seraient seulement voisins. Fait sur halalgpt : a faire partout.
2. **Jamais de fermes de liens.** Cinq domaines qui se lient massivement entre
   eux, dans un pied de page repete sur toutes les pages, cela porte un nom chez
   Google et c'est sanctionne. Les liens croises doivent etre **contextuels,
   utiles, et peu nombreux**. Un lien qui aide un lecteur reel est toujours sur ;
   un lien pose pour le moteur ne l'est jamais.

---

## Chantier 2 — Le referencement

### Par ordre d'effet reel, pas par ordre de facilite

1. **hreflang entre voyageshalal.fr et gohalaltravel.com** — dans les pages
   elles-memes, pas seulement dans le sitemap. Aujourd'hui les deux sites se
   font concurrence au lieu de s'additionner. *Agent VoyagesHalal.*
2. **HalalCheck part de zero** : donnees structurees, fil d'Ariane, dates,
   canoniques. Le plus gros gain pour le moins d'effort de tout l'empire.
   *Agent HalalCheck.*
3. **Les dates de mise a jour partout.** Les agents enrichissent chaque nuit et
   Google ne le voit pas. Lues dans l'historique git, **jamais inventees** — une
   fausse date est une fausse promesse. Modele : `scripts/dates-fiches.mjs`.
4. **Zero page orpheline** sur chaque site. Une page vers laquelle rien ne
   pointe est peu exploree et mal classee. Mesurer, puis rattacher.
5. **Les pages qui marchent deja**, plutot que des pages nouvelles.
   « salle de priere disney » et « est-ce que mcdo est halal » sont les requetes
   n°1 de la Search Console : on les rend imbattables.
6. **La confiance (E-E-A-T).** Le halal touche a l'alimentation et a la
   religion : Google y exige des signaux de serieux. Sources citees, dates,
   mentions legales, adresse de contact reelle. C'est aussi ce qui protege
   Mohamed.
7. **La vitesse.** `force-dynamic` la ou il n'est pas indispensable, images,
   Core Web Vitals.

### La verite qu'il faut dire sur les cinq domaines

Cinq domaines separes **divisent** l'autorite au lieu de la concentrer. Un seul
domaine aurait mieux marche. Mais les cinq existent, ils sont en ligne, et
VoyagesHalal a deja du trafic : les fusionner maintenant serait long et risque.

La consequence pratique est simple et elle s'applique des aujourd'hui :
**on n'ouvre plus aucun nouveau domaine.** Toute idee neuve devient une section
d'un site existant. Chaque domaine supplementaire serait une part d'autorite en
moins pour les cinq autres.

### Et la regle de volume, qui reste

**Maximum 2 a 3 contenus par jour et par domaine.** Mohamed l'a dit et il avait
raison : trop d'articles d'un coup abime le referencement au lieu de le servir.
Ameliorer une page existante vaut souvent mieux que d'en creer une moyenne.

---

## Qui fait quoi

- **Agent HalalGPT (responsable)** — fait : dates sur 178 fiches, fil d'Ariane,
  18 orphelines rattachees, passerelles marquees. Suite : le pont vers
  l'apprentissage des que le domaine existe.
- **Agent VoyagesHalal** — hreflang FR ↔ EN dans les pages ; orphelines ;
  `force-dynamic` la ou il ne sert pas ; passerelle vers HalalGPT sur les pages
  de priere.
- **Agent HalalCheck** — tout le socle de referencement, qui est a zero ; et la
  passerelle du verdict douteux vers `halalgpt.fr/e/<code>`.
- **Agent Apprentissage** — l'audio et l'addiction d'abord. Le referencement
  quand le site aura des visiteurs a garder.

---

## Une derniere chose, pour tous les agents

**Tout ce que Mohamed voit s'ecrit en francais.** Le rapport, mais aussi la
petite ligne de statut affichee sous la session dans l'application, le titre de
la session, les notifications. Il ne lit pas l'anglais, et une ligne en anglais
est une ligne perdue pour lui.
