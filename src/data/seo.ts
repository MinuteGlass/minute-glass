export type ServiceSlug = "reparation-pare-brise" | "remplacement-pare-brise" | "vitre-laterale";

export interface SeoService {
  slug: ServiceSlug;
  intervention: "reparation" | "remplacement" | "vitre";
  label: string;
  labelCourt: string;
  h1: (ville: string) => string;
  description: (ville: string) => string;
  contenu: (ville: string) => string;
  prixSans: string;
  prixAvec: string;
  duree: string;
  faq: { q: (ville: string) => string; a: (ville: string) => string }[];
}

export const SEO_SERVICES: Record<ServiceSlug, SeoService> = {
  "reparation-pare-brise": {
    slug: "reparation-pare-brise",
    intervention: "reparation",
    label: "Réparation de pare-brise",
    labelCourt: "Réparation impact",
    h1: (v) => `Réparation de pare-brise à ${v} — devis gratuit`,
    description: (v) =>
      `Vous avez un impact ou une fissure sur votre pare-brise à ${v} ? Déposez votre demande en 2 minutes et recevez des devis de réparateurs locaux. Sans assurance, les réparateurs viennent à vous.`,
    contenu: (v) =>
      `Un impact non traité s'agrandit rapidement, surtout avec les variations de température. À ${v}, la réparation d'impact est possible tant que la fissure fait moins de 3 cm et n'est pas dans votre champ de vision direct. Sans garantie bris de glace, comparer les prix est essentiel — MinuteGlass vous évite d'appeler chaque réparateur un par un : déposez une demande, les pros de ${v} vous contactent directement avec leurs tarifs.`,
    prixSans: "50€ – 90€",
    prixAvec: "0€ (pris en charge)",
    duree: "20 – 30 min",
    faq: [
      {
        q: (v: string) => `Combien coûte une réparation d'impact à ${v} sans assurance ?`,
        a: (v) =>
          `Sans garantie bris de glace à ${v}, comptez entre 50€ et 90€ selon le réparateur et l'étendue de l'impact. En déposant une demande sur MinuteGlass, vous recevez plusieurs devis et choisissez le meilleur prix sans passer de coups de fil.`,
      },
      {
        q: () => "Peut-on réparer ou faut-il remplacer le pare-brise ?",
        a: () =>
          "La réparation est possible si l'impact fait moins de 3 cm et n'est pas dans le champ de vision du conducteur. Au-delà, le remplacement est obligatoire. Un réparateur peut vous le confirmer en quelques secondes sur photo.",
      },
      {
        q: () => "Combien de temps dure la réparation ?",
        a: () =>
          "Une réparation d'impact prend 20 à 30 minutes. Le réparateur peut se déplacer à votre domicile ou votre lieu de travail. Vous réglez directement à la fin de l'intervention.",
      },
      {
        q: () => "Faut-il une assurance pour utiliser MinuteGlass ?",
        a: () =>
          "Non. MinuteGlass est particulièrement utile si vous n'avez pas la garantie bris de glace. Les réparateurs vous contactent, vous comparez, vous choisissez — et vous payez directement le professionnel, sans intermédiaire.",
      },
    ],
  },

  "remplacement-pare-brise": {
    slug: "remplacement-pare-brise",
    intervention: "remplacement",
    label: "Remplacement de pare-brise",
    labelCourt: "Remplacement",
    h1: (v) => `Remplacement de pare-brise à ${v} — devis gratuit`,
    description: (v) =>
      `Pare-brise brisé ou fissure irréparable à ${v} ? Décrivez votre véhicule une seule fois et recevez des devis de réparateurs locaux certifiés. Sans assurance, payez directement et roulez vite.`,
    contenu: (v) =>
      `Un remplacement de pare-brise est inévitable quand la fissure dépasse 3 cm ou traverse le champ de vision. À ${v}, les tarifs varient du simple au double selon les professionnels. Sans garantie bris de glace, il est indispensable de comparer avant de s'engager. MinuteGlass vous met en relation avec les réparateurs de ${v} : ils vous contactent, vous choisissez selon le prix et les délais, vous payez directement à l'intervention — sans attendre les remboursements assurance.`,
    prixSans: "200€ – 600€",
    prixAvec: "0€ (franchise selon contrat)",
    duree: "1h – 2h",
    faq: [
      {
        q: (v: string) => `Quel est le prix d'un remplacement de pare-brise à ${v} sans assurance ?`,
        a: (v) =>
          `À ${v}, le prix varie de 200€ à 600€ selon la marque du véhicule et le type de pare-brise (avec ou sans caméra, capteurs ADAS). En comparant plusieurs réparateurs via MinuteGlass, vous pouvez économiser jusqu'à 30%.`,
      },
      {
        q: () => "Combien de temps prend un remplacement de pare-brise ?",
        a: () =>
          "Le remplacement prend généralement 1h à 2h. Le pare-brise doit ensuite sécher 1h avant de reprendre la route. Certains réparateurs proposent un service à domicile.",
      },
      {
        q: () => "Les caméras et capteurs ADAS sont-ils recalibrés ?",
        a: () =>
          "Oui, si votre véhicule est équipé d'une caméra ou de capteurs intégrés au pare-brise, un recalibrage ADAS est nécessaire après le remplacement. Précisez-le dans votre demande pour recevoir des devis complets.",
      },
      {
        q: () => "Puis-je utiliser MinuteGlass sans assurance bris de glace ?",
        a: () =>
          "Absolument — c'est même le cas le plus fréquent sur MinuteGlass. Sans assurance, vous recevez plusieurs devis, comparez et payez directement le réparateur à la fin de l'intervention. Pas d'avance, pas de paperasse.",
      },
    ],
  },

  "vitre-laterale": {
    slug: "vitre-laterale",
    intervention: "vitre",
    label: "Remplacement de vitre latérale",
    labelCourt: "Vitre latérale",
    h1: (v) => `Remplacement de vitre latérale à ${v} — devis gratuit`,
    description: (v) =>
      `Vitre brisée ou fêlée à ${v} ? Déposez votre demande en 2 minutes et recevez des devis de réparateurs locaux. Sans assurance, les professionnels de ${v} viennent à vous.`,
    contenu: (v) =>
      `Une vitre latérale brisée expose votre véhicule aux intempéries et aux risques de vol. À ${v}, il est important d'agir rapidement. Contrairement au pare-brise, les vitres latérales sont généralement en verre trempé et ne peuvent pas être réparées — le remplacement est systématique. Sans garantie bris de glace, MinuteGlass vous permet de recevoir plusieurs devis de réparateurs de ${v} sans avoir à les appeler un par un.`,
    prixSans: "80€ – 300€",
    prixAvec: "0€ (selon contrat)",
    duree: "30 min – 1h",
    faq: [
      {
        q: (v: string) => `Combien coûte le remplacement d'une vitre latérale à ${v} ?`,
        a: (v) =>
          `À ${v}, le prix varie de 80€ à 300€ selon le modèle du véhicule et le type de vitre (teintée, électrique, etc.). Comparez plusieurs devis via MinuteGlass pour trouver le meilleur tarif.`,
      },
      {
        q: () => "Peut-on réparer une vitre latérale fissurée ?",
        a: () =>
          "Non. Les vitres latérales sont en verre trempé et ne peuvent pas être réparées — elles doivent être remplacées. Seul le pare-brise (en verre feuilleté) peut parfois être réparé.",
      },
      {
        q: () => "Le réparateur peut-il intervenir à domicile ?",
        a: () =>
          "Oui, beaucoup de réparateurs se déplacent à votre domicile ou lieu de travail. Précisez votre disponibilité dans la demande et les professionnels s'adaptent.",
      },
      {
        q: () => "Faut-il une assurance pour déposer une demande ?",
        a: () =>
          "Non. MinuteGlass est gratuit pour les particuliers avec ou sans assurance. Si vous n'avez pas la garantie bris de glace, vous recevez des devis et payez directement le réparateur choisi.",
      },
    ],
  },
};

