import type { IconName } from '@/components/Icon';
import type { Gender, Hand, Player } from '@/store/player';

/** Le parcours d'inscription, dans l'ordre. Sert au « Étape 3 sur 7 » et au bouton Continuer. */
export const ONBOARDING = ['/onboarding/profile', '/onboarding/body', '/onboarding/game', '/onboarding/shoes', '/onboarding/goals', '/onboarding/model', '/onboarding/jersey'] as const;
export type OnboardingRoute = (typeof ONBOARDING)[number];

export const stepOf = (route: OnboardingRoute) => ONBOARDING.indexOf(route) + 1;
export const nextStep = (route: OnboardingRoute) => ONBOARDING[ONBOARDING.indexOf(route) + 1];

/** Hauteur du cercle, en cm. */
export const RIM = 305;

/** Valeurs proposées tant que le joueur n'a rien renseigné. */
export const defaults = (gender: Gender) => ({
  birthYear: new Date().getFullYear() - 16,
  height: gender === 'F' ? 168 : 180,
  weight: gender === 'F' ? 60 : 72,
  shoeSize: gender === 'F' ? 39 : 43,
  weeklyTarget: 3,
});

export const age = (birthYear: number) => (birthYear ? new Date().getFullYear() - birthYear : 0);

/** Catégorie d'âge façon FFBB (approximative : la saison commence en septembre). */
export function category(birthYear: number) {
  const a = age(birthYear);
  if (!a) return '';
  if (a <= 10) return 'U11';
  if (a <= 12) return 'U13';
  if (a <= 14) return 'U15';
  if (a <= 17) return 'U18';
  if (a <= 20) return 'U21';
  return 'Senior';
}

/**
 * Hauteur atteinte bras levé, debout, sans sauter.
 * Avec l'envergure : environ 0,65 × taille + 0,68 × envergure. Sans : 1,33 × taille.
 */
export const standingReach = (height: number, wingspan: number) => Math.round(wingspan ? height * 0.65 + wingspan * 0.68 : height * 1.33);

/** 1,85 m */
export const meters = (cm: number) => `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, '0')} m`;

/** Indice d'envergure : envergure − taille. Positif = bras longs, un atout en défense et au rebond. */
export const apeIndex = (height: number, wingspan: number) => (height && wingspan ? wingspan - height : 0);

export const HANDS: { value: Exclude<Hand, ''>; label: (g: Gender) => string; detail: string }[] = [
  { value: 'R', label: (g) => (g === 'F' ? 'Droitière' : 'Droitier'), detail: 'Je tire main droite' },
  { value: 'L', label: (g) => (g === 'F' ? 'Gauchère' : 'Gaucher'), detail: 'Je tire main gauche' },
  { value: 'B', label: () => 'Ambidextre', detail: 'Les deux mains' },
];

export const handLabel = (hand: Hand, g: Gender) => HANDS.find((h) => h.value === hand)?.label(g) ?? '';

export const LEVELS = [
  { value: 'loisir', label: 'Loisir', detail: 'Playground, entre potes' },
  { value: 'departemental', label: 'Départemental', detail: 'Championnat du département' },
  { value: 'regional', label: 'Régional', detail: 'Ligue, pré-nationale' },
  { value: 'national', label: 'National', detail: 'NM / NF, centre de formation' },
];

export const levelLabel = (v: string) => LEVELS.find((l) => l.value === v)?.label ?? '';

/** Numéro du poste (1 à 5) et place sur le demi-terrain dessiné dans CourtPositions. */
export const POSITION_SPOTS: Record<string, { n: number; x: number; y: number }> = {
  Meneur: { n: 1, x: 160, y: 196 },
  Arrière: { n: 2, x: 262, y: 150 },
  Ailier: { n: 3, x: 58, y: 150 },
  'Ailier fort': { n: 4, x: 222, y: 70 },
  Pivot: { n: 5, x: 112, y: 52 },
};

/** Marques et gammes de chaussures de basket courantes. Le modèle reste libre. */
export const SHOES: { brand: string; lines: string[] }[] = [
  { brand: 'Nike', lines: ['LeBron', 'KD', 'Ja', 'Sabrina', 'Book', 'G.T. Cut', 'Giannis'] },
  { brand: 'Jordan', lines: ['Luka', 'Tatum', 'Zion', 'Air Jordan'] },
  { brand: 'Adidas', lines: ['AE', 'Harden', 'Dame', 'Trae'] },
  { brand: 'Puma', lines: ['MB', 'Scoot', 'All-Pro Nitro'] },
  { brand: 'Under Armour', lines: ['Curry'] },
  { brand: 'New Balance', lines: ['Kawhi', 'TWO WXY'] },
  { brand: 'Anta', lines: ['KAI', 'Klay'] },
  { brand: 'Li-Ning', lines: ['Way of Wade'] },
  { brand: 'Autre', lines: [] },
];

export const shoeLabel = (p: Pick<Player, 'shoeBrand' | 'shoeModel'>) => [p.shoeBrand === 'Autre' ? '' : p.shoeBrand, p.shoeModel].filter(Boolean).join(' ');

export const GOALS: { value: string; label: string; icon: IconName }[] = [
  { value: 'tir', label: 'Tir', icon: 'shot' },
  { value: 'dribble', label: 'Dribble', icon: 'dribble' },
  { value: 'defense', label: 'Défense', icon: 'defense' },
  { value: 'physique', label: 'Physique', icon: 'xp' },
  { value: 'detente', label: 'Détente', icon: 'hoop' },
  { value: 'mental', label: 'Mental', icon: 'coach' },
];

export const MAX_GOALS = 3;

/** La fiche est-elle complète ? Sert à proposer de la compléter aux anciens comptes. */
export const profileComplete = (p: Player) => !!(p.birthYear && p.height && p.weight && p.hand && p.level && p.shoeBrand && p.goals.length);
