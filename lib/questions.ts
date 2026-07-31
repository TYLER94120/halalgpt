// ─── Base de connaissances HalalGPT ───────────────────────────────────────────
//
// Chaque entrée devient une page SEO statique sur /q/[slug].
// C'est le trésor du projet : des réponses honnêtes, nuancées, en français,
// sur les questions halal les plus recherchées sur Google.
//
// Règle éditoriale : on présente les avis répandus (avec leurs divergences
// quand il y en a), on recommande la certification en cas de doute, et on ne
// délivre jamais de fatwa personnelle.

export type Category = 'Additifs' | 'Produits' | 'Alimentation' | 'Voyage' | 'Pratique';

export interface QA {
  slug: string;
  question: string;
  verdict: string;
  short: string;
  answer: string[];
  category: Category;
  related: string[];
}

export const QUESTIONS: QA[] = [
  // ─── ADDITIFS ───────────────────────────────────────────────────────────────
  {
    slug: 'e120-halal',
    question: 'Le E120 (carmin) est-il halal ?',
    verdict: '⚠️ Avis divergents — souvent évité',
    short:
      'Le E120 est un colorant rouge extrait de la cochenille, un insecte. La plupart des organismes de certification halal l’écartent.',
    answer: [
      'Le E120, aussi appelé carmin ou rouge cochenille, est un colorant rouge fabriqué à partir de la cochenille, un petit insecte séché et broyé. On le trouve dans certains bonbons, sodas, yaourts aux fruits rouges, charcuteries et cosmétiques.',
      'La consommation d’insectes est considérée comme non permise par la majorité des savants (notamment l’école hanafite). C’est pourquoi la plupart des organismes de certification halal refusent le E120. Un avis minoritaire le tolère en raison de la transformation subie, mais il reste marginal.',
      'En pratique : par précaution, la grande majorité des consommateurs musulmans l’évitent. Cherchez les alternatives colorées avec du E162 (betterave) ou du E163 (anthocyanes), parfaitement halal.',
    ],
    category: 'Additifs',
    related: ['e441-gelatine-halal', 'e471-halal', 'gelatine-halal'],
  },
  {
    slug: 'e441-gelatine-halal',
    question: 'Le E441 (gélatine) est-il halal ?',
    verdict: '⚠️ Ça dépend de la source',
    short:
      'Le E441 désigne la gélatine. Porcine : haram. Bovine : halal uniquement si l’animal a été abattu rituellement. Poisson : halal.',
    answer: [
      'Le E441 est le code européen de la gélatine, une protéine obtenue à partir de la peau et des os d’animaux. Sa licéité dépend entièrement de sa source.',
      'Gélatine de porc : interdite (haram), c’est l’avis unanime. Gélatine bovine : elle n’est halal que si la bête a été abattue selon le rite. Or, sans certification, la gélatine bovine industrielle provient généralement d’abattoirs classiques. Gélatine de poisson : halal sans condition particulière.',
      'Certains savants considèrent que la transformation chimique (istihala) purifie la gélatine, mais la majorité des organismes contemporains exigent une source halal. En pratique : privilégiez les produits certifiés halal ou les gélifiants végétaux (pectine E440, agar-agar E406).',
    ],
    category: 'Additifs',
    related: ['gelatine-halal', 'e120-halal', 'haribo-halal'],
  },
  {
    slug: 'e471-halal',
    question: 'Le E471 est-il halal ?',
    verdict: '⚠️ Ça dépend de l’origine',
    short:
      'Le E471 (mono- et diglycérides d’acides gras) peut être d’origine végétale (halal) ou animale (douteux). L’étiquette ne le précise presque jamais.',
    answer: [
      'Le E471 est un émulsifiant très répandu (pains de mie, biscuits, glaces, margarines, viennoiseries industrielles). Il est fabriqué à partir de graisses — végétales (palme, soja, tournesol) ou animales.',
      'S’il est d’origine végétale, il est halal. S’il est d’origine animale, il peut provenir du porc ou de bœuf non abattu rituellement, et devient alors problématique. Le problème : la réglementation européenne n’oblige pas à préciser l’origine sur l’emballage.',
      'En pratique : si l’emballage indique « origine végétale » ou porte un logo halal, pas de souci. Sinon, contactez la marque ou choisissez un produit certifié. Beaucoup de marques répondent en 24h sur leurs réseaux sociaux.',
    ],
    category: 'Additifs',
    related: ['e422-glycerine-halal', 'e441-gelatine-halal', 'e120-halal'],
  },
  {
    slug: 'e422-glycerine-halal',
    question: 'Le E422 (glycérine) est-il halal ?',
    verdict: '⚠️ Ça dépend de l’origine',
    short:
      'La glycérine (E422) est halal si elle est végétale ou synthétique, douteuse si elle est d’origine animale non précisée.',
    answer: [
      'Le E422, ou glycérol/glycérine, est un humectant présent dans les gâteaux industriels, chewing-gums, dentifrices, sirops et e-liquides. Comme le E471, il peut être produit à partir de végétaux (le plus courant aujourd’hui), de synthèse, ou de graisses animales.',
      'Glycérine végétale ou synthétique : halal. Glycérine animale : même problème que la gélatine — si elle provient du porc ou d’animaux non abattus rituellement, elle est à éviter.',
      'La bonne nouvelle : la majorité de la glycérine utilisée en Europe est aujourd’hui végétale (colza, palme). En cas de doute sur un produit consommé régulièrement, un message à la marque suffit souvent à obtenir l’origine exacte.',
    ],
    category: 'Additifs',
    related: ['e471-halal', 'e441-gelatine-halal'],
  },
  {
    slug: 'gelatine-halal',
    question: 'La gélatine est-elle halal ?',
    verdict: '⚠️ Ça dépend de la source',
    short:
      'La gélatine est haram si elle est porcine, halal si elle vient d’un animal abattu rituellement ou de poisson. Le réflexe : chercher la certification.',
    answer: [
      'La gélatine est partout : bonbons, marshmallows, mousses, gélules de médicaments, yaourts, guimauves. Elle est extraite du collagène de la peau et des os d’animaux — le plus souvent du porc (la moins chère) ou du bœuf.',
      'La règle : gélatine porcine, haram à l’unanimité. Gélatine bovine, halal seulement si l’animal a été abattu selon le rite — ce qui n’est pas le cas de la production industrielle standard. Gélatine de poisson, halal. Un débat existe sur la transformation (istihala) qui purifierait la matière, mais la position majoritaire des organismes de certification reste l’exigence d’une source halal.',
      'Alternatives sans souci : pectine de fruits (E440), agar-agar (E406), carraghénanes (E407) — tous végétaux. Et de plus en plus de marques proposent des gammes « gélatine halal » certifiées.',
    ],
    category: 'Additifs',
    related: ['e441-gelatine-halal', 'haribo-halal', 'medicaments-gelules-halal'],
  },
  {
    slug: 'fromage-presure-halal',
    question: 'Le fromage à la présure animale est-il halal ?',
    verdict: '✅ Toléré par la majorité',
    short:
      'La majorité des savants tolèrent le fromage à présure animale. Les plus prudents choisissent les fromages à présure microbienne ou certifiés.',
    answer: [
      'La présure est l’enzyme qui fait cailler le lait. Elle peut être animale (extraite de caillette de veau), microbienne ou végétale. Beaucoup de fromages traditionnels français (emmental, comté, camembert AOP…) utilisent de la présure animale.',
      'Historiquement, une grande partie des savants a permis la consommation de fromages sans s’enquérir de l’origine de la présure, la quantité utilisée étant infime et transformée. C’est l’avis le plus répandu aujourd’hui : le fromage à présure animale est toléré.',
      'Les plus prudents préfèrent les fromages à présure microbienne — c’est le cas de la majorité des fromages industriels (vérifiez la mention « coagulant microbien ») — ou les fromages certifiés halal, de plus en plus courants. Les deux démarches sont respectables.',
    ],
    category: 'Additifs',
    related: ['vinaigre-halal', 'e471-halal'],
  },
  {
    slug: 'vinaigre-halal',
    question: 'Le vinaigre (de vin) est-il halal ?',
    verdict: '✅ Halal pour la majorité',
    short:
      'Le vinaigre est halal pour la majorité des savants : le vin y est totalement transformé en une substance nouvelle, non enivrante.',
    answer: [
      'Le vinaigre de vin pose question puisqu’il est fabriqué à partir de vin. Mais la transformation est totale : l’alcool est converti en acide acétique par fermentation, et le produit final ne peut pas enivrer, même en grande quantité.',
      'Le Prophète ﷺ a fait l’éloge du vinaigre comme condiment. Les savants s’accordent sur la licéité du vinaigre dont la transformation s’est faite naturellement. Pour le vinaigre produit industriellement (transformation provoquée), l’école hanafite et la majorité contemporaine le considèrent également halal ; un avis plus prudent existe chez certains chafiites.',
      'En pratique : vinaigre de vin, balsamique, de cidre… sont consommés sans problème par l’immense majorité. Rien à voir avec le vin lui-même ou les sauces « au vin », qui restent interdits.',
    ],
    category: 'Additifs',
    related: ['cuisine-alcool-halal', 'fromage-presure-halal'],
  },

  // ─── PRODUITS ───────────────────────────────────────────────────────────────
  {
    slug: 'haribo-halal',
    question: 'Les bonbons Haribo sont-ils halal ?',
    verdict: '⚠️ Ça dépend de la gamme',
    short:
      'Les Haribo vendus en France contiennent de la gélatine de porc. Mais Haribo fabrique aussi des gammes halal certifiées, produites en Turquie.',
    answer: [
      'Mauvaise nouvelle : les Haribo classiques vendus en grande surface en France (Dragibus, Fraises Tagada, ours d’or…) contiennent de la gélatine de porc. Ils ne sont donc pas halal.',
      'Bonne nouvelle : Haribo possède une usine en Turquie qui produit des gammes 100 % halal, à base de gélatine bovine certifiée. On les trouve dans les épiceries orientales et certains sites spécialisés, avec le logo halal sur le paquet.',
      'Le réflexe : vérifier le paquet. « Fabriqué en Turquie » + logo halal = OK. Sinon, regardez la liste d’ingrédients : « gélatine » sans précision en France signifie presque toujours gélatine de porc. Il existe aussi de nombreuses marques alternatives 100 % halal en magasin oriental.',
    ],
    category: 'Produits',
    related: ['gelatine-halal', 'mms-halal', 'kinder-halal'],
  },
  {
    slug: 'mms-halal',
    question: 'Les M&M’s sont-ils halal ?',
    verdict: '⚠️ Non certifiés',
    short:
      'Les M&M’s ne contiennent pas de gélatine, mais ils ne sont pas certifiés halal et la marque ne garantit pas l’absence totale de dérivés animaux.',
    answer: [
      'Les M&M’s classiques (chocolat, cacahuète) vendus en Europe ne contiennent pas de gélatine dans leur liste d’ingrédients. Sur le papier, leur composition semble acceptable.',
      'Cependant, Mars ne certifie pas ses M&M’s halal et ne garantit pas ses chaînes de production pour un public musulman. Certaines éditions spéciales ou versions vendues dans d’autres pays ont pu contenir des additifs discutés (colorants, arômes). Le statut dépend donc du niveau d’exigence de chacun.',
      'En pratique : beaucoup de consommateurs musulmans les consomment sur la base de la composition affichée ; les plus prudents préfèrent des chocolats certifiés halal, nombreux en magasin oriental. Vérifiez toujours la liste d’ingrédients de l’édition que vous avez en main.',
    ],
    category: 'Produits',
    related: ['kinder-halal', 'haribo-halal', 'e120-halal'],
  },
  {
    slug: 'kinder-halal',
    question: 'Les Kinder sont-ils halal ?',
    verdict: '⚠️ Non certifiés',
    short:
      'La plupart des produits Kinder (Bueno, Surprise, Schoko-Bons) ne contiennent pas de gélatine, mais Ferrero ne les certifie pas halal.',
    answer: [
      'Les produits Kinder les plus connus — Bueno, Chocolat, Surprise, Schoko-Bons — n’affichent pas de gélatine ni d’ingrédient d’origine animale problématique dans leur composition européenne (lait, cacao, noisettes, sucre).',
      'Ferrero ne fait toutefois certifier aucun produit Kinder halal en Europe. Comme pour les M&M’s, c’est donc une question de niveau d’exigence : la composition est acceptable pour beaucoup, mais il n’y a pas de garantie d’organisme certificateur.',
      'À noter : dans certains pays musulmans, les mêmes produits Ferrero sont vendus avec certification halal locale. Si vous voyagez au Maroc, en Turquie ou aux Émirats, vous trouverez des Kinder certifiés. Vérifiez la composition exacte du produit local, elle peut varier d’un pays à l’autre.',
    ],
    category: 'Produits',
    related: ['mms-halal', 'haribo-halal', 'gelatine-halal'],
  },
  {
    slug: 'coca-cola-halal',
    question: 'Le Coca-Cola est-il halal ?',
    verdict: '✅ Généralement considéré halal',
    short:
      'Le Coca-Cola ne contient ni alcool ajouté ni ingrédient animal. Il est certifié halal dans plusieurs pays musulmans.',
    answer: [
      'Le Coca-Cola est régulièrement l’objet de rumeurs, mais sa composition ne contient ni alcool ajouté, ni ingrédient d’origine animale : eau gazéifiée, sucre, colorant caramel (E150d), acide phosphorique, arômes naturels, caféine.',
      'La question des traces infinitésimales d’alcool dans certains arômes (comme dans d’innombrables produits du commerce, jus de fruits compris) est considérée comme négligeable par la quasi-totalité des organismes : ces traces ne proviennent pas d’une boisson enivrante et sont indétectables à la consommation.',
      'Le Coca-Cola est d’ailleurs officiellement certifié halal dans plusieurs pays musulmans (Arabie saoudite, Émirats, Malaisie…) où il est produit localement. La grande majorité des savants et des consommateurs le considèrent donc permis.',
    ],
    category: 'Produits',
    related: ['red-bull-halal', 'levure-biere-halal'],
  },
  {
    slug: 'red-bull-halal',
    question: 'Le Red Bull est-il halal ?',
    verdict: '✅ Généralement considéré halal',
    short:
      'Le Red Bull ne contient pas d’alcool et sa taurine est 100 % synthétique (pas d’origine animale). Il est généralement considéré halal.',
    answer: [
      'Deux idées reçues circulent sur le Red Bull : qu’il contiendrait de l’alcool (faux — c’est une boisson sans alcool) et que sa taurine serait extraite de taureaux (faux — la taurine utilisée est entièrement synthétique, produite en laboratoire).',
      'Sa composition (eau gazéifiée, sucre, taurine synthétique, caféine, vitamines B) ne pose pas de problème du point de vue halal, et la boisson est vendue librement dans les pays du Golfe, souvent avec certification locale.',
      'Restent les considérations de santé : les boissons énergisantes sont déconseillées aux enfants et en grande quantité — mais c’est une question de santé, pas de licéité. Verdict : généralement considéré halal.',
    ],
    category: 'Produits',
    related: ['coca-cola-halal', 'levure-biere-halal'],
  },
  {
    slug: 'levure-biere-halal',
    question: 'La levure de bière est-elle halal ?',
    verdict: '✅ Halal',
    short:
      'La levure de bière est un micro-organisme non enivrant. Malgré son nom, elle est considérée halal par la quasi-totalité des avis.',
    answer: [
      'Son nom fait peur, mais la levure de bière (Saccharomyces cerevisiae) n’est pas de la bière : c’est un champignon microscopique, historiquement utilisé pour la fermentation de la bière, d’où son nom. Vendue en paillettes ou en compléments alimentaires, elle est riche en vitamines B.',
      'La levure elle-même ne contient pas d’alcool et ne peut pas enivrer. La levure dite « revivifiable » ou celle utilisée en boulangerie est cultivée sur des milieux sans rapport avec l’alcool. Elle est donc considérée halal par la quasi-totalité des savants.',
      'Seule nuance : certaines levures de bière « issues de brasserie » sont récupérées après le brassage. Même dans ce cas, elles sont lavées et séchées, et l’avis dominant reste la licéité. Les plus scrupuleux choisiront une levure « de culture pure », précisée sur l’étiquette.',
    ],
    category: 'Produits',
    related: ['vinaigre-halal', 'coca-cola-halal'],
  },

  // ─── ALIMENTATION ───────────────────────────────────────────────────────────
  {
    slug: 'viande-supermarche-halal',
    question: 'La viande de supermarché (non certifiée) est-elle halal ?',
    verdict: '❌ Non, sauf rayon certifié',
    short:
      'La viande standard des supermarchés ne respecte pas les conditions de l’abattage rituel. Seuls les produits certifiés halal le sont.',
    answer: [
      'Pour qu’une viande soit halal, l’animal doit être abattu selon des conditions précises : animal licite, saignée complète, invocation du nom d’Allah au moment de l’abattage. La filière standard française ne répond pas à ces exigences.',
      'Certains évoquent la permission de la « nourriture des Gens du Livre » (Coran 5:5), mais la grande majorité des savants contemporains considèrent que les méthodes industrielles actuelles (étourdissement pouvant tuer avant la saignée, absence d’invocation, saignée incomplète) ne correspondent pas à un abattage valide — l’avis dominant est donc que cette viande n’est pas halal.',
      'En pratique : privilégiez les boucheries halal et les rayons certifiés (AVS, ARGML, Achahada… les organismes n’ont pas tous le même niveau d’exigence — renseignez-vous). Pour le poisson, aucune certification n’est nécessaire.',
    ],
    category: 'Alimentation',
    related: ['poisson-fruits-de-mer-halal', 'restaurant-halal-paris', 'cuisine-alcool-halal'],
  },
  {
    slug: 'poisson-fruits-de-mer-halal',
    question: 'Le poisson et les fruits de mer sont-ils halal ?',
    verdict: '✅ Poisson : oui · ⚠️ Crustacés : selon l’école',
    short:
      'Le poisson est halal à l’unanimité, sans abattage rituel. Crevettes et fruits de mer : halal pour la majorité, débattus chez les hanafites.',
    answer: [
      'Le poisson est halal à l’unanimité des savants, et il ne nécessite aucun abattage rituel : « Vous est permise la chasse en mer et sa nourriture » (Coran 5:96). Vous pouvez donc manger du poisson partout, même dans un restaurant non halal (attention toutefois aux modes de cuisson : sauces au vin, fritures partagées avec des produits non halal…).',
      'Pour les fruits de mer (crevettes, crabes, moules, calamars…), trois écoles sur quatre — malikite, chafiite et hanbalite — les considèrent halal : tout ce qui vit exclusivement dans la mer est permis. L’école hanafite, elle, ne permet que le « samak » (poisson) : les crustacés et mollusques y sont déconseillés ou interdits selon les avis.',
      'En pratique : si vous suivez l’école hanafite, évitez crevettes et fruits de mer ; sinon, ils sont permis pour la majorité. Le thon, saumon, cabillaud, sardine… ne posent aucun problème pour personne.',
    ],
    category: 'Alimentation',
    related: ['viande-supermarche-halal', 'restaurant-halal-paris'],
  },
  {
    slug: 'cuisine-alcool-halal',
    question: 'Peut-on manger un plat cuisiné avec de l’alcool ?',
    verdict: '❌ Non pour la majorité',
    short:
      'Le vin ne s’évapore jamais totalement à la cuisson, et cuisiner avec du khamr est interdit pour la majorité des savants.',
    answer: [
      'Coq au vin, sauce au whisky, tiramisu à l’amaretto, moules au vin blanc… L’argument « l’alcool s’évapore à la cuisson » est scientifiquement faux : des mesures montrent qu’il reste de l’alcool même après plusieurs heures de cuisson (jusqu’à 5 % après 2h30 de mijotage).',
      'Surtout, pour la majorité des savants, la question n’est pas seulement la quantité résiduelle : il est interdit d’utiliser volontairement une boisson enivrante (khamr) dans la nourriture, quelle que soit la dose. Le plat cuisiné à l’alcool est donc à éviter.',
      'À distinguer des traces techniques involontaires (supports d’arômes industriels, fermentation naturelle des jus de fruits…), considérées comme négligeables par la plupart des organismes de certification. Au restaurant, demandez toujours si la sauce contient du vin — c’est courant dans la cuisine française et italienne.',
    ],
    category: 'Alimentation',
    related: ['vinaigre-halal', 'viande-supermarche-halal', 'restaurant-halal-paris'],
  },
  {
    slug: 'medicaments-gelules-halal',
    question: 'Les médicaments en gélules (gélatine) sont-ils halal ?',
    verdict: '⚠️ Permis en cas de nécessité',
    short:
      'Les gélules contiennent souvent de la gélatine animale. La nécessité médicale les rend permises ; des alternatives végétales existent.',
    answer: [
      'La plupart des gélules de médicaments et compléments alimentaires sont fabriquées en gélatine d’origine bovine ou porcine. La question inquiète beaucoup de patients musulmans.',
      'Le principe est clair : la préservation de la santé et de la vie prime. En cas de nécessité médicale, prendre un médicament en gélule est permis (règle de la darura), surtout s’il n’existe pas d’équivalent. Ne jamais interrompre un traitement pour cette raison sans avis médical.',
      'Pour les cas non urgents et les compléments : demandez à votre pharmacien une alternative en comprimé, ou des gélules végétales (HPMC, pullulan) de plus en plus courantes. Certains laboratoires précisent « gélatine de poisson » ou « gélule d’origine végétale » sur la boîte.',
    ],
    category: 'Pratique',
    related: ['gelatine-halal', 'e441-gelatine-halal'],
  },

  // ─── VOYAGE ─────────────────────────────────────────────────────────────────
  {
    slug: 'restaurant-halal-paris',
    question: 'Où manger halal à Paris ?',
    verdict: '🗺 Guide',
    short:
      'Paris est l’une des villes d’Europe les plus riches en restaurants halal : 11e, 18e, 10e… et une scène gastronomique halal en plein essor.',
    answer: [
      'Paris compte des centaines de restaurants halal, du grec de quartier à la gastronomie. Les zones les plus denses : le 11e arrondissement (Voltaire, Oberkampf) pour les burgers et la street food halal, le 18e (Barbès, La Chapelle) pour les cuisines maghrébine, africaine et indo-pakistanaise, le 10e (Faubourg Saint-Denis) pour la diversité, et l’Est parisien (19e, 20e) pour les valeurs sûres familiales.',
      'La scène halal parisienne explose : steakhouses premium, cuisine française revisitée halal, brunchs, japonais et coréens halal… Les nouvelles adresses ouvrent chaque mois.',
      'Le bon réflexe : ne vous fiez pas au simple mot « halal » en vitrine. Vérifiez le certificat affiché (organisme, date de validité) ou demandez-le — un restaurant sérieux le montre sans difficulté. C’est exactement ce que la carte VoyagesHalal vérifie pour vous, adresse par adresse.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-lyon', 'restaurant-halal-marseille', 'viande-supermarche-halal'],
  },
  {
    slug: 'restaurant-halal-lyon',
    question: 'Où manger halal à Lyon ?',
    verdict: '🗺 Guide',
    short:
      'À Lyon, cap sur la Guillotière et le 3e arrondissement : l’offre halal y est dense, du bouchon revisité aux tables orientales.',
    answer: [
      'Capitale de la gastronomie, Lyon a aussi une belle scène halal. Le quartier de la Guillotière (7e arrondissement) est le cœur historique : boucheries, pâtisseries orientales et restaurants maghrébins et moyen-orientaux s’y succèdent. Le 3e (Part-Dieu, Montchat) et Villeurbanne complètent l’offre avec burgers, tacos français et tables familiales.',
      'On trouve désormais à Lyon des restaurants halal de spécialités variées : libanais, turc, indien, asiatique, et même des adresses qui revisitent la cuisine lyonnaise en version halal.',
      'Comme partout : vérifiez le certificat halal affiché et sa date, surtout pour la viande. Les adresses vérifiées de la région lyonnaise arrivent sur la carte VoyagesHalal.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-paris', 'restaurant-halal-marseille'],
  },
  {
    slug: 'restaurant-halal-marseille',
    question: 'Où manger halal à Marseille ?',
    verdict: '🗺 Guide',
    short:
      'Marseille est sans doute la ville de France où manger halal est le plus facile : Noailles, Belsunce et bien au-delà.',
    answer: [
      'À Marseille, le halal n’est pas une niche, c’est une évidence. Le marché de Noailles — « le ventre de Marseille » — et le quartier de Belsunce concentrent boucheries halal, rôtisseries, snacks et restaurants maghrébins et orientaux à petits prix.',
      'Au-delà du centre, l’offre s’étend dans presque tous les quartiers : pizzerias halal (la pizza marseillaise est une institution), grillades, cuisine comorienne et africaine, poissons du port. Beaucoup d’adresses familiales servent halal sans même l’afficher — c’est la norme du quartier.',
      'Conseil : pour la viande, les certificats restent le bon réflexe, même à Marseille. Et si vous visitez : combinez un couscous à Noailles, une balade au Vieux-Port et la Grande Mosquée — la carte VoyagesHalal vous géolocalise tout ça.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-paris', 'restaurant-halal-lyon', 'pays-voyage-halal'],
  },
  {
    slug: 'repas-halal-avion',
    question: 'Comment avoir un repas halal en avion ?',
    verdict: '✈️ Guide',
    short:
      'Demandez le repas « MOML » (Moslem Meal) au moins 48h avant le vol. Certaines compagnies servent 100 % halal d’office.',
    answer: [
      'La plupart des grandes compagnies aériennes proposent un repas musulman sur demande : c’est le code MOML (Moslem Meal), à sélectionner au moment de la réservation ou au plus tard 48h avant le départ, via le site, l’appli ou le service client de la compagnie.',
      'Certaines compagnies servent halal pour tous, sans rien demander : Emirates, Qatar Airways, Etihad, Turkish Airlines, Saudia, Royal Air Maroc, Tunisair, Air Algérie… Sur les compagnies européennes (Air France, Lufthansa…), le MOML doit être réservé à l’avance — il n’y en a pas à bord sinon.',
      'Astuces : sur les vols low-cost sans repas, emportez le vôtre (les sandwichs à bord sont rarement halal). Vérifiez les snacks (gélatine dans certains bonbons distribués). Et en cas de doute sur un plat servi : l’option végétarienne (VLML) est le plan B classique.',
    ],
    category: 'Voyage',
    related: ['pays-voyage-halal', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'pays-voyage-halal',
    question: 'Quels sont les meilleurs pays pour voyager halal ?',
    verdict: '✈️ Guide',
    short:
      'Malaisie, Turquie, Maroc, Émirats, Indonésie… le top des destinations où voyager halal est un plaisir sans effort.',
    answer: [
      'Les destinations où tout est halal par défaut : la Malaisie (Kuala Lumpur est probablement la capitale mondiale du halal food), l’Indonésie, la Turquie (Istanbul, Cappadoce), le Maroc, la Tunisie, le Qatar et les Émirats (Dubaï, Abu Dhabi) — restaurants halal partout, mosquées à chaque coin de rue, hôtels adaptés.',
      'Les destinations qui font des efforts remarquables : le Japon (guides halal officiels, salles de prière dans les aéroports et gares), Singapour (certification stricte MUIS), Londres (des milliers de restos halal), la Thaïlande et la Corée du Sud pour les plus aventuriers.',
      'Nos critères pour juger une destination : densité de restaurants halal vérifiés, accès aux mosquées, hôtels halal-friendly (sans alcool, petit-déjeuner halal), et facilité générale. C’est exactement ce que mesure le HalalScore ✦ de VoyagesHalal, ville par ville.',
    ],
    category: 'Voyage',
    related: ['repas-halal-avion', 'restaurant-halal-paris', 'ramadan-voyage-jeune'],
  },

  // ─── PRATIQUE ───────────────────────────────────────────────────────────────
  {
    slug: 'ramadan-voyage-jeune',
    question: 'Peut-on ne pas jeûner en voyage pendant le Ramadan ?',
    verdict: '🌙 Oui, avec rattrapage',
    short:
      'Le Coran accorde au voyageur la permission de reporter son jeûne et de rattraper les jours plus tard (Coran 2:185).',
    answer: [
      '« Quiconque est malade ou en voyage, alors un nombre égal d’autres jours » (Coran 2:185). Le voyageur bénéficie d’une facilité explicite : il peut ne pas jeûner pendant son déplacement et rattraper les jours manqués après le Ramadan.',
      'Les conditions habituelles retenues par les savants : un déplacement d’une distance significative (souvent estimée autour de 80 km et plus, avec des divergences), commencé avant l’aube pour certains avis. Jeûner en voyage reste valide et même préférable pour celui qui n’en éprouve pas de difficulté ; s’abstenir est préférable quand le voyage est éprouvant.',
      'Conseils pratiques si vous jeûnez en voyage : suivez les horaires du lieu où vous vous trouvez (pas ceux de départ), gardez dattes et eau dans le sac pour un iftar en déplacement, et anticipez les vols longs — en avion, on rompt le jeûne quand on voit le soleil se coucher depuis l’avion.',
    ],
    category: 'Pratique',
    related: ['horaires-priere-voyage', 'repas-halal-avion'],
  },
  {
    slug: 'horaires-priere-voyage',
    question: 'Comment gérer les prières en voyage ?',
    verdict: '🕌 Facilités du voyageur',
    short:
      'Le voyageur peut raccourcir les prières de 4 unités à 2 (qasr) et, selon les écoles, regrouper certaines prières (jam’).',
    answer: [
      'L’islam accorde au voyageur des facilités précieuses. Le raccourcissement (qasr) : les prières de 4 unités (dhuhr, asr, isha) se font en 2 unités pendant le voyage — une pratique confirmée du Prophète ﷺ. Le regroupement (jam’) : selon la majorité des écoles, le voyageur peut regrouper dhuhr avec asr, et maghrib avec isha, ce qui simplifie énormément les journées de visite ou de transport.',
      'Les horaires changent selon le lieu : recalez-vous dès l’arrivée sur les horaires locaux (applications, mosquée du quartier). Pour la direction de la qibla, la boussole du téléphone suffit, et la plupart des hôtels des pays musulmans l’indiquent au plafond ou dans un tiroir.',
      'Pensez aussi aux salles de prière : la plupart des grands aéroports (Istanbul, Dubaï, Kuala Lumpur, mais aussi Roissy) en ont une, souvent indiquée « Prayer room ». Un tapis de poche pliable dans le sac règle tous les autres cas.',
    ],
    category: 'Pratique',
    related: ['ramadan-voyage-jeune', 'pays-voyage-halal'],
  },
];

export function getQuestion(slug: string): QA | undefined {
  return QUESTIONS.find((q) => q.slug === slug);
}

export const CATEGORIES: Category[] = ['Additifs', 'Produits', 'Alimentation', 'Voyage', 'Pratique'];
