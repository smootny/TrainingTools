import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Text,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';


export default function MenuScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const { isIPad, spacingMultiplier } = useDeviceInfo();

  const menuItems = [
    { label: t('training'), image: require('../../assets/images/exercise.png'), route: 'screens/ProgressBarScreen' },
    { label: t('stopwatch'), image: require('../../assets/images/stopwatch.png'), route: 'screens/StopWatchScreen' },
    { label: t('notebook'), image: require('../../assets/images/notebook.png'), route: 'screens/NotesListScreen' },
    { label: t('calorie_calculator'), image: require('../../assets/images/calories-calculator.png'), route: 'screens/CaloriesCalculatorScreen' },
    { label: t('water_intake'), image: require('../../assets/images/water-bottle.png'), route: 'screens/WaterIntakeScreen' },
    { label: t('photo_comparison'), image: require('../../assets/images/gallery.png'), route: 'screens/ImageComparisonScreen' },
    { label: t('my_records'), image: require('../../assets/images/trophy.png'), route: 'screens/PBScreen' },
    { label: t('settings'), image: require('../../assets/images/settings.png'), route: 'screens/SettingsScreen' },
  ];

  const dynamicStyles = getMenuStyles(isIPad, spacingMultiplier);

  const renderButton = ({ label, image, route }: any) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
      router.push(route);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPressIn(); 
    };
  
  

    return (
      <Animated.View key={label} style={[dynamicStyles.buttonWrapper, { transform: [{ scale }] }]}>
        <Pressable
          onPressIn={handlePress}
          onPressOut={onPressOut}
          style={[dynamicStyles.tile, {borderColor: theme.tile.borderColor}]}
        >
          <Image source={image} style={dynamicStyles.icon} resizeMode="contain" />
          <Text style={dynamicStyles.label}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
        <LinearGradient 
        colors={[theme.background, theme.secondary]} 
        start={{ x: 0.5, y: 1 }} 
        end={{ x: 0.5, y: 0 }} 
        style={styles.gradient}
        >
      <View style={dynamicStyles.container}>
        {menuItems.map(renderButton)}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

// Dynamic styles based on device
const getMenuStyles = (isIPad: boolean, spacingMultiplier: number) => StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: isIPad ? 100 * spacingMultiplier : 100,
    padding: isIPad ? 20 * spacingMultiplier : 20,
    gap: isIPad ? 12 * spacingMultiplier : 12,
    ...(isIPad && { maxWidth: 600, alignSelf: 'center' }),
  },
  buttonWrapper: {
    margin: isIPad ? 10 * spacingMultiplier : 10,
  },
  tile: {
    width: isIPad ? 160 : 130,
    height: isIPad ? 160 : 130,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: "#00000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  icon: {
    width: isIPad ? 75 : 60,
    height: isIPad ? 75 : 60,
    marginBottom: isIPad ? 8 * spacingMultiplier : 8,
  },
  label: {
    fontSize: isIPad ? 16 : 14,
    fontFamily: 'Roboto-Light',
    color: 'black',
  },
});
