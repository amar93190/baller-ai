import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const KEY = 'baller-ai/sounds';

const SOURCES = {
  swish: require('../../assets/sounds/swish.wav'),
  tick: require('../../assets/sounds/tick.wav'),
  levelup: require('../../assets/sounds/levelup.wav'),
};

export type Sound = keyof typeof SOURCES;

let enabled = true;
let ready = false;
const players: Partial<Record<Sound, AudioPlayer>> = {};

/** À appeler une fois : charge le réglage et prépare l'audio sans couper la musique du joueur. */
export async function initSounds() {
  if (ready) return;
  ready = true;
  enabled = (await AsyncStorage.getItem(KEY).catch(() => null)) !== 'off';
  await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
}

export const soundsEnabled = () => enabled;

export async function setSoundsEnabled(on: boolean) {
  enabled = on;
  await AsyncStorage.setItem(KEY, on ? 'on' : 'off').catch(() => {});
}

/** Joue un son court. Respecte le mode silencieux du téléphone et le réglage de l'app. */
export function play(sound: Sound) {
  if (!enabled) return;
  try {
    const p = (players[sound] ??= createAudioPlayer(SOURCES[sound]));
    p.seekTo(0);
    p.play();
  } catch {
    // Pas de son : rien de grave.
  }
}
