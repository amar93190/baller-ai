import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

/**
 * Rappel quotidien des missions (notification locale, sans serveur).
 * Réglé sur ce téléphone, dans Réglages.
 */
const KEY = 'baller-ai/reminder';
export const REMINDER_HOUR = 18;

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function reminderEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'on';
  } catch {
    return false;
  }
}

async function allowed(): Promise<boolean> {
  // Statuts iOS : 2 = autorisé, 3 = provisoire, 4 = éphémère (tous permettent d'afficher le rappel).
  const ok = (s?: number) => (s ?? 0) >= 2;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || ok(current.ios?.status)) return true;
  const asked = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: false, allowSound: true } });
  return asked.granted || ok(asked.ios?.status);
}

/** Active le rappel. Renvoie false si les notifications sont refusées. */
export async function enableReminder(name: string): Promise<boolean> {
  if (!(await allowed())) return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tes missions du jour t’attendent 🏀',
      body: `${name ? `${name}, 3` : '3'} missions et de l’XP à gagner. Garde ta série en vie !`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: REMINDER_HOUR, minute: 0 },
  });
  await AsyncStorage.setItem(KEY, 'on');
  return true;
}

export async function disableReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.setItem(KEY, 'off');
}
