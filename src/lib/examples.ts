import { isoDaysAgo } from '@/lib/dates';
import { XP } from '@/lib/xp';
import type { CheckIn, Match, ShotSession, XpEvent } from '@/store/player';

/** Données d'exemple pour présenter l'app (bouton dans le profil). */
export function exampleData(): { matches: Match[]; shots: ShotSession[]; checkins: CheckIn[]; xpLog: XpEvent[] } {
  const rows: [string, number, number, number, number, number, number][] = [
    ['Vénissieux', 58, 61, 9, 4, 2, 1],
    ['Caluire', 70, 52, 12, 5, 3, 2],
    ['Oullins', 49, 55, 8, 3, 5, 0],
    ['Écully', 66, 60, 14, 6, 2, 1],
    ['Décines', 61, 63, 11, 7, 4, 1],
    ['Meyzieu', 72, 59, 16, 5, 3, 3],
    ['Rillieux', 57, 54, 13, 4, 6, 2],
    ['Villeurbanne', 64, 58, 18, 6, 4, 2],
  ];
  const matches = rows.map(([opp, us, them, pts, reb, ast, stl], i) => ({
    id: `ex-m${i}`,
    date: isoDaysAgo((rows.length - 1 - i) * 7 + 2),
    opp,
    us,
    them,
    pts,
    reb,
    ast,
    stl,
  }));
  const shotRows: [number, string, number, number][] = [
    [12, 'Tir à 3 pts', 14, 25],
    [9, 'Lancer franc', 19, 30],
    [6, 'Layup', 13, 20],
    [4, 'Tir à 3 pts', 15, 25],
    [3, 'Lancer franc', 24, 30],
    [1, 'Mi-distance', 17, 25],
    [0, 'Tir à 3 pts', 18, 25],
  ];
  const shots = shotRows.map(([d, drill, made, att], i) => ({ id: `ex-s${i}`, date: isoDaysAgo(d), drill, made, att }));
  const checkins = [4, 3, 3, 4, 2, 3].map((mood, i) => ({ date: isoDaysAgo(i * 2 + 1), mood }));
  // XP cohérente avec l'historique : séries, matchs et missions des jours passés (rien pour aujourd'hui).
  const xpLog: XpEvent[] = [
    ...shots.filter((x) => x.date !== isoDaysAgo(0)).map((x) => ({ date: x.date, xp: XP.shots, reason: 'shots' as const })),
    ...matches.map((m) => ({ date: m.date, xp: XP.match, reason: 'match' as const })),
    ...Array.from({ length: 10 }, (_, i) => ({ date: isoDaysAgo(i + 1), xp: 70, reason: 'mission' as const })),
  ];
  return { matches, shots: shots.filter((x) => x.date !== isoDaysAgo(0)), checkins, xpLog };
}
