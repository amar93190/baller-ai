/**
 * Joueurs modèles proposés à l'inscription, 4 par poste, avec un programme d'entraînement.
 *
 * ⚠️ Utiliser le nom d'un joueur réel pour présenter un programme (« entraîne-toi comme Curry »)
 * relève du droit à l'image. OK pour la maquette de l'école, mais avant de soumettre l'app
 * sur les stores : passe USE_REAL_PLAYER_NAMES à false pour afficher des profils descriptifs à la place
 * (« Le Shooteur »…). Les vrais surnoms (Mamba, Greek Freak, Chef Curry…) sont aussi des marques déposées.
 */
export const USE_REAL_PLAYER_NAMES = true;

export type Drill = { id: string; title: string; detail: string };

export type PlayerModel = {
  id: string;
  /** M : joueur NBA, F : joueuse WNBA ou équipe de France. */
  gender: 'M' | 'F';
  position: string;
  name: string;
  alias: string;
  num: number;
  style: string;
  traits: string[];
  drills: Drill[];
};

const d = (model: string, list: [string, string][]): Drill[] => list.map(([title, detail], i) => ({ id: `${model}-${i + 1}`, title, detail }));

const MODELS_M: Omit<PlayerModel, 'gender'>[] = [
  // Meneur
  {
    id: 'curry',
    position: 'Meneur',
    name: 'Stephen Curry',
    alias: 'Le Shooteur',
    num: 30,
    style: 'Shooteur longue distance, toujours en mouvement sans ballon.',
    traits: ['Tir à 3 pts', 'Déplacements', 'Dribble'],
    drills: d('curry', [
      ['Form shooting', '50 tirs à une main près du cercle, coude aligné'],
      ['Catch & shoot', '5 positions × 10 tirs derrière la ligne à 3 pts'],
      ['Sortie de dribble', '30 pull-up à mi-distance, gauche et droite'],
      ['Dribble 2 ballons', '5 minutes : croisés, entre les jambes, rythme'],
      ['Tir en relocalisation', '25 tirs après un sprint vers un nouveau spot'],
      ['Tir très lointain', '20 tirs un mètre derrière la ligne à 3 pts'],
    ]),
  },
  {
    id: 'irving',
    position: 'Meneur',
    name: 'Kyrie Irving',
    alias: 'Le Dribbleur',
    num: 11,
    style: 'Dribble créatif et finitions acrobatiques près du cercle.',
    traits: ['Handle', 'Finitions', 'Main faible'],
    drills: d('irving', [
      ['Dribble stationnaire', '5 minutes de combos sans regarder le ballon'],
      ['Finitions main faible', '30 layups de la main faible, des deux côtés'],
      ['Reverse layups', '20 finitions de l’autre côté du cercle'],
      ['Spin move', '20 spins vers le cercle, finition en contact'],
      ['Floaters', '30 tirs en cloche dans la raquette'],
      ['Dribble sous pression', '10 traversées de terrain avec un défenseur fictif'],
    ]),
  },
  {
    id: 'doncic',
    position: 'Meneur',
    name: 'Luka Dončić',
    alias: 'Le Créateur',
    num: 77,
    style: 'Vision de jeu, rythme lent et step-back imprévisible.',
    traits: ['Step-back', 'Passes', 'Lecture du jeu'],
    drills: d('doncic', [
      ['Step-back', '30 step-back à 3 pts, appuis stables'],
      ['Changements de rythme', '10 attaques lent-rapide vers le cercle'],
      ['Passes en sortie de pick', '40 passes à une main vers un mur cible'],
      ['Tir après feinte', '25 tirs après une feinte de tir'],
      ['Finitions en contact', '20 layups en absorbant un choc'],
      ['Lecture vidéo', '15 minutes à analyser un match : où va le ballon ?'],
    ]),
  },
  {
    id: 'morant',
    position: 'Meneur',
    name: 'Ja Morant',
    alias: 'L’Explosif',
    num: 12,
    style: 'Vitesse, détente et attaque permanente du cercle.',
    traits: ['Vitesse', 'Détente', 'Attaque du cercle'],
    drills: d('morant', [
      ['Sprints ballon en main', '10 traversées à pleine vitesse'],
      ['Pliométrie', '3 séries de 10 sauts groupés'],
      ['Euro step', '20 euro steps, finition des deux mains'],
      ['Finitions en hauteur', '20 layups en prenant appel loin du cercle'],
      ['Premier pas', '20 départs croisés depuis la position de triple menace'],
      ['Tir en transition', '20 pull-up après un sprint'],
    ]),
  },
  // Arrière
  {
    id: 'bryant',
    position: 'Arrière',
    name: 'Kobe Bryant',
    alias: 'Le Compétiteur',
    num: 24,
    style: 'Mental de compétiteur, travail des appuis et tir à mi-distance.',
    traits: ['Mi-distance', 'Footwork', 'Mental'],
    drills: d('bryant', [
      ['Fadeaway', '30 fadeaways à mi-distance, des deux côtés'],
      ['Jeu de jambes', '20 pivots et jab steps avant de tirer'],
      ['Tir sous fatigue', '10 tirs après chaque série de 5 sprints'],
      ['Poste bas arrière', '20 tirs dos au panier côté ligne de fond'],
      ['Défense sur l’homme', '5 minutes de glissades défensives'],
      ['Séance à 6 h', 'Une séance avant les cours, 30 minutes'],
    ]),
  },
  {
    id: 'booker',
    position: 'Arrière',
    name: 'Devin Booker',
    alias: 'Le Scoreur',
    num: 1,
    style: 'Scoreur complet, à l’aise à 3 pts comme à mi-distance.',
    traits: ['Scoring', 'Mi-distance', 'Sortie d’écran'],
    drills: d('booker', [
      ['Sortie d’écran', '25 tirs en sortant d’un écran fictif'],
      ['Pull-up mi-distance', '30 tirs en un ou deux dribbles'],
      ['Jab step', '20 jab steps puis tir ou drive'],
      ['Tir à 3 pts', '5 positions × 8 tirs'],
      ['Finitions', '20 layups en angle'],
      ['Lancers francs', '3 séries de 10'],
    ]),
  },
  {
    id: 'thompson',
    position: 'Arrière',
    name: 'Klay Thompson',
    alias: 'Le Sniper',
    num: 11,
    style: 'Tir instantané après réception, mécanique parfaite.',
    traits: ['Catch & shoot', 'Mécanique', 'Défense'],
    drills: d('thompson', [
      ['Mécanique', '50 tirs près du cercle, même geste à chaque fois'],
      ['Catch & shoot rapide', '40 tirs en moins d’une seconde après réception'],
      ['Tirs dans le coin', '20 tirs depuis chaque coin'],
      ['Sortie d’écran rapide', '25 tirs en courant'],
      ['Défense', '5 minutes de glissades et de closeouts'],
      ['Série parfaite', 'Enchaîner 10 tirs réussis d’affilée'],
    ]),
  },
  {
    id: 'edwards',
    position: 'Arrière',
    name: 'Anthony Edwards',
    alias: 'Le Puissant',
    num: 5,
    style: 'Puissance, explosivité et confiance pour attaquer.',
    traits: ['Puissance', 'Attaque', 'Confiance'],
    drills: d('edwards', [
      ['Attaque en puissance', '20 drives en finissant malgré le contact'],
      ['Pliométrie', '3 séries de 8 sauts sur une jambe'],
      ['Pull-up à 3 pts', '25 tirs après un dribble'],
      ['Finitions au dunk', '15 tentatives en prenant appel sur deux pieds'],
      ['Renforcement', '3 séries de gainage et de squats'],
      ['Défense agressive', '5 minutes de pression sur le porteur'],
    ]),
  },
  // Ailier
  {
    id: 'james',
    position: 'Ailier',
    name: 'LeBron James',
    alias: 'Le Complet',
    num: 23,
    style: 'Jeu complet : passes, puissance et intelligence de jeu.',
    traits: ['Polyvalence', 'Passes', 'Physique'],
    drills: d('james', [
      ['Attaque en transition', '10 contre-attaques finies en puissance'],
      ['Passes à une main', '40 passes cross-court vers une cible'],
      ['Poste bas', '20 tirs dos au panier'],
      ['Tir à 3 pts', '5 positions × 6 tirs'],
      ['Rebond et relance', '20 rebonds suivis d’une passe rapide'],
      ['Récupération', '15 minutes d’étirements et de mobilité'],
    ]),
  },
  {
    id: 'durant',
    position: 'Ailier',
    name: 'Kevin Durant',
    alias: 'Le Grand Shooteur',
    num: 7,
    style: 'Grand gabarit qui tire comme un arrière.',
    traits: ['Tir en extension', 'Mi-distance', 'Dribble haut'],
    drills: d('durant', [
      ['Tir en extension', '30 tirs en sautant haut, lâcher au sommet'],
      ['Mi-distance', '5 positions × 8 tirs'],
      ['Jab step', '20 jab steps puis tir'],
      ['Dribble pour grand', '5 minutes de dribble bas malgré la taille'],
      ['Tir dos au panier', '20 turnaround jumpers'],
      ['Lancers francs', '3 séries de 10'],
    ]),
  },
  {
    id: 'tatum',
    position: 'Ailier',
    name: 'Jayson Tatum',
    alias: 'Le Technicien',
    num: 0,
    style: 'Footwork propre, step-back et scoring sur tout le terrain.',
    traits: ['Footwork', 'Step-back', 'Scoring'],
    drills: d('tatum', [
      ['Step-back mi-distance', '30 tirs, des deux côtés'],
      ['Footwork poste haut', '20 pivots puis tir'],
      ['Tir à 3 pts', '5 positions × 8 tirs'],
      ['Drive et kick', '20 pénétrations puis passe vers l’extérieur'],
      ['Finitions', '20 layups main gauche et main droite'],
      ['Défense', '5 minutes de glissades'],
    ]),
  },
  {
    id: 'leonard',
    position: 'Ailier',
    name: 'Kawhi Leonard',
    alias: 'Le Défenseur',
    num: 2,
    style: 'Défenseur d’élite, calme et efficace à mi-distance.',
    traits: ['Défense', 'Mi-distance', 'Sang-froid'],
    drills: d('leonard', [
      ['Défense sur l’homme', '10 minutes de glissades et de mains actives'],
      ['Interceptions', '20 lectures de passes à couper'],
      ['Pull-up mi-distance', '30 tirs après un ou deux dribbles'],
      ['Poste bas', '20 tirs en pivot'],
      ['Rebond défensif', '20 rebonds en boxant'],
      ['Routine calme', '5 minutes de respiration avant la séance'],
    ]),
  },
  // Ailier fort
  {
    id: 'antetokounmpo',
    position: 'Ailier fort',
    name: 'Giannis Antetokounmpo',
    alias: 'Le Coureur',
    num: 34,
    style: 'Grandes enjambées, attaque du cercle et transition.',
    traits: ['Transition', 'Attaque du cercle', 'Rebond'],
    drills: d('antetokounmpo', [
      ['Euro step long', '20 euro steps en prenant appel loin'],
      ['Contre-attaque', '10 traversées finies au cercle'],
      ['Rebond offensif', '20 rebonds suivis d’une remise'],
      ['Finitions en puissance', '20 layups malgré le contact'],
      ['Lancers francs', '3 séries de 10, même routine à chaque fois'],
      ['Renforcement', '3 séries de squats et de fentes'],
    ]),
  },
  {
    id: 'nowitzki',
    position: 'Ailier fort',
    name: 'Dirk Nowitzki',
    alias: 'Le Fadeaway',
    num: 41,
    style: 'Grand shooteur au fadeaway sur une jambe imparable.',
    traits: ['Fadeaway', 'Tir de grand', 'Toucher'],
    drills: d('nowitzki', [
      ['Fadeaway une jambe', '30 tirs au poste haut'],
      ['Tir à 3 pts pour grand', '5 positions × 6 tirs'],
      ['Pick and pop', '25 tirs après un écran fictif'],
      ['Mi-distance', '30 tirs sur la ligne des lancers'],
      ['Feinte et tir', '20 feintes de tir puis un dribble et tir'],
      ['Lancers francs', '3 séries de 10'],
    ]),
  },
  {
    id: 'duncan',
    position: 'Ailier fort',
    name: 'Tim Duncan',
    alias: 'Le Fondamental',
    num: 21,
    style: 'Fondamentaux parfaits et tir contre la planche.',
    traits: ['Fondamentaux', 'Tir planche', 'Défense'],
    drills: d('duncan', [
      ['Tir contre la planche', '30 tirs à 45° en visant le carré'],
      ['Poste bas', '20 mouvements dos au panier'],
      ['Mikan drill', '3 minutes de layups alternés sous le cercle'],
      ['Contres', '20 sauts pour contrer en restant vertical'],
      ['Rebond', '20 rebonds en boxant'],
      ['Lancers francs', '3 séries de 10'],
    ]),
  },
  {
    id: 'garnett',
    position: 'Ailier fort',
    name: 'Kevin Garnett',
    alias: 'Le Guerrier',
    num: 5,
    style: 'Intensité, défense et tir à mi-distance.',
    traits: ['Intensité', 'Défense', 'Mi-distance'],
    drills: d('garnett', [
      ['Défense au poste', '5 minutes de positionnement et de contacts'],
      ['Mi-distance', '30 tirs à la limite de la raquette'],
      ['Aide défensive', '20 rotations et retours'],
      ['Rebond', '20 rebonds offensifs et défensifs'],
      ['Communication', 'Parler à chaque action pendant tout un entraînement'],
      ['Lancers francs', '3 séries de 10'],
    ]),
  },
  // Pivot
  {
    id: 'wembanyama',
    position: 'Pivot',
    name: 'Victor Wembanyama',
    alias: 'Le Géant',
    num: 1,
    style: 'Taille hors norme, contres et tir d’extérieur.',
    traits: ['Contres', 'Tir extérieur', 'Mobilité'],
    drills: d('wembanyama', [
      ['Contres', '20 sauts pour contrer en timing'],
      ['Tir à 3 pts pour grand', '5 positions × 6 tirs'],
      ['Dribble pour grand', '5 minutes de dribble bas'],
      ['Finitions en hauteur', '20 layups et dunks'],
      ['Mobilité', '15 minutes d’étirements et de coordination'],
      ['Mi-distance', '30 tirs en pivot'],
    ]),
  },
  {
    id: 'jokic',
    position: 'Pivot',
    name: 'Nikola Jokić',
    alias: 'Le Passeur',
    num: 15,
    style: 'Pivot passeur, toucher de balle et lecture du jeu.',
    traits: ['Passes', 'Toucher', 'Lecture du jeu'],
    drills: d('jokic', [
      ['Passes du poste haut', '40 passes vers des cibles qui coupent'],
      ['Toucher près du cercle', '30 floaters et crochets'],
      ['Tir dos au panier', '20 turnaround jumpers'],
      ['Passes aveugles', '20 passes sans regarder la cible'],
      ['Rebond et relance', '20 rebonds suivis d’une passe longue'],
      ['Lecture vidéo', '15 minutes à analyser les coupes de tes coéquipiers'],
    ]),
  },
  {
    id: 'oneal',
    position: 'Pivot',
    name: 'Shaquille O’Neal',
    alias: 'Le Mur',
    num: 34,
    style: 'Puissance pure au poste bas.',
    traits: ['Puissance', 'Poste bas', 'Rebond'],
    drills: d('oneal', [
      ['Drop step', '20 drop steps en puissance'],
      ['Finitions au contact', '20 layups malgré la poussée'],
      ['Rebond', '20 rebonds en prenant position'],
      ['Renforcement', '3 séries de squats et de pompes'],
      ['Crochets', '20 crochets des deux mains'],
      ['Lancers francs', '5 séries de 10, la routine avant tout'],
    ]),
  },
  {
    id: 'embiid',
    position: 'Pivot',
    name: 'Joel Embiid',
    alias: 'Le Pivot technique',
    num: 21,
    style: 'Footwork de poste bas et tir à mi-distance.',
    traits: ['Footwork', 'Mi-distance', 'Lancers'],
    drills: d('embiid', [
      ['Dream shake', '20 feintes et pivots au poste bas'],
      ['Mi-distance', '30 tirs au poste haut'],
      ['Face au panier', '20 attaques d’un dribble'],
      ['Provoquer la faute', '20 finitions en cherchant le contact'],
      ['Lancers francs', '3 séries de 10'],
      ['Défense du cercle', '5 minutes de positionnement et de contres'],
    ]),
  },
];

