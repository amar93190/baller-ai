import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { todayISO } from '@/lib/dates';
import { exampleData } from '@/lib/examples';
import { applyRewards } from '@/lib/missions';
import { pullState, pushState } from '@/lib/sync';
import { XP } from '@/lib/xp';

export { todayISO };

export type Persona = 'solo' | 'club';
export type Gender = 'M' | 'F';
/** Main forte : droitier, gaucher, ambidextre. Vide tant que ce n'est pas renseigné. */
export type Hand = '' | 'R' | 'L' | 'B';

export type Player = {
  name: string;
  /** Joueur (M) ou joueuse (F) : adapte les textes et les modèles proposés. */
  gender: Gender;
  num: number;
  color: string;
  persona: Persona;
  position: string;
  club: string;
  /** Joueur modèle choisi à l'inscription (voir lib/models). */
  model: string;
  /** Exercices du programme du modèle déjà faits. */
  programDone: string[];
  /** Fiche joueur. 0 ou vide = pas encore renseigné (les anciens comptes n'ont pas ces champs). */
  birthYear: number;
  /** Taille, envergure en cm ; poids en kg. */
  height: number;
  weight: number;
  wingspan: number;
  hand: Hand;
  /** Niveau de jeu (voir lib/profile). */
  level: string;
  shoeBrand: string;
  shoeModel: string;
  /** Pointure européenne. */
  shoeSize: number;
  /** Ce que le joueur veut travailler en priorité (3 au plus). */
  goals: string[];
  /** Séances visées par semaine. */
  weeklyTarget: number;
};

export type Match = {
  id: string;
  date: string; // AAAA-MM-JJ
  opp: string;
  us: number;
  them: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
};

export type ShotSession = {
  id: string;
  date: string;
  drill: string;
  made: number;
  att: number;
};

export type CheckIn = { date: string; mood: number };

export type XpEvent = {
  date: string;
  xp: number;
  reason: 'shots' | 'drill' | 'match' | 'coach' | 'mission' | 'bonus';
  /** Exercice du programme ou mission concernée. */
  ref?: string;
};

export type AppState = {
  onboarded: boolean;
  player: Player;
  matches: Match[];
  shots: ShotSession[];
  checkins: CheckIn[];
  xpLog: XpEvent[];
  /** Missions déjà récompensées, sous la forme « date:mission ». */
  claimed: string[];
  /** Date de dernière modification, pour savoir quelle copie garder entre le téléphone et le cloud. */
  updatedAt: string;
};

const LEGACY_KEY = 'baller-ai/state/v1';
const keyFor = (userId: string) => `baller-ai/state/${userId}`;

export const initialState: AppState = {
  onboarded: false,
  player: {
    name: '',
    gender: 'M',
    num: 7,
    color: '#E4501F',
    persona: 'solo',
    position: 'Ailier',
    club: '',
    model: '',
    programDone: [],
    birthYear: 0,
    height: 0,
    weight: 0,
    wingspan: 0,
    hand: '',
    level: '',
    shoeBrand: '',
    shoeModel: '',
    shoeSize: 0,
    goals: [],
    weeklyTarget: 0,
  },
  matches: [],
  shots: [],
  checkins: [],
  xpLog: [],
  claimed: [],
  updatedAt: '',
};

type Actions = {
  updatePlayer: (p: Partial<Player>) => void;
  chooseModel: (id: string) => void;
  toggleDrill: (id: string) => void;
  finishOnboarding: () => void;
  addMatch: (m: Omit<Match, 'id'>) => void;
  addShots: (s: Omit<ShotSession, 'id'>) => void;
  checkIn: (mood: number) => void;
  logCoach: () => void;
  loadExamples: () => void;
  deleteAll: () => void;
};

type Ctx = { state: AppState; ready: boolean } & Actions;

const PlayerContext = createContext<Ctx | null>(null);

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const xp = (reason: XpEvent['reason'], amount: number, ref?: string): XpEvent => ({ date: todayISO(), xp: amount, reason, ref });

// Les anciennes sauvegardes n'ont pas forcément tous les champs.
const withDefaults = (saved: Partial<AppState>): AppState => ({ ...initialState, ...saved, player: { ...initialState.player, ...saved.player } });

