/** Direction « salle de nuit » : fond noir, surfaces anthracite, accents orange. */
export const colors = {
  orange: '#E4501F',
  bg: '#0B0B0C',
  surface: '#17181A',
  surface2: '#232427',
  text: '#F4F1EC',
  muted: '#9A968F',
  line: '#2A2B2F',
  parquet: '#D08A5E',
  white: '#FFFFFF',
  black: '#000000',
  good: '#4CC38A',
  goodSoft: 'rgba(76,195,138,0.16)',
  danger: '#FF6B5B',
  dangerSoft: 'rgba(255,107,91,0.16)',
};

/** Anton a besoin d'environ 1,45 fois sa taille en hauteur de ligne, sinon iOS coupe le haut des lettres. */
export const displayLineHeight = (size: number) => Math.round(size * 1.45);

export const fonts = {
  display: 'Anton_400Regular',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

/** Espacements : on n'utilise que ces valeurs (identité « Raquette »). */
export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 32, xxl: 48 };

/** Arrondis : puce, tuile, bloc. La forme Raquette est dans components/Raquette. */
export const radius = { chip: 10, tile: 16, block: 22 };

/** 6 tailles de texte. Les chiffres sont toujours en Anton. */
export const type = { score: 64, title: 36, block: 22, eyebrow: 12, body: 15, detail: 13 };

/** Les 5 paliers de carte, dans l'ordre des niveaux d'XP (lib/xp). */
export const tiers = [
  { key: 'rookie', label: 'ROOKIE', bg: ['#A8673F', '#6B3E26', '#2A1810'], sheen: 'rgba(255,214,180,0.22)', ink: '#FCE9DA', jersey: '#2A1810', jerseyInk: '#E8A57A' },
  { key: 'titulaire', label: 'TITULAIRE', bg: ['#D9DDE2', '#8A8F96', '#2B2E33'], sheen: 'rgba(255,255,255,0.4)', ink: '#101113', jersey: '#2B2E33', jerseyInk: '#E6E9EE' },
  { key: 'allstar', label: 'ALL-STAR', bg: ['#F6D57A', '#C9962B', '#3A2A0C'], sheen: 'rgba(255,246,214,0.45)', ink: '#1E1505', jersey: '#1E1505', jerseyInk: '#F6D57A' },
  { key: 'mvp', label: 'MVP', bg: ['#FF8A5E', '#E4501F', '#3A0F04'], sheen: 'rgba(255,226,200,0.35)', ink: '#FFF4EC', jersey: '#140604', jerseyInk: '#FF8A5E' },
  { key: 'legende', label: 'LÉGENDE', bg: ['#1D1E22', '#0B0B0C', '#000000'], sheen: 'rgba(228,80,31,0.4)', ink: '#F4F1EC', jersey: '#E4501F', jerseyInk: '#0B0B0C' },
] as const;

export type Tier = (typeof tiers)[number];

/** Couleurs d'équipe proposées à l'inscription. */
export const teamColors = [
  { label: 'Orange Baller', value: '#E4501F' },
  { label: 'Rouge', value: '#D7263D' },
  { label: 'Bleu', value: '#2457C5' },
  { label: 'Vert', value: '#1F8A5B' },
  { label: 'Violet', value: '#6B3FC4' },
];

/** Mélange deux couleurs hex : t = 0 donne a, t = 1 donne b. */
export function mix(a: string, b: string, t: number) {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = parse(a);
  const B = parse(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/** soft : fond teinté de l'accent. deep : texte lisible posé sur ce fond. */
export function accentShades(color: string) {
  return { accent: color, deep: mix(color, '#FFFFFF', 0.3), soft: mix(color, colors.bg, 0.8) };
}
