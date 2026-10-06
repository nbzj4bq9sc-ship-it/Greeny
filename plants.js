// Broad care profiles verified against NC State Extension on 2026-10-06.
// Source URLs, scope and mapping rules are documented in SOURCES.md.
const plants = [
  {
    "id": "aloe",
    "name": {
      "en": "Aloe vera",
      "fr": "Aloès"
    },
    "botanical": "Aloe vera",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/aloe-vera/",
    "note": {
      "en": "Let the growing medium dry completely between waterings; use very well-drained succulent mix.",
      "fr": "Laissez le substrat sécher complètement entre deux arrosages ; utilisez un mélange pour succulentes très drainant."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "spider",
    "name": {
      "en": "Spider plant",
      "fr": "Plante araignée"
    },
    "botanical": "Chlorophytum comosum",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/chlorophytum-comosum/",
    "note": {
      "en": "Keep the soil moist and avoid direct sun. Reduce watering in winter.",
      "fr": "Gardez le substrat humide et évitez le soleil direct. Réduisez les arrosages en hiver."
    }
  },
  {
    "id": "peace",
    "name": {
      "en": "Peace lily",
      "fr": "Fleur de lune"
    },
    "botanical": "Spathiphyllum",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/spathiphyllum/",
    "note": {
      "en": "Keep the medium moist, not soggy, and avoid direct sun and cold drafts.",
      "fr": "Gardez le substrat humide, sans le détremper, et évitez le soleil direct et les courants d’air froid."
    }
  },
  {
    "id": "snake",
    "name": {
      "en": "Snake plant",
      "fr": "Langue de belle-mère"
    },
    "botanical": "Dracaena trifasciata",
    "water": "dry",
    "light": "partial",
    "acceptedLight": [
      "partial",
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/dracaena-trifasciata/",
    "note": {
      "en": "Let the soil dry between waterings. It tolerates low light and some direct sun, but overwatering can rot its roots.",
      "fr": "Laissez sécher le substrat entre deux arrosages. Elle tolère peu de lumière et un peu de soleil direct, mais l’excès d’eau peut faire pourrir ses racines."
    }
  },
  {
    "id": "pothos",
    "name": {
      "en": "Pothos",
      "fr": "Pothos"
    },
    "botanical": "Epipremnum aureum",
    "water": "dry",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/epipremnum-aureum/",
    "note": {
      "en": "Let the well-drained medium dry between waterings. Low light is tolerated but may reduce leaf variegation.",
      "fr": "Laissez sécher le substrat bien drainant entre deux arrosages. Une faible lumière est tolérée, mais peut atténuer les panachures."
    }
  },
  {
    "id": "fiddle",
    "name": {
      "en": "Fiddle-leaf fig",
      "fr": "Figuier lyre"
    },
    "botanical": "Ficus lyrata",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/ficus-lyrata/",
    "note": {
      "en": "Keep the medium moist but well drained; protect from afternoon sun and avoid overwatering.",
      "fr": "Gardez le substrat humide mais bien drainé ; protégez du soleil de l’après-midi et évitez l’excès d’eau."
    },
    "acceptedLight": [
      "indirect",
      "partial"
    ]
  },
  {
    "id": "rubber",
    "name": {
      "en": "Rubber plant",
      "fr": "Caoutchouc"
    },
    "botanical": "Ficus elastica",
    "water": "dry",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/ficus-elastica/",
    "note": {
      "en": "Avoid overwatering and afternoon sun. Reduce watering during the dormant season.",
      "fr": "Évitez l’excès d’eau et le soleil de l’après-midi. Réduisez les arrosages pendant la période de repos."
    },
    "acceptedLight": [
      "indirect",
      "partial"
    ]
  },
  {
    "id": "dracaena",
    "name": {
      "en": "Dracaena",
      "fr": "Dragonnier"
    },
    "botanical": "Dracaena fragrans",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/dracaena-fragrans/",
    "note": {
      "en": "Keep the soil moist during growth and water less in winter. Direct sun can burn the leaves.",
      "fr": "Gardez le substrat humide en période de croissance et arrosez moins en hiver. Le soleil direct peut brûler les feuilles."
    }
  },
  {
    "id": "zz",
    "name": {
      "en": "ZZ plant",
      "fr": "Plante ZZ"
    },
    "botanical": "Zamioculcas zamiifolia",
    "water": "dry",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/zamioculcas-zamiifolia/",
    "note": {
      "en": "Let the soil dry completely before watering. Direct sun can scorch its leaves.",
      "fr": "Laissez sécher le substrat complètement avant d’arroser. Le soleil direct peut brûler ses feuilles."
    }
  },
  {
    "id": "fern",
    "name": {
      "en": "Boston fern",
      "fr": "Fougère de Boston"
    },
    "botanical": "Nephrolepis exaltata",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/nephrolepis-exaltata/",
    "note": {
      "en": "Do not let the medium dry out. This fern needs high humidity; reduce watering during winter dormancy.",
      "fr": "Ne laissez pas sécher le substrat. Cette fougère apprécie une forte humidité ambiante ; réduisez les arrosages pendant le repos hivernal."
    }
  },
  {
    "id": "jade",
    "name": {
      "en": "Jade plant",
      "fr": "Arbre de jade"
    },
    "botanical": "Crassula ovata",
    "water": "dry",
    "light": "partial",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/crassula-ovata/",
    "note": {
      "en": "Water when the soil is dry and reduce watering from autumn to late winter. Provide a sunny spot with afternoon protection.",
      "fr": "Arrosez quand le substrat est sec et réduisez les arrosages de l’automne à la fin de l’hiver. Choisissez un emplacement ensoleillé, protégé l’après-midi."
    },
    "acceptedLight": [
      "partial",
      "sun"
    ]
  },
  {
    "id": "begonia",
    "name": {
      "en": "Begonia",
      "fr": "Bégonia"
    },
    "botanical": "Begonia",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/begonia/",
    "note": {
      "en": "Keep the soil moist and well drained. Water at the base, avoiding the leaves and overwatering.",
      "fr": "Gardez le substrat humide et bien drainé. Arrosez au pied, sans mouiller les feuilles ni apporter trop d’eau."
    }
  },
  {
    "id": "violet",
    "name": {
      "en": "African violet",
      "fr": "Violette africaine"
    },
    "botanical": "Streptocarpus ionanthus",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/streptocarpus-ionanthus/",
    "note": {
      "en": "Let the surface dry before watering again. Bottom watering keeps water off the leaves.",
      "fr": "Laissez sécher la surface avant d’arroser à nouveau. Un arrosage par le bas évite de mouiller les feuilles."
    }
  },
  {
    "id": "orchid",
    "name": {
      "en": "Moth orchid",
      "fr": "Orchidée papillon"
    },
    "botanical": "Phalaenopsis",
    "water": "surface",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/phalaenopsis/",
    "note": {
      "en": "Use a bark-based orchid medium, let it dry somewhat between waterings and drain the pot fully.",
      "fr": "Utilisez un substrat pour orchidées à base d’écorces, laissez-le sécher partiellement entre deux arrosages et égouttez complètement le pot."
    }
  },
  {
    "id": "calathea",
    "name": {
      "en": "Calathea",
      "fr": "Calathéa"
    },
    "botanical": "Goeppertia",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/goeppertia/",
    "note": {
      "en": "Keep the medium moist, not soggy. Avoid direct sun, cold drafts and sudden temperature changes.",
      "fr": "Gardez le substrat humide, sans le détremper. Évitez le soleil direct, les courants d’air froid et les changements brusques de température."
    }
  },
  {
    "id": "philodendron",
    "name": {
      "en": "Heartleaf philodendron",
      "fr": "Philodendron grimpant"
    },
    "botanical": "Philodendron hederaceum",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/philodendron-hederaceum/",
    "note": {
      "en": "Keep the soil slightly moist and water less in winter. Low light is tolerated.",
      "fr": "Gardez le substrat légèrement humide et arrosez moins en hiver. Une faible lumière est tolérée."
    }
  },
  {
    "id": "monstera",
    "name": {
      "en": "Monstera",
      "fr": "Monstera"
    },
    "botanical": "Monstera deliciosa",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/monstera-deliciosa/",
    "note": {
      "en": "Let the upper part of the medium dry between thorough waterings. Avoid direct sun.",
      "fr": "Laissez sécher la partie supérieure du substrat entre deux arrosages complets. Évitez le soleil direct."
    }
  },
  {
    "id": "bromeliad",
    "name": {
      "en": "Guzmania",
      "fr": "Guzmania"
    },
    "botanical": "Guzmania lingulata",
    "water": "tank",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/guzmania-lingulata/",
    "note": {
      "en": "Keep water in the rosette’s central cup, especially in summer; water the roots sparingly in bromeliad or orchid mix.",
      "fr": "Gardez de l’eau dans la coupe centrale de la rosette, surtout en été ; arrosez peu les racines dans un substrat pour broméliacées ou orchidées."
    }
  },
  {
    "id": "cactus",
    "name": {
      "en": "Mammillaria cactus",
      "fr": "Cactus Mammillaria"
    },
    "botanical": "Mammillaria",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/mammillaria/",
    "note": {
      "en": "Let the soil dry completely between waterings. Suspend watering during winter dormancy.",
      "fr": "Laissez sécher le substrat complètement entre deux arrosages. Suspendez les arrosages pendant le repos hivernal."
    }
  },
  {
    "id": "lavender",
    "name": {
      "en": "English lavender",
      "fr": "Lavande vraie"
    },
    "botanical": "Lavandula angustifolia",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/lavandula-angustifolia/",
    "note": {
      "en": "Provide full sun and very well-drained soil on the dry side. Overwatering can cause root rot.",
      "fr": "Offrez du plein soleil et un substrat très drainant, plutôt sec. L’excès d’eau peut faire pourrir les racines."
    }
  },
  {
    "id": "mint",
    "name": {
      "en": "Spearmint",
      "fr": "Menthe verte"
    },
    "botanical": "Mentha spicata",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/mentha-spicata/",
    "note": {
      "en": "Keep the soil moist and well drained. Spearmint accepts full sun or partial shade.",
      "fr": "Gardez le substrat humide et bien drainé. La menthe verte accepte le plein soleil ou la mi-ombre."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "rosemary",
    "name": {
      "en": "Rosemary",
      "fr": "Romarin"
    },
    "botanical": "Salvia rosmarinus",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/salvia-rosmarinus/",
    "note": {
      "en": "Use dry to moderately moist, well-drained soil in full sun. Overwatering is a common cause of decline.",
      "fr": "Utilisez un substrat sec à modérément humide, bien drainé, en plein soleil. L’excès d’eau est une cause fréquente de dépérissement."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "basil",
    "name": {
      "en": "Basil",
      "fr": "Basilic"
    },
    "botanical": "Ocimum basilicum",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/ocimum-basilicum/",
    "note": {
      "en": "Provide full sun and moist, well-drained soil.",
      "fr": "Offrez du plein soleil et un substrat humide, bien drainé."
    }
  },
  {
    "id": "thyme",
    "name": {
      "en": "Thyme",
      "fr": "Thym"
    },
    "botanical": "Thymus vulgaris",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/thymus-vulgaris/",
    "note": {
      "en": "Choose full sun and a dry, well-drained medium.",
      "fr": "Choisissez le plein soleil et un substrat sec, bien drainé."
    }
  },
  {
    "id": "parsley",
    "name": {
      "en": "Parsley",
      "fr": "Persil"
    },
    "botanical": "Petroselinum crispum",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/petroselinum-crispum/",
    "note": {
      "en": "Keep the medium consistently moist and well drained. Indoors, provide bright light.",
      "fr": "Gardez le substrat régulièrement humide et bien drainé. À l’intérieur, offrez une lumière vive."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "chives",
    "name": {
      "en": "Chives",
      "fr": "Ciboulette"
    },
    "botanical": "Allium schoenoprasum",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/allium-schoenoprasum/",
    "note": {
      "en": "Use well-drained soil and a sunny spot; chives also accept partial shade.",
      "fr": "Utilisez un substrat bien drainé et un emplacement ensoleillé ; la ciboulette accepte aussi la mi-ombre."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "sage",
    "name": {
      "en": "Common sage",
      "fr": "Sauge officinale"
    },
    "botanical": "Salvia officinalis",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/salvia-officinalis/",
    "note": {
      "en": "Provide full sun and well-drained soil that is moderately moist to dry.",
      "fr": "Offrez du plein soleil et un substrat bien drainé, modérément humide à sec."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "oregano",
    "name": {
      "en": "Oregano",
      "fr": "Origan"
    },
    "botanical": "Origanum vulgare",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/origanum-vulgare/",
    "note": {
      "en": "Use well-drained soil with dry to moderate moisture. Variegated varieties may need shade during the hottest part of the day.",
      "fr": "Utilisez un substrat bien drainé, sec à modérément humide. Les variétés panachées peuvent nécessiter de l’ombre aux heures les plus chaudes."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "balm",
    "name": {
      "en": "Lemon balm",
      "fr": "Mélisse"
    },
    "botanical": "Melissa officinalis",
    "water": "surface",
    "light": "sun",
    "acceptedWater": [
      "surface",
      "dry",
      "moist"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/melissa-officinalis/",
    "note": {
      "en": "Lemon balm accepts moist to dry, well-drained soil, in full sun or partial shade.",
      "fr": "La mélisse accepte un substrat humide à sec, bien drainé, au soleil ou à la mi-ombre."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "cilantro",
    "name": {
      "en": "Coriander",
      "fr": "Coriandre"
    },
    "botanical": "Coriandrum sativum",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/coriandrum-sativum/",
    "note": {
      "en": "Provide moderately moist, well-drained soil. Coriander grows best in cool spring or autumn conditions.",
      "fr": "Offrez un substrat modérément humide, bien drainé. La coriandre pousse mieux dans la fraîcheur du printemps ou de l’automne."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "echeveria",
    "name": {
      "en": "Echeveria",
      "fr": "Échévéria"
    },
    "botanical": "Echeveria",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/echeveria/",
    "note": {
      "en": "Provide a sunny spot; this desert succulent needs little water.",
      "fr": "Offrez un emplacement ensoleillé ; cette succulente désertique a besoin de peu d’eau."
    }
  },
  {
    "id": "hoya",
    "name": {
      "en": "Wax plant",
      "fr": "Fleur de porcelaine"
    },
    "botanical": "Hoya carnosa",
    "water": "dry",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/hoya-carnosa/",
    "note": {
      "en": "Let the soil dry between waterings. Both overly wet and overly dry soil can cause leaf drop.",
      "fr": "Laissez sécher le substrat entre deux arrosages. Un substrat trop humide ou trop sec peut faire tomber les feuilles."
    },
    "acceptedLight": [
      "indirect",
      "partial"
    ]
  },
  {
    "id": "kalanchoe",
    "name": {
      "en": "Flaming Katy",
      "fr": "Kalanchoé"
    },
    "botanical": "Kalanchoe blossfeldiana",
    "water": "dry",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/kalanchoe-blossfeldiana/",
    "note": {
      "en": "Let the soil dry between waterings, then water thoroughly. Prolonged direct sun can scorch the leaves.",
      "fr": "Laissez sécher le substrat entre deux arrosages, puis arrosez abondamment. Un soleil direct prolongé peut brûler les feuilles."
    },
    "acceptedLight": [
      "indirect",
      "partial"
    ]
  },
  {
    "id": "pilea",
    "name": {
      "en": "Chinese money plant",
      "fr": "Pilea"
    },
    "botanical": "Pilea peperomioides",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/pilea-peperomioides/",
    "note": {
      "en": "Use moist, well-drained medium and bright indirect light. Overwatering can cause root rot.",
      "fr": "Utilisez un substrat humide, bien drainé et une lumière vive indirecte. L’excès d’eau peut faire pourrir les racines."
    }
  },
  {
    "id": "peperomia",
    "name": {
      "en": "Baby rubber plant",
      "fr": "Pépéromia"
    },
    "botanical": "Peperomia obtusifolia",
    "water": "surface",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/peperomia-obtusifolia/",
    "note": {
      "en": "Avoid wet soil, extreme dryness and direct sun. Bright indirect light is preferred.",
      "fr": "Évitez un substrat détrempé, une sécheresse excessive et le soleil direct. Une lumière vive indirecte est préférable."
    }
  },
  {
    "id": "schefflera",
    "name": {
      "en": "Dwarf umbrella tree",
      "fr": "Arbre ombrelle"
    },
    "botanical": "Heptapleurum arboricola",
    "water": "dry",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/heptapleurum-arboricola/",
    "note": {
      "en": "Let the soil dry, then water thoroughly. Direct sun can burn the leaves indoors.",
      "fr": "Laissez sécher le substrat, puis arrosez abondamment. À l’intérieur, le soleil direct peut brûler les feuilles."
    }
  },
  {
    "id": "ficus",
    "name": {
      "en": "Weeping fig",
      "fr": "Figuier pleureur"
    },
    "botanical": "Ficus benjamina",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/ficus-benjamina/",
    "note": {
      "en": "Water before the soil dries completely. Moving the plant to different light can cause leaf drop.",
      "fr": "Arrosez avant que le substrat ne sèche complètement. Un changement d’exposition peut faire tomber les feuilles."
    }
  },
  {
    "id": "anthurium",
    "name": {
      "en": "Anthurium",
      "fr": "Anthurium"
    },
    "botanical": "Anthurium andraeanum",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/anthurium-andraeanum/",
    "note": {
      "en": "Water when the top of the soil feels dry. Avoid direct sun and cold drafts.",
      "fr": "Arrosez quand la surface du substrat est sèche au toucher. Évitez le soleil direct et les courants d’air froid."
    }
  },
  {
    "id": "rex",
    "name": {
      "en": "Rex begonia",
      "fr": "Bégonia rex"
    },
    "botanical": "Begonia Rex Cultorum Group",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/begonia-rex-types/",
    "note": {
      "en": "Keep the medium moist and well drained. Avoid misting and overwatering.",
      "fr": "Gardez le substrat humide et bien drainé. Évitez la brumisation et l’excès d’eau."
    }
  },
  {
    "id": "maranta",
    "name": {
      "en": "Prayer plant",
      "fr": "Maranta"
    },
    "botanical": "Maranta leuconeura",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/maranta-leuconeura/",
    "note": {
      "en": "Keep the soil evenly moist during growth; reduce watering in winter. Avoid direct sun.",
      "fr": "Gardez le substrat uniformément humide en période de croissance ; réduisez les arrosages en hiver. Évitez le soleil direct."
    }
  },
  {
    "id": "marginata",
    "name": {
      "en": "Madagascar dragon tree",
      "fr": "Dragonnier de Madagascar"
    },
    "botanical": "Dracaena marginata",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/dracaena-reflexa-var-angustifolia/",
    "note": {
      "en": "Let the medium dry between waterings, but not severely. Bright indirect light is ideal.",
      "fr": "Laissez sécher le substrat entre deux arrosages, sans sécheresse excessive. Une lumière vive indirecte est idéale."
    }
  },
  {
    "id": "fatsia",
    "name": {
      "en": "Japanese aralia",
      "fr": "Aralia du Japon"
    },
    "botanical": "Fatsia japonica",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low",
      "partial"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/fatsia-japonica/",
    "note": {
      "en": "Keep the soil moist and well drained. Outdoor plants need protection from full sun and wind.",
      "fr": "Gardez le substrat humide et bien drainé. À l’extérieur, protégez la plante du plein soleil et du vent."
    }
  },
  {
    "id": "cyclamen",
    "name": {
      "en": "Florist’s cyclamen",
      "fr": "Cyclamen des fleuristes"
    },
    "botanical": "Cyclamen persicum",
    "water": "surface",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/cyclamen-persicum/",
    "note": {
      "en": "Water when the soil feels dry, avoiding the crown. Keep it cool and reduce watering during summer dormancy.",
      "fr": "Arrosez quand le substrat est sec au toucher, sans mouiller le cœur. Gardez la plante au frais et réduisez les arrosages pendant le repos estival."
    }
  },
  {
    "id": "hibiscus",
    "name": {
      "en": "Tropical hibiscus",
      "fr": "Hibiscus tropical"
    },
    "botanical": "Hibiscus rosa-sinensis",
    "water": "moist",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/hibiscus-rosa-sinensis/",
    "note": {
      "en": "Keep the roots moist in well-drained soil. Protect this tropical hibiscus from frost.",
      "fr": "Gardez les racines humides dans un substrat bien drainé. Protégez cet hibiscus tropical du gel."
    },
    "acceptedLight": [
      "sun",
      "partial"
    ]
  },
  {
    "id": "gardenia",
    "name": {
      "en": "Gardenia",
      "fr": "Gardénia"
    },
    "botanical": "Gardenia jasminoides",
    "water": "moist",
    "light": "indirect",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/gardenia-jasminoides/",
    "note": {
      "en": "Use rich, acidic, well-drained soil and bright indirect light or partial shade.",
      "fr": "Utilisez un substrat riche, acide, bien drainé et une lumière vive indirecte ou un emplacement à mi-ombre."
    },
    "acceptedLight": [
      "indirect",
      "partial"
    ]
  },
  {
    "id": "bougainvillea",
    "name": {
      "en": "Bougainvillea",
      "fr": "Bougainvillier"
    },
    "botanical": "Bougainvillea",
    "water": "dry",
    "light": "sun",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/bougainvillea/",
    "note": {
      "en": "Provide full sun and well-drained soil; this plant tolerates drought.",
      "fr": "Offrez du plein soleil et un substrat bien drainé ; cette plante tolère la sécheresse."
    }
  },
  {
    "id": "hydrangea",
    "name": {
      "en": "Bigleaf hydrangea",
      "fr": "Hortensia"
    },
    "botanical": "Hydrangea macrophylla",
    "water": "moist",
    "light": "indirect",
    "acceptedLight": [
      "indirect",
      "low",
      "partial"
    ],
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/hydrangea-macrophylla/",
    "note": {
      "en": "Provide good drainage and protect from afternoon sun. This hydrangea accepts partial to deep shade.",
      "fr": "Assurez un bon drainage et protégez du soleil de l’après-midi. Cet hortensia accepte la mi-ombre et une ombre plus dense."
    }
  }
];
