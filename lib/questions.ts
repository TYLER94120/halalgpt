// ─── Base de connaissances HalalGPT ───────────────────────────────────────────
//
// Chaque entrée devient une page SEO statique sur /q/[slug].
// C'est le trésor du projet : des réponses honnêtes, nuancées, en français,
// sur les questions halal les plus recherchées sur Google.
//
// Règle éditoriale : on présente les avis répandus (avec leurs divergences
// quand il y en a), on recommande la certification en cas de doute, et on ne
// délivre jamais de fatwa personnelle.

export type Category = 'Additifs' | 'Produits' | 'Alimentation' | 'Voyage' | 'Destinations' | 'Pratique';

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
    category: 'Pratique',
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
];

export function getQuestion(slug: string): QA | undefined {
  return QUESTIONS.find((q) => q.slug === slug);
}

export const CATEGORIES: Category[] = ['Additifs', 'Produits', 'Alimentation', 'Voyage', 'Destinations', 'Pratique'];
