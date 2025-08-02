import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSound } from '@/hooks/useSound';

type BackButtonProps = {
  to?: Parameters<ReturnType<typeof useRouter>['push']>[0];
};

const BackButton: React.FC<BackButtonProps> = ({ to = '/screens/MenuScreen' }) => {
  const router = useRouter();
  const { backButtonSound } = useSound();

  const handlePress = async () => {
    backButtonSound();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(to);
  };

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <Image
        source={require('../assets/images/right-arrow.png')}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
    shadowColor: "#00000",
    shadowOffset: {
	  width: 0,
	  height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  backIcon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '180deg' }],
  },
});
