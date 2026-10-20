import { todayISO } from '@/lib/dates';
import type { AppState, Match } from '@/store/player';

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAYS = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
const DAYS_LONG = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const fmtDate = (iso: string) => {
  const d = parse(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
export const fmtShort = (iso: string) => {
  const d = parse(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};
export const fmtToday = () => {
  const d = new Date();
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);

export const pct = (made: number, att: number) => (att > 0 ? Math.round((made / att) * 100) : 0);

/** Réussite au tir sur les 7 derniers jours, ou null sans séance. */
export function weekShotPct(s: AppState) {
  const recent = s.shots.filter((x) => daysBetween(x.date, todayISO()) < 7);
  const att = recent.reduce((n, x) => n + x.att, 0);
  return att ? pct(recent.reduce((n, x) => n + x.made, 0), att) : null;
}

export function drillPct(s: AppState, drill: string) {
  const list = s.shots.filter((x) => x.drill === drill).slice(-5);
  const att = list.reduce((n, x) => n + x.att, 0);
  return att ? pct(list.reduce((n, x) => n + x.made, 0), att) : null;
}

/** Nombre de jours consécutifs (jusqu'à aujourd'hui ou hier) avec une séance ou un match. */
export function streak(s: AppState) {
  const days = new Set([...s.shots.map((x) => x.date), ...s.matches.map((m) => m.date)]);
  let n = 0;
  const d = new Date();
  if (!days.has(todayISO())) d.setDate(d.getDate() - 1);
  for (;;) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!days.has(iso)) return n;
    n++;
    d.setDate(d.getDate() - 1);
  }
}

export function sessionsThisWeek(s: AppState) {
  return new Set(s.shots.filter((x) => daysBetween(x.date, todayISO()) < 7).map((x) => x.date)).size;
}

const avg = (ms: Match[], k: keyof Pick<Match, 'pts' | 'reb' | 'ast' | 'stl'>) =>
  ms.length ? ms.reduce((n, m) => n + m[k], 0) / ms.length : 0;

export function seasonAverages(s: AppState) {
  const ms = s.matches;
  return { pts: avg(ms, 'pts'), reb: avg(ms, 'reb'), ast: avg(ms, 'ast'), stl: avg(ms, 'stl'), wins: ms.filter((m) => m.us > m.them).length, n: ms.length };
}

const clamp = (v: number) => Math.max(40, Math.min(99, Math.round(v)));

/**
 * Attributs de la carte joueur, calculés à partir des vraies données.
 * Sans données, chaque attribut part de 60.
 */
export function attributes(s: AppState) {
  const recentShots = s.shots.slice(-10);
  const att = recentShots.reduce((n, x) => n + x.att, 0);
  const shot = att ? recentShots.reduce((n, x) => n + x.made, 0) / att : null;
  const ms = s.matches.slice(-8);
  const moods = s.checkins.slice(-10);
  const mood = moods.length ? moods.reduce((n, c) => n + c.mood, 0) / moods.length : null;
  return [
    { key: 'tir', label: 'Tir', value: shot === null ? 60 : clamp(45 + shot * 50) },
    { key: 'passe', label: 'Passe', value: ms.length ? clamp(55 + avg(ms, 'ast') * 6) : 60 },
    { key: 'rebond', label: 'Rebond', value: ms.length ? clamp(50 + avg(ms, 'reb') * 5) : 60 },
    { key: 'defense', label: 'Défense', value: ms.length ? clamp(55 + avg(ms, 'stl') * 9) : 60 },
    { key: 'mental', label: 'Mental', value: mood === null ? 60 : clamp(45 + mood * 8) },
  ];
}

export const overall = (s: AppState) => {
  const a = attributes(s);
  return Math.round(a.reduce((n, x) => n + x.value, 0) / a.length);
};

export const positions = [
  { label: 'Meneur', code: 'MEN' },
  { label: 'Arrière', code: 'ARR' },
  { label: 'Ailier', code: 'AIL' },
  { label: 'Ailier fort', code: 'AF' },
  { label: 'Pivot', code: 'PIV' },
];