/**
 * Joueuses modèles : WNBA et équipe de France, 4 par poste.
 * Leur programme reprend celui d'un style de jeu proche (base), avec ses propres identifiants.
 */
const WOMEN: (Omit<PlayerModel, 'gender' | 'drills'> & { base: string })[] = [
  { id: 'clark', position: 'Meneur', name: 'Caitlin Clark', alias: 'La Shooteuse', num: 22, style: 'Tir très lointain et passes laser, toujours en attaque.', traits: ['Tir lointain', 'Passes', 'Vision'], base: 'curry' },
  { id: 'ionescu', position: 'Meneur', name: 'Sabrina Ionescu', alias: 'La Créatrice', num: 20, style: 'Meneuse complète : step-back, passes et sang-froid.', traits: ['Step-back', 'Passes', 'Polyvalence'], base: 'doncic' },
  { id: 'johannes', position: 'Meneur', name: 'Marine Johannès', alias: 'L’Artiste', num: 23, style: 'Dribble créatif et passes inattendues, la touche française.', traits: ['Dribble', 'Créativité', 'Tir'], base: 'irving' },
  { id: 'bird', position: 'Meneur', name: 'Sue Bird', alias: 'La Cheffe d’orchestre', num: 10, style: 'Gestion du jeu, passes et tirs dans les moments clés.', traits: ['Lecture du jeu', 'Passes', 'Leadership'], base: 'doncic' },
  { id: 'taurasi', position: 'Arrière', name: 'Diana Taurasi', alias: 'La Compétitrice', num: 3, style: 'Scoreuse au mental d’acier, jamais rassasiée.', traits: ['Scoring', 'Mental', 'Tir à 3 pts'], base: 'bryant' },
  { id: 'ogunbowale', position: 'Arrière', name: 'Arike Ogunbowale', alias: 'La Scoreuse', num: 24, style: 'Création de tir en un contre un, en sortie de dribble.', traits: ['Un contre un', 'Pull-up', 'Scoring'], base: 'booker' },
  { id: 'plum', position: 'Arrière', name: 'Kelsey Plum', alias: 'La Vitesse', num: 10, style: 'Rapide, adroite, dangereuse en transition.', traits: ['Vitesse', 'Tir à 3 pts', 'Transition'], base: 'thompson' },
  { id: 'loyd', position: 'Arrière', name: 'Jewell Loyd', alias: 'La Tueuse', num: 24, style: 'Puissance et adresse pour finir les matchs.', traits: ['Attaque', 'Mi-distance', 'Défense'], base: 'edwards' },
  { id: 'stewart', position: 'Ailier', name: 'Breanna Stewart', alias: 'La Complète', num: 30, style: 'Grande taille, tir extérieur et jeu complet.', traits: ['Polyvalence', 'Tir', 'Rebond'], base: 'durant' },
  { id: 'moore', position: 'Ailier', name: 'Maya Moore', alias: 'La Gagnante', num: 23, style: 'Efficacité, défense et sens du moment.', traits: ['Mi-distance', 'Défense', 'Sang-froid'], base: 'leonard' },
  { id: 'collier', position: 'Ailier', name: 'Napheesa Collier', alias: 'La Technicienne', num: 24, style: 'Footwork propre et adresse près du cercle.', traits: ['Footwork', 'Finitions', 'Défense'], base: 'tatum' },
  { id: 'gwilliams', position: 'Ailier', name: 'Gabby Williams', alias: 'La Défenseuse', num: 1, style: 'Défense de fer et énergie de l’équipe de France.', traits: ['Défense', 'Énergie', 'Transition'], base: 'james' },
  { id: 'parker', position: 'Ailier fort', name: 'Candace Parker', alias: 'La Polyvalente', num: 3, style: 'Grande qui dribble, passe et tire comme une arrière.', traits: ['Polyvalence', 'Passes', 'Rebond'], base: 'duncan' },
  { id: 'thomas', position: 'Ailier fort', name: 'Alyssa Thomas', alias: 'La Moteur', num: 25, style: 'Physique, transition et passes depuis le poste.', traits: ['Physique', 'Transition', 'Passes'], base: 'antetokounmpo' },
  { id: 'sabally', position: 'Ailier fort', name: 'Satou Sabally', alias: 'La Guerrière', num: 0, style: 'Intensité, défense et attaque du cercle.', traits: ['Intensité', 'Défense', 'Attaque'], base: 'garnett' },
  { id: 'gruda', position: 'Ailier fort', name: 'Sandrine Gruda', alias: 'La Fadeaway', num: 7, style: 'Tir de grande et expérience internationale.', traits: ['Tir de grande', 'Poste haut', 'Expérience'], base: 'nowitzki' },
  { id: 'wilson', position: 'Pivot', name: 'A’ja Wilson', alias: 'La Dominante', num: 22, style: 'Domination au poste, mi-distance et contres.', traits: ['Poste bas', 'Mi-distance', 'Contres'], base: 'embiid' },
  { id: 'griner', position: 'Pivot', name: 'Brittney Griner', alias: 'Le Mur', num: 42, style: 'Taille, contres et finitions près du cercle.', traits: ['Contres', 'Finitions', 'Rebond'], base: 'oneal' },
  { id: 'leslie', position: 'Pivot', name: 'Lisa Leslie', alias: 'La Pionnière', num: 9, style: 'Mobilité, toucher et premier dunk de l’histoire de la WNBA.', traits: ['Mobilité', 'Toucher', 'Finitions'], base: 'wembanyama' },
  { id: 'fowles', position: 'Pivot', name: 'Sylvia Fowles', alias: 'La Rebondeuse', num: 34, style: 'Rebond, défense et adresse près du panier.', traits: ['Rebond', 'Défense', 'Toucher'], base: 'jokic' },
];

