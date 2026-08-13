# Plan de la semaine — 9 au 16 aout 2026

Ecrit le dimanche 9 aout, apres l'audit hebdomadaire et la premiere Coupe de
l'Empire. Il vaut jusqu'au dimanche suivant, sauf ordre de Mohamed.

---

## ⚠️ 11 aout, 14 h 28 — Mohamed change la priorite de la semaine

> « Il faut mettre le paquet sur le SEO naturel. La qualite des sites est quasi
> excellente maintenant, il faut du trafic. Previens tous les agents. »

**Le cadrage complet, avec les mesures, est dans `docs/CAP-TRAFIC.md` du depot
voyageshalal-app** — c'est le depot partage, donc le seul endroit que les quatre
agents lisent. Ce plan-ci reste valable pour tout ce qu'il dit d'halalgpt.fr,
mais l'ordre des priorites vient desormais de la.

Ce que la mesure du 11 aout a etabli, sur trois sites independamment, et qui
commande tout le reste :

**Le precis gagne, le generique perd.** « voyage halal » : 144 vues, 0 clic.
« ou prier au parc asterix » : 1 vue, 1 clic. Les requetes larges nous affichent
page 3, ou personne ne va ; les requetes precises nous affichent en premier.

Pour halalgpt.fr, cela confirme ce qui se voyait deja dans la Search Console :
« e627 halal », « isla delice halal », « mcdo halal en france » remontent ;
« certification halal » ne remonte pas.

Et mon plafond reste le meme, il est ailleurs que dans le contenu : **aucun lien
entrant**. 193 fiches et personne qui pointe vers moi.

Point de mesure : **25 aout**. Base a battre pour l'empire : 7 803 vues et
81 clics sur 28 jours.

---

## DECISION DE MOHAMED — 12 aout : plus aucune fiche nourriture

> « Oui pour diminuer pourcentage nourriture »

Question posee le 11 aout au soir, reponse le 12. **C'est une decision de
Mohamed, pas une preference d'agent : elle ne se contourne pas.**

Etat au jour de la decision :

  107 fiches nourriture (Produits 46, Additifs 32, Alimentation 29)
   86 fiches de vie generale
      soit 55,4 %

Objectif annonce : **48 %**. On n'y arrive pas en retirant des fiches — on n'en
retire aucune — mais en ecrivant ailleurs. Il reste **30 fiches NON
alimentaires** a ecrire, soit environ dix nuits a trois par nuit.

**Ce que la vague de nuit peut ecrire desormais :** priere, vie quotidienne,
famille, travail, sante, voyage, Ramadan, pratique.
**Ce qu'elle ne peut plus ecrire :** Produits, Additifs, Alimentation.

`scripts/test-nourriture.mjs` fait echouer les controles a la 108e fiche
nourriture, en nommant la faute. Ce n'est pas un test qu'on desactive : si
Mohamed change d'avis, il le dit, on monte le plafond et on ecrit pourquoi.

---

## Le constat qui commande tout

Les trois compteurs mesures cette semaine, cote a cote :

| | impressions / 7 j | clics / 7 j | position |
|---|---|---|---|
| voyageshalal.fr | 1 970 | 24 | 30,5 |
| halalgpt.fr | 63 | 2 | 22,2 |
| YouTube (28 j) | 6 600 vues | — | 7 abonnes |

Trois choses en decoulent, et elles ne sont pas negociables cette semaine :

1. **Tous les canaux sont minuscules.** Le seul qui a du volume est YouTube, et
   il ne convertit pas : 6 600 vues pour 7 abonnes.
2. **Une seule page porte VoyagesHalal** — Disneyland fait 22 clics sur 24.
   Toute l'energie SEO doit aller la, pas sur de nouvelles pages.
3. ~~**HalalGPT n'a aucun lien entrant.**~~ **PERIME — mesure du 13 aout.** La
   passerelle depuis VoyagesHalal existe et fonctionne : pied de page (donc sur
   TOUTES les pages du site), bouton flottant, bloc de l'accueil, encart du
   billet Disneyland, plus deux redirections. Aucun `nofollow` nulle part, et le
   lien du pied de page est rendu cote serveur — Google le voit.

   Ce qui restait casse, en revanche, c'est ce que ces liens trouvaient a
   l'arrivee : l'accueil etait la seule page indexable **sans balise
   canonique**, alors que la passerelle le vise depuis trois endroits avec
   trois campagnes UTM differentes. Google recevait quatre adresses pour une
   seule page, et la confiance apportee se repartissait entre elles au lieu de
   s'additionner. Corrige le 13 aout, voir « Defauts corriges ».

   **Ne pas repartir construire une passerelle : elle est la.** La question
   ouverte n'est plus son existence mais son rendement, et il se mesure dans
   Search Console sur le parametre `utm_medium=passerelle`.

---

## Ma priorite personnelle, apres la 3e place

**Livrer sur halalgpt.fr avant de livrer pour les autres.** La semaine ecoulee a
produit beaucoup d'outillage utile a l'empire et peu de choses qu'un visiteur de
mon propre site puisse voir. Aucun nouvel outil interne tant que ce n'est pas
corrige.

