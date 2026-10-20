import { todayISO } from '@/lib/dates';
import type { AppState } from '@/store/player';

/** XP gagnée pour chaque action. */
export const XP = {
  shots: 10,
  drill: 40,
  match: 30,
  coach: 5,
  allMissionsBonus: 50,
};

export const LEVELS = [
  { name: 'Rookie', min: 0 },
  { name: 'Titulaire', min: 300 },
  { name: 'All-Star', min: 900 },
  { name: 'MVP', min: 2000 },
  { name: 'Légende', min: 4000 },
];

export const totalXp = (s: AppState) => s.xpLog.reduce((n, e) => n + e.xp, 0);
export const todayXp = (s: AppState) => s.xpLog.filter((e) => e.date === todayISO()).reduce((n, e) => n + e.xp, 0);

export function levelInfo(xp: number) {
  let i = LEVELS.length - 1;
  while (i > 0 && xp < LEVELS[i].min) i--;
  const level = LEVELS[i];
  const next = LEVELS[i + 1];
  return {
    name: level.name,
    index: i,
    next: next?.name,
    toNext: next ? next.min - xp : 0,
    pct: next ? Math.round(((xp - level.min) / (next.min - level.min)) * 100) : 100,
  };
}