export const MODELS: PlayerModel[] = [
  ...MODELS_M.map((m) => ({ ...m, gender: 'M' as const })),
  ...WOMEN.map(({ base, ...m }) => ({
    ...m,
    gender: 'F' as const,
    drills: MODELS_M.find((x) => x.id === base)!.drills.map((dr, i) => ({ ...dr, id: `${m.id}-${i + 1}` })),
  })),
];

/**
 * Photos des joueurs : Wikimedia Commons, sous licence libre (CC BY, CC BY-SA ou domaine public).
 * Ces licences imposent de citer l'auteur : voir l'écran Crédits photos.
 * Elles sont masquées avec les vrais noms (USE_REAL_PLAYER_NAMES = false) :
 * le droit à l'image des joueurs s'applique aussi aux photos libres.
 */
const PHOTOS: Record<string, number> = {
  clark: require('../../assets/images/players/clark.jpg'),
  ionescu: require('../../assets/images/players/ionescu.jpg'),
  johannes: require('../../assets/images/players/johannes.jpg'),
  bird: require('../../assets/images/players/bird.jpg'),
  taurasi: require('../../assets/images/players/taurasi.jpg'),
  ogunbowale: require('../../assets/images/players/ogunbowale.jpg'),
  plum: require('../../assets/images/players/plum.jpg'),
  loyd: require('../../assets/images/players/loyd.jpg'),
  stewart: require('../../assets/images/players/stewart.jpg'),
  moore: require('../../assets/images/players/moore.jpg'),
  collier: require('../../assets/images/players/collier.jpg'),
  gwilliams: require('../../assets/images/players/gwilliams.jpg'),
  parker: require('../../assets/images/players/parker.jpg'),
  thomas: require('../../assets/images/players/thomas.jpg'),
  sabally: require('../../assets/images/players/sabally.jpg'),
  gruda: require('../../assets/images/players/gruda.jpg'),
  wilson: require('../../assets/images/players/wilson.jpg'),
  griner: require('../../assets/images/players/griner.jpg'),
  leslie: require('../../assets/images/players/leslie.jpg'),
  fowles: require('../../assets/images/players/fowles.jpg'),
  curry: require('../../assets/images/players/curry.jpg'),
  irving: require('../../assets/images/players/irving.jpg'),
  doncic: require('../../assets/images/players/doncic.jpg'),
  morant: require('../../assets/images/players/morant.jpg'),
  bryant: require('../../assets/images/players/bryant.jpg'),
  booker: require('../../assets/images/players/booker.jpg'),
  thompson: require('../../assets/images/players/thompson.jpg'),
  edwards: require('../../assets/images/players/edwards.jpg'),
  james: require('../../assets/images/players/james.jpg'),
  durant: require('../../assets/images/players/durant.jpg'),
  tatum: require('../../assets/images/players/tatum.jpg'),
  leonard: require('../../assets/images/players/leonard.jpg'),
  antetokounmpo: require('../../assets/images/players/antetokounmpo.jpg'),
  nowitzki: require('../../assets/images/players/nowitzki.jpg'),
  duncan: require('../../assets/images/players/duncan.jpg'),
  garnett: require('../../assets/images/players/garnett.jpg'),
  wembanyama: require('../../assets/images/players/wembanyama.jpg'),
  jokic: require('../../assets/images/players/jokic.jpg'),
  oneal: require('../../assets/images/players/oneal.jpg'),
  embiid: require('../../assets/images/players/embiid.jpg'),
};

