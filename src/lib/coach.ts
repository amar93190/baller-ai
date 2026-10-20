/**
 * Coach mental — version 1 : réponses écrites à l'avance.
 * L'étape 3 remplacera replyTo() par un appel à une IA, en gardant le filtre de détresse.
 */
export type Reply = { lines: string[]; replies: string[]; urgent?: boolean };

const DISTRESS = /(suicid|me tuer|en finir|envie de mourir|plus envie de vivre|me faire du mal|me blesser|scarif)/i;

const SCRIPTS: Record<string, Reply> = {
  "J'ai peur de rater mes lancers": {
    lines: [
      'C\'est normal. Sur la ligne, ton cerveau cherche un repère. Construis ta routine : 3 dribbles, une respiration lente, un mot-clé comme « doux », puis tu tires.',
      'Répète-la 20 fois à ta prochaine séance, onglet Tirs, exercice Lancer franc.',
    ],
    replies: ['Je stresse avant les matchs', 'Ok, je teste'],
  },
  'Je stresse avant les matchs': {
    lines: [
      'Essaie la respiration 4-4-6 : inspire 4 secondes, bloque 4, expire 6. Trois cycles dans le vestiaire.',
      "Le stress, c'est de l'énergie : ton corps se prépare à jouer. On apprend à la canaliser.",
    ],
    replies: ['Ok, je teste', 'Je manque de motivation'],
  },
  'Je manque de motivation': {
    lines: ["Pas de grosse séance aujourd'hui alors. Juste 15 minutes et 50 tirs.", 'La motivation revient souvent après avoir commencé, pas avant.'],
    replies: ["J'ai peur de rater mes lancers", 'Ok, je teste'],
  },
  'Ok, je teste': {
    lines: ['Parfait. Après ton match ou ta séance, reviens me dire comment ça s’est passé. On suivra ton mental dans le temps.'],
    replies: [],
  },
  'Confiance en moi': {
    lines: [
      'La confiance ne vient pas de nulle part : elle se construit avec des preuves. Note 3 actions réussies après chaque séance ou match, même petites.',
      'Avant un match, relis-les. Ton cerveau a besoin de souvenirs de réussite, pas seulement d’erreurs.',
    ],
    replies: ['Je stresse avant les matchs', 'Rebondir après une défaite'],
  },
  'Rebondir après une défaite': {
    lines: [
      'Prends 10 minutes pour être déçu, c’est normal. Ensuite, une seule question : qu’est-ce que je contrôle pour le prochain match ?',
      'Choisis une seule chose à travailler cette semaine. Pas dix.',
    ],
    replies: ['Confiance en moi', 'Je manque de motivation'],
  },
};

/** Sujets proposés sous la zone de texte, au premier lancement du coach. */
export const TOPICS: { label: string; prompt: string }[] = [
  { label: 'Stress avant un match', prompt: 'Je stresse avant les matchs' },
  { label: 'Confiance', prompt: 'Confiance en moi' },
  { label: 'Motivation', prompt: 'Je manque de motivation' },
  { label: 'Après une défaite', prompt: 'Rebondir après une défaite' },
  { label: 'Lancers francs', prompt: "J'ai peur de rater mes lancers" },
];

export function replyTo(text: string): Reply {
  if (DISTRESS.test(text)) {
    return {
      urgent: true,
      lines: [
        "Merci de me l'avoir dit. Ce que tu ressens est important, et tu n'as pas à le porter seul.",
        "Appelle le 3114 maintenant : c'est gratuit, anonyme et disponible 24h/24. Tu peux aussi en parler tout de suite à un adulte de confiance. En cas de danger immédiat, appelle le 112.",
      ],
      replies: [],
    };
  }
  return (
    SCRIPTS[text] ?? {
      lines: ["Merci de m'en parler. C'est plutôt avant, pendant ou après le match que tu le ressens ?"],
      replies: ['Je stresse avant les matchs', 'Je manque de motivation'],
    }
  );
}