/** Données du joueur connecté : sur le téléphone, et dans le cloud quand Supabase est branché. */
export function PlayerProvider({ userId, defaultName, children }: { userId: string; defaultName: string; children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    (async () => {
      let local: AppState | null = null;
      try {
        let raw = await AsyncStorage.getItem(keyFor(userId));
        if (!raw) {
          // Reprise des données d'avant les comptes (une seule fois).
          raw = await AsyncStorage.getItem(LEGACY_KEY);
          if (raw) await AsyncStorage.removeItem(LEGACY_KEY);
        }
        if (raw) local = withDefaults(JSON.parse(raw));
      } catch {}
      const remote = await pullState<Partial<AppState>>(userId).catch(() => null);
      // On garde la copie la plus récente : celle du téléphone ou celle du cloud.
      const remoteNewer = remote && (!local || Date.parse(remote.updatedAt) > (Date.parse(local.updatedAt) || 0));
      const pick = remoteNewer && remote ? withDefaults(remote.data) : local;
      setState(pick ?? { ...initialState, player: { ...initialState.player, name: defaultName } });
      loaded.current = true;
      setReady(true);
    })();
    return () => clearTimeout(pushTimer.current);
  }, [userId, defaultName]);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(keyFor(userId), JSON.stringify(state)).catch(() => {});
    // Envoi au cloud regroupé : une fois que le joueur a fini d'agir.
    clearTimeout(pushTimer.current);
    if (state.updatedAt) pushTimer.current = setTimeout(() => pushState(userId, state, state.updatedAt).catch(() => {}), 1500);
  }, [state, userId]);

  const value = useMemo<Ctx>(() => {
    // Chaque action passe par ici : les missions terminées donnent leur XP automatiquement.
    const update = (fn: (s: AppState) => AppState) => setState((s) => ({ ...applyRewards(fn(s)), updatedAt: new Date().toISOString() }));
    return {
      state,
      ready,
      updatePlayer: (p) => update((s) => ({ ...s, player: { ...s.player, ...p } })),
      chooseModel: (id) => update((s) => (s.player.model === id ? s : { ...s, player: { ...s.player, model: id, programDone: [] } })),
      toggleDrill: (id) =>
        update((s) => {
          const done = s.player.programDone;
          if (done.includes(id)) return { ...s, player: { ...s.player, programDone: done.filter((x) => x !== id) } };
          // L'XP d'un exercice n'est donnée qu'une fois, même s'il est décoché puis recoché.
          const already = s.xpLog.some((e) => e.reason === 'drill' && e.ref === id);
          return {
            ...s,
            player: { ...s.player, programDone: [...done, id] },
            xpLog: already ? s.xpLog : [...s.xpLog, xp('drill', XP.drill, id)],
          };
        }),
      finishOnboarding: () => update((s) => ({ ...s, onboarded: true, player: { ...s.player, name: s.player.name.trim() || 'Joueur' } })),
      addMatch: (m) =>
        update((s) => ({
          ...s,
          matches: [...s.matches, { ...m, id: newId() }].sort((a, b) => a.date.localeCompare(b.date)),
          xpLog: [...s.xpLog, xp('match', XP.match)],
        })),
      addShots: (x) => update((s) => ({ ...s, shots: [...s.shots, { ...x, id: newId() }], xpLog: [...s.xpLog, xp('shots', XP.shots)] })),
      checkIn: (mood) =>
        update((s) => ({
          ...s,
          checkins: [...s.checkins.filter((c) => c.date !== todayISO()), { date: todayISO(), mood }],
        })),
      logCoach: () =>
        update((s) => (s.xpLog.some((e) => e.reason === 'coach' && e.date === todayISO()) ? s : { ...s, xpLog: [...s.xpLog, xp('coach', XP.coach)] })),
      loadExamples: () => update((s) => ({ ...s, ...exampleData() })),
      /** Efface les données de ce compte sur le téléphone (avant la suppression du compte). */
      deleteAll: () => {
        loaded.current = false;
        clearTimeout(pushTimer.current);
        AsyncStorage.removeItem(keyFor(userId)).catch(() => {});
      },
    };
  }, [state, ready, userId]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

/** Comme usePlayer, mais renvoie null hors connexion (aucun joueur chargé). */
export function usePlayerOptional() {
  return useContext(PlayerContext);
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer doit être utilisé dans <PlayerProvider>');
  return ctx;
}