export const modelPhoto = (m: PlayerModel): number | undefined => (USE_REAL_PLAYER_NAMES ? PHOTOS[m.id] : undefined);

export const PHOTO_CREDITS: { id: string; author: string; license: string; source: string }[] = [
  { id: 'curry', author: 'Clément Bardot', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Stephen_Curry,_Olympic_Games_2024_(cropped).jpg' },
  { id: 'irving', author: 'Erik Drost', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Kyrie_Irving_(51830909437)_(cropped).jpg' },
  { id: 'doncic', author: 'U.S. Embassy Ljubljana', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Luka_Don%C4%8Di%C4%87_and_Marines,_2026_(cropped).jpg' },
  { id: 'morant', author: 'All-Pro Reels', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Ja_Morant_2021.jpg' },
  { id: 'bryant', author: 'Keith Allison', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Kobe_Bryant_Dec_2014.jpg' },
  { id: 'booker', author: 'Clément Bardot', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Devin_Booker,_Olympic_Games_2024_(cropped).jpg' },
  { id: 'thompson', author: 'Keith Allison from Hanover, MD, USA', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Klay_Thompson_(cropped).jpg' },
  { id: 'edwards', author: 'Bryan Berlin', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Anthony_Edwards_Argentina_v_Egypt_7_July_2026-069_(cropped).jpg' },
  { id: 'james', author: 'Erik Drost', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:LeBron_James_(51959977144)_(cropped2).jpg' },
  { id: 'durant', author: 'Clément Bardot', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Kevin_Durant,_Paris_2024_(cropped).jpg' },
  { id: 'tatum', author: 'Hameltion', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Celtics_at_Wizards_2024-12-044_(cropped_2).jpg' },
  { id: 'leonard', author: 'U.S. Marine Corps photo by Lance Cpl. Mhecaela J. Watts', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Kawhi_Leonard_(7440607)_(cropped).jpg' },
  { id: 'antetokounmpo', author: 'Erik Drost', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Giannis_Antetokounmpo_(51915153421)_(cropped).jpg' },
  { id: 'nowitzki', author: 'Keith Allison from Baltimore, USA', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Dirk_Nowitzki_2_(cropped).jpg' },
  { id: 'duncan', author: 'Geoff Livingston', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Tim_Duncan_Walks_Verizon_Center%27s_Floor_(cropped)_(cropped).jpg' },
  { id: 'garnett', author: 'Keith Allison from Baltimore, USA', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Kevin_Garnett_2008-01-13.jpg' },
  { id: 'wembanyama', author: 'Frenchieinportland', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Victor_Wembanyama_San_Antonio_Spurs_2024.jpg' },
  { id: 'jokic', author: 'All-Pro Reels', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Nikola_Jokic_free_throw_(cropped).jpg' },
  { id: 'oneal', author: 'TechCrunch', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:TechCrunch_Disrupt_2023_-_Day_1_(cropped).jpg' },
  { id: 'embiid', author: 'All-Pro Reels', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Joel_Embiid_2019.jpg' },
  { id: 'clark', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Caitlin_Clark_Fever_2026_(cropped).jpg' },
  { id: 'ionescu', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sabrina_Ionescu_2025_(cropped).jpg' },
  { id: 'johannes', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:260711_Lynx_Liberty_JohnMc157_(55386997877)_(cropped).jpg' },
  { id: 'bird', author: 'Fuzheado', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:SXSW-2024-alih-OB7A0246-Sue_Bird.jpg' },
  { id: 'taurasi', author: 'John Mac', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Diana_Taurasi_2024_(cropped).jpg' },
  { id: 'ogunbowale', author: 'Lorie Shaull', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Arike_Ogunbowale_01_(cropped).jpg' },
  { id: 'plum', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Kelsey_Plum_2025_Sparks_(cropped).jpg' },
  { id: 'loyd', author: 'John Mac', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Jewell_Loyd_2024_(cropped).jpg' },
  { id: 'stewart', author: 'User:Zafer', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Breanna_Stewart_12_United_States_20260910_(1)_(cropped).JPG' },
  { id: 'moore', author: 'Lorie Shaull from St Paul, United States', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Maya_Moore_speaking_at_the_Marshall_Project_in_Washington_DC_(48751715837)_(cropped).jpg' },
  { id: 'collier', author: 'John McClellan', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Napheesa_Collier_vs_Indiana_Fever_(August_2,_2026)_B.jpg' },
  { id: 'gwilliams', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:260824_Lynx_Valkries_JohnMc300_(55486705669)_(cropped).jpg' },
  { id: 'parker', author: 'SusanLesch', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Parker5_20171004.jpg' },
  { id: 'thomas', author: 'Lorie Shaull', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:2_Alyssa_Thomas_(cropped).jpg' },
  { id: 'sabally', author: 'John Mac', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Satou_Sabally_2025a_(cropped).jpg' },
  { id: 'gruda', author: 'Jérémy Kergourlay', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:France_vs_Finlande_-_EuroBasket_Women_2019_qualification_2018_-_46.jpg' },
  { id: 'wilson', author: 'John Mac', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:A%27ja_Wilson_(53756794398)_(cropped).jpg' },
  { id: 'griner', author: 'John Mac', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:260706_Lynx_Sun_JohnMc164_(cropped).jpg' },
  { id: 'leslie', author: 'Angela George at https://www.flickr.com/photos/sharongraphics/', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:LisaLeslieDec10.jpg' },
  { id: 'fowles', author: 'Lorie Shaull from St Paul, United States', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Sylvia_Fowles_2022_(52283271158)_(cropped).jpg' },
];

export const modelName = (m: PlayerModel) => (USE_REAL_PLAYER_NAMES ? m.name : m.alias);
export const modelsFor = (position: string, gender: 'M' | 'F' = 'M') => MODELS.filter((m) => m.position === position && m.gender === gender);
export const findModel = (id?: string) => MODELS.find((m) => m.id === id);

/** Progression du programme en pourcentage. */
export const programPct = (m: PlayerModel, done: string[]) => Math.round((m.drills.filter((x) => done.includes(x.id)).length / m.drills.length) * 100);
