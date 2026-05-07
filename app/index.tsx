import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasName, setHasName] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('userName');
        setHasName(!!(saved && saved.trim()));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || hasName === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return hasName ? (
    <Redirect href="/screens/MenuScreen" />
  ) : (
    <Redirect href="/screens/WelcomeScreen" />
  );
}
