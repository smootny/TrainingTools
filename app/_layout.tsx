import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { initI18n } from '@/config/i18n';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { setupNotificationListeners } from '@/utils/notifications';

export default function RootLayout() {
  useEffect(() => {
    const removeListener = setupNotificationListeners();
    return removeListener;
  }, []);
  
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });
  const [i18nLoaded, setI18nLoaded] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nLoaded(true));
  }, []);

  if (!fontsLoaded || !i18nLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
