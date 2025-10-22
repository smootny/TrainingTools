import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playerWelcome = useAudioPlayer(require('@/assets/sounds/welcome.wav'));
  const playerSwitch = useAudioPlayer(require('@/assets/sounds/sound-off.wav'));
  const playerDrink = useAudioPlayer(require('@/assets/sounds/drink.wav'));
  const playerReset = useAudioPlayer(require('@/assets/sounds/reset-app.wav'));
  const playerEat = useAudioPlayer(require('@/assets/sounds/eat.wav'));
  const playerConfirm = useAudioPlayer(require('@/assets/sounds/confirm.wav'));
  const playerAddNote = useAudioPlayer(require('@/assets/sounds/add-note.wav'));
  const playerRemoveNote = useAudioPlayer(require('@/assets/sounds/remove-note.wav'));
  const playerApprove = useAudioPlayer(require('@/assets/sounds/approve.wav'));
  const playerPhoto = useAudioPlayer(require('@/assets/sounds/photo.wav'));
  const playerMode = useAudioPlayer(require('@/assets/sounds/mode.wav'));

  useEffect(() => {
    AsyncStorage.getItem('soundEnabled').then((v) => {
      if (v !== null) setSoundEnabled(v === 'true');
    });

    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
      } catch {
      }
    })();
  }, []);

  const toggleSound = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    await AsyncStorage.setItem('soundEnabled', enabled.toString());
  };

  const play = (player: { play: () => void; seekTo: (sec: number) => void }) => {
    if (!soundEnabled) return;
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.log('Error playing sound:', e);
    }
  };

  const playButtonSound = () => play(playerWelcome);
  const playSwitchSound = () => play(playerSwitch);
  const drinkAddSound = () => play(playerDrink);
  const resetAppSound = () => play(playerReset);
  const eatAddSound = () => play(playerEat);
  const confirmButtonSound = () => play(playerConfirm);
  const addNoteSound = () => play(playerAddNote);
  const removeNoteSound = () => play(playerRemoveNote);
  const approveCheckSound = () => play(playerApprove);
  const photoConfirmSound = () => play(playerPhoto);
  const modeSwitchSound = () => play(playerMode);

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
