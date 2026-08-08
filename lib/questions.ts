// ─── Base de connaissances HalalGPT ───────────────────────────────────────────
//
// Chaque entrée devient une page SEO statique sur /q/[slug].
// C'est le trésor du projet : des réponses honnêtes, nuancées, en français,
// sur les questions halal les plus recherchées sur Google.
//
// Règle éditoriale : on présente les avis répandus (avec leurs divergences
// quand il y en a), on recommande la certification en cas de doute, et on ne
// délivre jamais de fatwa personnelle.

export type Category =
  | 'Additifs'
  | 'Produits'
  | 'Alimentation'
  | 'Ramadan'
  | 'Prière'
  | 'Vie quotidienne'
  | 'Voyage'
  | 'Destinations'
  | 'Pratique';

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
    category: 'Vie quotidienne',
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

  // ─── ADDITIFS (suite) ───────────────────────────────────────────────────────
  {
    slug: 'e330-halal',
    question: 'Le E330 (acide citrique) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'L’acide citrique (E330) est produit par fermentation de sucres végétaux. Il est halal — la rumeur contraire est un canular célèbre.',
    answer: [
      'Le E330, c’est l’acide citrique — celui du citron. Industriellement, il est produit par fermentation de sucres végétaux (mélasse, glucose) à l’aide d’un micro-organisme. Aucun ingrédient animal, aucun alcool : il est halal sans débat.',
      'Si ce code a mauvaise réputation, c’est à cause de la « liste de Villejuif », un canular des années 1970 qui classait le E330 parmi les additifs dangereux. Cette liste a été démentie mille fois, mais elle circule encore.',
      'On trouve le E330 dans les sodas, confitures, conserves et bonbons comme régulateur d’acidité. Côté halal comme côté santé aux doses alimentaires, il ne pose pas de problème.',
    ],
    category: 'Additifs',
    related: ['e621-glutamate-halal', 'lecithine-e322-halal', 'e120-halal'],
  },
  {
    slug: 'e621-glutamate-halal',
    question: 'Le E621 (glutamate) est-il halal ?',
    verdict: '✅ Généralement halal',
    short:
      'Le glutamate monosodique (E621) est produit par fermentation végétale. Il est généralement considéré halal.',
    answer: [
      'Le E621, ou glutamate monosodique (MSG), est l’exhausteur de goût des chips, nouilles instantanées, bouillons et plats préparés. Il est produit industriellement par fermentation de matières végétales (mélasse de betterave, canne, amidon).',
      'Ce procédé ne fait intervenir ni ingrédient animal ni alcool : le E621 est considéré halal par les organismes de certification. Les débats qui l’entourent concernent la santé (sensibilité de certaines personnes, envie de manger davantage), pas la licéité.',
      'Attention en revanche à ses voisins : le E621 est souvent accompagné des E631 et E627, qui eux peuvent être d’origine animale. C’est le trio classique des snacks aromatisés — vérifiez plutôt ces deux-là.',
    ],
    category: 'Additifs',
    related: ['e631-e627-halal', 'chips-halal', 'e330-halal'],
  },
  {
    slug: 'lecithine-e322-halal',
    question: 'La lécithine E322 est-elle halal ?',
    verdict: '✅ Généralement halal',
    short:
      'La lécithine (E322) utilisée en Europe est presque toujours issue du soja ou du tournesol : halal. La version issue d’œuf l’est aussi.',
    answer: [
      'La lécithine E322 est l’émulsifiant du chocolat, des margarines et de nombreuses pâtisseries. Dans l’industrie européenne, elle est presque toujours extraite du soja ou du tournesol — deux sources végétales, halal sans condition.',
      'Elle peut aussi être issue du jaune d’œuf (mention « lécithine d’œuf »), également halal. Une lécithine d’origine animale autre est théoriquement possible mais rarissime en alimentaire.',
      'En pratique : « lécithine de soja » ou « lécithine de tournesol » sur l’étiquette = aucun souci. C’est l’un des additifs les plus tranquilles qui soient.',
    ],
    category: 'Additifs',
    related: ['e330-halal', 'e471-halal', 'nutella-halal'],
  },
  {
    slug: 'e631-e627-halal',
    question: 'Les E631 et E627 sont-ils halal ?',
    verdict: '⚠️ Ça dépend de la source',
    short:
      'Les exhausteurs E631 (inosinate) et E627 (guanylate) peuvent venir de poisson ou de levure (halal), mais parfois de viande non rituelle.',
    answer: [
      'Les E631 (inosinate disodique) et E627 (guanylate disodique) sont des exhausteurs de goût qui accompagnent souvent le glutamate dans les chips, nouilles instantanées et snacks aromatisés.',
      'Leur source varie : extraits de poisson (sardines) ou de levure — halal —, mais ils peuvent aussi être produits à partir de viande, y compris de porc dans certaines filières asiatiques. L’étiquette ne précise jamais l’origine.',
      'En pratique : sur un produit certifié halal, aucun souci. Sans certification, c’est le cas typique où contacter la marque (ou choisir des chips nature) est le plus simple. Les nouilles instantanées coréennes et japonaises non certifiées sont les plus concernées.',
    ],
    category: 'Additifs',
    related: ['e621-glutamate-halal', 'chips-halal', 'e471-halal'],
  },
  {
    slug: 'e920-halal',
    question: 'Le E920 (L-cystéine) est-il halal ?',
    verdict: '⚠️ Ça dépend de la source',
    short:
      'La L-cystéine (E920), utilisée dans les pains industriels, peut être extraite de plumes de canard ou produite par synthèse. Origine à vérifier.',
    answer: [
      'Le E920, ou L-cystéine, est un agent de traitement de la farine : il rend la pâte plus souple. On le trouve dans certains pains industriels, burgers, viennoiseries et biscottes.',
      'Le problème est sa source : la L-cystéine peut être produite par fermentation ou synthèse (halal), mais elle est aussi historiquement extraite de plumes de canard — un animal non abattu rituellement — ce qui fait débat parmi les savants. L’extraction à partir de cheveux humains est interdite en Europe pour l’alimentaire.',
      'En pratique : les boulangeries artisanales n’en utilisent presque jamais (la baguette de votre boulanger n’est pas concernée). Pour le pain industriel, privilégiez les références certifiées ou sans E920 dans la liste d’ingrédients.',
    ],
    category: 'Additifs',
    related: ['e471-halal', 'e904-halal', 'gelatine-halal'],
  },
  {
    slug: 'e904-halal',
    question: 'Le E904 (gomme-laque / shellac) est-il halal ?',
    verdict: '⚠️ Toléré par beaucoup, discuté',
    short:
      'Le E904 est une résine sécrétée par un insecte, utilisée pour faire briller bonbons et fruits. Beaucoup le tolèrent, certains l’évitent.',
    answer: [
      'Le E904, ou gomme-laque (shellac), est l’agent d’enrobage qui fait briller les dragées, certains bonbons, les pommes du supermarché et des comprimés. C’est une résine sécrétée par la cochenille asiatique, un insecte.',
      'La nuance avec le E120 : ici on ne broie pas l’insecte, on récolte sa sécrétion — comme le miel pour l’abeille. C’est pourquoi de nombreux savants le tolèrent. D’autres l’évitent par précaution, notamment dans l’école hanafite, plus stricte sur tout ce qui provient des insectes.',
      'En pratique : c’est un additif « zone grise » assumée. Si vous suivez un avis strict, évitez-le ; sinon, la position tolérante est répandue et argumentée. Les produits certifiés halal tranchent la question pour vous.',
    ],
    category: 'Additifs',
    related: ['e120-halal', 'e920-halal', 'gelatine-halal'],
  },

  // ─── PRODUITS (suite) ───────────────────────────────────────────────────────
  {
    slug: 'nutella-halal',
    question: 'Le Nutella est-il halal ?',
    verdict: '⚠️ Non certifié (composition sans souci)',
    short:
      'Le Nutella ne contient ni gélatine, ni alcool, ni ingrédient animal problématique — mais il n’est pas certifié halal en Europe.',
    answer: [
      'La composition du Nutella vendu en France est courte : sucre, huile de palme, noisettes, cacao, lait écrémé en poudre, lécithines (soja ou tournesol), vanilline. Aucune gélatine, aucun alcool, aucun ingrédient carné.',
      'Ferrero ne certifie pas le Nutella halal en Europe — comme pour les Kinder, c’est donc une question de niveau d’exigence : la grande majorité des consommateurs musulmans le consomment sur la base de sa composition, les plus stricts préfèrent une pâte à tartiner certifiée.',
      'À noter : dans plusieurs pays musulmans (Turquie, Maroc, Golfe), le Nutella produit localement porte une certification halal officielle. Même recette, tampon en plus.',
    ],
    category: 'Produits',
    related: ['kinder-halal', 'lecithine-e322-halal', 'mms-halal'],
  },
  {
    slug: 'mcdo-halal',
    question: 'McDonald’s est-il halal en France ?',
    verdict: '❌ Non en France',
    short:
      'En France, la viande servie chez McDonald’s n’est pas halal. Dans les pays musulmans en revanche, McDo est certifié halal.',
    answer: [
      'La position de McDonald’s France est claire et publique : aucune viande halal dans ses restaurants. Burgers au bœuf comme au poulet proviennent de filières standard — ils ne sont donc pas halal.',
      'Ce qui reste possible en France pour beaucoup : le Filet-O-Fish (poisson) et les frites (huile végétale), selon votre niveau d’exigence sur les cuissons partagées et les sauces. Les plus stricts s’abstiennent complètement.',
      'En voyage, la situation change du tout au tout : au Maroc, en Turquie, aux Émirats, en Malaisie… McDonald’s est intégralement certifié halal. Le Big Mac de Marrakech est halal, celui de Paris ne l’est pas.',
    ],
    category: 'Produits',
    related: ['kfc-halal', 'poisson-fruits-de-mer-halal', 'restaurant-halal-paris'],
  },
  {
    slug: 'kfc-halal',
    question: 'KFC est-il halal en France ?',
    verdict: '❌ Non en France',
    short:
      'Le poulet servi par KFC France n’est pas halal. Comme McDo, KFC est en revanche certifié halal dans les pays musulmans.',
    answer: [
      'KFC France ne propose pas de poulet halal : la marque s’approvisionne en filière standard et l’indique dans sa FAQ officielle. Les rumeurs de « KFC halal » en France concernent des enseignes concurrentes qui imitent le concept, pas KFC lui-même.',
      'Au Royaume-Uni, une centaine de restaurants KFC sont officiellement halal (liste publiée par la marque) — c’est de là que vient la confusion. Et dans les pays musulmans (Maroc, Égypte, Golfe, Asie du Sud-Est), KFC est intégralement halal.',
      'La bonne nouvelle pour les amateurs de poulet frit en France : les alternatives halal ne manquent pas — c’est même l’un des segments les plus dynamiques de la restauration halal française. La carte VoyagesHalal vous en géolocalise près de chez vous.',
    ],
    category: 'Produits',
    related: ['mcdo-halal', 'restaurant-halal-paris', 'viande-supermarche-halal'],
  },
  {
    slug: 'chewing-gum-halal',
    question: 'Les chewing-gums sont-ils halal ?',
    verdict: '⚠️ Souvent oui, à vérifier',
    short:
      'La plupart des chewing-gums sont sans gélatine, mais certains contiennent de la gélatine ou une glycérine d’origine douteuse.',
    answer: [
      'La base des chewing-gums modernes est une gomme synthétique — pas de problème halal. Les points à surveiller sont ailleurs : la glycérine (E422) utilisée comme humectant, dont l’origine peut être animale, et la gélatine, présente dans certains dragéifiés et bonbons gélifiés à mâcher.',
      'Les grandes marques vendues en France (menthe classique) sont majoritairement sans gélatine — vérifiez simplement la liste d’ingrédients : si « gélatine » n’apparaît pas, il reste la question de la glycérine, généralement végétale aujourd’hui.',
      'Réflexe simple : liste d’ingrédients courte sans gélatine = généralement OK ; en cas de doute sur un produit consommé quotidiennement, un message à la marque ou un chewing-gum certifié règle la question.',
    ],
    category: 'Produits',
    related: ['e422-glycerine-halal', 'gelatine-halal', 'haribo-halal'],
  },
  {
    slug: 'glace-halal',
    question: 'Les glaces sont-elles halal ?',
    verdict: '⚠️ Souvent oui, à vérifier',
    short:
      'Beaucoup de glaces sont halal, mais attention à trois pièges : la gélatine, les arômes alcoolisés et le E471 d’origine inconnue.',
    answer: [
      'Une glace, c’est du lait, de la crème, du sucre et des arômes — rien de problématique sur le principe. Trois pièges reviennent pourtant : la gélatine (dans certaines glaces industrielles et toppings type marshmallow), l’alcool (parfums rhum-raisin, tiramisu, ou « extrait de vanille » sur support alcoolique), et les émulsifiants E471/E472 dont l’origine n’est pas précisée.',
      'Les sorbets sont généralement les plus sûrs (fruits, eau, sucre). Pour les crèmes glacées industrielles, un coup d’œil à la liste d’ingrédients suffit dans la plupart des cas : sans gélatine ni alcool affichés, la majorité des consommateurs considèrent que c’est bon.',
      'Chez le glacier artisanal, demandez simplement : les parfums alcoolisés sont toujours signalés, et beaucoup d’artisans travaillent sans gélatine. Il existe aussi des marques de glaces certifiées halal en magasin oriental.',
    ],
    category: 'Produits',
    related: ['gelatine-halal', 'e471-halal', 'cuisine-alcool-halal'],
  },
  {
    slug: 'chips-halal',
    question: 'Les chips sont-elles halal ?',
    verdict: '⚠️ Nature oui, aromatisées à vérifier',
    short:
      'Les chips nature (pomme de terre, huile, sel) sont halal. Les versions aromatisées peuvent contenir E631/E627 ou des arômes d’origine animale.',
    answer: [
      'Les chips nature sont l’un des snacks les plus simples qui soient : pommes de terre, huile végétale, sel. Halal sans discussion.',
      'Les choses se compliquent avec les versions aromatisées : les exhausteurs E631/E627 (origine parfois animale), les arômes « fromage » (question de la présure), et les saveurs type « bacon » — qui, ironie de l’industrie, sont presque toujours des arômes végétaux/fumée, mais méritent vérification au cas par cas.',
      'Réflexe pratique : nature, vinaigre ou paprika « sans arôme animal » = tranquille ; saveurs fromagères ou carnées sans certification = vérifiez la liste ou passez votre chemin. Les rayons orientaux regorgent de chips aromatisées certifiées halal.',
    ],
    category: 'Produits',
    related: ['e631-e627-halal', 'e621-glutamate-halal', 'fromage-presure-halal'],
  },

  // ─── ALIMENTATION (suite) ───────────────────────────────────────────────────
  {
    slug: 'sauce-soja-halal',
    question: 'La sauce soja est-elle halal ?',
    verdict: '⚠️ Ça dépend du type',
    short:
      'La sauce soja fermentée naturellement contient 1 à 3 % d’alcool résiduel — avis partagés. Des versions sans alcool existent.',
    answer: [
      'Surprise pour beaucoup : la sauce soja traditionnelle (type shoyu japonais) contient 1 à 3 % d’alcool, produit naturellement pendant la fermentation du soja et du blé. Ce n’est pas un ajout, c’est le procédé lui-même.',
      'Les avis divergent : certains savants l’interdisent (présence d’alcool mesurable), d’autres la tolèrent car cet alcool de fermentation n’est pas du khamr destiné à enivrer et la sauce ne peut pas soûler. Les organismes de certification asiatiques (JAKIM en Malaisie notamment) certifient halal les sauces soja produites sans fermentation alcoolisée ou traitées pour l’éliminer.',
      'En pratique : si vous voulez éviter le débat, cherchez une sauce soja certifiée halal (épiceries asiatiques et orientales en proposent) ou les versions « hydrolysées » sans fermentation. Au restaurant japonais, c’est le même arbitrage que pour le mirin — posez la question.',
    ],
    category: 'Alimentation',
    related: ['vinaigre-halal', 'cuisine-alcool-halal', 'voyage-halal-tokyo'],
  },
  {
    slug: 'moutarde-halal',
    question: 'La moutarde est-elle halal ?',
    verdict: '✅ Généralement, sauf « au vin blanc »',
    short:
      'La moutarde de Dijon classique (graines, vinaigre, eau, sel) est halal. Attention aux variantes « au vin blanc ».',
    answer: [
      'La moutarde de Dijon classique est fabriquée avec des graines de moutarde, du vinaigre, de l’eau et du sel. Le vinaigre étant halal pour la majorité des savants, la moutarde classique l’est aussi.',
      'Le piège : certaines recettes — notamment des moutardes « à l’ancienne » premium ou des spécialités régionales — remplacent une partie du vinaigre par du vin blanc, clairement mentionné dans les ingrédients. Celles-ci sont à éviter.',
      'Réflexe : deux secondes sur la liste d’ingrédients. « Vinaigre » = OK, « vin blanc » = on repose. La moutarde des grandes marques en version classique est dans le premier cas.',
    ],
    category: 'Alimentation',
    related: ['vinaigre-halal', 'cuisine-alcool-halal', 'bouillon-cube-halal'],
  },
  {
    slug: 'bouillon-cube-halal',
    question: 'Les bouillons cubes sont-ils halal ?',
    verdict: '⚠️ Ça dépend — versions halal disponibles',
    short:
      'Les bouillons cubes classiques peuvent contenir des graisses et extraits de viande non halal. Des gammes certifiées existent partout.',
    answer: [
      'Les bouillons cubes classiques (bœuf, volaille) contiennent souvent des graisses et des extraits de viande issus de filières standard — donc non halal. Même les versions « légumes » peuvent contenir des graisses animales ou des arômes ambigus.',
      'La solution est simple car le marché a suivi : la plupart des grandes marques proposent des gammes certifiées halal (logo sur la boîte), très présentes en grande surface et incontournables en épicerie orientale.',
      'Réflexe : cherchez le logo halal sur l’emballage — c’est l’un des produits où la certification est la plus répandue. Pour les bouillons de légumes sans certification, vérifiez « graisse végétale » dans la liste.',
    ],
    category: 'Alimentation',
    related: ['viande-supermarche-halal', 'moutarde-halal', 'e621-glutamate-halal'],
  },

  // ─── PRATIQUE (suite) ───────────────────────────────────────────────────────
  {
    slug: 'parfum-alcool-halal',
    question: 'Le parfum contenant de l’alcool est-il halal ?',
    verdict: '✅ Permis pour la majorité',
    short:
      'Se parfumer avec un parfum à l’alcool est permis pour la majorité des savants contemporains : il n’est ni bu, ni enivrant à l’usage.',
    answer: [
      'La quasi-totalité des parfums contiennent de l’alcool dénaturé comme support. La question de leur licéité revient sans cesse — et la réponse majoritaire est rassurante.',
      'Pour la majorité des savants contemporains, l’interdiction du khamr concerne sa consommation ; l’alcool cosmétique, non destiné à être bu, impropre à l’ivresse par usage externe, est permis. Un avis plus strict (considérant l’alcool impur au toucher) existe, notamment dans certaines écoles — ses tenants utilisent les « musc » et parfums sans alcool, très répandus dans les boutiques musulmanes.',
      'En pratique : les deux positions se côtoient sereinement. Si vous préférez la précaution, les huiles parfumées sans alcool ne manquent pas ; sinon, l’avis permissif est solidement argumenté et largement suivi. La prière avec un vêtement parfumé à l’alcool est valide pour la majorité.',
    ],
    category: 'Vie quotidienne',
    related: ['vinaigre-halal', 'medicaments-gelules-halal', 'cuisine-alcool-halal'],
  },
  {
    slug: 'invocation-voyage',
    question: 'Quelle est l’invocation (dou’a) du voyageur ?',
    verdict: '🤲 La dou’a du voyage',
    short:
      'L’invocation du voyageur commence par « Subhâna-lladhî sakhkhara lanâ hâdhâ… » (Coran 43:13-14) — à dire en montant dans le véhicule.',
    answer: [
      'En montant en voiture, dans l’avion ou le train, le voyageur dit d’abord « Bismillah », puis l’invocation tirée du Coran (43:13-14) : « Subhâna-lladhî sakhkhara lanâ hâdhâ wa mâ kunnâ lahu muqrinîn, wa innâ ilâ rabbinâ la-munqalibûn » — « Gloire à Celui qui a mis ceci à notre service alors que nous n’étions pas capables de les dominer. Et c’est vers notre Seigneur que nous retournerons. »',
      'Le Prophète ﷺ ajoutait une demande pour le voyage : « Allahumma innâ nas’aluka fî safarinâ hâdhâ al-birra wa-t-taqwâ, wa mina-l-‘amali mâ tardâ » — « Ô Allah, nous Te demandons dans ce voyage la bonté et la piété, et des œuvres que Tu agrées » (rapporté par Muslim), avec la demande de facilité du trajet et de protection de la famille laissée derrière soi.',
      'Bonus du voyageur : sa dou’a est exaucée — le Prophète ﷺ a cité l’invocation du voyageur parmi celles qui ne sont pas repoussées. Profitez du trajet pour multiplier les invocations, pour vous et vos proches.',
    ],
    category: 'Pratique',
    related: ['horaires-priere-voyage', 'priere-avion', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'priere-avion',
    question: 'Comment prier dans l’avion ?',
    verdict: '🕌 Guide pratique',
    short:
      'Dans l’avion : debout vers la qibla si possible, sinon assis par nécessité — ou en regroupant les prières à l’arrivée selon les écoles.',
    answer: [
      'Première option, la meilleure quand elle est possible : prier debout, dans un espace libre de la cabine (près des offices, avec l’accord de l’équipage), orienté vers la qibla au début de la prière. Sur les compagnies du Golfe et Saudia, c’est courant — certains gros porteurs ont même un espace de prière.',
      'Si c’est impossible (turbulences, avion plein, consignes) : la prière assise à sa place est permise par nécessité, en inclinant le buste pour le rukû‘ et davantage pour le sujûd. Beaucoup de savants recommandent alors de refaire la prière à l’arrivée par précaution — d’autres la considèrent acquise.',
      'Troisième voie, souvent la plus simple : utiliser les facilités du voyageur et regrouper (dhuhr+asr, maghrib+isha) avant le décollage ou après l’atterrissage, quand le créneau horaire de la prière le permet. Les applications de prière donnent les horaires en vol ; en pratique, on suit l’horaire du lieu survolé — et pour la rupture du jeûne, le coucher du soleil vu depuis l’avion.',
    ],
    category: 'Pratique',
    related: ['horaires-priere-voyage', 'invocation-voyage', 'repas-halal-avion'],
  },

  // ─── VOYAGE — VILLES FRANÇAISES (suite) ─────────────────────────────────────
  {
    slug: 'restaurant-halal-lille',
    question: 'Où manger halal à Lille ?',
    verdict: '🗺 Guide',
    short:
      'À Lille, le quartier de Wazemmes et son marché sont le cœur du halal — et Roubaix-Tourcoing juste à côté complètent une offre très riche.',
    answer: [
      'Lille est l’une des villes les plus faciles de France pour manger halal. Le quartier de Wazemmes, avec son marché mythique (mardi, jeudi, dimanche), concentre boucheries halal, rôtisseries, pâtisseries orientales et restaurants à petits prix. Lille-Sud et Moulins complètent le tableau.',
      'La métropole joue aussi : Roubaix et Tourcoing, à quelques minutes de métro, ont une offre halal dense et familiale — couscous, grillades, spécialités du Maghreb et burgers halal nouvelle génération.',
      'Spécialité à tester en version halal : les friteries du Nord — plusieurs adressent désormais une carte 100 % halal. Comme toujours, vérifiez le certificat pour la viande, et retrouvez les adresses vérifiées de la métropole lilloise sur la carte VoyagesHalal.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-paris', 'restaurant-halal-strasbourg', 'restaurant-halal-toulouse'],
  },
  {
    slug: 'restaurant-halal-toulouse',
    question: 'Où manger halal à Toulouse ?',
    verdict: '🗺 Guide',
    short:
      'À Toulouse, cap sur Arnaud-Bernard, Saint-Cyprien et le Mirail : la ville rose a une offre halal généreuse et variée.',
    answer: [
      'À Toulouse, le quartier historique pour manger halal est Arnaud-Bernard, juste derrière la place du Capitole : restaurants maghrébins, orientaux et gargotes étudiantes s’y côtoient depuis des décennies. Saint-Cyprien, de l’autre côté de la Garonne, monte en puissance.',
      'Côté quartiers, Le Mirail, Bellefontaine et Empalot comptent de nombreuses boucheries et tables familiales, et la périphérie voit fleurir les enseignes de burgers, tacos et poulet frit halal qui font la réputation de la scène toulousaine.',
      'Le réflexe habituel s’applique : certificat affiché pour la viande, affluence locale comme meilleur indice de qualité. Les adresses vérifiées de la ville rose rejoignent progressivement la carte VoyagesHalal.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-marseille', 'restaurant-halal-lyon', 'restaurant-halal-lille'],
  },
  {
    slug: 'restaurant-halal-strasbourg',
    question: 'Où manger halal à Strasbourg ?',
    verdict: '🗺 Guide',
    short:
      'À Strasbourg, la gare, Neudorf et la Meinau concentrent l’offre halal — avec un bonus : les spécialités turques y sont excellentes.',
    answer: [
      'Strasbourg a une particularité savoureuse : sa forte communauté turque en fait l’une des meilleures villes de France pour les spécialités anatoliennes halal — lahmacun, pide, dürüm et grillades au charbon. Le secteur de la gare et le quartier de Neudorf en regorgent.',
      'La Meinau, Hautepierre et Cronenbourg complètent l’offre avec boucheries, pâtisseries orientales et tables familiales maghrébines. Le centre historique, très touristique, compte moins d’adresses halal — mieux vaut s’éloigner de deux ou trois rues de la cathédrale.',
      'Et pour goûter à l’Alsace en version halal : plusieurs restaurants proposent désormais tarte flambée et spécialités locales revisitées halal. Vérifiez les certificats comme partout — la Grande Mosquée de Strasbourg, plus grande de France, mérite aussi la visite.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-lille', 'restaurant-halal-lyon', 'restaurant-halal-paris'],
  },

  // ─── DESTINATIONS INTERNATIONALES ───────────────────────────────────────────
  {
    slug: 'voyage-halal-istanbul',
    question: 'Voyager halal à Istanbul : le guide',
    verdict: '✦ 8.9 — Très bon halal',
    short:
      'À Istanbul, tout est halal par défaut : kebabs, mosquées mythiques, adhan sur le Bosphore. La destination halal parfaite à 3h30 de Paris.',
    answer: [
      'Istanbul est probablement la meilleure « première destination halal » qui soit : quasiment toute la nourriture est halal par défaut, l’adhan rythme la journée, et les chefs-d’œuvre de l’islam — Mosquée Bleue, Sainte-Sophie, Süleymaniye — sont au cœur de la visite. Seul point de vigilance : l’alcool existe dans les zones touristiques (Taksim, Istiklal), sans jamais concerner la nourriture.',
      'Côté assiette : kebabs et köfte partout, balik ekmek (sandwich au poisson grillé) sur les quais d’Eminönü, petits-déjeuners turcs interminables, baklava et lokum. Le quartier de Fatih est le plus conservateur et 100 % halal ; Sultanahmet concentre les sites historiques.',
      'Conseils pratiques : traversez le Bosphore en ferry public (le plus beau « restaurant avec vue » de la ville coûte le prix d’un ticket), prévoyez les prières dans les grandes mosquées ouvertes aux visiteurs, et changez vos euros en ville plutôt qu’à l’aéroport. HalalScore VoyagesHalal : ✦ 8.9.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-dubai', 'voyage-halal-marrakech', 'repas-halal-avion'],
  },
  {
    slug: 'voyage-halal-dubai',
    question: 'Voyager halal à Dubaï : le guide',
    verdict: '✦ 9.0 — Excellence halal',
    short:
      'À Dubaï, le halal est la norme : restaurants du monde entier certifiés, mosquées spectaculaires, confort total pour les familles musulmanes.',
    answer: [
      'Dubaï coche toutes les cases du voyage halal sans effort : toute la restauration est halal par défaut (la ville applique une réglementation stricte), les salles de prière sont partout — jusque dans les centres commerciaux — et l’appel à la prière fait partie du décor. L’alcool existe dans les hôtels et certains restaurants licenciés : il suffit de les éviter si on préfère.',
      'Le grand luxe de Dubaï pour le voyageur musulman, c’est la variété : cuisine émiratie, libanaise, indienne, japonaise, italienne… toutes halal. Ne manquez pas le vieux Dubaï (souks de l’or et des épices, quartier Al Fahidi, traversée de la crique en abra) qui équilibre la démesure du Burj Khalifa et du Dubai Mall.',
      'Conseils : visitez la mosquée de Jumeirah (ouverte aux visiteurs avec visite guidée), prévoyez l’hiver (novembre-mars) pour un climat parfait, et le vendredi matin les horaires s’adaptent à la prière. HalalScore VoyagesHalal : ✦ 9.0.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-doha', 'voyage-halal-istanbul', 'repas-halal-avion'],
  },
  {
    slug: 'voyage-halal-kuala-lumpur',
    question: 'Voyager halal à Kuala Lumpur : le guide',
    verdict: '✦ 9.1 — Excellence halal',
    short:
      'Kuala Lumpur est la capitale mondiale de la halal food : certification JAKIM ultra-stricte, street food inoubliable, mosquées superbes.',
    answer: [
      'Si le halal food avait une capitale mondiale, ce serait Kuala Lumpur. La certification malaisienne JAKIM est la plus respectée au monde, affichée partout — des étals de rue aux grands restaurants — et la scène culinaire est prodigieuse : nasi lemak au petit-déjeuner, satay, laksa, roti canai à toute heure.',
      'La ville se visite facilement : tours Petronas, grottes de Batu, Masjid Negara (la mosquée nationale et son toit en étoile), quartier de Kampung Baru pour la cuisine malaise authentique. Chaque centre commercial a sa salle de prière (surau) — le confort religieux absolu.',
      'Conseils : KL est aussi la porte d’entrée idéale vers Langkawi et les îles ; la saison sèche va de mai à juillet ; et le taux de change rend la gastronomie incroyablement accessible. HalalScore VoyagesHalal : ✦ 9.1.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-bali', 'voyage-halal-doha', 'pays-voyage-halal'],
  },
  {
    slug: 'voyage-halal-marrakech',
    question: 'Voyager halal à Marrakech : le guide',
    verdict: '✦ 8.7 — Très bon halal',
    short:
      'Marrakech offre le dépaysement total à 3h de vol : tout est halal, la Koutoubia veille sur la médina, et la table marocaine est reine.',
    answer: [
      'Marrakech, c’est l’évidence halal à 3 heures de la France : toute la nourriture est halal, les mosquées structurent la ville — la Koutoubia en tête — et le rythme des prières fait partie de la vie. Le seul point d’attention concerne certains restaurants très touristiques et hôtels internationaux qui servent de l’alcool : facile à éviter.',
      'La table marocaine y est somptueuse : tanjia marrakchie (l’emblème local, cuite des heures dans les braises du hammam), couscous du vendredi, tajines, pastilla, et le théâtre permanent de Jemaa el-Fna le soir. Les jardins Majorelle, les palais Bahia et Badi, et les souks complètent le tableau.',
      'Conseils : négociez tout au souk (avec le sourire), préférez octobre-avril pour la chaleur, et pour un séjour au calme choisissez un riad dans la médina — la plupart sont tenus par des familles et servent une cuisine maison mémorable. HalalScore VoyagesHalal : ✦ 8.7.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-istanbul', 'voyage-halal-dubai', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'voyage-halal-londres',
    question: 'Voyager halal à Londres : le guide',
    verdict: '✦ 8.0 — Bon niveau halal',
    short:
      'Londres est la capitale halal de l’Occident : des milliers de restaurants, des quartiers musulmans historiques, à 2h30 de Paris.',
    answer: [
      'Aucune ville occidentale ne rivalise avec Londres sur le halal : on estime à plusieurs milliers les restaurants halal de la capitale britannique. Whitechapel et l’East End (autour de l’East London Mosque), Edgware Road (cuisine libanaise et du Golfe), Brick Lane (curry houses) et Green Street sont des mondes à explorer.',
      'La spécialité locale qui vaut le détour : le fried chicken halal, institution londonienne, et la scène des desserts (cookie dough, gelato halal) qui fait le bonheur des familles. Deux vigilances : les certifications varient (HMC est la plus stricte, HFA plus répandue) — les restaurants affichent laquelle ils suivent —, et le « halal » auto-proclamé existe comme partout.',
      'Conseils : l’Eurostar met Londres à 2h15 de Paris, les grandes mosquées (East London Mosque, Regent’s Park) accueillent chaleureusement les visiteurs, et les musées nationaux gratuits en font un city-trip familial idéal. HalalScore VoyagesHalal : ✦ 8.0.',
    ],
    category: 'Destinations',
    related: ['restaurant-halal-paris', 'voyage-halal-istanbul', 'repas-halal-avion'],
  },
  {
    slug: 'voyage-halal-tokyo',
    question: 'Voyager halal à Tokyo et au Japon : le guide',
    verdict: '✦ 7.0 — Possible avec préparation',
    short:
      'Le Japon s’ouvre au halal : ramen halal à Shinjuku, mosquée Tokyo Camii, salles de prière dans les gares. Magique, avec un peu de préparation.',
    answer: [
      'Voyager halal au Japon demande de la préparation — mais le pays fait des efforts remarquables : restaurants halal certifiés à Tokyo (le ramen halal de Shinjuku est devenu un pèlerinage gourmand), guides halal officiels des offices de tourisme, salles de prière dans les aéroports et grands magasins.',
      'Les pièges à connaître : le bouillon de porc (tonkotsu) omniprésent dans les ramen classiques, le mirin (alcool de cuisine) dans beaucoup de sauces, et la sauce soja fermentée. Les valeurs sûres : les restaurants certifiés, les sushis (poisson cru + riz — vérifiez juste le vinaigre de riz et évitez les sauces), et les enseignes végétariennes.',
      'À ne pas manquer : la mosquée Tokyo Camii à Yoyogi, joyau ottoman et plus grande mosquée du Japon, le quartier d’Asakusa, et un passage par les konbinis pour les snacks à composition simple. HalalScore VoyagesHalal : ✦ 7.0 — l’aventure en vaut largement la peine.',
    ],
    category: 'Destinations',
    related: ['sauce-soja-halal', 'voyage-halal-kuala-lumpur', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'voyage-halal-bali',
    question: 'Voyager halal à Bali : le guide',
    verdict: '✦ 7.2 — Facile avec les bons réflexes',
    short:
      'Bali est hindoue… dans le pays musulman le plus peuplé du monde : les warungs halal sont partout, il suffit de savoir les reconnaître.',
    answer: [
      'Le paradoxe balinais : l’île est à majorité hindoue, mais elle appartient à l’Indonésie — premier pays musulman du monde — et accueille énormément de voyageurs musulmans. Résultat : les restaurants halal y sont nombreux, il faut juste les identifier, car la spécialité locale la plus célèbre (babi guling, cochon de lait rôti) est précisément à éviter.',
      'Les bons réflexes : cherchez les mentions « warung muslim », « masakan Padang » (cuisine de Sumatra, halal par tradition — un régal) ou le logo halal MUI. Les zones de Kuta, Seminyak et Nusa Dua regorgent d’options halal, et beaucoup d’hôtels proposent un petit-déjeuner sans porc sur demande.',
      'Côté pratique : des mosquées existent dans toutes les zones touristiques (celle de Kuta est très accessible), les plages et rizières de Tegallalang se moquent de votre régime alimentaire, et un chauffeur-guide musulman — très courant — résout toutes les questions d’un coup. HalalScore VoyagesHalal : ✦ 7.2.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-kuala-lumpur', 'voyage-halal-tokyo', 'pays-voyage-halal'],
  },
  {
    slug: 'voyage-halal-doha',
    question: 'Voyager halal à Doha (Qatar) : le guide',
    verdict: '✦ 9.2 — Excellence halal',
    short:
      'Doha est l’une des destinations les plus confortables au monde pour un voyageur musulman : tout est halal, sûr, somptueux.',
    answer: [
      'Doha est peut-être la destination la plus « sans effort » du voyage halal : l’intégralité de la restauration est halal, la ville est l’une des plus sûres au monde, et la culture islamique y est mise en scène avec un raffinement rare — le Musée d’art islamique, posé sur sa presqu’île, vaut le voyage à lui seul.',
      'Les incontournables : le Souq Waqif le soir (grillades, cafés, fauconnerie), la Corniche au coucher du soleil, le quartier culturel de Katara, et l’île artificielle de The Pearl. La cuisine qatarie (machbous, luqaimat) se découvre aux côtés de toutes les gastronomies du monde en version halal.',
      'L’astuce voyageur : Qatar Airways étant l’un des meilleurs hubs mondiaux, Doha se glisse parfaitement en escale longue (stopover organisé par la compagnie, visa simple) sur la route de l’Asie — deux voyages pour le prix d’un. Évitez juin-septembre et sa chaleur extrême. HalalScore VoyagesHalal : ✦ 9.2.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-dubai', 'voyage-halal-kuala-lumpur', 'repas-halal-avion'],
  },

  // ─── ADDITIFS (vague 3 — les « faciles » très recherchés) ───────────────────
  {
    slug: 'e100-halal',
    question: 'Le E100 (curcumine) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le E100 est la curcumine, le colorant jaune du curcuma. Origine végétale : halal sans débat.',
    answer: [
      'Le E100 est la curcumine, extraite du curcuma — l’épice jaune des currys. On la retrouve comme colorant dans les moutardes, bouillons, produits laitiers et confiseries.',
      'Origine 100 % végétale, aucun solvant problématique dans les procédés standards : le E100 est halal, et c’est l’avis unanime des organismes de certification.',
      'C’est l’un des colorants les plus « propres » du marché — quand un produit l’utilise à la place du E120 (cochenille), c’est bon signe pour le consommateur musulman.',
    ],
    category: 'Additifs',
    related: ['e120-halal', 'e133-halal', 'e150d-halal'],
  },
  {
    slug: 'e133-halal',
    question: 'Le E133 (bleu brillant) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le E133 est un colorant bleu entièrement synthétique, sans ingrédient animal : il est considéré halal.',
    answer: [
      'Le E133, ou bleu brillant FCF, colore bonbons bleus, glaces « Schtroumpf », boissons et glaçages. C’est un colorant de synthèse, fabriqué en laboratoire à partir de dérivés pétrochimiques.',
      'Aucune matière animale, aucun alcool : le E133 est considéré halal par les organismes de certification. Comme pour beaucoup de colorants azoïques, les discussions le concernant relèvent de la santé (hyperactivité débattue chez l’enfant), pas de la licéité.',
      'Il figure d’ailleurs couramment dans des confiseries certifiées halal — la couleur bleue de vos bonbons halal préférés, c’est probablement lui.',
    ],
    category: 'Additifs',
    related: ['e100-halal', 'e120-halal', 'haribo-halal'],
  },
  {
    slug: 'e150d-halal',
    question: 'Le E150d (caramel) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le E150d est le colorant caramel des sodas, obtenu en chauffant des sucres. Il est halal.',
    answer: [
      'Le E150d, ou caramel au sulfite d’ammonium, est le colorant brun des colas et de nombreuses sauces. Il est produit en chauffant des sucres d’origine végétale en présence de composés sulfités et ammoniacaux.',
      'Tout le procédé est minéral et végétal : pas d’ingrédient animal, pas d’alcool. Le E150d est halal — c’est notamment lui qui colore le Coca-Cola, certifié halal dans de nombreux pays.',
      'Même conclusion pour ses cousins E150a, E150b et E150c : les quatre caramels colorants sont considérés halal.',
    ],
    category: 'Additifs',
    related: ['coca-cola-halal', 'e100-halal', 'e330-halal'],
  },
  {
    slug: 'e250-nitrite-halal',
    question: 'Le E250 (nitrite de sodium) est-il halal ?',
    verdict: '✅ Halal (débat santé, pas religieux)',
    short:
      'Le E250 est un sel minéral utilisé dans la charcuterie, y compris halal. Religieusement sans problème ; le débat le concernant est sanitaire.',
    answer: [
      'Le E250, nitrite de sodium, est le conservateur emblématique de la charcuterie : il empêche le développement de la bactérie du botulisme et donne leur couleur rosée aux produits. C’est un sel minéral de synthèse — aucune origine animale.',
      'Religieusement, il est donc halal, et on le retrouve d’ailleurs dans la plupart des charcuteries halal industrielles (blanc de dinde, saucisson halal…). La vraie question qui l’entoure est sanitaire : sa consommation excessive est débattue, et certaines marques — halal comprises — développent des gammes « sans nitrite ».',
      'À retenir : voir E250 sur une charcuterie halal certifiée n’enlève rien à sa licéité. Si vous souhaitez l’éviter, c’est un choix santé, comme pour tout consommateur.',
    ],
    category: 'Additifs',
    related: ['viande-supermarche-halal', 'e330-halal', 'bouillon-cube-halal'],
  },
  {
    slug: 'e407-carraghenane-halal',
    question: 'Le E407 (carraghénane) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le carraghénane (E407) est extrait d’algues rouges. C’est un gélifiant végétal, halal — et une excellente alternative à la gélatine.',
    answer: [
      'Le E407, ou carraghénane, est un gélifiant extrait d’algues rouges récoltées principalement en Asie du Sud-Est. On le trouve dans les flans, desserts lactés, laits végétaux et même certaines confiseries.',
      'Origine marine et végétale : il est halal sans discussion, toutes écoles confondues. C’est précisément l’un des trois gélifiants (avec la pectine E440 et l’agar-agar E406) qui permettent de fabriquer bonbons et desserts sans gélatine animale.',
      'Réflexe utile : un « flan » ou une panna cotta industrielle au E407 plutôt qu’à la gélatine est un produit tranquille pour le consommateur musulman.',
    ],
    category: 'Additifs',
    related: ['gelatine-halal', 'e440-pectine-halal', 'e415-xanthane-halal'],
  },
  {
    slug: 'e415-xanthane-halal',
    question: 'Le E415 (gomme xanthane) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'La gomme xanthane (E415) est produite par fermentation de sucres végétaux. Elle est halal.',
    answer: [
      'Le E415, la gomme xanthane, est l’épaississant chouchou de l’industrie (sauces, dressings, glaces, pâtisserie sans gluten). Elle est produite par fermentation de sucres d’origine végétale par une bactérie, puis purifiée et séchée.',
      'Le procédé ne fait intervenir ni matière animale ni alcool résiduel dans le produit fini : la gomme xanthane est considérée halal par les organismes de certification.',
      'Même famille tranquille : la gomme guar (E412, graine végétale) et la gomme arabique (E414, sève d’acacia) — toutes halal. Les « gommes » alimentaires sont globalement un rayon sans piège.',
    ],
    category: 'Additifs',
    related: ['e407-carraghenane-halal', 'e440-pectine-halal', 'e330-halal'],
  },
  {
    slug: 'e440-pectine-halal',
    question: 'Le E440 (pectine) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'La pectine (E440) est extraite de fruits — pommes et agrumes. C’est LE gélifiant halal des confitures et bonbons sans gélatine.',
    answer: [
      'Le E440, la pectine, est extraite des pépins et peaux de pommes et d’agrumes. C’est elle qui fait « prendre » les confitures — et de plus en plus de bonbons « sans gélatine ».',
      'Origine 100 % fruitière : halal à l’unanimité. Quand un paquet de bonbons affiche « pectine » à la place de « gélatine », c’est le signal que cherchent tous les consommateurs musulmans en rayon confiserie.',
      'Astuce courses : les bonbons végans utilisent par définition pectine, amidon ou agar-agar plutôt que la gélatine — le rayon végan est un allié inattendu du consommateur halal (vérifiez juste l’absence d’arômes alcoolisés).',
    ],
    category: 'Additifs',
    related: ['gelatine-halal', 'haribo-halal', 'e407-carraghenane-halal'],
  },
  {
    slug: 'e466-halal',
    question: 'Le E466 (CMC) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le E466 (carboxyméthylcellulose) est fabriqué à partir de cellulose végétale. Il est halal.',
    answer: [
      'Le E466, ou carboxyméthylcellulose (CMC), est un épaississant et stabilisant dérivé de la cellulose — la fibre des plantes et du bois. On le croise dans les glaces, sauces, produits de boulangerie et même le dentifrice.',
      'Sa matière première est exclusivement végétale et son procédé de fabrication chimique n’implique aucun dérivé animal : le E466 est halal.',
      'La famille des celluloses (E460 à E469) est logée à la même enseigne : toutes d’origine végétale, toutes halal. Un rayon de plus où vous pouvez lire l’étiquette sereinement.',
    ],
    category: 'Additifs',
    related: ['e415-xanthane-halal', 'e471-halal', 'e330-halal'],
  },

  // ─── PRODUITS (vague 3 — les marques stars de Google) ───────────────────────
  {
    slug: 'oreo-halal',
    question: 'Les Oreo sont-ils halal ?',
    verdict: '⚠️ Non certifiés (composition sans gélatine)',
    short:
      'Les Oreo vendus en Europe ne contiennent ni gélatine ni ingrédient animal (hors traces de lait), mais ne sont pas certifiés halal.',
    answer: [
      'La composition des Oreo européens est simple : farine, sucre, huiles végétales, cacao, amidon, levure chimique, émulsifiants (lécithines). Pas de gélatine, pas de graisse animale — Mondelez l’a confirmé publiquement pour le marché européen.',
      'La marque précise cependant que les Oreo ne sont « pas certifiés halal » : pas d’audit d’organisme, pas de garantie sur les chaînes de production. C’est le même cas de figure que Nutella ou Kinder — acceptable pour la plupart sur la base de la composition, écarté par les plus stricts.',
      'En voyage, vous trouverez des Oreo certifiés halal dans les pays musulmans (production locale ou importée certifiée). Même biscuit, tampon en plus.',
    ],
    category: 'Produits',
    related: ['nutella-halal', 'kinder-halal', 'mms-halal'],
  },
  {
    slug: 'pringles-halal',
    question: 'Les Pringles sont-elles halal ?',
    verdict: '⚠️ Selon le parfum',
    short:
      'Les Pringles Original sont généralement considérées sans souci ; les parfums fromagers et carnés demandent vérification.',
    answer: [
      'Les Pringles Original (pomme de terre, huiles, farines, sel) ne contiennent pas d’ingrédient animal problématique : elles sont généralement considérées acceptables, bien que non certifiées.',
      'Les parfums aromatisés sont plus délicats : les versions fromagères (Sour Cream & Onion, Cheese) posent la question de la présure et des arômes lactés, et certains parfums contiennent les exhausteurs E631/E627 dont l’origine varie. Aucun parfum vendu en France ne contient officiellement de porc, mais l’origine exacte des arômes n’est pas détaillée.',
      'Réflexe : Original = tranquille pour la plupart ; parfums aromatisés = liste d’ingrédients, et dans le doute les marques de chips certifiées halal des épiceries orientales imitent tous ces goûts.',
    ],
    category: 'Produits',
    related: ['chips-halal', 'e631-e627-halal', 'doritos-halal'],
  },
  {
    slug: 'snickers-mars-twix-halal',
    question: 'Snickers, Mars et Twix sont-ils halal ?',
    verdict: '⚠️ Non certifiés (sans gélatine en Europe)',
    short:
      'Les barres Mars, Snickers et Twix vendues en Europe ne contiennent pas de gélatine, mais ne sont pas certifiées halal.',
    answer: [
      'Bonne nouvelle d’abord : les recettes européennes des barres Snickers, Mars, Twix et Bounty ne contiennent pas de gélatine. Leurs ingrédients : chocolat, caramel (sucre, lait), cacahuètes, nougat — dont le blanc d’œuf, parfaitement halal.',
      'Comme pour les M&M’s (même groupe Mars), aucune certification halal n’existe en Europe : la composition est acceptable pour la plupart des consommateurs musulmans, sans garantie d’organisme pour les plus exigeants.',
      'Vigilance voyage : les recettes varient selon les continents — certaines confiseries du groupe ont contenu de la gélatine sur d’autres marchés. Lisez l’étiquette locale, ou profitez des versions certifiées vendues dans les pays musulmans.',
    ],
    category: 'Produits',
    related: ['mms-halal', 'kinder-halal', 'gelatine-halal'],
  },
  {
    slug: 'monster-halal',
    question: 'Le Monster Energy est-il halal ?',
    verdict: '✅ Généralement considéré halal',
    short:
      'Comme le Red Bull, le Monster ne contient pas d’alcool et sa taurine est synthétique. Il est généralement considéré halal.',
    answer: [
      'Le Monster Energy suscite les mêmes questions que le Red Bull — et les réponses sont les mêmes : pas d’alcool dans la recette, et une taurine entièrement synthétique, produite en laboratoire sans aucune origine animale.',
      'Sa composition (eau gazéifiée, sucre, taurine, caféine, ginseng, vitamines B, arômes) ne contient pas d’ingrédient problématique. Il est vendu librement dans les pays du Golfe et considéré halal par la plupart des avis, sans certification systématique en Europe.',
      'Le vrai sujet est sanitaire : très forte teneur en caféine et en sucre, déconseillé aux jeunes — une question de santé, pas de licéité. À consommer avec la même modération que n’importe quel énergisant.',
    ],
    category: 'Produits',
    related: ['red-bull-halal', 'coca-cola-halal', 'e330-halal'],
  },
  {
    slug: 'doritos-halal',
    question: 'Les Doritos sont-ils halal ?',
    verdict: '⚠️ Selon le parfum',
    short:
      'Les Doritos Nature sont sans souci ; les parfums fromagers (Nacho Cheese) posent les questions habituelles de présure et d’arômes.',
    answer: [
      'Les Doritos sont des chips de maïs : la base (maïs, huile végétale, sel) est halal sans discussion, et la version Nature l’illustre.',
      'Les parfums stars — Nacho Cheese en tête — ajoutent fromage en poudre (question de la présure), arômes et parfois des exhausteurs E621/E631. Aucun ingrédient porcin dans les versions françaises, mais l’origine de la présure et des arômes n’est pas précisée : c’est la zone grise classique des snacks fromagers non certifiés.',
      'Comme pour les Pringles : Nature = OK, parfums = à vérifier selon votre exigence, et les épiceries orientales débordent de tortilla chips certifiées halal aux mêmes saveurs.',
    ],
    category: 'Produits',
    related: ['pringles-halal', 'chips-halal', 'fromage-presure-halal'],
  },
  {
    slug: 'yaourt-halal',
    question: 'Les yaourts sont-ils halal ?',
    verdict: '✅ Nature oui — desserts lactés à vérifier',
    short:
      'Les yaourts nature sont halal (lait + ferments). Attention en revanche à la gélatine dans certains desserts lactés et mousses.',
    answer: [
      'Un yaourt, c’est du lait et des ferments lactiques : halal sans aucune discussion. Yaourts nature, brassés, à la grecque « nature »… aucun souci.',
      'La vigilance commence avec les desserts lactés : mousses, liégeois, certains yaourts « onctueux » ou allégés peuvent contenir de la gélatine comme texturant — elle apparaît clairement dans la liste d’ingrédients. Les crèmes dessert utilisent plus souvent amidons et carraghénanes (halal).',
      'Réflexe : le mot « gélatine » sur l’étiquette tranche la question en deux secondes. Et pour les enfants, plusieurs marques proposent des gammes certifiées halal en grande surface.',
    ],
    category: 'Produits',
    related: ['gelatine-halal', 'e407-carraghenane-halal', 'fromage-presure-halal'],
  },
  {
    slug: 'quick-halal',
    question: 'Quick est-il halal ?',
    verdict: '⚠️ Une partie du réseau seulement',
    short:
      'Une partie des restaurants Quick est certifiée halal, pas tout le réseau : il faut vérifier votre restaurant sur la liste officielle.',
    answer: [
      'Quick est un cas unique dans le fast-food français : une partie de ses restaurants est officiellement certifiée halal (viandes certifiées par des organismes reconnus, affichage en restaurant), tandis que le reste du réseau sert de la viande standard.',
      'Conséquence : « Quick » tout court ne veut rien dire — tout dépend de VOTRE restaurant. La liste des établissements halal est publiée par l’enseigne et le certificat est affiché sur place ; en cas de doute, demandez-le au comptoir, c’est un réflexe normal et bien accueilli.',
      'C’est l’exception qui confirme la règle française : McDonald’s et Burger King ne proposent aucun restaurant halal en France, Quick si — mais uniquement dans les restaurants listés.',
    ],
    category: 'Produits',
    related: ['mcdo-halal', 'burger-king-halal', 'kfc-halal'],
  },
  {
    slug: 'burger-king-halal',
    question: 'Burger King est-il halal en France ?',
    verdict: '❌ Non en France',
    short:
      'Burger King France ne propose pas de viande halal. Comme ses concurrents, l’enseigne est en revanche halal dans les pays musulmans.',
    answer: [
      'Burger King France s’approvisionne en filière standard : aucun restaurant halal dans l’Hexagone, et la marque le confirme dans sa communication officielle. Les Whopper français ne sont donc pas halal.',
      'Reste possible selon votre niveau d’exigence : les options sans viande (le Veggie King, les frites) — avec les questions habituelles de cuissons partagées pour les plus stricts.',
      'À l’étranger, le tableau change : Burger King est intégralement certifié halal dans les pays musulmans (Maroc, Turquie, Golfe, Asie du Sud-Est). Et en France, la scène des smash burgers halal indépendants n’a jamais été aussi riche — la carte VoyagesHalal en géolocalise près de chez vous.',
    ],
    category: 'Produits',
    related: ['quick-halal', 'mcdo-halal', 'kfc-halal'],
  },

  // ─── ALIMENTATION (vague 3) ─────────────────────────────────────────────────
  {
    slug: 'levure-chimique-halal',
    question: 'La levure chimique est-elle halal ?',
    verdict: '✅ Halal',
    short:
      'La levure chimique est un mélange minéral (bicarbonate + acide). Rien d’animal, rien de fermenté : halal.',
    answer: [
      'La levure chimique des sachets roses n’a de « levure » que le nom : c’est un mélange de bicarbonate de sodium, d’un acide (pyrophosphate ou crème de tartre) et d’amidon. Aucun organisme vivant, aucune fermentation.',
      'Tous ses composants sont minéraux ou végétaux : la levure chimique est halal sans aucune réserve. Même conclusion pour le bicarbonate seul et la levure de boulanger (un champignon, voir notre fiche levure).',
      'Petite précision sur la crème de tartre (E336) : elle est récupérée sur les cuves de vinification, mais c’est un cristal minéral purifié sans caractère enivrant — considéré halal par les organismes de certification, à l’image du vinaigre.',
    ],
    category: 'Alimentation',
    related: ['levure-biere-halal', 'vinaigre-halal', 'e330-halal'],
  },
  {
    slug: 'arome-vanille-halal',
    question: 'L’arôme de vanille est-il halal ?',
    verdict: '⚠️ Vanilline oui — « extrait » à nuancer',
    short:
      'La vanilline (arôme de synthèse) est halal. L’« extrait de vanille » liquide est macéré dans l’alcool — avis partagés sur les traces.',
    answer: [
      'Deux produits différents se cachent derrière le goût vanille. La vanilline, arôme de synthèse utilisé dans l’immense majorité des produits industriels (Nutella, biscuits, yaourts) : fabriquée sans alcool résiduel significatif, elle est considérée halal.',
      'L’« extrait naturel de vanille » liquide, lui, est traditionnellement obtenu par macération de gousses dans une solution alcoolisée (souvent 35 %). Utilisé en petite quantité dans un gâteau, l’alcool devient indétectable — beaucoup de savants tolèrent ces traces techniques non enivrantes, les plus stricts préfèrent l’éviter.',
      'Alternatives sans débat : gousse de vanille entière, poudre de vanille, ou extraits « sans alcool » à base de glycérine végétale, disponibles en magasin bio et oriental. Pour la pâtisserie maison, la gousse reste la reine.',
    ],
    category: 'Alimentation',
    related: ['cuisine-alcool-halal', 'vinaigre-halal', 'glace-halal'],
  },
  {
    slug: 'gelatine-poisson-halal',
    question: 'La gélatine de poisson est-elle halal ?',
    verdict: '✅ Halal',
    short:
      'La gélatine de poisson est halal sans condition d’abattage — c’est l’alternative idéale pour bonbons et desserts gélifiés.',
    answer: [
      'La gélatine de poisson est extraite des peaux et arêtes de poissons. Le poisson étant halal sans abattage rituel, sa gélatine l’est aussi — c’est l’avis unanime, toutes écoles confondues (y compris hanafite, le poisson étant licite pour tous).',
      'On la retrouve dans les marshmallows halal, certains bonbons certifiés et des compléments alimentaires. Sur l’étiquette, cherchez « gélatine de poisson » explicitement : la mention « gélatine » seule désigne presque toujours du porc ou du bœuf.',
      'C’est l’une des trois grandes alternatives halal à la gélatine classique, avec la pectine (E440) et le carraghénane (E407) — de quoi ne plus jamais se priver de chamallows.',
    ],
    category: 'Alimentation',
    related: ['gelatine-halal', 'poisson-fruits-de-mer-halal', 'e440-pectine-halal'],
  },

  // ─── VOYAGE — VILLES FRANÇAISES (vague 3) ───────────────────────────────────
  {
    slug: 'restaurant-halal-nice',
    question: 'Où manger halal à Nice ?',
    verdict: '🗺 Guide',
    short:
      'À Nice, le quartier de la gare Thiers et l’Ariane concentrent l’offre halal — avec la socca en bonus végétarien niçois.',
    answer: [
      'À Nice, le réflexe halal commence autour de la gare Thiers et du boulevard Jean-Jaurès : grillades, kebabs de qualité, restaurants tunisiens et marocains s’y succèdent. Le quartier de l’Ariane, plus excentré, est le cœur communautaire avec boucheries et tables familiales.',
      'Bonus niçois qui tombe bien : la socca (galette de pois chiches), la pissaladière sans anchois et la cuisine niçoise végétale se dégustent halal par nature — parfait pour goûter local dans le Vieux-Nice sans se poser de questions.',
      'En été, beaucoup de plages privées et restaurants touristiques servent de l’alcool — la nourriture reste à vérifier au cas par cas comme partout. Certificats pour la viande, affluence locale comme boussole, et la carte VoyagesHalal pour les adresses vérifiées de la Côte d’Azur.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-marseille', 'restaurant-halal-montpellier', 'restaurant-halal-lyon'],
  },
  {
    slug: 'restaurant-halal-bordeaux',
    question: 'Où manger halal à Bordeaux ?',
    verdict: '🗺 Guide',
    short:
      'À Bordeaux, direction Saint-Michel et le marché des Capucins : le quartier historique du halal bordelais, complété par la rive droite.',
    answer: [
      'À Bordeaux, le quartier Saint-Michel est l’adresse historique : autour du marché des Capucins (« le ventre de Bordeaux »), boucheries halal, rôtisseries, pâtisseries orientales et restaurants maghrébins font vivre le quartier depuis des générations.',
      'La nouvelle génération bordelaise s’exprime ailleurs : smash burgers, tacos et poulet frit halal essaiment dans le centre et sur la rive droite (Bastide, Lormont, Cenon), portés par une clientèle jeune et exigeante.',
      'Bordeaux étant la capitale mondiale du vin, beaucoup de restaurants gastronomiques cuisinent à l’alcool — posez la question systématiquement hors des adresses halal. Pour le reste : certificats, avis récents, et la carte VoyagesHalal en renfort.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-toulouse', 'restaurant-halal-nantes', 'cuisine-alcool-halal'],
  },
  {
    slug: 'restaurant-halal-nantes',
    question: 'Où manger halal à Nantes ?',
    verdict: '🗺 Guide',
    short:
      'À Nantes, l’offre halal se concentre autour de Talensac, du centre et des quartiers Bellevue et Malakoff — en forte croissance.',
    answer: [
      'Nantes a longtemps été discrète sur le halal, mais la donne a changé : autour du marché de Talensac et dans le centre, kebabs de qualité, restaurants orientaux et enseignes de burgers halal se sont multipliés ces dernières années.',
      'Les quartiers Bellevue, Malakoff et Doulon comptent boucheries halal et adresses familiales, tandis que la périphérie (Saint-Herblain, Rezé) accueille les concepts nouvelle génération — poulet frit, tacos, smash burgers certifiés.',
      'Conseil local : la scène évolue vite, vérifiez les avis récents et le certificat affiché. Et pour un dessert local sans question à se poser, le gâteau nantais traditionnel contient du rhum — préférez les versions « sans alcool » que proposent certaines pâtisseries, ou passez au berlingot !',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-bordeaux', 'restaurant-halal-lille', 'restaurant-halal-paris'],
  },
  {
    slug: 'restaurant-halal-montpellier',
    question: 'Où manger halal à Montpellier ?',
    verdict: '🗺 Guide',
    short:
      'À Montpellier, du centre (Gambetta, gare) à La Paillade, l’offre halal est l’une des plus denses du sud de la France.',
    answer: [
      'Montpellier est une place forte du halal dans le Sud : autour du cours Gambetta, de la rue du Faubourg Figuerolles et de la gare Saint-Roch, les restaurants orientaux, syriens et maghrébins se comptent par dizaines — dont une belle scène de cuisine levantine.',
      'Les quartiers Mosson-La Paillade et Petit Bard complètent l’offre familiale (boucheries, rôtisseries), tandis que la jeunesse étudiante fait vivre les enseignes de burgers, tacos et poke halal du centre — Montpellier est l’une des villes les plus jeunes de France, et sa scène halal en profite.',
      'À vingt minutes, Sète et ses poissons grillés offrent l’escapade parfaite (le poisson est halal partout !). Certificats et affluence locale comme toujours — les adresses vérifiées de l’Hérault arrivent sur la carte VoyagesHalal.',
    ],
    category: 'Voyage',
    related: ['restaurant-halal-marseille', 'restaurant-halal-nice', 'restaurant-halal-toulouse'],
  },

  // ─── DESTINATIONS (vague 2) ─────────────────────────────────────────────────
  {
    slug: 'voyage-halal-le-caire',
    question: 'Voyager halal au Caire : le guide',
    verdict: '✦ 8.6 — Très bon halal',
    short:
      'Le Caire, ville aux mille minarets : tout est halal, l’histoire islamique est partout, et le koshary vous attend.',
    answer: [
      'Le Caire est un bain d’histoire musulmane à ciel ouvert : la mosquée-université Al-Azhar (mille ans de savoir), le Caire islamique classé à l’UNESCO, la citadelle de Saladin, la mosquée Ibn Touloun… et l’appel à la prière depuis mille minarets. Toute la nourriture y est halal par défaut.',
      'Côté assiette, le koshary (riz-lentilles-pâtes-oignons frits) est le roi de la street food, avec les ful medames, taameya (falafels égyptiens) et grillades. Le bazar Khan el-Khalili, autour d’Al-Azhar, mêle souks, cafés historiques et artisanat.',
      'Conseils : négociez tout (taxis compris — ou utilisez les applications VTC), prévoyez les pyramides de Gizeh tôt le matin, et gardez de la monnaie pour les pourboires (bakchich), institution locale. HalalScore VoyagesHalal : ✦ 8.6.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-istanbul', 'voyage-halal-marrakech', 'voyage-halal-doha'],
  },
  {
    slug: 'voyage-halal-amsterdam',
    question: 'Voyager halal à Amsterdam : le guide',
    verdict: '✦ 7.8 — Bon niveau halal',
    short:
      'Amsterdam surprend : une offre halal riche (cuisines surinamaise, turque, marocaine), des mosquées actives, à 3h de train de Paris.',
    answer: [
      'Amsterdam est une très bonne surprise halal : les communautés turque, marocaine et surinamaise y ont bâti une offre dense. La spécialité à ne pas manquer : la cuisine surinamaise-javanaise halal (roti, bami, saoto) — introuvable en France et délicieuse.',
      'Les quartiers De Pijp (marché Albert Cuyp), Oost et Nieuw-West concentrent restaurants et boucheries halal ; les snackbars halal (fricandelle et frites sauce) sont une institution néerlandaise. Attention en revanche au centre touristique : beaucoup d’adresses y mélangent tout — vérifiez le certificat.',
      'Conseils : la ville se visite à vélo comme un local, le Rijksmuseum et les canaux se moquent de votre régime, et le Thalys met Amsterdam à 3h20 de Paris. Les mosquées (dont la grande mosquée Fatih dans le centre) accueillent facilement les voyageurs. HalalScore VoyagesHalal : ✦ 7.8.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-londres', 'restaurant-halal-paris', 'repas-halal-avion'],
  },
  {
    slug: 'voyage-halal-barcelone',
    question: 'Voyager halal à Barcelone : le guide',
    verdict: '✦ 7.3 — Possible avec les bons quartiers',
    short:
      'À Barcelone, le Raval est votre quartier général halal — dans une ville où le porc est partout, mieux vaut connaître ses adresses.',
    answer: [
      'Barcelone demande un peu de méthode : la cuisine catalane traditionnelle fait la part belle au porc (jambon en vitrine partout) et l’alcool accompagne les tapas. Mais la ville a un atout : le Raval, quartier central où la communauté pakistanaise a ouvert des dizaines de restaurants halal — currys, grillades, biryanis excellents et pas chers.',
      'Les kebabs et snacks halal sont nombreux autour de la Rambla et dans l’Eixample, et plusieurs restaurants marocains et syriens montent en gamme. Pour la paella, cherchez spécifiquement les versions poisson/fruits de mer dans un établissement de confiance — ou les restaurants halal qui la proposent.',
      'La Sagrada Família, le parc Güell et la plage de la Barceloneta font le reste. Bonus : la mosquée Tariq bin Ziyad et plusieurs salles de prière au centre. HalalScore VoyagesHalal : ✦ 7.3 — très faisable en connaissant ses quartiers.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-amsterdam', 'voyage-halal-londres', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'voyage-halal-bangkok',
    question: 'Voyager halal à Bangkok et en Thaïlande : le guide',
    verdict: '✦ 6.8 — L’aventure préparée',
    short:
      'Bangkok cache une vraie Thaïlande musulmane : quartiers halal historiques, certification CICOT, et le sud du pays majoritairement musulman.',
    answer: [
      'On l’ignore souvent : la Thaïlande compte des millions de musulmans et Bangkok a ses quartiers halal historiques — autour de la mosquée Haroon (Bang Rak) et surtout le long de Ramkhamhaeng et Phetchaburi, où restaurants et street food halal abondent. Le logo halal officiel thaï (CICOT, losange vert) est votre repère fiable.',
      'La cuisine thaï musulmane est une merveille : massaman curry (élu parmi les meilleurs plats du monde — d’origine musulmane !), khao mok gai (biryani thaï), satay. Vigilance sur la street food généraliste : porc omniprésent et sauces (huître, poisson fermenté) à questionner.',
      'Le sud du pays (Krabi, Phuket côté communautés locales, Koh Lanta) est largement musulman : mosquées sur les îles, warungs halal, ambiance familiale. Conseils : temples et palais se visitent épaules couvertes, et le ramadan y est très suivi dans le sud. HalalScore VoyagesHalal : ✦ 6.8 — dépaysement maximal, préparation minimale requise.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-kuala-lumpur', 'voyage-halal-bali', 'voyage-halal-tokyo'],
  },
  {
    slug: 'voyage-halal-sarajevo',
    question: 'Voyager halal à Sarajevo : le guide',
    verdict: '✦ 8.4 — La perle musulmane d’Europe',
    short:
      'Sarajevo est la capitale musulmane de l’Europe : ćevapi halal, mosquées ottomanes, café bosnien — à 2h de vol, sans dépaysement religieux.',
    answer: [
      'Sarajevo est unique : une capitale européenne où l’adhan résonne entre les collines, où la vieille ville ottomane (Baščaršija) aligne mosquées du XVIe siècle, fontaines et artisans du cuivre, et où la nourriture est halal presque partout — la Bosnie est le pays musulman de l’Europe.',
      'La table bosnienne est généreuse et abordable : ćevapi (petites saucisses grillées servies dans le somun moelleux), burek, dolma, baklava, le tout arrosé de café bosnien préparé à l’ottomane. La mosquée Gazi Husrev-bey et sa medersa sont le cœur spirituel de la ville.',
      'Conseils : montez au belvédère de la forteresse jaune au coucher du soleil, prenez le téléphérique du mont Trebević, et prévoyez une excursion à Mostar et son pont mythique (2h de route). Le ramadan à Sarajevo — canon d’iftar tiré de la forteresse compris — est une expérience inoubliable. HalalScore VoyagesHalal : ✦ 8.4.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-istanbul', 'voyage-halal-amsterdam', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'voyage-halal-singapour',
    question: 'Voyager halal à Singapour : le guide',
    verdict: '✦ 8.5 — Très bon halal',
    short:
      'Singapour allie certification MUIS ultra-fiable, hawker centers halal et le quartier magique de Kampong Glam autour de la mosquée du Sultan.',
    answer: [
      'Singapour est l’une des destinations halal les plus fiables d’Asie : la certification MUIS, gérée par l’autorité islamique de la cité-État, est rigoureuse et affichée partout — jusque dans les hawker centers (marchés de street food), dont plusieurs sections sont entièrement halal.',
      'Le quartier à ne pas manquer : Kampong Glam, le quartier malais historique autour de la majestueuse mosquée du Sultan — cafés, boutiques, murtabak et nasi padang. Ajoutez le laksa, le chicken rice halal et les saveurs indo-malaises : la ville est un festin certifié.',
      'Conseils : Gardens by the Bay et Marina Bay le soir, Sentosa en famille, et l’aéroport de Changi (souvent élu meilleur du monde, salles de prière comprises) mérite d’arriver en avance. Budget à prévoir : Singapour est chère — mais les hawkers halal restent très abordables. HalalScore VoyagesHalal : ✦ 8.5.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-kuala-lumpur', 'voyage-halal-bangkok', 'voyage-halal-dubai'],
  },
  {
    slug: 'voyage-halal-maldives',
    question: 'Voyager halal aux Maldives : le guide',
    verdict: '✦ 8.8 — Le paradis, deux formules',
    short:
      'Les Maldives sont un pays 100 % musulman : îles locales authentiques et halal intégral, ou resorts de rêve — à choisir en connaissance.',
    answer: [
      'On l’oublie derrière les photos de villas sur pilotis : les Maldives sont une république entièrement musulmane. Sur les îles locales (Maafushi, Dhigurah, Thoddoo…), tout est halal, l’adhan rythme la journée, et les guesthouses ont démocratisé le paradis — plages de rêve à prix accessibles, excursions raies manta et requins-baleines comprises.',
      'Les resorts-îles privées, eux, vivent sous un régime spécial : alcool servi et cuisine internationale (halal disponible, à confirmer à la réservation). Beaucoup de familles musulmanes préfèrent les îles locales pour l’ambiance — ou choisissent un resort en demandant les options halal, nombreux à bien les gérer vu la clientèle du Golfe.',
      'Conseils : sur les îles locales, le « bikini beach » est la plage dédiée aux touristes, le reste de l’île suit la pudeur locale ; la saison sèche va de décembre à avril ; et le poisson grillé du soir sur la plage est un souvenir pour la vie. HalalScore VoyagesHalal : ✦ 8.8.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-bali', 'voyage-halal-dubai', 'voyage-halal-kuala-lumpur'],
  },
  {
    slug: 'voyage-halal-new-york',
    question: 'Voyager halal à New York : le guide',
    verdict: '✦ 7.5 — Bon niveau halal',
    short:
      'New York et ses halal carts légendaires : la ville qui a fait du poulet-riz halal une icône, avec des quartiers musulmans entiers à explorer.',
    answer: [
      'New York a donné au monde une icône : le halal cart — ces chariots de rue servant le mythique « chicken over rice » sauce blanche, nés des vendeurs égyptiens et devenus patrimoine culinaire de la ville. Des centaines de carts halal quadrillent Manhattan, celui de la 53e/6e Avenue ayant lancé la légende.',
      'Au-delà des carts : Jackson Heights (Queens) pour la cuisine sud-asiatique halal, Bay Ridge (Brooklyn) pour le monde arabe, Atlantic Avenue pour les épiceries yéménites et l’agneau grillé. Les steakhouses et smash burgers halal se multiplient à Manhattan — la scène est en pleine explosion.',
      'Conseils : l’Islamic Cultural Center et les mosquées de quartier sont accueillantes, les grands musées (MET, MoMA) et Central Park meublent les journées, et le réflexe reste le même qu’ailleurs : « halal » affiché ne dispense pas de demander qui certifie, surtout hors des quartiers communautaires. HalalScore VoyagesHalal : ✦ 7.5.',
    ],
    category: 'Destinations',
    related: ['voyage-halal-londres', 'voyage-halal-dubai', 'repas-halal-avion'],
  },
  // ─── RAMADAN ────────────────────────────────────────────────────────────────
  {
    slug: 'brosser-dents-ramadan',
    question: 'Peut-on se brosser les dents pendant le Ramadan ?',
    verdict: '✅ Permis (avec précaution)',
    short:
      'Se brosser les dents n’annule pas le jeûne, à condition de ne pas avaler d’eau ni de dentifrice. Le siwak est même recommandé.',
    answer: [
      'Se brosser les dents pendant le jeûne est permis et n’annule pas le Ramadan. La condition : ne rien avaler volontairement — ni l’eau de rinçage, ni le dentifrice. Recracher soigneusement suffit.',
      'Certains savants recommandent par précaution de se brosser avec du dentifrice avant l’aube (suhur) et après la rupture (iftar), et d’utiliser en journée le siwak (bâton d’arak), que le Prophète ﷺ utilisait — il est recommandé même en jeûnant.',
      'Le goût du dentifrice qui reste en bouche ne casse pas le jeûne tant que rien n’est avalé délibérément. Si une goutte passe malgré toi, sans intention, le jeûne reste valide pour la majorité des savants.',
    ],
    category: 'Ramadan',
    related: ['avaler-salive-ramadan', 'gouttes-yeux-ramadan', 'se-doucher-ramadan'],
  },
  {
    slug: 'avaler-salive-ramadan',
    question: 'Avaler sa salive annule-t-il le jeûne ?',
    verdict: '✅ N’annule pas le jeûne',
    short:
      'Avaler sa propre salive n’annule pas le jeûne — c’est l’avis unanime des savants. Impossible et non demandé de s’en empêcher.',
    answer: [
      'Non, avaler sa salive n’annule pas le jeûne. Les savants sont unanimes : la salive fait partie du corps, et s’en empêcher serait impossible. Cette inquiétude, très fréquente, n’a pas lieu d’être.',
      'Ce qui est différent : avaler volontairement les glaires remontées en bouche (divergence entre écoles, mieux vaut recracher), ou avaler de l’eau, de la nourriture ou tout ce qui vient de l’extérieur du corps.',
      'Retiens la règle simple : ce que ton corps produit naturellement (salive) ne casse pas le jeûne ; ce qui vient de l’extérieur et que tu avales volontairement le casse.',
    ],
    category: 'Ramadan',
    related: ['brosser-dents-ramadan', 'oubli-manger-ramadan', 'vomir-ramadan'],
  },
  {
    slug: 'oubli-manger-ramadan',
    question: 'J’ai mangé par oubli pendant le Ramadan : mon jeûne est-il cassé ?',
    verdict: '✅ Le jeûne reste valide',
    short:
      'Manger ou boire par pur oubli n’annule pas le jeûne : on s’arrête dès qu’on s’en rend compte et on continue sa journée normalement.',
    answer: [
      'Bonne nouvelle : si tu as mangé ou bu en oubliant complètement que tu jeûnais, ton jeûne reste valide selon la grande majorité des savants. Le Prophète ﷺ a dit que celui qui mange ou boit par oubli doit compléter son jeûne : « c’est Allah qui l’a nourri et abreuvé » (Boukhari, Mouslim).',
      'La marche à suivre : dès que tu t’en rends compte, tu t’arrêtes immédiatement (même une bouchée en cours se recrache) et tu poursuis ta journée de jeûne. Pas de rattrapage, pas de compensation.',
      'Attention à la nuance : cela vaut pour l’oubli sincère. Continuer à manger après s’en être souvenu, ou manger en pensant « c’est cassé de toute façon », annule le jeûne. L’école malikite demande par précaution de rattraper le jour — avis minoritaire mais respecté.',
    ],
    category: 'Ramadan',
    related: ['avaler-salive-ramadan', 'vomir-ramadan', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'piqure-ramadan',
    question: 'Une piqûre ou un vaccin annule-t-il le jeûne ?',
    verdict: '⚠️ Ça dépend du type d’injection',
    short:
      'Les injections médicales non nutritives (vaccin, anesthésie locale, insuline) n’annulent pas le jeûne pour la majorité des savants. Les perfusions nutritives, si.',
    answer: [
      'La règle retenue par la majorité des savants contemporains : une injection qui ne nourrit pas n’annule pas le jeûne. Vaccins, antibiotiques injectés, anesthésie dentaire locale, insuline : le jeûne reste valide, car rien n’arrive à l’estomac et ça ne remplace pas un repas.',
      'À l’inverse, les perfusions nutritives (glucose, sérum alimentaire) annulent le jeûne selon la plupart des avis, car elles remplissent la fonction de la nourriture. Et si tu es malade au point d’en avoir besoin, rappelle-toi que le malade est précisément exempté de jeûne par le Coran.',
      'Par précaution, certains préfèrent programmer les injections non urgentes après la rupture du jeûne. Mais ne repousse jamais un soin nécessaire pour le jeûne : la religion facilite, elle ne met pas la santé en danger.',
    ],
    category: 'Ramadan',
    related: ['prise-de-sang-ramadan', 'medicament-ramadan', 'gouttes-yeux-ramadan'],
  },
  {
    slug: 'prise-de-sang-ramadan',
    question: 'Une prise de sang annule-t-elle le jeûne ?',
    verdict: '✅ N’annule pas le jeûne (majorité)',
    short:
      'Une prise de sang pour analyse n’annule pas le jeûne selon la majorité des savants. Un don de sang important est débattu — mieux vaut le programmer le soir.',
    answer: [
      'Une prise de sang de quelques tubes pour des analyses n’annule pas le jeûne : rien n’entre dans le corps, et la quantité prélevée est minime. C’est l’avis de la grande majorité des savants. Pratique à savoir : beaucoup d’analyses se font justement à jeun — le Ramadan est même un bon moment.',
      'Le don de sang (quantité importante) fait davantage débat : par analogie avec la hijama (saignée), l’école hanbalite considère qu’il rompt le jeûne ; la majorité le permet mais le déconseille en journée à cause de la fatigue qu’il provoque.',
      'En pratique : analyses médicales sans souci en journée ; don de sang, programme-le après l’iftar — la plupart des collectes en pays musulmans s’organisent d’ailleurs le soir pendant Ramadan.',
    ],
    category: 'Ramadan',
    related: ['piqure-ramadan', 'medicament-ramadan', 'vomir-ramadan'],
  },
  {
    slug: 'gouttes-yeux-ramadan',
    question: 'Les gouttes dans les yeux ou le nez annulent-elles le jeûne ?',
    verdict: '⚠️ Yeux : non — nez : prudence',
    short:
      'Les gouttes oculaires n’annulent pas le jeûne pour la majorité. Pour le nez, éviter d’avaler ce qui descend dans la gorge.',
    answer: [
      'Les gouttes dans les yeux n’annulent pas le jeûne selon la majorité des savants contemporains : l’œil n’est pas une voie d’alimentation. Même si un léger goût arrive en gorge, l’avis dominant reste la validité du jeûne.',
      'Pour les gouttes nasales et les sprays, c’est plus sensible : le nez communique directement avec la gorge. L’avis répandu : permis en cas de besoin, en inclinant la tête et en recrachant ce qui descend. Le Prophète ﷺ a d’ailleurs recommandé de ne pas exagérer l’aspiration d’eau par le nez pendant les ablutions en état de jeûne.',
      'Les inhalateurs pour l’asthme sont permis pendant le jeûne selon la plupart des conseils de fiqh contemporains (ce n’est ni nourriture ni boisson, et la santé prime). En cas de traitement régulier, demande à ton médecin si une prise matin/soir est possible.',
    ],
    category: 'Ramadan',
    related: ['piqure-ramadan', 'medicament-ramadan', 'brosser-dents-ramadan'],
  },
  {
    slug: 'medicament-ramadan',
    question: 'Peut-on prendre des médicaments pendant le Ramadan ?',
    verdict: '⚠️ Pas par la bouche en journée',
    short:
      'Un médicament avalé casse le jeûne. Mais le malade est exempté, et beaucoup de traitements peuvent se prendre le soir — vois avec ton médecin.',
    answer: [
      'Tout médicament avalé (comprimé, gélule, sirop) rompt le jeûne, même sans valeur nutritive : c’est une ingestion volontaire par la bouche. En revanche, injections non nutritives, gouttes oculaires, crèmes, patchs et inhalateurs ne le rompent pas selon la majorité des savants contemporains.',
      'Le vrai message : si tu as un traitement indispensable en journée, c’est que tu entres probablement dans la catégorie du malade — et le Coran exempte explicitement le malade du jeûne (sourate 2, verset 185). Tu rattrapes plus tard, ou tu compenses (fidya) si la maladie est chronique. Jeûner en mettant sa santé en danger n’est pas un acte pieux, c’est un contresens.',
      'Réflexe pratique : avant Ramadan, vois ton médecin (beaucoup connaissent bien la question) pour adapter les horaires de prise sur suhur et iftar quand c’est médicalement possible. Ne modifie jamais un traitement seul.',
    ],
    category: 'Ramadan',
    related: ['piqure-ramadan', 'medicaments-gelules-halal', 'femme-enceinte-ramadan'],
  },
  {
    slug: 'vomir-ramadan',
    question: 'Vomir annule-t-il le jeûne ?',
    verdict: '⚠️ Involontaire : non — provoqué : oui',
    short:
      'Vomir malgré soi n’annule pas le jeûne. Se faire vomir volontairement l’annule et impose de rattraper le jour.',
    answer: [
      'La règle vient d’un hadith clair : « Celui qui est vaincu par le vomissement n’a pas à rattraper ; celui qui se fait vomir volontairement doit rattraper » (Abou Dawoud, Tirmidhi). Si tu es malade et que tu vomis malgré toi, ton jeûne reste valide — rince-toi la bouche et continue.',
      'Se faire vomir délibérément (doigt dans la gorge, provocation volontaire) rompt le jeûne : il faudra rattraper ce jour après Ramadan.',
      'Et si les vomissements viennent d’une vraie maladie (gastro, grossesse difficile…), rappelle-toi que le malade est exempté : mieux vaut rompre, se soigner et rattraper que de s’épuiser. Avaler volontairement ce qui remonte est en revanche à éviter — recrache et rince.',
    ],
    category: 'Ramadan',
    related: ['oubli-manger-ramadan', 'medicament-ramadan', 'femme-enceinte-ramadan'],
  },
  {
    slug: 'fumer-ramadan',
    question: 'Fumer annule-t-il le jeûne ?',
    verdict: '❌ Oui, la cigarette casse le jeûne',
    short:
      'Fumer rompt le jeûne : la fumée est inhalée volontairement et atteint le corps. Cela vaut aussi pour la chicha et la vape.',
    answer: [
      'Oui, fumer pendant le jeûne l’annule — c’est l’avis quasi unanime des savants. La fumée de cigarette contient des substances qui pénètrent volontairement dans le corps, et l’arabe classique parle même de « boire » la cigarette (shurb ad-dukhân). Cigarette, chicha, cigare : même règle.',
      'La vapoteuse et la puff sont logées à la même enseigne par les conseils de fiqh contemporains : inhalation volontaire d’un produit (nicotine, arômes, glycérine) — le jeûne est rompu.',
      'Beaucoup de fumeurs témoignent que le Ramadan est le meilleur moment pour arrêter : tu tiens déjà 15 heures par jour sans fumer. Côté religion, la majorité des savants contemporains considèrent la cigarette interdite ou fortement détestée toute l’année, à cause de sa nocivité prouvée. Double raison d’en profiter pour décrocher.',
    ],
    category: 'Ramadan',
    related: ['cigarette-halal', 'chicha-halal', 'puff-vape-halal'],
  },
  {
    slug: 'sport-ramadan',
    question: 'Peut-on faire du sport pendant le Ramadan ?',
    verdict: '✅ Permis (au bon moment)',
    short:
      'Le sport est permis en jeûnant. Le bon créneau : une séance légère avant l’iftar ou un entraînement normal après la rupture.',
    answer: [
      'Faire du sport pendant le Ramadan est tout à fait permis — le jeûne n’interdit que manger, boire et les rapports en journée. La vraie question est pratique : comment s’entraîner sans se mettre dans le rouge alors qu’on ne peut pas boire ?',
      'Les créneaux qui marchent : une séance modérée dans l’heure qui précède l’iftar (tu réhydrates juste après), ou l’entraînement complet 1 à 2 heures après la rupture, une fois le repas digéré. Évite le cardio intense en plein après-midi : la déshydratation n’a rien de méritoire, et si le sport te pousse à rompre le jeûne, c’est le sport qu’il faut décaler, pas le jeûne.',
      'Baisse l’intensité de 20 à 30 % les premiers jours, dors suffisamment et charge l’hydratation entre iftar et suhur. Les sportifs de haut niveau avec compétitions ont des cas particuliers : les avis autorisant de reporter le jeûne existent mais se discutent avec un savant, pas dans un vestiaire.',
    ],
    category: 'Ramadan',
    related: ['se-doucher-ramadan', 'dattes-rompre-jeune', 'whey-proteine-halal'],
  },
  {
    slug: 'femme-enceinte-ramadan',
    question: 'Une femme enceinte doit-elle jeûner le Ramadan ?',
    verdict: '⚠️ Exemptée si crainte pour elle ou le bébé',
    short:
      'Si le jeûne présente un risque pour elle ou son bébé, la femme enceinte (ou qui allaite) est exemptée. La compensation varie selon les écoles.',
    answer: [
      'L’islam n’impose jamais de jeûner au détriment de la santé. Si une femme enceinte ou allaitante craint pour elle-même ou pour son enfant — fatigue sévère, hypoglycémies, avis médical défavorable — elle est exemptée de jeûne. C’est une facilité (rukhsa) prévue par la religion, pas un manquement.',
      'La compensation diffère selon les écoles : rattraper les jours plus tard (avis majoritaire), nourrir un pauvre par jour manqué (fidya) en plus ou à la place du rattrapage selon les cas — les écoles hanafite, malikite, chaféite et hanbalite ont chacune leur détail. Le plus simple : demander à l’imam de sa mosquée selon sa situation.',
      'Si la grossesse se passe bien et que le médecin ne voit pas d’obstacle, beaucoup de femmes jeûnent normalement. Le bon réflexe : en parler à la fois au médecin (suivi, hydratation) et rester à l’écoute de son corps — au moindre signal sérieux, on rompt sans culpabiliser.',
    ],
    category: 'Ramadan',
    related: ['medicament-ramadan', 'ramadan-voyage-jeune', 'vomir-ramadan'],
  },
  {
    slug: 'se-doucher-ramadan',
    question: 'Peut-on se doucher ou se baigner pendant le jeûne ?',
    verdict: '✅ Permis',
    short:
      'Douche, bain, piscine : permis pendant le jeûne. La seule règle est de ne pas avaler d’eau volontairement.',
    answer: [
      'Oui, se doucher pendant le jeûne est parfaitement permis — y compris une douche fraîche exprès pour se rafraîchir. Des compagnons rapportent que le Prophète ﷺ se versait de l’eau sur la tête en jeûnant à cause de la chaleur. La fraîcheur n’est pas une rupture du jeûne.',
      'Piscine et baignade : permises aussi, avec une précaution de bon sens — ne pas avaler d’eau. Si quelques gouttes passent involontairement, le jeûne reste valide pour la majorité des savants ; c’est l’ingestion volontaire qui pose problème.',
      'Même logique pour le rinçage de la bouche pendant les ablutions : permis, sans exagérer l’aspiration d’eau (le hadith le précise pour le jeûneur). Bref : l’eau sur le corps, autant que tu veux ; l’eau dans le ventre, jamais volontairement.',
    ],
    category: 'Ramadan',
    related: ['brosser-dents-ramadan', 'sport-ramadan', 'avaler-salive-ramadan'],
  },
  {
    slug: 'maquillage-ramadan',
    question: 'Peut-on se maquiller pendant le Ramadan ?',
    verdict: '✅ N’annule pas le jeûne',
    short:
      'Le maquillage n’annule pas le jeûne : rien n’est ingéré. Attention seulement au rouge à lèvres qui peut passer en bouche.',
    answer: [
      'Se maquiller n’annule pas le jeûne : mascara, fond de teint, crème, khôl — rien de tout cela n’entre dans le corps par une voie d’alimentation. Les savants sont très largement d’accord là-dessus. Même chose pour les crèmes hydratantes et les huiles sur la peau.',
      'Le seul point de vigilance pratique : le rouge à lèvres ou le baume, qu’on finit parfois par lécher sans y penser. S’il passe en bouche et qu’on l’avale, on tombe dans l’ingestion. Par précaution, certains le réservent pour le soir.',
      'Question distincte du jeûne : le maquillage reste soumis aux règles habituelles de pudeur en dehors du foyer — le Ramadan ne change rien dans un sens ni dans l’autre. Et le parfum ne rompt pas le jeûne (respirer une odeur n’est pas manger).',
    ],
    category: 'Ramadan',
    related: ['parfum-alcool-halal', 'rouge-levres-carmin-halal', 'brosser-dents-ramadan'],
  },
  {
    slug: 'dattes-rompre-jeune',
    question: 'Pourquoi rompre le jeûne avec des dattes ?',
    verdict: '✅ Sunna du Prophète ﷺ',
    short:
      'Rompre avec des dattes fraîches, sèches, ou à défaut de l’eau, est la sunna rapportée du Prophète ﷺ — et un excellent choix nutritionnel.',
    answer: [
      'Le Prophète ﷺ rompait son jeûne avec des dattes fraîches (rutab), à défaut des dattes sèches (tamr), et à défaut quelques gorgées d’eau — c’est le hadith rapporté par Abou Dawoud et Tirmidhi. Suivre cet ordre est une sunna, pas une obligation : rompre avec n’importe quel aliment licite est valide.',
      'La science moderne valide ce choix : après 15 heures de jeûne, les sucres rapides de la datte remontent la glycémie en douceur, avec des fibres, du potassium et du magnésium — bien mieux qu’un soda glacé qui brusque l’estomac vide.',
      'La tradition : rompre dès que le soleil est couché (ne pas retarder), avec un nombre impair de dattes selon certains rapports, puis faire la prière du maghreb avant de passer au vrai repas. L’invocation de la rupture : « Dhahaba adh-dhama’u wabtallatil-‘uruqu wa thabatal-ajru in shâ’ Allah ».',
    ],
    category: 'Ramadan',
    related: ['zakat-al-fitr-montant', 'sport-ramadan', 'ramadan-voyage-jeune'],
  },
  {
    slug: 'zakat-al-fitr-montant',
    question: 'Zakat al-Fitr : combien donner et quand ?',
    verdict: '✅ Obligatoire avant la prière de l’Aïd',
    short:
      'La zakat al-Fitr est due pour chaque membre du foyer, à verser avant la prière de l’Aïd. En France, le montant en argent est fixé chaque année (ordre de grandeur : 5 à 9 € par personne).',
    answer: [
      'La zakat al-Fitr (ou sadaqat al-Fitr) est une aumône obligatoire de fin de Ramadan, due pour chaque membre du foyer — y compris les enfants et les personnes à charge. Elle purifie le jeûneur de ses écarts et permet aux plus pauvres de fêter l’Aïd dignement.',
      'La mesure d’origine est un sâ‘ de nourriture de base (environ 2,5 à 3 kg de blé, riz, dattes…). L’école hanafite permet de verser l’équivalent en argent, et c’est l’usage dominant en France : les grandes mosquées et fédérations annoncent chaque année le montant — généralement entre 5 et 9 € par personne. Vérifie le chiffre de l’année auprès de ta mosquée.',
      'Le timing compte : elle doit être versée avant la prière de l’Aïd (idéalement les derniers jours de Ramadan pour que la distribution arrive à temps). Donnée après la prière, elle ne compte plus que comme une aumône ordinaire. Les mosquées et associations sérieuses s’occupent de la redistribution locale.',
    ],
    category: 'Ramadan',
    related: ['dattes-rompre-jeune', 'ramadan-voyage-jeune', 'femme-enceinte-ramadan'],
  },
  // ─── ALIMENTATION (animaux, viandes, concepts) ─────────────────────────────
  {
    slug: 'escargots-halal',
    question: 'Les escargots sont-ils halal ?',
    verdict: '⚠️ Avis divergents selon les écoles',
    short:
      'L’école malikite permet les escargots terrestres (cuits) ; l’école hanafite les interdit. Une vraie divergence classique — chacun suit son école.',
    answer: [
      'Grande question française ! Les escargots terrestres divisent réellement les écoles. L’école malikite les considère permis, à condition qu’ils soient cuits (leur préparation tient lieu d’abattage pour ce type de petite créature). C’est l’avis dominant au Maghreb, où les escargots se consomment traditionnellement — le babbouche marocain en est la preuve vivante.',
      'L’école hanafite, à l’inverse, les classe parmi les hasharat (petites bêtes rampantes) dont la consommation est interdite. Chaféites et hanbalites penchent aussi vers l’interdiction des créatures terrestres sans sang versé.',
      'En pratique : c’est un cas d’école de divergence légitime — si ta famille suit la tradition malikite, les escargots cuits sont permis ; si tu suis l’avis hanafite, tu t’abstiens. Attention en revanche à la recette française classique : le beurre persillé peut contenir du vin blanc dans certaines préparations — à vérifier.',
    ],
    category: 'Alimentation',
    related: ['grenouille-halal', 'crevette-halal', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'grenouille-halal',
    question: 'Les cuisses de grenouille sont-elles halal ?',
    verdict: '❌ Interdites (majorité)',
    short:
      'La majorité des savants interdit la grenouille : un hadith interdit de la tuer. Un avis malikite la tolère, mais il reste minoritaire.',
    answer: [
      'La majorité des savants considèrent la grenouille interdite à la consommation, en s’appuyant sur un hadith où le Prophète ﷺ a interdit de tuer la grenouille lorsqu’un médecin voulait en faire un remède (Abou Dawoud, Nasa’i). Ce qu’on ne peut pas tuer, on ne peut pas le manger.',
      'L’école malikite, la plus large sur les animaux aquatiques et amphibies, comporte un avis permettant la grenouille. Mais même chez beaucoup de malikites contemporains, le hadith d’interdiction fait pencher vers l’abstention.',
      'En pratique : ce grand classique des cartes de brasserie française est à laisser de côté pour la plupart des musulmans. Si le sujet est la découverte culinaire, les fruits de mer offrent un terrain bien plus consensuel — surtout dans la lecture malikite et chaféite.',
    ],
    category: 'Alimentation',
    related: ['escargots-halal', 'poisson-fruits-de-mer-halal', 'calamar-poulpe-halal'],
  },
  {
    slug: 'cheval-halal',
    question: 'La viande de cheval est-elle halal ?',
    verdict: '⚠️ Permise (majorité) — réservée chez certains',
    short:
      'La viande chevaline est permise pour la majorité (chaféites, hanbalites, et l’avis retenu chez les malikites contemporains varie) ; l’école hanafite la déconseille fortement. Abattage rituel requis dans tous les cas.',
    answer: [
      'La viande de cheval est permise selon la majorité des savants : un hadith authentique rapporte que les compagnons ont consommé du cheval du vivant du Prophète ﷺ (Boukhari, Mouslim, d’après Jâbir et Asmâ’). C’est l’avis des écoles chaféite et hanbalite.',
      'L’école hanafite la considère fortement déconseillée (makruh tahrimi selon Abou Hanifa), notamment par égard pour le rôle du cheval dans le jihad et le transport. Chez les malikites, on trouve des avis allant du déconseillé à l’interdit. La divergence est donc réelle, mais l’avis permissif s’appuie sur les textes les plus directs.',
      'Deux conditions pratiques si tu en consommes : l’abattage rituel reste obligatoire (un steak de cheval de boucherie chevaline classique française n’est pas halal pour autant !), et la traçabilité doit être sérieuse. Les boucheries halal proposant du cheval existent mais sont rares.',
    ],
    category: 'Alimentation',
    related: ['lapin-halal', 'gibier-chasse-halal', 'viande-supermarche-halal'],
  },
  {
    slug: 'lapin-halal',
    question: 'Le lapin est-il halal ?',
    verdict: '✅ Halal (avec abattage rituel)',
    short:
      'Le lapin est permis : le Prophète ﷺ en a accepté. Comme toute viande, il doit être abattu rituellement pour être halal.',
    answer: [
      'Oui, le lapin est un animal licite : un hadith rapporte qu’on offrit au Prophète ﷺ du lapin et qu’il l’accepta (Boukhari, Mouslim). Les quatre écoles s’accordent sur sa licéité — c’est l’un des rares points sans vraie divergence dans les viandes « inhabituelles ».',
      'La condition habituelle s’applique : l’animal doit être abattu selon le rite (tasmiya, saignée) pour que sa viande soit halal. Un lapin de supermarché ou de chasse au fusil sans tasmiya ne l’est pas — même règle que pour le poulet ou le bœuf.',
      'Où en trouver : certaines boucheries halal en proposent sur commande, et des élevages français font de l’abattage rituel de lapin. Un classique du couscous et des plats de grand-mère parfaitement licite — à condition de soigner la source.',
    ],
    category: 'Alimentation',
    related: ['cheval-halal', 'gibier-chasse-halal', 'viande-supermarche-halal'],
  },
  {
    slug: 'crevette-halal',
    question: 'Les crevettes sont-elles halal ?',
    verdict: '✅ Halal (majorité) — débat hanafite',
    short:
      'Les crevettes sont halal pour la grande majorité des savants. Chez les hanafites, seul le « poisson » est permis — mais beaucoup y classent la crevette.',
    answer: [
      'Pour les écoles malikite, chaféite et hanbalite, tout ce qui vit dans la mer est licite — le verset « la chasse en mer vous est rendue licite » (sourate 5, verset 96) est général. Les crevettes sont donc halal sans condition d’abattage, comme le poisson.',
      'L’école hanafite ne permet que le « poisson » (samak) : la question devient alors zoologique — la crevette est-elle un poisson ? Beaucoup de savants hanafites du sous-continent indien l’ont historiquement classée comme telle et la permettent ; d’autres l’écartent avec les crustacés. C’est un débat interne à l’école.',
      'En pratique : crevettes, gambas et bouquets sont consommés sans problème par l’écrasante majorité des musulmans. Vigilance ailleurs : dans les plats préparés, la sauce peut contenir alcool ou arômes douteux — la crevette nature, elle, est claire.',
    ],
    category: 'Alimentation',
    related: ['homard-crabe-halal', 'calamar-poulpe-halal', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'homard-crabe-halal',
    question: 'Le homard et le crabe sont-ils halal ?',
    verdict: '✅ Halal (majorité) — évités chez les hanafites',
    short:
      'Homard, crabe, langouste : permis pour les écoles malikite, chaféite et hanbalite. L’école hanafite les écarte (seul le poisson est permis).',
    answer: [
      'Même logique que pour tous les animaux marins : les écoles malikite, chaféite et hanbalite permettent l’ensemble des produits de la mer, crustacés compris. Homard, crabe, langouste, langoustine et écrevisse (d’eau douce) sont donc halal pour la majorité, sans abattage rituel requis.',
      'L’école hanafite restreint la mer au poisson : les crustacés « marcheurs » comme le crabe et le homard y sont écartés — plus nettement encore que la crevette, dont le classement fait débat.',
      'Point pratique des restaurants : le homard est parfois flambé au cognac ou nappé de sauces au vin — le crustacé est licite, la sauce peut ne pas l’être. Au restaurant, demande la préparation nature ou vérifie la carte.',
    ],
    category: 'Alimentation',
    related: ['crevette-halal', 'calamar-poulpe-halal', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'calamar-poulpe-halal',
    question: 'Le calamar et le poulpe sont-ils halal ?',
    verdict: '✅ Halal (majorité) — évités chez les hanafites',
    short:
      'Calamars, seiches et poulpes sont permis pour la majorité des savants (animaux marins). L’école hanafite les écarte car ce ne sont pas des poissons.',
    answer: [
      'Les céphalopodes — calamar, seiche, poulpe — vivent exclusivement dans la mer : ils entrent dans la permission générale des produits marins retenue par les écoles malikite, chaféite et hanbalite. Calamars à la romaine, poulpe grillé : halal pour la majorité.',
      'L’école hanafite, fidèle à sa règle « seul le poisson », les considère non permis. Si tu suis cette école, tu t’en tiens aux poissons — sardines, dorades, thon, saumon, sans limite.',
      'Vigilance récurrente des fritures : certains restaurants font frire calamars et produits panés dans la même huile que des produits non halal, et certaines panures industrielles contiennent des additifs à vérifier. Le calamar lui-même, en revanche, ne pose pas d’autre question que celle de l’école suivie.',
    ],
    category: 'Alimentation',
    related: ['crevette-halal', 'homard-crabe-halal', 'surimi-halal'],
  },
  {
    slug: 'surimi-halal',
    question: 'Le surimi est-il halal ?',
    verdict: '⚠️ Souvent oui — vérifier les additifs',
    short:
      'Le surimi est à base de chair de poisson (halal), mais ses arômes et additifs — parfois du vin ou du mirin dans les recettes asiatiques — sont à vérifier.',
    answer: [
      'Le surimi est fabriqué à partir de chair de poisson blanc (colin, merlan) reconstituée — la base est donc halal pour toutes les écoles. Ce sont les 30 à 60 % restants qui méritent l’étiquette : amidon, blanc d’œuf, arômes crabe, colorants (souvent paprika, parfois E120 à éviter), stabilisants.',
      'Le vrai point de vigilance : certaines recettes, surtout asiatiques, incorporent du mirin (alcool de riz) ou du vin dans les arômes. Les surimis vendus en grande surface française n’en contiennent généralement pas — mais « généralement » n’est pas « toujours » : un coup d’œil à la liste d’ingrédients règle la question.',
      'Bonne nouvelle : plusieurs marques de surimi vendues en France sont certifiées halal ou affichent des recettes sans alcool ni ingrédient animal terrestre. Si le paquet mentionne juste poisson, amidon, blanc d’œuf, huile, sel, sucre et arômes sans alcool : pas de souci pour la plupart des avis.',
    ],
    category: 'Alimentation',
    related: ['poisson-fruits-de-mer-halal', 'calamar-poulpe-halal', 'e120-halal'],
  },
  {
    slug: 'foie-gras-halal',
    question: 'Le foie gras est-il halal ?',
    verdict: '⚠️ Possible avec abattage rituel — débat sur le gavage',
    short:
      'Canard et oie sont des animaux licites : un foie gras issu d’un abattage rituel certifié existe. Le gavage soulève en revanche un débat éthique chez les savants.',
    answer: [
      'Le canard et l’oie sont des volailles licites : abattues rituellement, leur viande — et leur foie — sont halal. Du foie gras certifié halal est effectivement produit et vendu en France, notamment pour les fêtes. Un foie gras classique de supermarché, sans abattage rituel, n’est pas halal.',
      'Reste le débat du gavage : l’islam interdit de faire souffrir les animaux inutilement, et plusieurs savants contemporains jugent le gavage intensif contraire à ce principe — rendant le foie gras déconseillé voire illicite à leurs yeux malgré l’abattage rituel. D’autres considèrent que si l’animal est licite et l’abattage conforme, le produit l’est.',
      'En pratique : si tu veux en consommer, cherche la double garantie — certification halal sérieuse ET élevage le moins brutal possible (des producteurs travaillent en gavage doux ou alternatives). Et si le débat éthique te met mal à l’aise, s’abstenir est un choix que beaucoup de savants saluent.',
    ],
    category: 'Alimentation',
    related: ['gibier-chasse-halal', 'viande-supermarche-halal', 'abattage-etourdissement-halal'],
  },
  {
    slug: 'gibier-chasse-halal',
    question: 'Le gibier chassé est-il halal ?',
    verdict: '⚠️ Oui, sous conditions précises',
    short:
      'La chasse d’animaux licites est permise si le chasseur est musulman ou des gens du Livre, prononce la tasmiya au tir, et que l’animal meurt de l’arme.',
    answer: [
      'La chasse est explicitement permise dans le Coran (sourate 5, versets 4 et 96), avec des conditions : l’animal doit être d’une espèce licite (cerf, chevreuil, sanglier exclu évidemment, perdrix, faisan…), le chasseur doit prononcer « Bismillah » au moment de tirer ou de lâcher le chien dressé, et l’animal doit mourir de l’arme — s’il est retrouvé vivant, il doit être égorgé rituellement.',
      'Le gibier tué par un chasseur qui ne remplit pas ces conditions (pas de tasmiya, animal retrouvé mort sans savoir comment) n’est pas halal pour la majorité des savants. Le sanglier — la moitié du tableau de chasse français — est un porcin : interdit dans tous les cas.',
      'En pratique : le gibier acheté chez un boucher classique ou reçu d’un voisin chasseur non musulman ne remplit généralement pas les conditions. Si tu chasses toi-même (permis en règle) ou connais un chasseur musulman pratiquant les règles : le chevreuil et le faisan halal existent bel et bien.',
    ],
    category: 'Alimentation',
    related: ['cheval-halal', 'lapin-halal', 'abattage-etourdissement-halal'],
  },
  {
    slug: 'difference-halal-casher',
    question: 'Quelle différence entre halal et casher ? Peut-on manger casher ?',
    verdict: '⚠️ Proches mais différents — avis divergents',
    short:
      'Halal et casher partagent l’abattage rituel et l’interdit du porc, mais diffèrent (vin casher permis, séparation lait-viande…). Manger casher fait débat chez les savants.',
    answer: [
      'Les deux systèmes se ressemblent : abattage par égorgement avec bénédiction, interdiction du porc, saignée de l’animal. D’où l’idée répandue que « casher = halal en plus strict ». Mais les différences sont réelles : le judaïsme autorise le vin (casher), interdit de mélanger lait et viande, n’autorise que certains quartiers de l’animal, et la bénédiction prononcée n’est pas la tasmiya.',
      'Peut-on manger de la viande casher ? Le Coran permet la nourriture des gens du Livre (sourate 5, verset 5), et une partie des savants en déduit que la viande casher est licite pour un musulman, notamment en l’absence d’option halal. D’autres estiment que les conditions propres au rite musulman ne sont pas toutes remplies et préfèrent s’abstenir quand le halal est disponible.',
      'En pratique en France : le halal est largement disponible, donc la question se pose surtout en voyage (Amérique latine, certaines villes sans boucherie halal mais avec communauté juive). L’avis médian répandu : en situation de besoin, la viande casher est une option acceptée par de nombreux savants — le vin casher, lui, reste de l’alcool : interdit.',
    ],
    category: 'Alimentation',
    related: ['abattage-etourdissement-halal', 'viande-supermarche-halal', 'halal-definition'],
  },
  {
    slug: 'abattage-etourdissement-halal',
    question: 'La viande halal peut-elle venir d’un animal étourdi ?',
    verdict: '⚠️ Le grand débat de la certification',
    short:
      'Sans étourdissement : halal pour tous. Étourdissement réversible avant l’égorgement : accepté par certains certificateurs, refusé par les plus stricts (AVS…).',
    answer: [
      'C’est LE débat qui divise les certifications halal en France. La règle de base : l’animal doit être vivant au moment de l’égorgement, avec écoulement du sang et tasmiya. Sans étourdissement, tout le monde est d’accord : c’est halal. La question est de savoir si un étourdissement préalable (électronarcose, notamment pour les volailles) reste acceptable.',
      'Position stricte (AVS et d’autres) : refus de tout étourdissement — risque de tuer l’animal avant l’égorgement, et éloignement du rite. Position plus souple (d’autres certificateurs et plusieurs conseils de fatwa) : un étourdissement prouvé réversible (l’animal se réveillerait sans l’égorgement) est tolérable, l’animal étant bien vivant à la saignée. Les deux positions s’appuient sur des savants sérieux.',
      'Conséquence pratique : « certifié halal » n’a pas le même sens selon le logo. Si le sujet t’importe, apprends les positions des certificateurs présents sur tes produits (chaque organisme publie la sienne) et choisis en connaissance de cause — c’est exactement ce qu’on détaille dans notre page sur les certifications.',
    ],
    category: 'Alimentation',
    related: ['certifications-halal-france', 'viande-supermarche-halal', 'difference-halal-casher'],
  },
  // ─── ADDITIFS (2e vague) ────────────────────────────────────────────────────
  {
    slug: 'e102-tartrazine-halal',
    question: 'Le E102 (tartrazine) est-il halal ?',
    verdict: '✅ Halal (colorant synthétique)',
    short:
      'La tartrazine (E102) est un colorant jaune 100 % synthétique : halal. Sa mauvaise réputation concerne la santé (hyperactivité), pas la licéité.',
    answer: [
      'Le E102, ou tartrazine, est un colorant jaune citron entièrement synthétique, fabriqué par chimie industrielle sans aucune matière animale. Côté halal, il ne pose donc aucun problème : c’est licite.',
      'Sa réputation sulfureuse vient d’ailleurs : la tartrazine fait partie des six colorants azoïques dont l’Union européenne impose l’étiquetage « peut avoir des effets indésirables sur l’activité et l’attention chez les enfants ». Halal ne veut pas dire recommandé.',
      'On la trouve dans des sodas, sirops, bonbons, chips aromatisées et confiseries bas de gamme. Si tu veux l’éviter pour des raisons de santé, les alternatives naturelles jaunes sont la curcumine (E100) et le carotène (E160a) — halal également.',
    ],
    category: 'Additifs',
    related: ['e100-halal', 'e160a-carotene-halal', 'e120-halal'],
  },
  {
    slug: 'e160a-carotene-halal',
    question: 'Le E160a (carotène) est-il halal ?',
    verdict: '✅ Halal',
    short:
      'Le carotène (E160a) est extrait de végétaux (carotte, palme, algues) ou synthétisé : halal dans la quasi-totalité des cas.',
    answer: [
      'Le E160a désigne les carotènes, les pigments orange des carottes, extraits de végétaux (carotte, huile de palme, algues) ou produits par synthèse. Dans tous ces cas : halal, sans discussion.',
      'Le seul cas d’école théorique : certains additifs liposolubles peuvent être enrobés dans un support de gélatine pour les stabiliser en poudre. C’est rare pour le E160a alimentaire et jamais indiqué sur l’étiquette — la quasi-totalité des avis n’en tiennent pas rigueur et le considèrent licite tel quel.',
      'On le trouve dans les margarines, jus, glaces, fromages et gâteaux pour donner la teinte orangée. C’est l’un des colorants les plus sûrs, côté halal comme côté santé — c’est littéralement de la provitamine A.',
    ],
    category: 'Additifs',
    related: ['e102-tartrazine-halal', 'e100-halal', 'e120-halal'],
  },
  {
    slug: 'e270-acide-lactique-halal',
    question: 'Le E270 (acide lactique) est-il halal ?',
    verdict: '✅ Halal (malgré son nom)',
    short:
      'L’acide lactique (E270) n’a rien à voir avec le porc et rarement avec le lait : il est produit par fermentation de sucres végétaux. Halal.',
    answer: [
      'Le nom fait peur pour rien : « lactique » évoque le lait, et certains sites de listes d’additifs l’ont même classé douteux par confusion. En réalité, le E270 est produit industriellement par fermentation bactérienne de sucres — betterave, maïs, canne — sans matière animale.',
      'Même dans le cas minoritaire où le substrat de départ serait du lactosérum (petit-lait), l’acide lactique obtenu par fermentation reste licite : le lait est halal, et la transformation est complète. Les préoccupations autour du lactosérum concernent plutôt les végans que le halal.',
      'On trouve le E270 partout : sauces, olives, boissons, bonbons acidulés, charcuteries (où c’est la charcuterie qu’il faut questionner, pas l’additif !). Ses cousins E325, E326 et E327 (lactates) suivent la même logique : halal.',
    ],
    category: 'Additifs',
    related: ['e330-halal', 'e102-tartrazine-halal', 'e472-halal'],
  },
  {
    slug: 'e412-gomme-guar-halal',
    question: 'Le E412 (gomme de guar) est-il halal ?',
    verdict: '✅ Halal (végétal)',
    short:
      'La gomme de guar (E412) est extraite d’une graine de légumineuse : 100 % végétale, halal sans réserve.',
    answer: [
      'Le E412 est extrait des graines du guar, une légumineuse cultivée principalement en Inde et au Pakistan. C’est un épaississant purement végétal : halal, sans aucune réserve, toutes écoles confondues.',
      'On le trouve dans les glaces, sauces, laits végétaux, plats préparés et produits sans gluten, où il remplace la texture du gluten. Il fait équipe avec ses cousins tout aussi licites : gomme xanthane (E415), gomme de caroube (E410), gomme arabique (E414).',
      'C’est le genre d’additif qui montre qu’il ne faut pas avoir peur des E-numéros en bloc : une bonne partie sont de simples extraits de plantes. Le réflexe utile n’est pas d’éviter tous les E, mais de connaître la poignée de codes réellement sensibles (E120, E441, E471, E472, E904, E920…).',
    ],
    category: 'Additifs',
    related: ['e415-xanthane-halal', 'e414-gomme-arabique-halal', 'e440-pectine-halal'],
  },
  {
    slug: 'e414-gomme-arabique-halal',
    question: 'Le E414 (gomme arabique) est-il halal ?',
    verdict: '✅ Halal (sève d’acacia)',
    short:
      'La gomme arabique (E414) est la sève séchée de l’acacia : végétale, halal — elle enrobe bonbons, dragées et sodas.',
    answer: [
      'Le E414, la gomme arabique ou gomme d’acacia, est tout simplement la sève durcie d’acacias récoltée principalement au Soudan et au Sahel. Un produit végétal traditionnel, utilisé depuis des siècles : halal sans discussion.',
      'Elle sert d’enrobage brillant aux dragées et bonbons, de stabilisant dans les sodas et les arômes, et de support dans certains médicaments. Quand un bonbon brille, c’est souvent E414 (halal) ou E904 (shellac, sécrétion d’insecte — plus discuté) : la nuance vaut le coup d’œil.',
      'Anecdote qui a son charme : la récolte de gomme arabique fait vivre des millions de personnes dans des pays majoritairement musulmans — un additif halal qui, en plus, soutient ces économies.',
    ],
    category: 'Additifs',
    related: ['e904-halal', 'e412-gomme-guar-halal', 'e903-cire-carnauba-halal'],
  },
  {
    slug: 'e472-halal',
    question: 'Le E472 (a, b, c, e…) est-il halal ?',
    verdict: '⚠️ Ça dépend de l’origine',
    short:
      'Les E472a-f sont des esters de mono- et diglycérides : d’origine végétale (halal) ou animale (douteuse). Comme le E471, l’étiquette ne précise presque jamais.',
    answer: [
      'La famille E472 (E472a à E472f) regroupe des émulsifiants dérivés des mono- et diglycérides — le fameux E471 — combinés à divers acides. Même problème que leur parent : les graisses de départ peuvent être végétales (palme, soja, colza) ou animales (y compris porcines).',
      'Le E472e, très courant dans le pain industriel et les viennoiseries pour renforcer la pâte, est aujourd’hui majoritairement d’origine végétale en Europe — mais l’étiquette n’a pas l’obligation de le préciser. Sans mention « origine végétale » ni certification, le doute existe.',
      'Le réflexe : produits certifiés halal, mention explicite « émulsifiant d’origine végétale », ou message à la marque (la plupart répondent). Et pour le pain, la boulangerie artisanale classique — farine, eau, levure, sel — contourne élégamment tout le problème.',
    ],
    category: 'Additifs',
    related: ['e471-halal', 'e481-halal', 'e422-glycerine-halal'],
  },
  {
    slug: 'e476-halal',
    question: 'Le E476 (dans le chocolat) est-il halal ?',
    verdict: '✅ Halal (végétal)',
    short:
      'Le E476 (polyricinoléate de polyglycérol), l’émulsifiant des tablettes de chocolat, est fabriqué à partir d’huile de ricin et de soja : végétal, halal.',
    answer: [
      'Le E476, star des étiquettes de chocolat industriel, est fabriqué à partir d’huile de ricin et de glycérol généralement végétal. Il fluidifie le chocolat en réduisant le beurre de cacao nécessaire. Origine végétale dans la pratique industrielle : halal.',
      'Une réserve théorique existe — le glycérol utilisé pourrait en principe être d’origine animale — mais l’industrie du chocolat utilise des sources végétales, et les organismes de certification qui auditent les grandes marques de chocolat valident le E476 dans les références certifiées.',
      'Si une tablette t’inquiète, le vrai point à vérifier n’est généralement pas le E476 mais les arômes (alcool dans certains chocolats fourrés) et la lécithine (E322, quasi toujours de soja ou tournesol : halal). Le chocolat noir simple — cacao, sucre, lécithine, arôme vanille — est licite dans l’immense majorité des cas.',
    ],
    category: 'Additifs',
    related: ['lecithine-e322-halal', 'e471-halal', 'chocolat-liqueur-halal'],
  },
  {
    slug: 'e481-halal',
    question: 'Le E481 (dans le pain de mie) est-il halal ?',
    verdict: '⚠️ Ça dépend de l’origine',
    short:
      'Le E481 (stéaroyl-2-lactylate de sodium) dérive d’acide stéarique, végétal ou animal. Souvent végétal en Europe, mais sans garantie sur l’étiquette.',
    answer: [
      'Le E481 est l’améliorant classique du pain de mie et des brioches industrielles : il rend la mie moelleuse plus longtemps. Il est fabriqué à partir d’acide stéarique et d’acide lactique. L’acide lactique est licite (fermentation) ; l’acide stéarique, lui, peut venir d’huiles végétales ou de graisses animales.',
      'En Europe, la production est majoritairement végétale (palme, notamment), mais comme pour le E471 et le E472, l’origine n’est presque jamais précisée sur l’emballage. Sans certification, il reste un doute — le même degré de doute que le E471, désormais bien connu des consommateurs musulmans.',
      'Solution simple : plusieurs marques de pain de mie vendues en grande surface française sont certifiées halal, et les enseignes répondent sur l’origine de leurs additifs. Ou le pain du boulanger, qui n’a besoin ni de E481 ni de conservateur.',
    ],
    category: 'Additifs',
    related: ['e471-halal', 'e472-halal', 'e570-halal'],
  },
  {
    slug: 'e570-halal',
    question: 'Le E570 (acide stéarique) est-il halal ?',
    verdict: '⚠️ Ça dépend de l’origine',
    short:
      'L’acide stéarique (E570) peut être extrait de graisses végétales (halal) ou animales (douteux). Fréquent aussi dans les gélules et compléments.',
    answer: [
      'Le E570 est un acide gras utilisé comme antiagglomérant et liant, présent dans certains bonbons, chewing-gums, et très fréquent — avec son dérivé le stéarate de magnésium — dans les comprimés et gélules de compléments alimentaires et de médicaments.',
      'Comme toute la famille des dérivés d’acides gras (E471, E472, E481), il peut être produit à partir d’huiles végétales (cas le plus courant aujourd’hui : palme, coco) ou de graisses animales, y compris porcines. L’étiquette ne précise rien : sans certification ou réponse du fabricant, le doute demeure.',
      'Pour les compléments alimentaires, le sujet se cumule souvent avec la gélule en gélatine : un produit « certifié halal » règle les deux d’un coup, et le marché des compléments certifiés a explosé — whey, vitamines, oméga 3 halal se trouvent désormais facilement.',
    ],
    category: 'Additifs',
    related: ['e481-halal', 'medicaments-gelules-halal', 'whey-proteine-halal'],
  },
  {
    slug: 'e903-cire-carnauba-halal',
    question: 'Le E903 (cire de carnauba) est-il halal ?',
    verdict: '✅ Halal (cire de palmier)',
    short:
      'La cire de carnauba (E903) provient des feuilles d’un palmier brésilien : végétale, halal — à ne pas confondre avec le shellac (E904).',
    answer: [
      'Le E903 est récolté sur les feuilles du palmier carnauba, au Brésil. Cette cire végétale fait briller bonbons, dragées, fruits et médicaments. Origine 100 % végétale : halal sans réserve.',
      'La confusion classique : son voisin de numéro E904 (shellac ou gomme-laque), sécrété par un insecte, dont la licéité fait débat entre écoles. Deux enrobages brillants, deux verdicts différents — d’où l’intérêt de lire le numéro précis.',
      'Sur une étiquette de bonbons, la combinaison « E903 + E414 + colorants végétaux » est un bon signal ; « E904 + E120 + gélatine » est le trio à questionner. Trois secondes de lecture qui changent tout.',
    ],
    category: 'Additifs',
    related: ['e904-halal', 'e414-gomme-arabique-halal', 'e120-halal'],
  },
  {
    slug: 'e1105-lysozyme-halal',
    question: 'Le E1105 (lysozyme) est-il halal ?',
    verdict: '✅ Halal (blanc d’œuf)',
    short:
      'Le lysozyme (E1105) est une enzyme extraite du blanc d’œuf de poule : halal. On le trouve surtout dans les fromages affinés.',
    answer: [
      'Le E1105, ou lysozyme, est une enzyme naturellement présente dans le blanc d’œuf de poule, dont elle est extraite industriellement. L’œuf étant licite, le lysozyme l’est aussi : halal, toutes écoles confondues.',
      'Son usage principal : conservateur dans les fromages à pâte dure et affinés (il empêche un gonflement bactérien), et dans certains vins — mais là, c’est le vin le problème, pas l’enzyme.',
      'Pour les fromages, le E1105 est donc un faux suspect : la vraie question reste la présure (l’enzyme de coagulation, potentiellement animale) — un sujet qu’on détaille dans notre page dédiée au fromage. Lysozyme : tranquille. Présure : à vérifier.',
    ],
    category: 'Additifs',
    related: ['fromage-presure-halal', 'e270-acide-lactique-halal', 'vache-qui-rit-halal'],
  },
  // ─── PRODUITS & MARQUES (2e vague) ──────────────────────────────────────────
  {
    slug: 'kitkat-halal',
    question: 'Le KitKat est-il halal ?',
    verdict: '⚠️ Pas certifié en France — recette a priori sans gélatine',
    short:
      'Le KitKat vendu en France n’est pas certifié halal, mais sa recette standard (gaufrette, chocolat) ne contient pas de gélatine. Des versions certifiées existent (Malaisie, Moyen-Orient).',
    answer: [
      'Le KitKat classique, c’est une gaufrette enrobée de chocolat au lait : blé, sucre, lait, cacao, huile végétale, lécithine, arômes. D’après la composition publiée en Europe, pas de gélatine ni d’ingrédient animal problématique évident — mais Nestlé ne certifie pas halal ses KitKat français.',
      'Sans certification, il reste les questions habituelles des chocolats industriels : nature exacte des arômes et des émulsifiants. La plupart des consommateurs musulmans en France le consomment sur la base de la composition ; les plus prudents attendent la certification.',
      'À savoir : les KitKat produits en Malaisie, à Dubaï ou en Turquie sont certifiés halal (le logo figure sur l’emballage) — on les trouve dans certaines épiceries orientales. Même produit, traçabilité vérifiée en plus.',
    ],
    category: 'Produits',
    related: ['nutella-halal', 'kinder-halal', 'snickers-mars-twix-halal'],
  },
  {
    slug: 'ferrero-rocher-halal',
    question: 'Les Ferrero Rocher sont-ils halal ?',
    verdict: '⚠️ Pas certifié — composition a priori sans alcool ni gélatine',
    short:
      'Les Ferrero Rocher ne sont pas certifiés halal, mais leur composition publiée (noisette, chocolat, gaufrette) ne mentionne ni alcool ni gélatine.',
    answer: [
      'Le Ferrero Rocher, c’est une noisette entière, de la pâte de noisette, une gaufrette et du chocolat au lait. D’après la liste d’ingrédients publiée en France : pas de gélatine, pas d’alcool déclaré, lécithine de soja comme émulsifiant. Ferrero a d’ailleurs communiqué à plusieurs reprises que ses grandes références européennes (Nutella, Rocher, Kinder hors gammes spécifiques) ne contiennent ni alcool ni gélatine.',
      'Pour autant, il n’existe pas de certification halal sur les Ferrero Rocher vendus en France. C’est donc la situation classique : composition rassurante, garantie absente. La grande majorité des avis les considèrent consommables sur la base de l’étiquette.',
      'Attention aux cousins : d’autres pralines et chocolats de fêtes (Mon Chéri de la même maison, par exemple) contiennent, elles, de l’alcool bien réel — la liqueur est même dans le nom. Chaque référence a sa propre étiquette : c’est elle qui tranche.',
    ],
    category: 'Produits',
    related: ['nutella-halal', 'kinder-halal', 'chocolat-liqueur-halal'],
  },
  {
    slug: 'milka-halal',
    question: 'Le chocolat Milka est-il halal ?',
    verdict: '⚠️ Ça dépend des références — gélatine dans certaines',
    short:
      'Les tablettes Milka classiques ne contiennent pas de gélatine, mais certaines références fourrées (guimauve…) en contiennent. Pas de certification : vérifier chaque étiquette.',
    answer: [
      'Milka n’est pas une réponse unique : c’est une gamme énorme. Les tablettes classiques (lait, noisettes, Oreo…) affichent une composition sans gélatine ni alcool — la question restante étant l’origine des arômes et émulsifiants, comme pour tout chocolat non certifié.',
      'Mais plusieurs références Milka contiennent de la gélatine, notamment celles à la guimauve. Sur ces produits, la gélatine utilisée dans l’industrie européenne est généralement porcine ou bovine non rituelle : à écarter.',
      'Le réflexe Milka : lire chaque étiquette, référence par référence — « gélatine » y figure obligatoirement quand elle est présente. Et si tu veux du chocolat garanti, des marques certifiées halal existent en épicerie orientale et même en grande surface.',
    ],
    category: 'Produits',
    related: ['kinder-halal', 'kitkat-halal', 'marshmallow-halal'],
  },
  {
    slug: 'lindt-halal',
    question: 'Le chocolat Lindt est-il halal ?',
    verdict: '⚠️ Attention à l’alcool dans plusieurs gammes',
    short:
      'Les tablettes Lindt simples n’affichent ni gélatine ni alcool, mais plusieurs pralinés et bouchées Lindt contiennent de l’alcool (kirsch, liqueurs). Pas de certification.',
    answer: [
      'Chez Lindt, le point de vigilance numéro un n’est pas la gélatine (rare dans leurs recettes) mais l’alcool : plusieurs pralinés, bouchées et chocolats de fête contiennent du kirsch, du rhum ou des liqueurs — parfois de façon peu visible sur le devant de la boîte. L’alcool figure toujours dans la liste d’ingrédients : lecture obligatoire.',
      'Les tablettes classiques (Excellence 70 %, lait…) affichent des compositions simples — cacao, sucre, lait, vanille — sans alcool ni gélatine déclarés. Sans certification halal, on retombe sur le cas habituel : consommable sur la base de l’étiquette pour la plupart des avis, en l’absence de garantie formelle.',
      'Cas particulier des Lindor : les recettes varient selon les parfums — certains contiennent des arômes à vérifier. Règle Lindt : jamais d’achat de boîte cadeau sans retourner la boîte.',
    ],
    category: 'Produits',
    related: ['chocolat-liqueur-halal', 'kitkat-halal', 'ferrero-rocher-halal'],
  },
  {
    slug: 'mentos-halal',
    question: 'Les Mentos sont-ils halal ?',
    verdict: '⚠️ Ça dépend des gammes et des pays',
    short:
      'Certains Mentos contiennent de la gélatine, d’autres non, selon les gammes et les usines. Des versions certifiées halal existent — vérifier chaque paquet.',
    answer: [
      'Les Mentos ne sont pas une réponse unique : selon les parfums, les gammes (dragées, gums) et les pays de production, la recette peut contenir de la gélatine — et souvent aussi de la cire d’abeille (E901, licite) et du carnauba (E903, licite). Le suspect à chercher sur l’étiquette : « gélatine ».',
      'Les Mentos produits dans certaines usines (Indonésie notamment, gros producteur) sont certifiés halal, logo à l’appui — on les croise en épicerie orientale. Les paquets européens sans gélatine dans la liste d’ingrédients sont consommés sans problème par la plupart.',
      'Pour les chewing-gums Mentos, s’ajoute la question habituelle de la base gomme et des arômes — même situation que les autres chewing-gums industriels. Trente secondes d’étiquette règlent chaque cas.',
    ],
    category: 'Produits',
    related: ['chewing-gum-halal', 'dragibus-halal', 'e904-halal'],
  },
  {
    slug: 'dragibus-halal',
    question: 'Les Dragibus sont-ils halal ?',
    verdict: '⚠️ Sans gélatine — colorants à vérifier',
    short:
      'D’après la composition publiée par Haribo France, les Dragibus ne contiennent pas de gélatine. Restent les colorants (E120 possible selon recettes) et l’absence de certification.',
    answer: [
      'Surprise chez Haribo : contrairement aux fraises Tagada ou aux ours d’or, les Dragibus n’affichent pas de gélatine dans leur composition publiée en France — la texture vient d’amidon et de gommes. C’est pour ça que la question revient sans cesse : c’est LE bonbon Haribo que beaucoup pensaient interdit d’office.',
      'Les points restant à vérifier sur le paquet : les colorants — les recettes de bonbons noirs/rouges ont pu utiliser du E120 (cochenille, à éviter) selon les époques, même si les colorants végétaux ont largement pris le relais — et l’enrobage de surface (cires licites E901/E903 en général).',
      'Pas de certification halal sur les Dragibus français : c’est étiquette et conviction personnelle. Alternative zéro doute : Haribo produit en Turquie des gammes 100 % halal certifiées (gélatine bovine rituelle), vendues en épicerie orientale — le goût de l’enfance sans l’arrière-pensée.',
    ],
    category: 'Produits',
    related: ['haribo-halal', 'e120-halal', 'marshmallow-halal'],
  },
  {
    slug: 'marshmallow-halal',
    question: 'Les marshmallows (Chamallows) sont-ils halal ?',
    verdict: '❌ Généralement non — versions halal existantes',
    short:
      'Les marshmallows classiques (Chamallows…) contiennent de la gélatine, généralement porcine : à éviter. Des versions halal (gélatine bovine ou poisson) existent.',
    answer: [
      'Le moelleux du marshmallow, c’est de la gélatine — impossible de faire sans (ou presque). Dans les marques classiques vendues en grande surface française, cette gélatine est généralement porcine : les Chamallows et équivalents sont donc à éviter, c’est l’un des cas les plus nets du rayon confiserie.',
      'La bonne nouvelle : le marshmallow halal existe bel et bien — gélatine bovine issue d’abattage rituel ou gélatine de poisson. Les épiceries orientales et les rayons halal en proposent plusieurs marques certifiées, et le goût est identique.',
      'Vigilance aussi sur les produits qui en cachent : chocolats à la guimauve, biscuits type « têtes au chocolat », céréales avec marshmallows, barbe à papa industrielle… La gélatine se glisse partout où ça mousse et rebondit — l’étiquette la mentionne toujours.',
    ],
    category: 'Produits',
    related: ['gelatine-halal', 'haribo-halal', 'dragibus-halal'],
  },
  {
    slug: 'lu-prince-halal',
    question: 'Les biscuits Prince de LU sont-ils halal ?',
    verdict: '⚠️ Pas certifié — composition a priori sans ingrédient animal problématique',
    short:
      'Les Prince (chocolat) affichent une composition sans gélatine : blé, sucre, huiles végétales, cacao, lait. Pas de certification halal en France.',
    answer: [
      'Le Prince classique fourré chocolat affiche une composition de biscuit industriel standard : céréales, sucre, huiles végétales, cacao, lait, poudre à lever, émulsifiants (lécithines). Pas de gélatine ni de graisse animale déclarée dans la recette française actuelle.',
      'Comme toujours sans certification : les émulsifiants et arômes restent le point théorique de vigilance (origine non précisée), mais rien dans l’étiquette ne signale d’ingrédient animal problématique. La grande majorité des familles musulmanes en France les consomment sans état d’âme.',
      'Si tu préfères le zéro question : plusieurs marques de biscuits certifiés halal (dont des équivalents « fourrés chocolat » très convaincants) occupent désormais les rayons halal des grandes surfaces et les épiceries orientales.',
    ],
    category: 'Produits',
    related: ['oreo-halal', 'kitkat-halal', 'cereales-halal'],
  },
  {
    slug: 'danette-halal',
    question: 'La Danette est-elle halal ?',
    verdict: '⚠️ Crèmes classiques : a priori oui — mousses : gélatine',
    short:
      'Les crèmes dessert Danette classiques n’affichent pas de gélatine (épaississants végétaux). Les mousses et liégeois, si, souvent. Vérifier chaque pot.',
    answer: [
      'La Danette classique (chocolat, vanille, caramel…) est une crème dessert à base de lait, sucre, amidon et carraghénanes (E407, algue rouge : licite) — pas de gélatine dans la composition publiée des recettes standard. C’est ce qui la distingue de beaucoup de desserts lactés concurrents.',
      'En revanche, dès qu’on passe aux textures aériennes — mousses, liégeois avec chantilly, certains « Danette pop » — la gélatine apparaît fréquemment pour tenir la mousse. Même marque, verdicts opposés : c’est le pot qui décide, pas le logo.',
      'Réflexe rayon frais : sur tout dessert lacté, chercher le mot « gélatine » dans la liste d’ingrédients (mention obligatoire). Sans elle : a priori consommable pour la plupart des avis. Avec elle et sans certification : à reposer.',
    ],
    category: 'Produits',
    related: ['yaourt-halal', 'e407-carraghenane-halal', 'glace-halal'],
  },
  {
    slug: 'vache-qui-rit-halal',
    question: 'La Vache qui rit est-elle halal ?',
    verdict: '⚠️ Standard non certifiée — versions halal certifiées existantes',
    short:
      'La Vache qui rit standard n’est pas certifiée halal en France (présure d’origine variable dans les fromages utilisés). Des versions certifiées halal existent, notamment au Maghreb et en rayons halal.',
    answer: [
      'La Vache qui rit est un fromage fondu : on refond des fromages avec du lait et des sels de fonte. La question halal se loge dans les fromages de départ — leur coagulation a pu utiliser de la présure animale (issue de veaux non abattus rituellement). Sur la version standard française, pas de certification ni de garantie sur ce point.',
      'La marque (groupe Bel) produit cependant des versions certifiées halal pour de nombreux marchés — Maroc, Algérie, Moyen-Orient — et on trouve ces boîtes logotées dans les épiceries orientales et certains rayons halal français. Même goût, traçabilité contrôlée.',
      'La position varie donc selon ta rigueur sur la présure : ceux qui suivent l’avis large sur les fromages (présure tolérée par transformation) consomment la version standard ; ceux qui veulent la garantie prennent la boîte certifiée. On détaille tout le débat de la présure sur notre page fromage.',
    ],
    category: 'Produits',
    related: ['fromage-presure-halal', 'kiri-halal', 'babybel-halal'],
  },
  {
    slug: 'kiri-halal',
    question: 'Le Kiri est-il halal ?',
    verdict: '⚠️ Standard non certifié — versions halal existantes',
    short:
      'Comme la Vache qui rit (même groupe), le Kiri standard n’est pas certifié halal en France, mais des versions certifiées existent sur certains marchés.',
    answer: [
      'Le Kiri est un fromage fondu au lait et à la crème, du même groupe Bel que la Vache qui rit — et la situation est identique : la version vendue en grande surface française n’est pas certifiée halal, la question portant sur la présure des fromages entrant dans la recette.',
      'Des Kiri certifiés halal sont produits pour les marchés du Maghreb et du Moyen-Orient (le logo de certification figure sur la boîte) et arrivent dans les épiceries orientales françaises. Si le sujet de la présure t’importe, c’est la version à choisir.',
      'À noter pour les goûters d’enfants : la plupart des fromages fondus concurrents sont dans le même cas exactement. La vraie ligne de partage n’est pas la marque mais la présence ou non d’une certification sur la boîte.',
    ],
    category: 'Produits',
    related: ['vache-qui-rit-halal', 'fromage-presure-halal', 'babybel-halal'],
  },
  {
    slug: 'babybel-halal',
    question: 'Le Babybel est-il halal ?',
    verdict: '⚠️ Coagulant non animal annoncé — pas de certification halal',
    short:
      'Mini Babybel communique sur un coagulant d’origine non animale (fromage adapté aux végétariens en France) : rassurant côté présure, mais sans certification halal formelle.',
    answer: [
      'Cas intéressant : en France, la marque communique depuis plusieurs années sur le fait que Mini Babybel est fabriqué avec un coagulant d’origine non animale et convient aux végétariens. Le point noir habituel des fromages — la présure animale — est donc écarté par le fabricant lui-même sur ce marché.',
      'Pour beaucoup de consommateurs musulmans, cela suffit : lait, ferments, coagulant microbien, sel — rien d’illicite dans la liste. Il ne s’agit pourtant pas d’une certification halal : personne n’audite la chaîne au titre du halal, et les mentions « végétarien » relèvent de la déclaration du fabricant.',
      'Vérifie toujours l’emballage de ton pays d’achat (les recettes varient selon les marchés) : la mention « convient aux végétariens » ou « coagulant microbien » est le signal à chercher sur tous les fromages, Babybel ou pas. C’est l’astuce fromage la plus utile qui soit.',
    ],
    category: 'Produits',
    related: ['fromage-presure-halal', 'vache-qui-rit-halal', 'kiri-halal'],
  },
  {
    slug: 'subway-halal',
    question: 'Subway est-il halal en France ?',
    verdict: '❌ Non (pas de halal en France)',
    short:
      'Les Subway français ne proposent pas de viandes halal. Dans d’autres pays (Moyen-Orient, certains restaurants au Royaume-Uni), des enseignes halal existent.',
    answer: [
      'En France, Subway ne propose pas de viandes halal : poulet, dinde, jambon et bœuf des recettes standard proviennent de filières classiques. Contrairement à une rumeur récurrente, aucune certification ne couvre les restaurants français de l’enseigne.',
      'Ce qui reste possible chez Subway France : les subs végétariens (crudités, fromage — avec la réserve habituelle de la présure — sauces à vérifier) et le thon, si l’on est à l’aise avec la préparation sur le même plan de travail que les viandes — point qui gêne certains.',
      'Ailleurs, le tableau change : au Moyen-Orient tout est halal, et au Royaume-Uni une partie des Subway (souvent en quartiers à forte population musulmane) sert du halal certifié, affiché en vitrine. Le réflexe voyage : chercher l’affichage ou demander — jamais supposer d’un pays à l’autre.',
    ],
    category: 'Produits',
    related: ['kfc-halal', 'mcdo-halal', 'dominos-pizza-halal'],
  },
  {
    slug: 'dominos-pizza-halal',
    question: 'Domino’s Pizza est-il halal en France ?',
    verdict: '❌ Non certifié en France',
    short:
      'Domino’s France n’est pas halal : pepperoni et viandes standard. Les options végétariennes restent possibles, avec les réserves habituelles.',
    answer: [
      'Domino’s Pizza France ne propose pas de gamme halal : les garnitures carnées (pepperoni, bœuf, poulet, jambon) relèvent de filières classiques, et l’enseigne ne revendique aucune certification en France. Le pepperoni des recettes phares est une charcuterie à base de porc et/ou bœuf non rituel.',
      'Les pizzas végétariennes (marguerite, quatre fromages, légumes) restent envisageables selon ta position sur le fromage (présure) et la cuisson dans le même four que les pizzas carnées — les avis tolèrent généralement la cuisson partagée tant qu’il n’y a pas de contact direct, mais chacun place son curseur.',
      'L’alternative simple en France : le pays regorge de pizzerias halal indépendantes — souvent excellentes — et certaines chaînes locales 100 % halal se développent dans les grandes villes. Le comparatif se gagne rarement sur la pizza industrielle.',
    ],
    category: 'Produits',
    related: ['subway-halal', 'kebab-halal', 'kfc-halal'],
  },
  {
    slug: 'o-tacos-halal',
    question: 'O’Tacos est-il halal ?',
    verdict: '✅ Enseigne construite sur la viande halal',
    short:
      'O’Tacos s’est développé sur un positionnement viandes halal, via ses fournisseurs. Comme toujours en franchise : un coup d’œil à l’affichage du restaurant reste le bon réflexe.',
    answer: [
      'O’Tacos, l’enseigne qui a industrialisé le french tacos, s’est construite dès l’origine sur un positionnement halal : viandes (poulet mariné, viande hachée, cordon bleu…) issues de filières halal via ses fournisseurs référencés. C’est un pilier assumé de son succès auprès de sa clientèle.',
      'La nuance de rigueur en restauration franchisée : la garantie vaut ce que valent les contrôles, et les certificats affichés émanent des fournisseurs plus que d’une certification d’enseigne unique auditant chaque restaurant. Les plus exigeants demandent en caisse les certificats des viandes — pratique courante et bien acceptée.',
      'Au-delà du halal, on te doit la lucidité nutritionnelle : un tacos M sauce fromagère dépasse allègrement les 1000 kcal. Halal, oui — léger, non. Ton cœur aussi a des droits sur toi.',
    ],
    category: 'Produits',
    related: ['kebab-halal', 'kfc-halal', 'cordon-bleu-halal'],
  },
  {
    slug: 'starbucks-halal',
    question: 'Starbucks est-il halal ?',
    verdict: '⚠️ Boissons : très largement oui — attention à la vitrine',
    short:
      'Les cafés et boissons Starbucks classiques ne contiennent ni alcool ni gélatine. Les pâtisseries de la vitrine, en revanche, sont à vérifier (gélatine, arômes).',
    answer: [
      'Côté boissons, Starbucks est un terrain plutôt tranquille : cafés, lattes, cappuccinos, chocolats et la plupart des frappuccinos sont composés de café, lait, sucre, sirops aromatisés et crème — sans alcool ni gélatine dans les recettes standard. Les sirops (vanille, caramel…) sont des préparations sucrées aromatisées, pas des liqueurs.',
      'Les points à vérifier : certaines boissons saisonnières à garnitures spéciales (toppings, morceaux) peuvent embarquer des ingrédients à contrôler, et surtout la vitrine sucrée-salée — sandwichs (charcuteries non halal), cakes et desserts pouvant contenir gélatine ou alcool (tiramisu…). Le personnel dispose des fiches ingrédients sur demande.',
      'Aucun Starbucks français n’est certifié halal en tant que tel ; dans les pays du Golfe et en Asie du Sud-Est, les enseignes le sont. Pour ton latte quotidien en France : pas de souci particulier selon la quasi-totalité des avis.',
    ],
    category: 'Produits',
    related: ['mcdo-halal', 'glace-halal', 'arome-vanille-halal'],
  },
  {
    slug: 'fanta-halal',
    question: 'Le Fanta est-il halal ?',
    verdict: '✅ Consommé sans problème (pas d’alcool déclaré)',
    short:
      'Le Fanta est un soda aux arômes de fruits sans alcool ni ingrédient animal déclarés : consommé sans problème par la quasi-totalité des musulmans.',
    answer: [
      'Le Fanta (orange et autres parfums) est composé d’eau gazéifiée, de sucre, de jus concentré, d’arômes naturels et d’acidifiants — pas d’alcool ni d’ingrédient animal dans la composition déclarée en Europe. Comme le Coca-Cola du même groupe, il est consommé sans difficulté par l’immense majorité des musulmans.',
      'Le débat théorique est le même que pour tous les sodas : les arômes peuvent techniquement être extraits avec des traces de solvants alcooliques, indétectables et évaporées. La position très largement dominante : ces traces techniques infinitésimales ne rendent pas la boisson illicite — un liquide n’est interdit que s’il enivre en grande quantité, ce qui n’est évidemment pas le cas.',
      'Dans de nombreux pays musulmans, le Fanta produit localement est certifié halal, ce qui confirme l’analyse. Vigilance uniquement sur les éditions exotiques étrangères : certains parfums peuvent contenir des colorants comme le E120 (cochenille) selon les pays — l’étiquette tranche.',
    ],
    category: 'Produits',
    related: ['coca-cola-halal', 'pepsi-halal', 'ice-tea-halal'],
  },
  {
    slug: 'pepsi-halal',
    question: 'Le Pepsi est-il halal ?',
    verdict: '✅ Consommé sans problème (pas d’alcool déclaré)',
    short:
      'Comme le Coca-Cola, le Pepsi ne contient ni alcool ni ingrédient animal déclarés. La rumeur récurrente ne s’appuie sur rien de sérieux.',
    answer: [
      'Le Pepsi est un cola : eau gazéifiée, sucre, colorant caramel (E150d), acidifiant, arômes naturels dont caféine. Aucun alcool ni ingrédient animal dans la composition déclarée. Il est certifié halal dans de nombreux pays musulmans où il est produit localement — l’Arabie saoudite et l’Égypte en boivent des océans.',
      'Les rumeurs qui reviennent en boucle (« l’arôme secret contient du porc », lectures cachées du logo…) n’ont jamais produit la moindre preuve. La position des organismes de certification qui ont audité les usines : rien d’illicite.',
      'Reste l’éternel débat des traces de solvants dans les arômes, identique pour tous les sodas — considéré comme sans effet sur la licéité par l’avis très largement dominant. Bref : le Pepsi se juge sur le sucre qu’il contient, pas sur un interdit religieux.',
    ],
    category: 'Produits',
    related: ['coca-cola-halal', 'fanta-halal', 'red-bull-halal'],
  },
  {
    slug: 'ice-tea-halal',
    question: 'L’Ice Tea (Lipton…) est-il halal ?',
    verdict: '✅ Consommé sans problème',
    short:
      'Les thés glacés industriels (Lipton, Fuze Tea…) sont des boissons sucrées aromatisées sans alcool ni ingrédient animal déclarés : pas de problème halal.',
    answer: [
      'Les thés glacés du commerce — Lipton Ice Tea, Fuze Tea, marques de distributeurs — sont composés d’eau, de sucre, d’extrait de thé, d’acidifiants et d’arômes (pêche, citron…). Ni alcool ni ingrédient animal dans les compositions déclarées en Europe : rien à signaler côté halal.',
      'La seule question théorique est celle de tous les arômes industriels (traces techniques de solvants, évaporées et indétectables), balayée par l’avis dominant : ces boissons sont licites, et elles sont d’ailleurs certifiées halal dans plusieurs pays de production.',
      'Astuce du rayon : certaines boissons « détox » ou kombucha voisines dans le frigo du magasin contiennent, elles, de l’alcool résiduel de fermentation — un sujet réel qu’on traite sur notre page kombucha. L’ice tea classique, lui, est une simple infusion sucrée : tranquille.',
    ],
    category: 'Produits',
    related: ['kombucha-halal', 'fanta-halal', 'coca-cola-halal'],
  },
  {
    slug: 'isla-delice-halal',
    question: 'Isla Délice est-il vraiment halal ?',
    verdict: '✅ Marque 100 % halal certifiée',
    short:
      'Isla Délice est la marque halal leader en France : toute la gamme est certifiée et contrôlée, le certificateur est indiqué sur l’emballage.',
    answer: [
      'Isla Délice est l’exemple inverse de la plupart des questions qu’on traite ici : ce n’est pas une marque classique avec un doute halal, c’est une marque construite à 100 % sur le halal — charcuteries de volaille et de bœuf, lardons de dinde, knacks, plats préparés. Toute la gamme est certifiée, avec contrôle de la chaîne, et l’organisme certificateur figure sur chaque emballage.',
      'C’est ce qui a fait son succès : remplacer terme à terme les produits du quotidien (lardons, chorizo, knacki, jambon) par des versions halal de goût comparable, en grande surface. Pour les recettes familiales françaises — carbonara, raclette, hot-dogs — c’est la solution de facilité.',
      'Le conseil qui reste valable même ici : jette un œil au logo de certification sur le paquet si le niveau d’exigence du certificateur t’importe (positions différentes sur l’étourdissement, les contrôles…). Mais dans le paysage français, une marque entièrement halal avec certification affichée est exactement ce qu’on recommande de chercher.',
    ],
    category: 'Produits',
    related: ['knacki-halal', 'lardons-halal', 'certifications-halal-france'],
  },
  // ─── PRODUITS DU QUOTIDIEN & COMPLÉMENTS ────────────────────────────────────
  {
    slug: 'knacki-halal',
    question: 'Les Knacki sont-elles halal ?',
    verdict: '❌ Non — alternatives halal directes',
    short:
      'Les Knacki classiques (Herta) sont au porc, et les versions volaille ne sont pas certifiées halal. Les knacks halal existent chez les marques spécialisées.',
    answer: [
      'Les Knacki originales de Herta sont des saucisses de porc : interdites, sans débat. Herta propose aussi des versions 100 % volaille, mais celles-ci ne sont pas halal pour autant : la volaille provient d’abattoirs classiques, sans abattage rituel ni certification.',
      'C’est le piège classique du rayon : « volaille » n’a jamais voulu dire « halal ». Sans certification, une saucisse de poulet reste une volaille non rituelle.',
      'La solution est à deux mètres dans le rayon halal : plusieurs marques spécialisées (Isla Délice et d’autres) font des knacks de volaille certifiées au goût très proche, pensées exactement pour ça — hot-dogs et coquillettes-knacks compris. Le réflexe : chercher le logo de certification, pas la couleur du paquet.',
    ],
    category: 'Produits',
    related: ['isla-delice-halal', 'lardons-halal', 'cordon-bleu-halal'],
  },
  {
    slug: 'cordon-bleu-halal',
    question: 'Le cordon bleu est-il halal ?',
    verdict: '⚠️ Standard : non — versions halal courantes',
    short:
      'Les cordons bleus de supermarché classiques (volaille non rituelle + jambon) ne sont pas halal. Les versions certifiées existent partout en rayon halal.',
    answer: [
      'Le cordon bleu industriel classique cumule deux problèmes : une escalope de volaille issue d’abattage non rituel, et une tranche de jambon — parfois de porc, parfois de dinde non rituelle — le tout pané. Sans certification : pas halal, même quand l’emballage affiche « 100 % volaille ».',
      'La parade est devenue très simple : le cordon bleu est l’un des produits stars du rayon halal — toutes les marques spécialisées en proposent (poulet, dinde, jambon de volaille halal), avec certification affichée. Les enfants n’y voient aucune différence, littéralement.',
      'Version maison pour les motivés : escalope halal, jambon de volaille halal, fromage (vérifier la présure ou prendre un certifié), chapelure. Dix minutes, meilleur que l’industriel, et zéro question.',
    ],
    category: 'Alimentation',
    related: ['knacki-halal', 'isla-delice-halal', 'viande-supermarche-halal'],
  },
  {
    slug: 'lardons-halal',
    question: 'Par quoi remplacer les lardons ? Des lardons halal existent-ils ?',
    verdict: '❌ Lardons de porc interdits — alternatives efficaces',
    short:
      'Les lardons classiques sont du porc : interdits. Alternatives : lardons de dinde/bœuf halal (rayon halal), ou fumés végétaux — la carbonara halal existe.',
    answer: [
      'Les lardons sont de la poitrine de porc : interdits, cas le plus simple du droit alimentaire musulman. Mais la question que tout le monde pose vraiment, c’est : comment faire une carbonara, une quiche ou une raclette sans eux ?',
      'Réponse rayon halal : les « lardons » de dinde ou de bœuf fumés halal — plusieurs marques certifiées en proposent — apportent le goût fumé-salé recherché. Dans une quiche ou des pâtes, la différence se remarque à peine. Autres pistes : viande des Grisons halal, pastrami de bœuf halal, ou allumettes de poulet fumé.',
      'Piste végétale en bonus : tofu fumé ou champignons poêlés au paprika fumé — le « goût lardon » vient surtout du fumage et du sel. La cuisine française se halalise très bien : c’est une question d’ingrédients, pas de recettes.',
    ],
    category: 'Alimentation',
    related: ['isla-delice-halal', 'knacki-halal', 'fromage-presure-halal'],
  },
  {
    slug: 'kebab-halal',
    question: 'Le kebab est-il toujours halal ?',
    verdict: '⚠️ Souvent, pas toujours — demander le certificat',
    short:
      'La viande de kebab est souvent halal, mais pas systématiquement : les broches industrielles ont des traçabilités variables. Un kebab sérieux affiche son certificat.',
    answer: [
      'Le réflexe « kebab = halal » est trop rapide. La plupart des kebabs en France servent effectivement de la viande halal — c’est leur clientèle — mais les broches industrielles (souvent importées d’Allemagne ou des Pays-Bas, gros producteurs) ont des niveaux de traçabilité très variables, et des fraudes à la viande non rituelle mélangée ont été documentées dans la filière européenne.',
      'Les signaux d’un kebab sérieux : certificat de son fournisseur de broches affiché ou disponible en caisse, enseigne assumant le halal (pas seulement « viande halal » écrit au marqueur), et idéalement un certificateur connu derrière. Demander ne vexe personne — les bons gérants sortent le papier avec fierté.',
      'Vigilance annexe : la sauce algérienne ou samouraï ne pose pas de problème, mais certains établissements servent aussi de l’alcool ou des produits non halal — chacun juge de sa ligne sur le lieu. Et le kebab maison (émincé de veau ou poulet halal mariné) reste le boss final du rapport qualité-confiance.',
    ],
    category: 'Alimentation',
    related: ['o-tacos-halal', 'viande-supermarche-halal', 'certifications-halal-france'],
  },
  {
    slug: 'biere-sans-alcool-halal',
    question: 'La bière sans alcool est-elle halal ?',
    verdict: '⚠️ Avis divergents — dépend du 0,0 %',
    short:
      'Les « sans alcool » à moins de 0,5 % contiennent de l’alcool résiduel : à éviter pour la majorité. Les vraies 0,0 % divisent les savants (résidus nuls, mais imitation débattue).',
    answer: [
      'Piège d’étiquette : en Europe, une bière peut s’appeler « sans alcool » jusqu’à 0,5 % d’alcool. Ces bières contiennent donc réellement de l’alcool, en petite quantité — la majorité des savants les interdisent, l’alcool restant de l’alcool quelle que soit la dose (« ce qui enivre en grande quantité est interdit en petite »).',
      'Les « 0,0 % » sont un autre débat : quand le procédé garantit une teneur nulle (désalcoolisation poussée ou fermentation stoppée), il n’y a plus d’alcool à proprement parler. Certains savants les permettent alors (c’est une boisson maltée, comme celles très populaires au Moyen-Orient) ; d’autres les déconseillent pour la ressemblance avec l’alcool et la porte qu’elle entrouvre — l’argument de l’imitation.',
      'En pratique : les boissons maltées halal certifiées (sans fermentation alcoolique du tout) existent et règlent la question. Pour les 0,0 % industrielles, position personnelle éclairée : vérifier le vrai taux (0,0 affiché), et savoir que les deux avis existent chez des savants sérieux.',
    ],
    category: 'Alimentation',
    related: ['kombucha-halal', 'vinaigre-halal', 'cuisine-alcool-halal'],
  },
  {
    slug: 'kombucha-halal',
    question: 'Le kombucha est-il halal ?',
    verdict: '⚠️ Prudence — alcool résiduel de fermentation',
    short:
      'Le kombucha est un thé fermenté contenant naturellement 0,5 à 2 % d’alcool résiduel selon les brassins : la prudence domine chez les savants.',
    answer: [
      'Le kombucha est un thé sucré fermenté par une culture de levures et bactéries — et qui dit fermentation par levures dit production d’alcool. Les kombuchas du commerce affichent généralement moins de 1,2 % (seuil d’étiquetage), mais des analyses indépendantes ont régulièrement mesuré des taux réels entre 0,5 et 2 %, surtout sur les produits crus non pasteurisés qui continuent de fermenter en bouteille.',
      'Avec un alcool résiduel réel et variable, la position prudente domine : à éviter, comme toute boisson dont on ne maîtrise pas la teneur. Un produit garanti sous 0,5 % rejoint le débat de la bière sans alcool — toléré par certains avis, écarté par d’autres.',
      'Si c’est le côté pétillant-fermenté qui te plaît : le kéfir de fruits maison à fermentation courte, les sodas au gingembre non fermentés ou l’eau pétillante aromatisée cochent la case sans le doute. Le kombucha « santé » n’a de toute façon rien de magique que ces alternatives n’aient pas.',
    ],
    category: 'Alimentation',
    related: ['biere-sans-alcool-halal', 'vinaigre-halal', 'ice-tea-halal'],
  },
  {
    slug: 'cereales-halal',
    question: 'Les céréales du petit-déjeuner sont-elles halal ?',
    verdict: '⚠️ La plupart oui — gélatine et D3 à surveiller',
    short:
      'La plupart des céréales (blé, maïs, sucre, cacao) sont sans ingrédient animal. À surveiller : les marshmallows (gélatine) et la vitamine D3 ajoutée (lanoline).',
    answer: [
      'Bonne nouvelle du petit-déjeuner : la majorité des céréales industrielles — pétales de maïs, riz soufflé, blé au chocolat ou au miel — sont composées de céréales, sucre, cacao, huile et vitamines : pas d’ingrédient animal problématique dans la plupart des recettes vendues en France.',
      'Les deux points de contrôle : la gélatine, présente dès qu’il y a des marshmallows ou certains glaçages (céréales américaines importées surtout) — étiquette éliminatoire — et la vitamine D3 d’enrichissement, souvent issue de lanoline (graisse de laine de mouton), tolérée par la grande majorité des avis car extraite d’un animal vivant sans consommation de chair (le débat existe, on le détaille sur notre page vitamine D3).',
      'Réflexe import : les boîtes américaines colorées des épiceries « US » sont les plus susceptibles de contenir gélatine ou colorants comme le E120. Les grandes références européennes, elles, passent presque toutes le contrôle de l’étiquette.',
    ],
    category: 'Alimentation',
    related: ['marshmallow-halal', 'vitamine-d3-halal', 'e120-halal'],
  },
  {
    slug: 'sushi-halal',
    question: 'Les sushis sont-ils halal ?',
    verdict: '⚠️ Le poisson oui — attention au mirin et aux sauces',
    short:
      'Le poisson cru est halal. Les pièges du restaurant japonais : le mirin (alcool de riz) dans certains riz et sauces, la sauce anguille, et le surimi.',
    answer: [
      'Le cœur du sushi — poisson cru, riz, algue nori, avocat, concombre — est halal (le poisson n’exige pas d’abattage rituel). Un plateau saumon-thon-maki concombre est licite pour toutes les écoles, hors débat hanafite sur les seuls fruits de mer non-poissons (crevette dans certains California).',
      'Les vrais pièges sont liquides : le mirin, alcool de riz doux omniprésent dans la cuisine japonaise, peut entrer dans l’assaisonnement du riz à sushi, les sauces sucrées (sauce anguille/unagi notamment) et certaines marinades. La sauce soja fermentée contient elle aussi des traces d’alcool de fermentation — largement tolérées par les avis dominants, mais les sauces soja sans alcool certifiées existent.',
      'En pratique au restaurant : demander si le riz et les sauces contiennent mirin ou saké (les bons restaurants savent répondre), éviter les pièces laquées type unagi en cas de doute, et savoir que des restaurants japonais halal certifiés se développent dans les grandes villes — Paris en compte plusieurs excellents.',
    ],
    category: 'Alimentation',
    related: ['sauce-soja-halal', 'surimi-halal', 'poisson-fruits-de-mer-halal'],
  },
  {
    slug: 'chocolat-liqueur-halal',
    question: 'Les chocolats à la liqueur sont-ils halal ?',
    verdict: '❌ Non (alcool réel)',
    short:
      'Chocolats à la liqueur, pralines au kirsch, babas au rhum : l’alcool y est présent en quantité réelle, non évaporée — interdits.',
    answer: [
      'Les chocolats à la liqueur contiennent de l’alcool liquide bien réel — c’est leur raison d’être. Contrairement au mythe de « l’alcool qui s’évapore à la cuisson », ici il n’y a même pas de cuisson : la liqueur est enfermée telle quelle dans la coque. Interdits, sans nuance à chercher.',
      'Même famille à écarter : babas au rhum, forêts noires au kirsch véritable, truffes au Grand Marnier, glaces au rhum-raisin à l’alcool réel, et les « arômes » qui sont en fait de l’alcool ajouté (l’étiquette dit alors « rhum », « liqueur », pas « arôme »). En pâtisserie aussi, l’alcool cuit ne disparaît jamais totalement — les mesures montrent qu’il en reste une part significative.',
      'Les alternatives licites existent pour chaque plaisir : pralinés, ganaches, chocolats fourrés caramel ou pistache — tout le rayon non alcoolisé, qui reste 95 % du rayon. Et pour le goût « rhum » en pâtisserie : les arômes sans alcool font le travail dans les recettes maison.',
    ],
    category: 'Alimentation',
    related: ['lindt-halal', 'cuisine-alcool-halal', 'arome-vanille-halal'],
  },
  {
    slug: 'whey-proteine-halal',
    question: 'La whey (protéine) est-elle halal ?',
    verdict: '⚠️ Souvent tolérée — versions certifiées conseillées',
    short:
      'La whey provient du lactosérum de fromagerie, où intervient parfois la présure animale. La plupart des avis la tolèrent ; les whey certifiées halal règlent la question.',
    answer: [
      'La whey est extraite du lactosérum, le liquide issu de la fabrication du fromage. Le débat halal vient de là : ce fromage a pu être coagulé avec de la présure animale (enzyme de veau non rituel). La whey elle-même n’est que du lait filtré, mais son procédé croise potentiellement cet ingrédient discuté.',
      'La position dominante est tolérante : le lactosérum est un dérivé du lait (licite), la présure n’y subsiste qu’à l’état de traces infimes, et une large partie de la production utilise désormais des enzymes microbiennes. Beaucoup de savants classent donc la whey standard comme licite. Les plus rigoureux préfèrent la garantie.',
      'Et la garantie existe : le marché des whey certifiées halal a explosé — grandes marques de nutrition sportive comprises, logo sur le pot. À vérifier aussi sur l’étiquette : les arômes gourmands (rarement problématiques) et l’absence de créamer à gélatine dans les mélanges. Pour les gélules et autres compléments, même réflexe certification.',
    ],
    category: 'Produits',
    related: ['creatine-halal', 'fromage-presure-halal', 'medicaments-gelules-halal'],
  },
  {
    slug: 'creatine-halal',
    question: 'La créatine est-elle halal ?',
    verdict: '✅ Halal (synthétique) — gélules à vérifier',
    short:
      'La créatine monohydrate du commerce est synthétisée chimiquement, sans matière animale : halal. Seul point à vérifier : la gélule (gélatine) si tu ne prends pas la poudre.',
    answer: [
      'Contrairement à ce que son lien avec la viande laisse penser (on en trouve naturellement dans le muscle), la créatine vendue en complément est produite par synthèse chimique — à partir de sarcosine et de cyanamide, sans aucun tissu animal. La créatine monohydrate en poudre est donc halal, et c’est l’avis répandu sans difficulté.',
      'Le seul point de contrôle est l’enveloppe : en gélules, vérifier qu’il s’agit de capsules végétales (HPMC, pullulan) et non de gélatine — le grand classique des compléments. La poudre nature, elle, ne pose aucune question.',
      'Au passage, la créatine est l’un des compléments les plus étudiés et les plus sûrs de la nutrition sportive — halal et efficace, combinaison rare dans un marché qui vend beaucoup de poudre aux yeux. Prends la monohydrate simple, pas les mélanges exotiques.',
    ],
    category: 'Produits',
    related: ['whey-proteine-halal', 'medicaments-gelules-halal', 'taurine-halal'],
  },
  {
    slug: 'collagene-halal',
    question: 'Le collagène est-il halal ?',
    verdict: '⚠️ Ça dépend de la source (comme la gélatine)',
    short:
      'Le collagène est extrait de peaux et os — porcins (interdit), bovins (selon abattage) ou marins (halal). Le collagène marin est la valeur sûre.',
    answer: [
      'Le collagène des compléments beauté et articulations est le cousin direct de la gélatine : extrait des peaux, os et cartilages d’animaux. Même grille de lecture — collagène porcin : interdit ; bovin : licite seulement si l’animal a été abattu rituellement (rare sans certification) ; marin (peaux de poissons) : halal sans condition.',
      'Le problème du marché : beaucoup de produits indiquent juste « collagène hydrolysé » ou « peptides de collagène » sans préciser la source. Sans mention « marin » ou « bovin halal certifié », le doute est réel — le porcin est courant dans l’industrie car moins cher.',
      'La solution simple : choisir un collagène marin (mention explicite « poisson » ou « marine collagen ») ou un produit certifié halal — l’offre est désormais large. Et vérifier la gélule si c’en est une. Pour la version gratuite : le bouillon d’os de bœuf halal maison est littéralement du collagène.',
    ],
    category: 'Produits',
    related: ['gelatine-halal', 'gelatine-poisson-halal', 'whey-proteine-halal'],
  },
  {
    slug: 'vitamine-d3-halal',
    question: 'La vitamine D3 est-elle halal ?',
    verdict: '✅ Largement tolérée (lanoline) — versions végétales existantes',
    short:
      'La D3 classique est extraite de la lanoline (graisse de laine de mouton vivant) : tolérée par la grande majorité des avis. La D3 de lichen est l’alternative sans débat.',
    answer: [
      'La vitamine D3 des compléments et des aliments enrichis provient majoritairement de la lanoline — la graisse naturelle de la laine de mouton, récoltée à la tonte d’animaux vivants. Pas d’abattage, pas de chair consommée : la grande majorité des avis la considèrent licite, la laine et ses dérivés d’un animal vivant licite étant purs.',
      'Un débat minoritaire existe (principe de précaution sur tout dérivé animal sans abattage rituel), mais il reste marginal : la lanoline est aussi utilisée dans les cosmétiques et baumes sans que cela soulève d’objection majeure. Les organismes de certification valident couramment la D3 sur lanoline.',
      'Pour la tranquillité totale : la D3 végétale extraite du lichen existe (souvent étiquetée « vegan D3 ») et des D3 certifiées halal aussi. Vérifie l’enveloppe (gélatine vs capsule végétale) et le support huileux. Vu le déficit en vitamine D des habitants du nord de l’Europe, c’est un complément que ton médecin validera volontiers — halal compris.',
    ],
    category: 'Produits',
    related: ['medicaments-gelules-halal', 'cereales-halal', 'collagene-halal'],
  },
  {
    slug: 'taurine-halal',
    question: 'La taurine (Red Bull, Monster) est-elle halal ?',
    verdict: '✅ Halal (synthétique)',
    short:
      'La taurine des boissons énergisantes est 100 % synthétique — le mythe de la taurine de taureau est faux. Halal.',
    answer: [
      'Le mythe a la vie dure : non, la taurine des boissons énergisantes ne provient pas de taureaux (ni de leur bile, ni d’ailleurs). Elle a certes été isolée pour la première fois dans la bile de bœuf au XIXe siècle — d’où son nom — mais la taurine industrielle est entièrement synthétique, produite par réaction chimique sans aucune matière animale.',
      'C’est un acide aminé que ton propre corps fabrique et qu’on trouve dans l’alimentation courante. Côté halal : rien à signaler, et les boissons énergisantes sont d’ailleurs certifiées halal dans de nombreux pays musulmans, taurine comprise.',
      'Le vrai sujet des energy drinks n’est pas religieux mais sanitaire : doses massives de caféine et de sucre, déconseillées aux ados qui en sont pourtant les premiers consommateurs. Halal ne veut pas dire bon pour toi — ton cœur bat déjà assez vite.',
    ],
    category: 'Produits',
    related: ['red-bull-halal', 'monster-halal', 'creatine-halal'],
  },
  // ─── PRATIQUE (2e vague) ────────────────────────────────────────────────────
  {
    slug: 'tatouage-halal',
    question: 'Le tatouage est-il halal ?',
    verdict: '❌ Interdit (majorité) — nuances importantes',
    short:
      'Le tatouage permanent est interdit pour la grande majorité des savants (hadiths explicites). Le henné est permis. Un tatouage antérieur n’est pas un péché continu.',
    answer: [
      'Le tatouage permanent est interdit selon la grande majorité des savants, sur la base de hadiths explicites où le Prophète ﷺ a maudit « celle qui tatoue et celle qui se fait tatouer » (Boukhari, Mouslim). Les raisons invoquées : modification durable de la création et pratique liée à des rites anciens.',
      'Ce qui est permis sans débat : le henné (traditionnel et recommandé même), les tatouages éphémères qui s’effacent, et le maquillage semi-permanent fait l’objet d’un débat distinct (certains l’assimilent au tatouage, d’autres non vu son caractère non définitif).',
      'Pour ceux qui se sont fait tatouer avant de pratiquer ou de se convertir : le repentir suffit — un tatouage existant n’est pas un péché qui se renouvelle chaque jour, et l’ablution comme la prière restent parfaitement valides avec (l’encre est sous la peau, l’eau atteint bien la surface). Le retrait au laser n’est pas une obligation, surtout s’il est coûteux ou risqué : c’est l’avis répandu des savants contemporains.',
    ],
    category: 'Vie quotidienne',
    related: ['piercing-halal', 'vernis-ongles-priere', 'parfum-alcool-halal'],
  },
  {
    slug: 'piercing-halal',
    question: 'Le piercing est-il halal ?',
    verdict: '⚠️ Oreilles/nez pour les femmes : permis — le reste débattu',
    short:
      'Les boucles d’oreilles et le piercing du nez pour les femmes sont permis (pratique attestée). Les autres piercings, et ceux des hommes, font débat.',
    answer: [
      'Les boucles d’oreilles féminines sont permises sans divergence notable : les femmes des compagnons en portaient, et percer les oreilles des filles est admis par les écoles. Le piercing du nez féminin est également permis pour la plupart des savants, notamment là où c’est une parure culturellement établie (sous-continent indien).',
      'Pour les autres emplacements (arcade, lèvre, nombril…) : beaucoup de savants contemporains les déconseillent ou les interdisent — mutilation sans usage établi, imitation de modes, risques médicaux, et exposition d’une zone qui devrait rester couverte pour le nombril. Pour les hommes, la majorité interdit les piercings, la parure corporelle de ce type étant considérée comme féminine dans les textes.',
      'Comme souvent, la question cache la vraie grille de lecture : parure admise et discrète d’un côté, transformation corporelle suivie de modes de l’autre. Pour un piercing déjà posé, le retrait laisse au pire une trace minime — la situation se corrige facilement, contrairement au tatouage.',
    ],
    category: 'Vie quotidienne',
    related: ['tatouage-halal', 'vernis-ongles-priere', 'rouge-levres-carmin-halal'],
  },
  {
    slug: 'vernis-ongles-priere',
    question: 'Peut-on prier avec du vernis à ongles ?',
    verdict: '⚠️ La prière oui — les ablutions non',
    short:
      'Le vernis classique est imperméable : les ablutions faites avec ne sont pas valides (l’eau n’atteint pas l’ongle). L’astuce : le poser après le wudu, le retirer avant de le refaire.',
    answer: [
      'Le problème n’est pas la prière elle-même mais l’ablution : le vernis classique forme une couche imperméable qui empêche l’eau d’atteindre l’ongle, or le lavage des mains jusqu’aux poignets — ongles compris — est un pilier du wudu. Ablution invalide = prière invalide. C’est l’avis de l’immense majorité des savants.',
      'Les solutions pratiques dans l’ordre de fiabilité : poser le vernis quand on est déjà en état d’ablution et le retirer avant de devoir la refaire (ou le porter pendant les règles) ; les vernis « perméables/wudu-friendly » vendus comme laissant passer l’eau existent, mais les tests indépendants sont contrastés — la plupart des savants recommandent de ne pas s’y fier ; le henné, lui, colore sans couche et ne pose aucun problème.',
      'Précision utile : ceci concerne le vernis posé au moment de faire l’ablution. Un vernis posé sur une ablution valide n’annule rien — tu peux prier avec jusqu’à ce que l’ablution soit rompue. D’où la stratégie « pose le vendredi soir, retire avant fajr » que beaucoup ont adoptée.',
    ],
    category: 'Prière',
    related: ['tatouage-halal', 'rouge-levres-carmin-halal', 'ablutions-chaussettes'],
  },
  {
    slug: 'rouge-levres-carmin-halal',
    question: 'Le rouge à lèvres au carmin (E120) est-il halal ?',
    verdict: '⚠️ Avis partagés (cosmétique vs ingestion)',
    short:
      'Le carmin (cochenille) dans un cosmétique est toléré par une partie des avis (usage externe), mais le rouge à lèvres s’ingère partiellement — beaucoup préfèrent l’éviter.',
    answer: [
      'Le carmin — le E120, extrait de l’insecte cochenille — colore une grande partie des rouges à lèvres et blushs (cherche « CI 75470 » dans la liste INCI). En alimentaire, la majorité l’écarte ; en cosmétique, la question se dédouble : un usage purement externe est toléré par beaucoup d’avis (on ne mange pas son blush), mais le rouge à lèvres est un cas frontière — on en ingère mécaniquement de petites quantités au fil de la journée.',
      'D’où les deux positions : tolérance (quantités infimes, usage cosmétique, transformation du pigment) et abstention (même logique que l’alimentaire dès qu’il y a ingestion). Les deux existent chez des gens sérieux — c’est un vrai cas de conscience personnelle.',
      'La sortie par le haut est facile : les gammes sans carmin sont nombreuses (colorants minéraux, la mention « vegan » garantit l’absence de cochenille), et les marques de cosmétiques certifiés halal se multiplient. Pour celles qui veulent le rouge parfait sans la question : il existe, littéralement dans le même rayon.',
    ],
    category: 'Vie quotidienne',
    related: ['e120-halal', 'parfum-alcool-halal', 'maquillage-ramadan'],
  },
  {
    slug: 'musique-halal',
    question: 'La musique est-elle haram ?',
    verdict: '⚠️ Divergence réelle entre savants',
    short:
      'Sujet réellement débattu : l’avis classique majoritaire restreint les instruments ; des savants reconnus permettent la musique au contenu décent. Les deux positions s’appuient sur des textes.',
    answer: [
      'Voici l’une des questions les plus débattues du fiqh — et l’honnêteté oblige à présenter les deux camps. L’avis classique majoritaire des quatre écoles restreint l’usage des instruments de musique (hors tambour daf pour les fêtes), sur la base de hadiths comme celui de Boukhari mentionnant ceux qui rendront licites « la soie et les instruments ». Pour cet avis : chant sans instrument (anasheed) permis, musique instrumentale à éviter.',
      'Face à lui, des savants anciens et contemporains reconnus (Ibn Hazm hier, cheikh al-Qaradawi et d’autres récemment) jugent ces hadiths non concluants ou contextuels et permettent la musique dont le contenu est décent — jugeant l’interdit lié aux paroles obscènes, à la débauche associée ou à l’excès qui détourne de la prière, pas aux sons eux-mêmes.',
      'Ce qui fait consensus des deux côtés : paroles vulgaires ou contraires à la foi, ambiances de débauche et musique qui fait manquer les prières posent problème quel que soit l’avis ; et le Coran récité reste au-dessus de tout ce que l’oreille peut recevoir. Pour ta pratique personnelle : renseigne-toi honnêtement des deux positions et suis celle qui correspond à ta démarche — sans juger l’autre camp.',
    ],
    category: 'Vie quotidienne',
    related: ['anniversaire-halal', 'souhaiter-noel-halal', 'halal-definition'],
  },
  {
    slug: 'anniversaire-halal',
    question: 'Fêter les anniversaires est-il halal ?',
    verdict: '⚠️ Avis divergents',
    short:
      'Certains savants l’interdisent (innovation, imitation), beaucoup de contemporains le permettent comme simple habitude sociale sans caractère religieux. Divergence sereine possible.',
    answer: [
      'Deux lectures s’affrontent sereinement. L’avis restrictif, porté notamment par des savants saoudiens de référence : l’anniversaire est une fête non prescrite, imitée d’autres cultures, et l’islam n’a que deux fêtes (les deux Aïds) — donc à ne pas célébrer.',
      'L’avis permissif, répandu chez de nombreux savants contemporains : marquer un anniversaire n’est pas un acte d’adoration mais une habitude sociale (‘âda), et les habitudes sont permises par défaut tant qu’elles ne contiennent rien d’interdit. Un gâteau en famille, un cadeau, des invocations pour l’enfant : rien d’illicite en soi. Pas de rite religieux inventé, pas d’extravagance, et l’occasion de remercier Allah pour une année de vie.',
      'En pratique, la ligne de partage passe souvent par le contenu : un dîner familial sobre trouve beaucoup de défenseurs ; ce qui accompagne parfois les fêtes (mixité débridée, alcool, dépenses folles) est problématique pour tout le monde. Comme souvent : renseigne-toi, choisis ta position en conscience, et respecte celle du cousin qui a choisi l’autre.',
    ],
    category: 'Vie quotidienne',
    related: ['souhaiter-noel-halal', 'musique-halal', 'halal-definition'],
  },
  {
    slug: 'souhaiter-noel-halal',
    question: 'Peut-on souhaiter « Joyeux Noël » à ses proches non musulmans ?',
    verdict: '⚠️ Avis divergents — courtoisie vs précaution',
    short:
      'Célébrer Noël soi-même : non pour la quasi-totalité des savants. Le souhaiter à des proches non musulmans : interdit pour certains, permis par courtoisie pour d’autres (avis contemporain répandu).',
    answer: [
      'Distinguons deux questions. Célébrer Noël en tant que musulman (sapin chez soi, fête religieuse) : la quasi-totalité des savants l’écartent — c’est une fête religieuse d’une autre confession, et l’islam a ses propres fêtes. Là-dessus, peu de débat.',
      'Souhaiter « Joyeux Noël » à un collègue, un voisin, ou le côté non musulman de sa famille est une autre question, réellement débattue. L’avis restrictif (Ibn al-Qayyim, repris par de nombreux savants) y voit une approbation implicite d’un dogme contraire au tawhid. L’avis permissif, porté par plusieurs conseils de fatwa contemporains et savants établis en Occident : une parole de courtoisie envers des gens qui nous souhaitent bien nos fêtes relève de la bienveillance que le Coran recommande envers ceux qui ne nous combattent pas (sourate 60, verset 8) — sans partager leur croyance.',
      'En pratique pour beaucoup de familles franco-musulmanes (mariages mixtes, grands-parents non musulmans), la question est très concrète : maintenir le lien familial est une obligation religieuse, lui. Réponse sereine possible : participer au repas familial sans les rites religieux, formules chaleureuses neutres (« bonnes fêtes », « profite bien de ta famille ») ou vœux directs selon l’avis qu’on suit — les deux positions ont leurs savants.',
    ],
    category: 'Vie quotidienne',
    related: ['anniversaire-halal', 'musique-halal', 'chien-islam'],
  },
  {
    slug: 'cigarette-halal',
    question: 'Fumer est-il haram ?',
    verdict: '❌ Interdit ou fortement détesté (avis contemporains)',
    short:
      'La nocivité de la cigarette étant scientifiquement établie, la majorité des savants contemporains la déclarent interdite (ou au minimum fortement détestée).',
    answer: [
      'Les anciens savants divergeaient à une époque où la nocivité du tabac était inconnue — beaucoup le classaient makruh (détesté). Depuis que la science a établi que la cigarette tue (cancers, maladies cardiovasculaires — l’une des premières causes de mortalité évitable), la majorité des instances et savants contemporains ont basculé vers l’interdiction : le Coran interdit de se jeter soi-même dans la destruction (sourate 2, verset 195) et de gaspiller ses biens.',
      'Les arguments s’empilent : nuire à soi-même, nuire aux autres (tabagisme passif — ta famille respire ta fumée), dépendance qui asservit, et argent brûlé (un paquet par jour représente plusieurs milliers d’euros par an, comptés au tribunal du gaspillage).',
      'Si tu fumes : personne ne te juge ici — la dépendance est une réalité médicale. Mais sache que l’arrêt est considéré comme une obligation de préservation de soi par ces avis, que le Ramadan est une rampe de lancement éprouvée, et que les substituts nicotiniques remboursés existent en France. Chaque cigarette non fumée compte.',
    ],
    category: 'Vie quotidienne',
    related: ['chicha-halal', 'puff-vape-halal', 'fumer-ramadan'],
  },
  {
    slug: 'chicha-halal',
    question: 'La chicha est-elle haram ?',
    verdict: '❌ Même statut que la cigarette (voire pire)',
    short:
      'La chicha suit le même raisonnement que la cigarette — sa fumée est même plus volumineuse. Son image « conviviale » ne change rien à l’analyse des savants.',
    answer: [
      'La chicha bénéficie d’une image douce — fruitée, conviviale, orientale — que la science contredit brutalement : une session d’une heure fait inhaler un volume de fumée équivalent à des dizaines de cigarettes selon l’OMS, avec monoxyde de carbone, goudrons et métaux lourds. L’eau ne filtre pas ce qui compte.',
      'Le raisonnement des savants contemporains est donc le même que pour la cigarette : nocivité établie → interdiction (ou détestation forte au minimum). Le fait qu’elle soit occasionnelle chez certains atténue le volume, pas le principe — et la dimension sociale (bars à chicha) ajoute souvent des environnements que les mêmes savants déconseillent.',
      'Ironie culturelle à connaître : la chicha n’a rien d’islamique — c’est une habitude sociale ottomane et indienne que les savants de ces mêmes époques critiquaient déjà. La convivialité orientale a mille autres supports : thé à la menthe, café, dattes — le plateau sans le goudron.',
    ],
    category: 'Vie quotidienne',
    related: ['cigarette-halal', 'puff-vape-halal', 'fumer-ramadan'],
  },
  {
    slug: 'puff-vape-halal',
    question: 'La puff / vapoteuse est-elle haram ?',
    verdict: '⚠️ Même logique que le tabac (nicotine, nocivité)',
    short:
      'Les puffs à nicotine suivent le raisonnement du tabac pour la plupart des savants contemporains : dépendance et nocivité. Les liquides sont par ailleurs généralement halal côté ingrédients.',
    answer: [
      'La vape à nicotine crée et entretient une dépendance, avec une nocivité moindre que la cigarette mais réelle (produits récents, effets à long terme incomplets) — la plupart des avis contemporains la classent donc avec le tabac : interdite ou fortement déconseillée, surtout en initiation. Les puffs jetables, conçues pour accrocher les ados avec des goûts bonbon, concentrent les critiques : dépendance délibérément marketée + gaspillage + déchets.',
      'Cas différent : la vape comme outil de sevrage encadré chez un fumeur qui décroche — plusieurs savants la tolèrent comme moindre mal transitoire, comme les substituts nicotiniques. L’intention et la trajectoire comptent : sortir de la dépendance, pas y entrer par une porte fruitée.',
      'Détail ingrédients pour être complet : les e-liquides (propylène glycol, glycérine végétale, arômes, nicotine) ne contiennent généralement rien d’illicite en soi — la glycérine est quasi toujours végétale. Le débat n’est pas dans le flacon, il est dans la dépendance et la nocivité. Une puff « 0 % nicotine » échappe à l’argument de la dépendance mais garde ceux du gaspillage et de l’imitation.',
    ],
    category: 'Vie quotidienne',
    related: ['cigarette-halal', 'chicha-halal', 'fumer-ramadan'],
  },
  {
    slug: 'chien-islam',
    question: 'Peut-on avoir un chien en islam ?',
    verdict: '⚠️ Déconseillé sans besoin — permis pour garde, chasse, assistance',
    short:
      'Garder un chien sans nécessité est déconseillé par la majorité (hadiths sur les anges et la rétribution). Permis pour la garde, la chasse, le troupeau et l’assistance. Le maltraiter est interdit dans tous les cas.',
    answer: [
      'Les textes posent deux réalités à tenir ensemble. D’un côté, des hadiths authentiques : les anges n’entrent pas dans une maison où il y a un chien, et celui qui garde un chien sans besoin voit sa rétribution diminuer chaque jour — d’où la position majoritaire : pas de chien de compagnie sans nécessité. De l’autre, les mêmes textes valident explicitement le chien utile : garde, chasse, troupeau — étendus aujourd’hui aux chiens d’assistance (guide d’aveugle, alerte médicale) par les savants contemporains.',
      'Sur la pureté : la salive du chien est impure pour la majorité (lavage rituel en cas de contact avec ustensiles), mais l’école malikite considère le chien vivant comme pur — une divergence classique qui change beaucoup le quotidien de ceux qui en ont un. Toucher un chien n’est en aucun cas un péché ; au pire, on lave avant de prier.',
      'Et un point non négociable dans tous les avis : la maltraitance des animaux est interdite. Le hadith de la femme punie pour avoir enfermé un chat sans le nourrir, et celui de l’homme pardonné pour avoir abreuvé un chien assoiffé (Boukhari), fixent le cadre : celui qui croise un chien errant a le droit — et le mérite — de le nourrir. Ne pas en posséder n’a jamais autorisé à en mépriser un.',
    ],
    category: 'Vie quotidienne',
    related: ['halal-definition', 'gibier-chasse-halal', 'souhaiter-noel-halal'],
  },
  {
    slug: 'halal-definition',
    question: 'Que veut dire « halal » exactement ?',
    verdict: '📖 Le licite — bien plus que la viande',
    short:
      '« Halal » signifie « licite, permis » et s’applique à tout : nourriture, argent, comportement. Le principe de base : tout est permis sauf ce qui est explicitement interdit.',
    answer: [
      '« Halal » (حلال) veut simplement dire « licite, permis » — l’opposé de « haram » (interdit). Le mot s’applique à toute la vie : un aliment, un revenu, un contrat, un comportement peuvent être halal ou haram. La réduction du mot à la viande est un raccourci moderne — utile au supermarché, trompeur pour comprendre.',
      'Le principe juridique fondateur, retenu par les savants : en dehors des adorations, tout est permis par défaut (al-asl fil-ashyâ’ al-ibâha) — seuls sont interdits les éléments désignés par les textes : le porc et ses dérivés, l’alcool et ce qui enivre, la viande non abattue rituellement, le sang, l’argent de l’intérêt et du jeu, etc. La liste des interdits est courte ; le halal est l’immense reste.',
      'Entre les deux existent des zones grises (le « douteux », shubuhât) que le hadith recommande d’éviter pour préserver sa religion — c’est exactement le terrain des additifs et produits qu’on décortique sur ce site. Et un dernier étage souvent oublié : tayyib — bon, sain, pur. L’idéal coranique est « halal et tayyib » : licite ET bon. Un soda ultra-sucré peut être halal sans être tayyib ; viser les deux est la vraie gourmandise du croyant.',
    ],
    category: 'Pratique',
    related: ['difference-halal-casher', 'certifications-halal-france', 'abattage-etourdissement-halal'],
  },
  {
    slug: 'certifications-halal-france',
    question: 'Quelles certifications halal sont fiables en France ?',
    verdict: '📖 Les repères pour choisir',
    short:
      'AVS, ARGML, Achahada et les mosquées habilitées (Paris, Lyon, Évry) dominent le marché français, avec des niveaux d’exigence différents (étourdissement, contrôle permanent). Apprendre à lire les logos change tout.',
    answer: [
      'Le halal n’étant pas réglementé par l’État français, la garantie repose sur des organismes privés — et ils n’ont pas tous le même cahier des charges. Les acteurs majeurs : AVS (À Votre Service), réputé le plus strict — refus de l’étourdissement, contrôleurs permanents sur sites ; ARGML (rattachée à la Grande Mosquée de Lyon), rigoureuse également avec contrôle permanent ; Achahada, très présente en grande distribution ; et les trois mosquées historiquement habilitées pour l’export (Paris, Lyon, Évry).',
      'Les lignes de partage à connaître : étourdissement accepté ou refusé (le grand clivage — voir notre page dédiée), contrôle permanent sur chaîne ou audits ponctuels, et périmètre réel (l’abattage seul, ou toute la transformation jusqu’au produit fini). Un même mot « halal » recouvre ces réalités différentes — c’est le logo précis qui t’informe, pas le mot.',
      'Réflexes pratiques : mémorise les deux ou trois logos qui correspondent à ton niveau d’exigence et cherche-les sur les emballages ; méfie-toi du « halal » écrit sans aucun logo (auto-déclaration sans contrôle) ; et sache que les sites des certificateurs listent leurs entreprises contrôlées — vérifiable en deux minutes de téléphone au rayon boucherie.',
    ],
    category: 'Pratique',
    related: ['abattage-etourdissement-halal', 'viande-supermarche-halal', 'isla-delice-halal'],
  },
  {
    slug: 'priere-travail',
    question: 'Comment prier au travail en France ?',
    verdict: '✅ Des solutions existent presque toujours',
    short:
      'Pauses légales, salle discrète, prières regroupées en horaires d’hiver : la prière au travail s’organise. L’employeur peut encadrer mais la pratique discrète trouve presque toujours sa place.',
    answer: [
      'Côté droit français : la liberté religieuse est protégée, mais l’employeur privé peut encadrer la pratique au nom du bon fonctionnement (et la neutralité s’impose dans le public). En pratique, une prière de cinq minutes sur son temps de pause, dans un coin discret (bureau vide, salle de repos à un moment calme, voiture), ne pose juridiquement aucun problème dans l’immense majorité des situations — c’est l’usage du temps de pause qui est libre.',
      'Côté organisation religieuse : les créneaux des prières ont une plage étendue (dhuhr jusqu’à asr, asr jusqu’au coucher…), ce qui laisse presque toujours une pause utilisable ; en hiver, dhuhr, asr et maghreb tombent serrés — la pause déjeuner et la fin de journée en couvrent l’essentiel. En cas d’impossibilité réelle et ponctuelle, des avis (notamment l’école hanbalite pour le besoin) permettent de regrouper dhuhr-asr ou maghreb-isha — solution d’exception, pas d’habitude ; et la prière manquée par contrainte se rattrape dès que possible.',
      'Conseils de terrain : la discrétion et la fiabilité professionnelle sont tes meilleurs alliés (celui qui fait bien son travail obtient facilement cinq minutes de tranquillité) ; un mot simple au manager ou aux RH débloque souvent une salle ; et beaucoup de collègues prient déjà quelque part dans ton bâtiment — demande. Des millions de musulmans français prient au travail chaque jour sans drame : c’est une logistique, pas un conflit.',
    ],
    category: 'Prière',
    related: ['rattraper-prieres-ratees', 'priere-vendredi-obligatoire', 'ablutions-chaussettes'],
  },
  {
    slug: 'rattraper-prieres-ratees',
    question: 'Comment rattraper des années de prières manquées ?',
    verdict: '⚠️ Repentir + plan de rattrapage (majorité)',
    short:
      'Pour la majorité des savants : repentir sincère et rattrapage progressif des prières manquées (qada). Un avis notable estime le repentir et la régularité suffisants. Dans tous les cas : commencer aujourd’hui.',
    answer: [
      'Question immense pour tous ceux qui reviennent à la pratique. La position des quatre écoles : les prières obligatoires manquées restent une dette — on les rattrape (qada), même des années après, en plus du repentir. Méthode concrète répandue : ajouter à chaque prière du jour une prière de rattrapage du même type (chaque dhuhr, un dhuhr de dette), jusqu’à épuisement de l’estimation — des années se rattrapent ainsi en quelques années, sans écraser personne.',
      'Un avis divergent existe, notamment chez Ibn Taymiyya et Ibn Hazm : la prière délibérément abandonnée ne se « rattrape » pas techniquement — le repentir sincère, la régularité parfaite désormais et l’abondance de prières surérogatoires en tiennent lieu. Cet avis, suivi par certains savants contemporains, soulage ceux que l’estimation d’une dette de quinze ans paralyse.',
      'Ce que les deux avis partagent : l’essentiel est le retour immédiat et définitif à la prière — aujourd’hui, pas au prochain Ramadan — et la sincérité du repentir. Estime ta dette sans obsession maladive (une évaluation raisonnable suffit), choisis ta méthode avec un imam qui te connaît, et souviens-toi que la porte du repentir efface ce que la comptabilité n’atteindra jamais.',
    ],
    category: 'Prière',
    related: ['priere-travail', 'priere-vendredi-obligatoire', 'horaires-priere-voyage'],
  },
  {
    slug: 'priere-vendredi-obligatoire',
    question: 'La prière du vendredi est-elle obligatoire ? Et si je travaille ?',
    verdict: '✅ Obligatoire pour les hommes — exemptions réelles',
    short:
      'La jumu‘a est obligatoire pour l’homme pubère résident (Coran 62:9) ; femmes, voyageurs et malades en sont dispensés. Le travail exige d’essayer de s’organiser — l’impossibilité réelle est une excuse.',
    answer: [
      'Le vendredi (jumu‘a) est une obligation individuelle pour l’homme musulman pubère, résident et en bonne santé — l’ordre coranique est explicite : « quand on appelle à la prière du vendredi, accourez au rappel d’Allah et laissez le commerce » (sourate 62, verset 9). Elle remplace dhuhr et se compose du sermon et de deux unités de prière. Femmes (bienvenues à la mosquée mais non obligées), voyageurs, malades et enfants en sont dispensés.',
      'Le cas du travail : l’obligation impose de chercher réellement une solution — pause déjeuner décalée (la jumu‘a dure 30 à 45 minutes dans la plupart des mosquées françaises), aménagement d’horaires, récupération. Beaucoup y parviennent. En cas d’impossibilité véritable (poste non quittable, service continu, risque réel pour l’emploi sans alternative), les savants reconnaissent l’excuse : on prie dhuhr normalement, sans culpabilité maladive — en continuant de chercher une solution durable pour les vendredis suivants.',
      'À connaître en France : de nombreuses mosquées font deux services successifs le vendredi précisément pour les travailleurs, et la khutba de certaines commence à 12h30 pile pour tenir dans une pause d’une heure. Renseigne-toi sur les horaires exacts des mosquées autour du travail — c’est souvent ça, la solution introuvable.',
    ],
    category: 'Prière',
    related: ['priere-travail', 'rattraper-prieres-ratees', 'horaires-priere-voyage'],
  },
  {
    slug: 'ablutions-chaussettes',
    question: 'Peut-on essuyer sur ses chaussettes pour les ablutions ?',
    verdict: '⚠️ Permis sur khuff — chaussettes fines débattues',
    short:
      'L’essuyage (mash) sur les chaussons de cuir est établi par la sunna (24h, 72h en voyage). Sur les chaussettes ordinaires, les écoles divergent — pratique à connaître pour l’hiver et le travail.',
    answer: [
      'La facilité existe et elle est authentique : le Prophète ﷺ essuyait sur ses khuffayn (chaussons de cuir) lors des ablutions au lieu de laver les pieds — à condition de les avoir enfilés en état d’ablution complète. Durée : un jour et une nuit pour le résident, trois jours et trois nuits pour le voyageur. On passe simplement les mains mouillées sur le dessus des pieds : dix secondes, ablution valide.',
      'Le débat porte sur nos chaussettes modernes : les quatre écoles classiques exigent un matériau épais, couvrant et permettant la marche (cuir ou équivalent) — excluant la chaussette fine de coton. Des savants, s’appuyant sur des rapports de compagnons essuyant sur leurs jawrab (chaussettes), permettent l’essuyage sur toute chaussette couvrante et non transparente : avis suivi par beaucoup aujourd’hui, notamment l’hiver ou au travail.',
      'En pratique : enfile tes chaussettes après une ablution complète le matin, et selon l’avis que tu suis, les renouvellements de la journée se font par essuyage — un vrai changement de vie au bureau, en voyage ou par -5°C. Conditions à retenir : ablution complète à l’enfilage, durée limitée, et tout état d’impureté majeure impose le lavage complet. Les « chaussettes de mash » épaisses vendues pour ça cochent toutes les cases des avis stricts.',
    ],
    category: 'Prière',
    related: ['vernis-ongles-priere', 'priere-travail', 'horaires-priere-voyage'],
  },
  // ─── PRIÈRE & VIE GÉNÉRALE (IA musulmane généralisée) ───────────────────────
  {
    slug: 'priere-istikhara',
    question: 'Comment faire la prière d’istikhara ?',
    verdict: '✅ Sunna recommandée — 2 unités + invocation',
    short:
      'Deux unités de prière surérogatoire, puis l’invocation d’istikhara. Elle se fait pour toute décision licite, et la réponse vient par les circonstances — pas forcément par un rêve.',
    answer: [
      'La marche à suivre est simple : tu pries deux unités (rak‘a) de prière surérogatoire, en dehors des horaires déconseillés, puis — une fois le salut prononcé — tu récites l’invocation d’istikhara rapportée par Boukhari, en nommant ton affaire au moment prévu. Le Prophète ﷺ l’enseignait à ses compagnons « comme il leur enseignait une sourate du Coran », signe de son importance.',
      'L’invocation dit en substance : « Ô Allah, je Te demande de m’assister par Ta science, je Te demande capacité par Ta puissance… Si Tu sais que cette affaire est un bien pour moi dans ma religion, ma vie et ma fin, décrète-la pour moi et facilite-la. Si Tu sais qu’elle est un mal pour moi, éloigne-la de moi et éloigne-m’en, et décrète pour moi le bien où qu’il soit. » L’apprendre par cœur en arabe est l’idéal ; en attendant, la comprendre et la dire dans sa langue reste valable pour beaucoup de savants.',
      'Trois précisions qui règlent 90 % des questions : elle se fait pour toute décision licite (mariage, travail, déménagement, études) — pas pour choisir entre le licite et l’illicite ; le rêve n’est PAS la réponse attendue — la réponse vient par la facilitation ou le blocage des circonstances et par l’apaisement du cœur ; et on peut la répéter plusieurs jours si le cœur reste partagé. Après l’istikhara, tu consultes des gens de confiance (istishâra) et tu décides : la confiance en Allah n’annule pas la réflexion.',
    ],
    category: 'Prière',
    related: ['rattraper-prieres-ratees', 'priere-travail', 'invocation-voyage'],
  },
  {
    slug: 'se-convertir-islam',
    question: 'Comment se convertir à l’islam ?',
    verdict: '📖 Deux phrases suffisent',
    short:
      'Prononcer la double attestation de foi (chahada) avec conviction suffit : on devient musulman à cet instant. Le reste — grande ablution, prières, apprentissage — vient ensuite, progressivement.',
    answer: [
      'La conversion tient en une phrase prononcée avec sincérité : « Ash-hadu an lâ ilâha illa-Llâh, wa ash-hadu anna Muhammadan rasûlu-Llâh » — j’atteste qu’il n’y a de divinité qu’Allah, et j’atteste que Muhammad est Son messager. Il n’y a ni intermédiaire obligatoire, ni cérémonie imposée, ni papier indispensable : à cet instant précis, la personne est musulmane, et tous ses péchés antérieurs sont effacés selon les textes.',
      'Ce qui suit immédiatement : la grande ablution (ghusl) est recommandée — un lavage complet du corps qui marque le nouveau départ, avis majoritaire —, puis on apprend à faire les ablutions et la prière, la première obligation quotidienne. Personne n’attend d’un nouveau musulman qu’il maîtrise tout en une semaine : la règle constante des savants est la progressivité. Commence par la prière et l’essentiel de la foi, le reste s’apprend avec le temps.',
      'Côté pratique en France : se présenter à une mosquée permet d’obtenir un certificat de conversion — inutile pour la validité devant Allah, mais demandé pour certaines démarches (mariage religieux, visa pour l’Omra ou le Hajj). Beaucoup de mosquées proposent aussi un accompagnement pour les nouveaux convertis. Un conseil que répètent tous ceux qui sont passés par là : trouve une communauté bienveillante et une personne de confiance à qui poser tes questions — la solitude est le vrai obstacle des premiers mois, pas la difficulté de la religion.',
    ],
    category: 'Pratique',
    related: ['ghusl-grande-ablution', 'rattraper-prieres-ratees', 'halal-definition'],
  },
  {
    slug: 'ghusl-grande-ablution',
    question: 'Comment faire le ghusl (grande ablution) ?',
    verdict: '📖 Laver tout le corps avec intention',
    short:
      'L’essentiel : l’intention, puis faire parvenir l’eau à tout le corps, cheveux compris. La version complète suit la sunna : mains, parties intimes, ablutions, puis le corps.',
    answer: [
      'Le ghusl est obligatoire après un rapport conjugal ou une éjaculation, après les règles et les lochies (suites de couches), et il est vivement recommandé le vendredi, pour les deux Aïds et à la conversion. Tant qu’il n’est pas fait, la prière et la récitation du Coran restent suspendues — d’où l’importance de bien le connaître.',
      'Le strict minimum qui rend le ghusl valide : formuler l’intention dans le cœur, puis faire parvenir l’eau à l’ensemble du corps, sans oublier la racine des cheveux, le nombril, l’arrière des oreilles et entre les orteils. Rien d’autre n’est indispensable — une douche complète avec intention suffit techniquement.',
      'La forme complète, celle de la sunna : intention, laver les mains, laver les parties intimes, faire des ablutions complètes comme pour la prière, verser l’eau trois fois sur la tête en frottant le cuir chevelu, puis laver tout le corps en commençant par le côté droit. Deux précisions utiles : les femmes n’ont pas l’obligation de défaire leurs tresses pour le ghusl d’impureté majeure si l’eau atteint la racine (hadith d’Oumm Salama) ; et vernis, faux ongles ou extensions imperméables doivent être retirés, puisqu’ils empêchent l’eau d’atteindre la peau. Sans eau ou en cas de maladie, le tayammum (ablution sèche) prend le relais.',
    ],
    category: 'Prière',
    related: ['se-convertir-islam', 'ablutions-chaussettes', 'vernis-ongles-priere'],
  },
  {
    slug: 'psy-therapie-islam',
    question: 'Consulter un psychologue est-il halal ?',
    verdict: '✅ Permis et encouragé',
    short:
      'Se soigner est encouragé en islam, la santé mentale comprise. Consulter un psychologue est permis — la seule vigilance porte sur des conseils contraires à la religion.',
    answer: [
      'Oui, et les savants contemporains sont très largement d’accord. Le principe est posé par un hadith connu : « Ô serviteurs d’Allah, soignez-vous, car Allah n’a pas fait descendre de maladie sans faire descendre son remède » (Tirmidhi, Abou Dawoud). Rien n’exclut la souffrance psychique de cette règle : dépression, anxiété, deuil, traumatisme, troubles obsessionnels se soignent, comme un diabète ou une fracture.',
      'À dissiper d’emblée : consulter n’est pas un manque de foi. Le Prophète ﷺ lui-même a connu l’année de la tristesse ; le prophète Ya‘qûb a pleuré jusqu’à en perdre la vue ; les grands savants ont écrit sur la mélancolie. Souffrir n’est pas un péché, et refuser un soin par orgueil spirituel n’est pas de la piété. La prière, le Coran et le dhikr apaisent le cœur — ils ne remplacent pas un traitement, ils l’accompagnent.',
      'La seule vraie vigilance porte sur le contenu des conseils : un thérapeute qui recommanderait des solutions contraires à ta religion doit être écouté avec discernement, comme on le ferait pour n’importe quel conseil. En pratique, beaucoup de musulmans francophones cherchent un praticien qui comprend leur cadre culturel et religieux — cela existe et facilite le suivi — mais un bon professionnel respectueux de tes valeurs fait très bien l’affaire. Et si l’urgence est là (pensées suicidaires), on appelle le 3114, numéro national gratuit : préserver une vie est un principe majeur de l’islam.',
    ],
    category: 'Vie quotidienne',
    related: ['mauvais-oeil-protection', 'medicaments-gelules-halal', 'halal-definition'],
  },
  {
    slug: 'mauvais-oeil-protection',
    question: 'Le mauvais œil existe-t-il ? Comment s’en protéger ?',
    verdict: '📖 Réel — protection par le Coran et les invocations',
    short:
      'Le mauvais œil est une réalité affirmée par des hadiths authentiques. La protection se fait par la roqya légiférée : Coran, invocations prophétiques — pas par les amulettes ni les talismans.',
    answer: [
      'Le mauvais œil (‘ayn) est une réalité en islam : « Le mauvais œil est réel » (Boukhari, Mouslim), et un autre hadith précise qu’il « fait entrer l’homme dans la tombe ». Il naît souvent d’un regard d’admiration ou d’envie, parfois sans mauvaise intention de la personne qui regarde. Le réflexe préventif recommandé : dire « mâ shâ’a-Llâh, tabâraka-Llâh » quand une chose te plaît chez autrui, et invoquer la bénédiction plutôt que d’exprimer une admiration nue.',
      'La protection légiférée est simple et gratuite : les invocations du matin et du soir, la sourate al-Fâtiha, le verset du Trône (âyat al-Kursî) avant de dormir, les trois dernières sourates (al-Ikhlâs, al-Falaq, an-Nâs) soufflées dans les mains puis passées sur le corps — comme le faisait le Prophète ﷺ —, et l’invocation qu’il récitait pour protéger ses petits-fils. La roqya, c’est cela : la récitation du Coran sur soi ou sur un proche. Elle est à la portée de tous, sans intermédiaire.',
      'Ce qui est en revanche écarté par les savants : les amulettes, talismans, fils rouges, « mains de Fatma » portées comme protection, et surtout les voyants, marabouts et désenvoûteurs qui monnaient leurs services — un domaine où l’escroquerie et le charlatanisme prospèrent sur la détresse des gens. Le hadith est sévère envers celui qui consulte un devin. Enfin, une règle d’équilibre : ne pas tout attribuer au mauvais œil. Fatigue, dépression, échecs répétés ont souvent des causes médicales ou matérielles bien réelles — on invoque ET on consulte un médecin.',
    ],
    category: 'Vie quotidienne',
    related: ['psy-therapie-islam', 'priere-istikhara', 'halal-definition'],
  },
];

export function getQuestion(slug: string): QA | undefined {
  return QUESTIONS.find((q) => q.slug === slug);
}

export const CATEGORIES: Category[] = [
  'Additifs',
  'Produits',
  'Alimentation',
  'Ramadan',
  'Prière',
  'Vie quotidienne',
  'Voyage',
  'Destinations',
  'Pratique',
];

// Slugs des pages catégorie (/categorie/[slug]) — ASCII uniquement.
export const CATEGORY_SLUGS: Record<Category, string> = {
  Additifs: 'additifs',
  Produits: 'produits',
  Alimentation: 'alimentation',
  Ramadan: 'ramadan',
  Prière: 'priere',
  'Vie quotidienne': 'vie-quotidienne',
  Voyage: 'voyage',
  Destinations: 'destinations',
  Pratique: 'pratique',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  Additifs:
    'E120, E441, E471… Tous les additifs alimentaires passés au crible : origine, avis des savants, alternatives halal.',
  Produits:
    'Kinder, Haribo, KitKat, McDo… Marques et produits du supermarché : ce qui est halal, ce qui ne l’est pas, ce qu’il faut vérifier.',
  Alimentation:
    'Viandes, fruits de mer, gélatine, alcool de cuisine… Les grandes questions de l’assiette halal, avec les nuances entre écoles.',
  Ramadan:
    'Jeûne, brossage de dents, piqûres, sport, oublis… Les réponses claires aux questions les plus posées pendant le mois de Ramadan.',
  Prière:
    'Rattrapage, ablutions, prière au travail, vendredi… Les réponses claires aux questions concrètes de la prière.',
  'Vie quotidienne':
    'Musique, tatouage, travail, fêtes, animaux… La vie moderne passée au filtre serein de l’islam, avec les divergences quand il y en a.',
  Voyage:
    'Prière en avion, repas halal, jeûne en déplacement… Voyager sereinement en tant que musulman.',
  Destinations:
    'Dubaï, Istanbul, Londres, Tokyo… Nos guides halal des grandes destinations : restaurants, mosquées, conseils.',
  Pratique:
    'Prière, ablutions, vie quotidienne, certifications… Les questions pratiques que tout le monde se pose.',
};

export function getCategoryBySlug(slug: string): Category | undefined {
  return (Object.keys(CATEGORY_SLUGS) as Category[]).find((c) => CATEGORY_SLUGS[c] === slug);
}
