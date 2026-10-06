// Broad care profiles for potted plants; see SOURCES.md for scope and limitations.
const plants = [
  {
    "id": "aloe",
    "name": {
      "en": "Aloe vera",
      "fr": "Aloès"
    },
    "botanical": "Aloe vera",
    "water": "dry",
    "light": "sun"
  },
  {
    "id": "spider",
    "name": {
      "en": "Spider plant",
      "fr": "Plante araignée"
    },
    "botanical": "Chlorophytum comosum",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "peace",
    "name": {
      "en": "Peace lily",
      "fr": "Spathiphyllum"
    },
    "botanical": "Spathiphyllum",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "snake",
    "name": {
      "en": "Snake plant",
      "fr": "Langue de belle-mère"
    },
    "botanical": "Dracaena trifasciata",
    "water": "dry",
    "light": "indirect"
  },
  {
    "id": "pothos",
    "name": {
      "en": "Pothos",
      "fr": "Pothos"
    },
    "botanical": "Epipremnum aureum",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "fiddle",
    "name": {
      "en": "Fiddle-leaf fig",
      "fr": "Figuier lyre"
    },
    "botanical": "Ficus lyrata",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "rubber",
    "name": {
      "en": "Rubber plant",
      "fr": "Caoutchouc"
    },
    "botanical": "Ficus elastica",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "dracaena",
    "name": {
      "en": "Dracaena",
      "fr": "Dragonnier"
    },
    "botanical": "Dracaena fragrans",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "zz",
    "name": {
      "en": "ZZ plant",
      "fr": "Plante ZZ"
    },
    "botanical": "Zamioculcas zamiifolia",
    "water": "dry",
    "light": "indirect"
  },
  {
    "id": "fern",
    "name": {
      "en": "Boston fern",
      "fr": "Fougère de Boston"
    },
    "botanical": "Nephrolepis exaltata",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "jade",
    "name": {
      "en": "Jade plant",
      "fr": "Arbre de jade"
    },
    "botanical": "Crassula ovata",
    "water": "dry",
    "light": "sun"
  },
  {
    "id": "begonia",
    "name": {
      "en": "Begonia",
      "fr": "Bégonia"
    },
    "botanical": "Begonia",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "violet",
    "name": {
      "en": "African violet",
      "fr": "Violette africaine"
    },
    "botanical": "Streptocarpus ionanthus",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "orchid",
    "name": {
      "en": "Moth orchid",
      "fr": "Orchidée papillon"
    },
    "botanical": "Phalaenopsis",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "calathea",
    "name": {
      "en": "Calathea",
      "fr": "Calathéa"
    },
    "botanical": "Goeppertia",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "philodendron",
    "name": {
      "en": "Heartleaf philodendron",
      "fr": "Philodendron grimpant"
    },
    "botanical": "Philodendron hederaceum",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "monstera",
    "name": {
      "en": "Monstera",
      "fr": "Monstera"
    },
    "botanical": "Monstera deliciosa",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "bromeliad",
    "name": {
      "en": "Guzmania",
      "fr": "Guzmania"
    },
    "botanical": "Guzmania",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "cactus",
    "name": {
      "en": "Desert cactus",
      "fr": "Cactus du désert"
    },
    "botanical": "Cactaceae (desert types)",
    "water": "dry",
    "light": "sun"
  },
  {
    "id": "lavender",
    "name": {
      "en": "English lavender",
      "fr": "Lavande vraie"
    },
    "botanical": "Lavandula angustifolia",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "mint",
    "name": {
      "en": "Mint",
      "fr": "Menthe"
    },
    "botanical": "Mentha",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "rosemary",
    "name": {
      "en": "Rosemary",
      "fr": "Romarin"
    },
    "botanical": "Salvia rosmarinus",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "basil",
    "name": {
      "en": "Basil",
      "fr": "Basilic"
    },
    "botanical": "Ocimum basilicum",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "thyme",
    "name": {
      "en": "Thyme",
      "fr": "Thym"
    },
    "botanical": "Thymus vulgaris",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "parsley",
    "name": {
      "en": "Parsley",
      "fr": "Persil"
    },
    "botanical": "Petroselinum crispum",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "chives",
    "name": {
      "en": "Chives",
      "fr": "Ciboulette"
    },
    "botanical": "Allium schoenoprasum",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "sage",
    "name": {
      "en": "Common sage",
      "fr": "Sauge officinale"
    },
    "botanical": "Salvia officinalis",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "oregano",
    "name": {
      "en": "Oregano",
      "fr": "Origan"
    },
    "botanical": "Origanum vulgare",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "balm",
    "name": {
      "en": "Lemon balm",
      "fr": "Mélisse"
    },
    "botanical": "Melissa officinalis",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "cilantro",
    "name": {
      "en": "Coriander",
      "fr": "Coriandre"
    },
    "botanical": "Coriandrum sativum",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "echeveria",
    "name": {
      "en": "Echeveria",
      "fr": "Échévéria"
    },
    "botanical": "Echeveria",
    "water": "dry",
    "light": "sun"
  },
  {
    "id": "hoya",
    "name": {
      "en": "Wax plant",
      "fr": "Fleur de porcelaine"
    },
    "botanical": "Hoya carnosa",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "kalanchoe",
    "name": {
      "en": "Flaming Katy",
      "fr": "Kalanchoé"
    },
    "botanical": "Kalanchoe blossfeldiana",
    "water": "dry",
    "light": "sun"
  },
  {
    "id": "pilea",
    "name": {
      "en": "Chinese money plant",
      "fr": "Pilea"
    },
    "botanical": "Pilea peperomioides",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "peperomia",
    "name": {
      "en": "Baby rubber plant",
      "fr": "Pépéromia"
    },
    "botanical": "Peperomia obtusifolia",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "schefflera",
    "name": {
      "en": "Dwarf umbrella tree",
      "fr": "Arbre ombrelle"
    },
    "botanical": "Heptapleurum arboricola",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "ficus",
    "name": {
      "en": "Weeping fig",
      "fr": "Figuier pleureur"
    },
    "botanical": "Ficus benjamina",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "anthurium",
    "name": {
      "en": "Anthurium",
      "fr": "Anthurium"
    },
    "botanical": "Anthurium andraeanum",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "rex",
    "name": {
      "en": "Rex begonia",
      "fr": "Bégonia rex"
    },
    "botanical": "Begonia rex",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "maranta",
    "name": {
      "en": "Prayer plant",
      "fr": "Maranta"
    },
    "botanical": "Maranta leuconeura",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "marginata",
    "name": {
      "en": "Madagascar dragon tree",
      "fr": "Dragonnier de Madagascar"
    },
    "botanical": "Dracaena marginata",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "fatsia",
    "name": {
      "en": "Japanese aralia",
      "fr": "Aralia du Japon"
    },
    "botanical": "Fatsia japonica",
    "water": "surface",
    "light": "indirect"
  },
  {
    "id": "cyclamen",
    "name": {
      "en": "Florist’s cyclamen",
      "fr": "Cyclamen des fleuristes"
    },
    "botanical": "Cyclamen persicum",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "hibiscus",
    "name": {
      "en": "Tropical hibiscus",
      "fr": "Hibiscus tropical"
    },
    "botanical": "Hibiscus rosa-sinensis",
    "water": "moist",
    "light": "sun"
  },
  {
    "id": "gardenia",
    "name": {
      "en": "Gardenia",
      "fr": "Gardénia"
    },
    "botanical": "Gardenia jasminoides",
    "water": "moist",
    "light": "indirect"
  },
  {
    "id": "bougainvillea",
    "name": {
      "en": "Bougainvillea",
      "fr": "Bougainvillier"
    },
    "botanical": "Bougainvillea",
    "water": "surface",
    "light": "sun"
  },
  {
    "id": "hydrangea",
    "name": {
      "en": "Bigleaf hydrangea",
      "fr": "Hortensia"
    },
    "botanical": "Hydrangea macrophylla",
    "water": "moist",
    "light": "indirect"
  }
];

const sourceNames = {calathea:"calathea", cactus:"cactaceae", violet:"saintpaulia-ionantha", schefflera:"schefflera-arboricola"};
plants.forEach(plant => { if (sourceNames[plant.id]) plant.source = sourceNames[plant.id]; });
