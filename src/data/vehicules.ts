/**
 * Catalogue des marques et modèles proposés dans le formulaire de dépôt.
 *
 * Objectif : guider la saisie sans jamais bloquer un client dont le modèle
 * manque (option « Autre » / « Mon modèle n'est pas dans la liste »).
 * Liste volontairement limitée aux modèles courants du marché français ;
 * elle n'a pas vocation à être exhaustive (les finitions ne sont pas listées).
 */
export type MarqueVehicules = {
  marque: string;
  modeles: string[];
};

export const MARQUES_VEHICULES: MarqueVehicules[] = [
  {
    marque: "Abarth",
    modeles: ["500", "595", "695", "600e"],
  },
  {
    marque: "Alfa Romeo",
    modeles: ["Giulia", "Giulietta", "Junior", "MiTo", "Stelvio", "Tonale"],
  },
  {
    marque: "Alpine",
    modeles: ["A110", "A290"],
  },
  {
    marque: "Audi",
    modeles: [
      "A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron",
      "Q5", "Q7", "Q8", "e-tron", "TT", "R8",
    ],
  },
  {
    marque: "BMW",
    modeles: [
      "Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 6",
      "Série 7", "Série 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM",
      "Z4", "i3", "i4", "i5", "i7", "iX1", "iX3", "iX",
    ],
  },
  {
    marque: "BYD",
    modeles: ["Atto 3", "Dolphin", "Seal", "Seal U", "Han", "Tang"],
  },
  {
    marque: "Citroën",
    modeles: [
      "Ami", "Berlingo", "C1", "C2", "C3", "C3 Aircross", "C4", "C4 Cactus",
      "C4 Picasso", "C4 X", "C5", "C5 Aircross", "C5 X", "C6", "C8",
      "Grand C4 Picasso", "Jumper", "Jumpy", "Nemo", "Saxo", "Xsara",
      "ë-C3", "ë-C4",
    ],
  },
  {
    marque: "Cupra",
    modeles: ["Ateca", "Born", "Formentor", "Leon", "Raval", "Tavascan", "Terramar"],
  },
  {
    marque: "Dacia",
    modeles: ["Duster", "Jogger", "Lodgy", "Logan", "Sandero", "Sandero Stepway", "Spring", "Dokker"],
  },
  {
    marque: "DS",
    modeles: ["DS 3", "DS 3 Crossback", "DS 4", "DS 5", "DS 7", "DS 7 Crossback", "DS 9"],
  },
  {
    marque: "Fiat",
    modeles: [
      "500", "500e", "500X", "500L", "Bravo", "Doblo", "Ducato", "Freemont",
      "Panda", "Punto", "Scudo", "Sedici", "Tipo", "Ulysse",
    ],
  },
  {
    marque: "Ford",
    modeles: [
      "C-Max", "EcoSport", "Edge", "Explorer", "Fiesta", "Focus", "Galaxy",
      "Kuga", "Mondeo", "Mustang", "Mustang Mach-E", "Puma", "Ranger",
      "S-Max", "Tourneo", "Transit",
    ],
  },
  {
    marque: "Honda",
    modeles: ["Accord", "Civic", "CR-V", "HR-V", "Insight", "Jazz", "e:Ny1"],
  },
  {
    marque: "Hyundai",
    modeles: [
      "Bayon", "i10", "i20", "i30", "i40", "Ioniq", "Ioniq 5", "Ioniq 6",
      "ix20", "ix35", "Kona", "Nexo", "Santa Fe", "Staria", "Tucson",
    ],
  },
  {
    marque: "Isuzu",
    modeles: ["D-Max"],
  },
  {
    marque: "Jaguar",
    modeles: ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  },
  {
    marque: "Jeep",
    modeles: ["Avenger", "Cherokee", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  },
  {
    marque: "Kia",
    modeles: [
      "Ceed", "Carnival", "EV6", "EV9", "Niro", "Picanto", "ProCeed", "Rio",
      "Sorento", "Soul", "Sportage", "Stinger", "Stonic", "XCeed",
    ],
  },
  {
    marque: "Lancia",
    modeles: ["Delta", "Musa", "Ypsilon"],
  },
  {
    marque: "Land Rover",
    modeles: [
      "Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover",
      "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar",
    ],
  },
  {
    marque: "Lexus",
    modeles: ["CT", "ES", "GS", "IS", "LBX", "LS", "NX", "RX", "RZ", "UX"],
  },
  {
    marque: "Lynk & Co",
    modeles: ["01", "02", "03", "08"],
  },
  {
    marque: "Maserati",
    modeles: ["Ghibli", "Grecale", "Levante", "MC20", "Quattroporte", "GranTurismo"],
  },
  {
    marque: "Mazda",
    modeles: ["CX-3", "CX-30", "CX-5", "CX-60", "CX-80", "Mazda2", "Mazda3", "Mazda6", "MX-5", "MX-30"],
  },
  {
    marque: "Mercedes-Benz",
    modeles: [
      "Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "CLS",
      "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "GLA", "GLB", "GLC", "GLE",
      "GLS", "Classe G", "SL", "Sprinter", "Vito", "Classe V",
    ],
  },
  {
    marque: "MG",
    modeles: ["Cyberster", "HS", "Marvel R", "MG3", "MG4", "MG5", "ZS"],
  },
  {
    marque: "MINI",
    modeles: ["Cabrio", "Clubman", "Cooper", "Countryman", "Paceman"],
  },
  {
    marque: "Mitsubishi",
    modeles: ["ASX", "Colt", "Eclipse Cross", "L200", "Outlander", "Pajero", "Space Star"],
  },
  {
    marque: "Nissan",
    modeles: [
      "Ariya", "Interstar", "Juke", "Leaf", "Micra", "Navara", "Note",
      "Pulsar", "Qashqai", "Townstar", "X-Trail",
    ],
  },
  {
    marque: "Opel",
    modeles: [
      "Adam", "Astra", "Combo", "Corsa", "Crossland", "Frontera", "Grandland",
      "Insignia", "Meriva", "Mokka", "Movano", "Vivaro", "Zafira",
    ],
  },
  {
    marque: "Peugeot",
    modeles: [
      "106", "107", "108", "205", "206", "207", "208", "2008", "301", "306",
      "307", "308", "3008", "309", "405", "406", "407", "408", "508", "5008",
      "607", "807", "1007", "4007", "4008", "Bipper", "Boxer", "e-208",
      "e-2008", "Expert", "Partner", "Rifter", "Traveller",
    ],
  },
  {
    marque: "Polestar",
    modeles: ["2", "3", "4"],
  },
  {
    marque: "Porsche",
    modeles: ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  },
  {
    marque: "Renault",
    modeles: [
      "4", "5", "Arkana", "Austral", "Captur", "Clio", "Espace", "Express",
      "Kadjar", "Kangoo", "Koleos", "Laguna", "Master", "Mégane",
      "Mégane E-Tech", "Modus", "Rafale", "Scénic", "Scénic E-Tech",
      "Symbioz", "Talisman", "Trafic", "Twingo", "Twizy", "Zoe",
    ],
  },
  {
    marque: "SEAT",
    modeles: ["Alhambra", "Arona", "Ateca", "Ibiza", "Leon", "Mii", "Tarraco", "Toledo"],
  },
  {
    marque: "Škoda",
    modeles: ["Citigo", "Enyaq", "Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Roomster", "Scala", "Superb", "Yeti"],
  },
  {
    marque: "Smart",
    modeles: ["#1", "#3", "Fortwo", "Forfour"],
  },
  {
    marque: "SsangYong / KGM",
    modeles: ["Actyon", "Korando", "Musso", "Rexton", "Rodius", "Tivoli", "Torres"],
  },
  {
    marque: "Subaru",
    modeles: ["BRZ", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "XV"],
  },
  {
    marque: "Suzuki",
    modeles: ["Across", "Alto", "Baleno", "Ignis", "Jimny", "S-Cross", "Splash", "Swace", "Swift", "Vitara"],
  },
  {
    marque: "Tesla",
    modeles: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  },
  {
    marque: "Toyota",
    modeles: [
      "Auris", "Avensis", "Aygo", "Aygo X", "bZ4X", "C-HR", "Camry",
      "Corolla", "GR86", "Hilux", "Land Cruiser", "Prius", "Prius+",
      "Proace", "Proace City", "RAV4", "Supra", "Verso", "Yaris",
      "Yaris Cross",
    ],
  },
  {
    marque: "Volkswagen",
    modeles: [
      "Amarok", "Arteon", "Beetle", "Caddy", "Crafter", "Golf",
      "Golf Plus", "ID.3", "ID.4", "ID.5", "ID.7", "ID.Buzz", "Jetta",
      "Multivan", "Passat", "Polo", "Scirocco", "Sharan", "T-Cross",
      "T-Roc", "Taigo", "Tiguan", "Touareg", "Touran", "Transporter", "up!",
    ],
  },
  {
    marque: "Volvo",
    modeles: [
      "C30", "C40", "EX30", "EX90", "S40", "S60", "S80", "S90", "V40",
      "V50", "V60", "V70", "V90", "XC40", "XC60", "XC90",
    ],
  },
];

/** Marques triées alphabétiquement, « Autre » ajouté à la fin par le formulaire. */
export const MARQUES = MARQUES_VEHICULES.map((entree) => entree.marque);

export function modelesPour(marque: string): string[] {
  return MARQUES_VEHICULES.find((entree) => entree.marque === marque)?.modeles ?? [];
}
