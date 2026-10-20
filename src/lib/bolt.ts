import type { Mood } from '@/components/Bolt';
import { missionsFor } from '@/lib/missions';
import { streak } from '@/lib/stats';
import { XP } from '@/lib/xp';
import type { AppState } from '@/store/player';

/** Ce que Bolt dit sur l'accueil : court, comme un coéquipier, selon les missions et la série. */
export function boltHome(s: AppState): { text: string; mood: Mood } {
  const missions = missionsFor(s);
  const done = missions.filter((m) => m.done).length;
  const next = missions.find((m) => !m.done);
  const days = streak(s);
  if (!next) return { text: 'Tout est fait. Repos, et reviens demain pour garder la série.', mood: 'hype' };
  if (done > 0) return { text: `${done} sur ${missions.length}. Encore ${missions.length - done} et tu prends +${XP.allMissionsBonus} XP de bonus.`, mood: 'focus' };
  if (days > 1) return { text: `${days} jours de série. On la garde ? Commence par : ${next.title.toLowerCase()}.`, mood: 'chill' };
  if (!s.shots.length && !s.matches.length) return { text: `Yo ! Moi c'est Bolt. Première mission : ${next.title.toLowerCase()}. Je compte avec toi.`, mood: 'hype' };
  return { text: `Yo. ${missions.length} missions t'attendent. On commence par ${next.title.toLowerCase()} ?`, mood: 'chill' };
}

/** Ce que Bolt dit pendant une série de tirs, selon le dernier tir. */
export function boltLive(made: number, tries: number, target: number, combo: number, last: 'hit' | 'miss' | null): { text: string; mood: Mood } {
  const left = target - tries;
  if (tries >= target) return { text: `C'est fini ! ${made} sur ${target}. Va voir ta carte.`, mood: 'hype' };
  if (last === 'hit' && combo >= 3) return { text: `${combo} de suite. T'es en feu, garde le rythme.`, mood: 'hype' };
  if (last === 'hit') return { text: `Dedans. Encore ${left}.`, mood: 'focus' };
  if (last === 'miss') return { text: 'Pas grave. Jambes, puis poignet. Le suivant rentre.', mood: 'focus' };
  return { text: `${target} tirs. Respire, routine, et c'est parti.`, mood: 'chill' };
}

/** Le cri de victoire selon la réussite. */
export function shout(pct: number) {
  if (pct >= 80) return 'SWISH';
  if (pct >= 60) return 'CLUTCH';
  if (pct >= 40) return 'BIEN JOUÉ';
  return 'ON CONTINUE';
}