export interface SeoCity {
  slug: string;
  nom: string;
  departement: string;
  region: string;
  reparateurs: number;
  villesProches: { slug: string; nom: string }[];
}

export const SEO_CITIES: SeoCity[] = [
  { slug: "paris", nom: "Paris", departement: "75", region: "Île-de-France", reparateurs: 124, villesProches: [{ slug: "boulogne-billancourt", nom: "Boulogne-Billancourt" }, { slug: "saint-denis", nom: "Saint-Denis" }, { slug: "montreuil", nom: "Montreuil" }, { slug: "versailles", nom: "Versailles" }] },
  { slug: "lyon", nom: "Lyon", departement: "69", region: "Auvergne-Rhône-Alpes", reparateurs: 34, villesProches: [{ slug: "villeurbanne", nom: "Villeurbanne" }, { slug: "venissieux", nom: "Vénissieux" }, { slug: "bron", nom: "Bron" }, { slug: "caluire", nom: "Caluire" }] },
  { slug: "marseille", nom: "Marseille", departement: "13", region: "Provence-Alpes-Côte d'Azur", reparateurs: 41, villesProches: [{ slug: "aix-en-provence", nom: "Aix-en-Provence" }, { slug: "aubagne", nom: "Aubagne" }, { slug: "martigues", nom: "Martigues" }] },
  { slug: "toulouse", nom: "Toulouse", departement: "31", region: "Occitanie", reparateurs: 28, villesProches: [{ slug: "blagnac", nom: "Blagnac" }, { slug: "colomiers", nom: "Colomiers" }, { slug: "muret", nom: "Muret" }] },
  { slug: "nice", nom: "Nice", departement: "06", region: "Provence-Alpes-Côte d'Azur", reparateurs: 19, villesProches: [{ slug: "antibes", nom: "Antibes" }, { slug: "cannes", nom: "Cannes" }, { slug: "menton", nom: "Menton" }] },
  { slug: "nantes", nom: "Nantes", departement: "44", region: "Pays de la Loire", reparateurs: 22, villesProches: [{ slug: "saint-herblain", nom: "Saint-Herblain" }, { slug: "rezé", nom: "Rezé" }, { slug: "saint-nazaire", nom: "Saint-Nazaire" }] },
  { slug: "montpellier", nom: "Montpellier", departement: "34", region: "Occitanie", reparateurs: 18, villesProches: [{ slug: "lattes", nom: "Lattes" }, { slug: "castelnau-le-lez", nom: "Castelnau-le-Lez" }, { slug: "sete", nom: "Sète" }] },
  { slug: "strasbourg", nom: "Strasbourg", departement: "67", region: "Grand Est", reparateurs: 16, villesProches: [{ slug: "schiltigheim", nom: "Schiltigheim" }, { slug: "illkirch", nom: "Illkirch" }, { slug: "mulhouse", nom: "Mulhouse" }] },
  { slug: "bordeaux", nom: "Bordeaux", departement: "33", region: "Nouvelle-Aquitaine", reparateurs: 24, villesProches: [{ slug: "merignac", nom: "Mérignac" }, { slug: "pessac", nom: "Pessac" }, { slug: "libourne", nom: "Libourne" }] },
  { slug: "lille", nom: "Lille", departement: "59", region: "Hauts-de-France", reparateurs: 21, villesProches: [{ slug: "roubaix", nom: "Roubaix" }, { slug: "tourcoing", nom: "Tourcoing" }, { slug: "villeneuve-d-ascq", nom: "Villeneuve-d'Ascq" }] },
  { slug: "rennes", nom: "Rennes", departement: "35", region: "Bretagne", reparateurs: 15, villesProches: [{ slug: "saint-malo", nom: "Saint-Malo" }, { slug: "vannes", nom: "Vannes" }, { slug: "lorient", nom: "Lorient" }] },
  { slug: "reims", nom: "Reims", departement: "51", region: "Grand Est", reparateurs: 12, villesProches: [{ slug: "epernay", nom: "Épernay" }, { slug: "chalons-en-champagne", nom: "Châlons-en-Champagne" }] },
  { slug: "toulon", nom: "Toulon", departement: "83", region: "Provence-Alpes-Côte d'Azur", reparateurs: 17, villesProches: [{ slug: "la-seyne-sur-mer", nom: "La Seyne-sur-Mer" }, { slug: "hyeres", nom: "Hyères" }, { slug: "frejus", nom: "Fréjus" }] },
  { slug: "grenoble", nom: "Grenoble", departement: "38", region: "Auvergne-Rhône-Alpes", reparateurs: 14, villesProches: [{ slug: "echirolles", nom: "Échirolles" }, { slug: "chambery", nom: "Chambéry" }, { slug: "valence", nom: "Valence" }] },
  { slug: "dijon", nom: "Dijon", departement: "21", region: "Bourgogne-Franche-Comté", reparateurs: 11, villesProches: [{ slug: "beaune", nom: "Beaune" }, { slug: "chalon-sur-saone", nom: "Chalon-sur-Saône" }] },
  { slug: "angers", nom: "Angers", departement: "49", region: "Pays de la Loire", reparateurs: 13, villesProches: [{ slug: "le-mans", nom: "Le Mans" }, { slug: "saumur", nom: "Saumur" }] },
  { slug: "nimes", nom: "Nîmes", departement: "30", region: "Occitanie", reparateurs: 10, villesProches: [{ slug: "ales", nom: "Alès" }, { slug: "arles", nom: "Arles" }] },
  { slug: "clermont-ferrand", nom: "Clermont-Ferrand", departement: "63", region: "Auvergne-Rhône-Alpes", reparateurs: 9, villesProches: [{ slug: "thiers", nom: "Thiers" }, { slug: "vichy", nom: "Vichy" }] },
  { slug: "le-havre", nom: "Le Havre", departement: "76", region: "Normandie", reparateurs: 11, villesProches: [{ slug: "rouen", nom: "Rouen" }, { slug: "caen", nom: "Caen" }] },
  { slug: "aix-en-provence", nom: "Aix-en-Provence", departement: "13", region: "Provence-Alpes-Côte d'Azur", reparateurs: 16, villesProches: [{ slug: "marseille", nom: "Marseille" }, { slug: "aubagne", nom: "Aubagne" }] },
];

export function getCityBySlug(slug: string): SeoCity | undefined {
  return SEO_CITIES.find((c) => c.slug === slug);
}

export function getServiceBySlug(slug: string): SeoService | undefined {
  return SEO_SERVICES[slug as ServiceSlug];
}
