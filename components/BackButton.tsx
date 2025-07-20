import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type BackButtonProps = {
    to?: Parameters<ReturnType<typeof useRouter>['push']>[0];
};

const BackButton: React.FC<BackButtonProps> = ({ to = '/screens/MenuScreen' }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.push(to)}>
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
  },
  backIcon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '180deg' }],
  },
});
