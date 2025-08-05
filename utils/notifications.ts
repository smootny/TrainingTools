import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Brak uprawnień do wysyłania powiadomień!');
    return false;
  }
  return true;
}

export async function scheduleDailyNotification(hour: number, minute: number) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Halo!👀 Tutaj Twój motywator!',
      body: 'Woda wypita? Kalorie nabite? To teraz czas na trening! 💪',
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function setupNotificationListeners() {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Kliknięto powiadomienie:', response);
  });

  return () => subscription.remove();
}
