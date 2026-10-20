import { dayNumber, todayISO } from '@/lib/dates';
import { findModel, modelName } from '@/lib/models';
import { XP } from '@/lib/xp';
import type { AppState } from '@/store/player';

export type Mission = {
  id: string;
  title: string;
  detail: string;
  xp: number;
  progress: number;
  target: number;
  done: boolean;
  /** Où aller pour faire la mission. */
  action: 'shots' | 'program' | 'coach' | 'model';
  drill?: string;
};

export const DRILLS = ['Lancer franc', 'Tir à 3 pts', 'Mi-distance', 'Layup'];

/** 3 missions par jour : un exercice de tir qui change chaque jour, le programme pro, et le mental. */
export function missionsFor(s: AppState, date = todayISO()): Mission[] {
  const day = dayNumber(date);
  const drill = DRILLS[day % DRILLS.length];
  const target = drill === 'Lancer franc' ? 30 : 25;
  const attempts = s.shots.filter((x) => x.date === date && x.drill === drill).reduce((n, x) => n + x.att, 0);

  const model = findModel(s.player.model);
  const drillsToday = s.xpLog.filter((e) => e.date === date && e.reason === 'drill').length;
  const coachToday = s.xpLog.some((e) => e.date === date && e.reason === 'coach');

  const list: Mission[] = [
    {
      id: `shots-${drill}`,
      title: `${target} tirs : ${drill.toLowerCase()}`,
      detail: 'Lance ta série dans l’onglet Séance',
      xp: 30,
      progress: Math.min(attempts, target),
      target,
      done: attempts >= target,
      action: 'shots',
      drill,
    },
    model
      ? {
          id: 'program',
          title: `1 exercice du programme ${modelName(model)}`,
          detail: 'Valide-le dans Mon programme pro',
          xp: 20,
          progress: Math.min(drillsToday, 1),
          target: 1,
          done: drillsToday >= 1,
          action: 'program',
        }
      : {
          id: 'model',
          title: s.player.gender === 'F' ? 'Choisis ta joueuse modèle' : 'Choisis ton joueur modèle',
          detail: 'Et reçois ton programme pro',
          xp: 20,
          progress: s.player.model ? 1 : 0,
          target: 1,
          done: !!s.player.model,
          action: 'model',
        },
    {
      id: 'coach',
      title: 'Parle à ton coach mental',
      detail: 'Un message suffit',
      xp: 20,
      progress: coachToday ? 1 : 0,
      target: 1,
      done: coachToday,
      action: 'coach',
    },
  ];
  return list;
}

/**
 * Donne l'XP des missions terminées aujourd'hui, une seule fois chacune, plus le bonus
 * quand les 3 sont faites. Appelé après chaque action du joueur.
 */
export function applyRewards(s: AppState): AppState {
  const date = todayISO();
  const missions = missionsFor(s, date);
  const add: AppState['xpLog'] = [];
  const claimed = [...s.claimed];
  for (const m of missions) {
    const key = `${date}:${m.id}`;
    if (m.done && !claimed.includes(key)) {
      claimed.push(key);
      add.push({ date, xp: m.xp, reason: 'mission', ref: m.id });
    }
  }
  const bonusKey = `${date}:bonus`;
  if (missions.every((m) => m.done) && !claimed.includes(bonusKey)) {
    claimed.push(bonusKey);
    add.push({ date, xp: XP.allMissionsBonus, reason: 'bonus' });
  }
  return add.length ? { ...s, claimed, xpLog: [...s.xpLog, ...add] } : s;
}