Et une regle de methode, apres deux erreurs de mesure en une nuit : **verifier
avant d'affirmer**. Un `grep` qui rend zero se recoupe avant de devenir un
constat.

---

## Les chantiers, par ordre

### 1. Ce qu'un visiteur voit (lundi, mercredi)

- Rendre la **decouverte du jour** vraiment partageable : c'est la seule boucle
  de croissance gratuite du site. Quelqu'un qui apprend que sa vitamine D vient
  de la laine de mouton l'envoie a sa famille — encore faut-il que la carte
  partagee donne envie d'etre ouverte.
- La **memoire de conversation** existe et reste invisible. La mettre en avant
  au retour plutot que la cacher.
- Vitesse ressentie du chat : la premiere reponse doit commencer a s'afficher
  plus tot.

### 2. La profondeur editoriale (mardi, jeudi)

Enrichir 5 a 8 fiches existantes, jamais en creer plus de 3 a 5 par nuit. Cible
prioritaire : les fiches qui recoivent deja des impressions dans la Search
Console — `mcdo-halal` en tete — plutot que des sujets neufs sans demande
mesuree.

**Le desequilibre reste a corriger** : 107 fiches sur 182 touchent a la
nourriture, 9 seulement a la priere. Continuer a redresser, 4 fiches par nuit
maximum, categories Priere, Pratique et Vie quotidienne d'abord.

### 3. La technique (vendredi)

Robustesse de l'API (delais, messages d'erreur lisibles), verification des builds
des trois depots, dette technique.

### 4. L'ecosysteme (samedi)

Verification profonde des liens croises et de la coherence des palettes sur les
quatre sites, parcours utilisateur inter-sites.

---

## Ce qui attend Mohamed, et que je ne peux pas faire a sa place

1. **Le depot GitHub pour islampasapas.fr** — seul blocage restant pour mettre
   le site d'apprentissage vraiment en ligne. Le domaine est paye.
2. **contact@halalcheck.fr** — des que la boite existe, le remplacement prend
   deux minutes.
3. **La mine de questions** — `halalgpt.fr/api/mine?key=…`. Elle contient ce que
   les gens demandent reellement, et elle n'a jamais ete ouverte. Elle devrait
   decider des fiches ET des sujets de video. On choisit a l'instinct alors
   qu'on a la donnee.
4. **Un relecteur humain** (imam, etudiant en sciences religieuses) pour le site
   d'apprentissage.
5. **INPI** — depot de la marque.

---

## La ligne, rappelee

**Finance — la regle a change le 10 aout, decision de Mohamed. LE PRINCIPE OUI,
LE CAS PERSONNEL JAMAIS.** On peut traiter ce sur quoi les savants sont
unanimes : les jeux de hasard et le principe du riba, qui tiennent a un verset
explicite. On ne traite JAMAIS une situation — credit immobilier, banque,
assurance, placement, crypto, bourse, leasing : les savants qualifies y
divergent reellement, et un engagement de plusieurs annees ne se decide pas
d'apres une page web. Ce qui protege Mohamed n'est pas l'auteur du texte, c'est
la nature du sujet.

Jamais inventer une certification, une composition,
une salle de priere, une reference de hadith. Jamais de fatwa personnelle :
presenter les avis repandus avec leurs divergences et orienter vers un savant.
Aucun mecanisme d'addiction ne s'appuie sur la culpabilite religieuse. Maximum
2 a 3 contenus par jour et par domaine. **On n'ouvre plus aucun nouveau
domaine.**

---

## Defauts connus, a traiter la nuit TECHNIQUE (vendredi)

*(rien en attente — voir ci-dessous)*

---

## Defauts corriges

**La passerelle des codes additifs tombait dans le vide sur 36 liens publics
sur 56 — corrige le 13 aout.**

Trouve en auditant mon propre site a la demande de Mohamed. L'hygiene technique
ne montrait rien : 0 titre coupe sur 214 pages, 0 orpheline, 0 page sans
canonique, donnees structurees sur les 202 fiches. Le defaut etait ailleurs.

`halalcheck.fr/additifs.html` publie **56 liens** vers `halalgpt.fr/e/<CODE>`.
Mesure faite un code a la fois, sur la construction de production : **20**
arrivaient sur une fiche, **36 tombaient sur `/categorie/additifs`**. Et les 36
sont exactement ceux que le moteur du scanner classe « douteux — origine
animale possible » : esters d'acides gras, stearates, phosphate d'os,
L-cystine. Quelqu'un lisait « E472e » sur un paquet, voyait *douteux*, appuyait
pour comprendre, et recevait une liste qui ne parlait pas de son code.

Le defaut ne pouvait etre vu par aucun controle existant : le scanner testait
son moteur, mes fiches testaient mes fiches, et **le fil entre les deux n'etait
teste par personne**. Les deux moities etaient vertes.

