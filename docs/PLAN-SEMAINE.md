# Plan de la semaine — 9 au 16 aout 2026

Ecrit le dimanche 9 aout, apres l'audit hebdomadaire et la premiere Coupe de
l'Empire. Il vaut jusqu'au dimanche suivant, sauf ordre de Mohamed.

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
3. **HalalGPT n'a aucun lien entrant.** C'est ce qui le tient a la position 22,
   pas son contenu. Le seul remede rapide et propre est la passerelle depuis
   VoyagesHalal, qui a deja la confiance de Google.

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
