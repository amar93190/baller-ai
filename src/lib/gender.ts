import type { Gender } from '@/store/player';

/** Choisit le mot selon le joueur (M) ou la joueuse (F). */
export const g = (gender: Gender | undefined, masculine: string, feminine: string) => (gender === 'F' ? feminine : masculine);

const FEMININE_POSITIONS: Record<string, string> = {
  Meneur: 'Meneuse',
  Arrière: 'Arrière',
  Ailier: 'Ailière',
  'Ailier fort': 'Ailière forte',
  Pivot: 'Pivot',
};

/** Le poste est stocké au masculin, et affiché accordé. */
export const positionLabel = (position: string, gender: Gender | undefined) => (gender === 'F' ? (FEMININE_POSITIONS[position] ?? position) : position);