Correctif : `/e/<CODE>` sans fiche ne redirige plus, il rend une page qui dit
« pas encore de fiche », **sans inventer de verdict** — la charte interdit
d'emprunter celui d'un additif voisin — et propose les fiches d'additifs les
plus proches par leur numero, presentees comme voisines et non comme la
reponse. La page est en `noindex` : l'indexer reviendrait a fabriquer des
centaines de pages minces, exactement ce que l'audit reproche par ailleurs.
Verifie apres coup : 20 redirections vers une fiche, 36 pages honnetes,
**0 dans le vide**.

La logique est sortie de la route vers `lib/ecodes.ts`, en fonctions pures.
Raison : tant qu'elle vivait dans `app/e/[code]/route.ts`, elle ne se testait
qu'avec un serveur en marche, donc jamais dans le controle automatique.
`scripts/test-ecodes.mjs` tourne desormais avec Node seul, et il est branche
dans `controles.yml`. Verifie qu'il peut virer au rouge en remettant
volontairement le bug d'origine.

Deux notes qui valent plus que le correctif :

1. **Mon propre comptage a menti deux fois** avant de donner le bon chiffre.
   D'abord « 8 series de tests en echec » — c'etait l'atelier, pas le site.
   Ensuite « 55 passerelles cassees sur 55 » — mon test de prefixe echouait sur
   une redirection absolue. Et l'expression `E[0-9]{3}` ne voyait ni E1000 ni
   E1105 : la liste du moteur etait sous-comptee a 55 au lieu de 56.
2. **J'ai ecrit un commentaire affirmant que le tsconfig acceptait les imports
   en `.ts`.** Il ne les accepte pas, la construction l'a refuse. Une
   affirmation non verifiee, dans un commentaire, sur mon propre depot, deux
   heures apres avoir signe un audit qui reproche exactement cela.

**L'accueil n'avait pas de balise canonique — corrige le 13 aout.**

Trouve en verifiant une affirmation de ce document, pas en cherchant un bug.
Le plan disait « HalalGPT n'a aucun lien entrant, le seul remede est la
passerelle » ; la mesure a montre que la passerelle etait deja construite et
suivie. En regardant ce qu'elle trouvait a l'arrivee, le vrai defaut est
apparu.

Sur les neuf routes du site : six declaraient leur canonique, deux sont
volontairement hors de Google (`labo-son`, `studio`), et la neuvieme etait
l'accueil — la seule page vers laquelle pointent des liens exterieurs. La
passerelle la vise depuis trois endroits, chacun avec ses parametres de
campagne : Google recevait quatre adresses pour une seule page.

`scripts/test-canoniques.mjs` verifie desormais que toute page indexable
declare la sienne. Verifie apres coup dans le HTML produit :
`<link rel="canonical" href="https://halalgpt.fr"/>`.

Une note sur ce test, parce qu'elle vaut plus que le correctif : sa premiere
version interdisait aussi de cumuler « noindex » et canonique, et elle a
aussitot accuse `mentions-legales` et `confidentialite`. Ces deux pages
declarent `index: false, follow: true` avec une canonique — un choix sain,
et une regle que j'avais inventee. L'assertion a ete retiree. Un test qui
invente sa regle fabrique du travail au lieu d'en eviter.

**« voyage halal paris » repondait Istanbul — corrige le 10 aout, et le
diagnostic de la veille etait faux.**

Note d'abord comme un defaut du calcul de correspondance de l'etage 1. La
mesure a montre autre chose : cet etage, avec son seuil de trois mots, ne
matchait rien du tout. La reponse venait de `localFallback`, qui se contentait
d'UN SEUL mot commun.

Ce repli ne sert que lorsque l'IA est injoignable — donc jamais en production
normale, et c'est pour cela que le defaut n'etait visible qu'en local, sans cle
API. Mais il sert le jour ou l'API tombe, et ce jour-la l'utilisateur recevait
une reponse fausse avec assurance, sans savoir que c'etait un pis-aller.

Trois corrections, avec `scripts/test-repli.mjs` ecrit AVANT (14 cas, 14 verts) :

1. **On compare des mots, plus des bouts de mots.** « sept » trouvait
   « septembre », « assis » trouvait « assistance » — une question
   d'arithmetique tombait sur la fiche du montant de la zakat. Un prefixe reste
   admis a partir de cinq lettres, pour que « priere » retrouve « prieres ».
2. **Chaque mot pese selon sa rarete.** « voyage » est dans une vingtaine de
   fiches, « nutella » dans deux : les compter pareil etait toute l'erreur.
3. **Une separation est exigee** plutot qu'un seuil absolu : soit deux mots
   designent la meme fiche, soit elle devance nettement la suivante. Sinon on
   avoue. « voyage halal paris » echoue aux deux — une dizaine de fiches de
   voyage a egalite derriere — et c'est exactement le cas qu'on voulait
   attraper.

Et surtout : **le repli ne se fait plus passer pour une vraie reponse.** Il
s'annonce (« je n'arrive pas a joindre mon IA en ce moment »). Un repli a le
droit d'etre approximatif, il n'a pas le droit d'etre confiant — c'est la lecon
de la competence `repondre-en-conditions-degradees` ecrite par l'agent
HalalCheck, appliquee ici.
