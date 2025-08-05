import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('soundEnabled').then((value) => {
      if (value !== null) setSoundEnabled(value === 'true');
    });
  }, []);

  const toggleSound = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    await AsyncStorage.setItem('soundEnabled', enabled.toString());
  };

  const playSound = async (file: any) => {
    if (!soundEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.log('Error playing sound:', err);
    }
  };

  const playButtonSound = () => playSound(require('@/assets/sounds/welcome.wav'));
  const playSwitchSound = () => playSound(require('@/assets/sounds/sound-off.wav'));
  const drinkAddSound = () => playSound(require('@/assets/sounds/drink.wav'));
  const resetAppSound = () => playSound(require('@/assets/sounds/reset-app.wav'));
  const eatAddSound = () => playSound(require('@/assets/sounds/eat.wav'));
  const confirmButtonSound = () => playSound(require('@/assets/sounds/confirm.wav'));
  const addNoteSound = () => playSound(require('@/assets/sounds/add-note.wav'));
  const removeNoteSound = () => playSound(require('@/assets/sounds/remove-note.wav'));
  const approveCheckSound = () => playSound(require('@/assets/sounds/approve.wav'));
  const photoConfirmSound = () => playSound(require('@/assets/sounds/photo.wav'));
  const modeSwitchSound = () => playSound(require('@/assets/sounds/mode.wav'));

  return {
    photoConfirmSound,
    modeSwitchSound,
    playButtonSound,
    playSwitchSound,
    approveCheckSound,
    confirmButtonSound,
    drinkAddSound,
    eatAddSound,
    addNoteSound,
    removeNoteSound,
    resetAppSound,
    toggleSound,
    soundEnabled,
  };
};
