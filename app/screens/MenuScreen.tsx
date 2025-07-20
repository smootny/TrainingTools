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

const menuItems = [
  { label: 'Training', image: require('../../assets/images/exercise.png'), route: 'screens/ProgressBarScreen' },
  { label: 'Stopwatch', image: require('../../assets/images/stopwatch.png'), route: 'screens/StopWatchScreen' },
  { label: 'Notebook', image: require('../../assets/images/notebook.png'), route: 'screens/NotesListScreen' },
  { label: 'Calorie Calculator', image: require('../../assets/images/calories-calculator.png'), route: 'screens/CaloriesCalculatorScreen' },
  { label: 'Water Intake', image: require('../../assets/images/water-bottle.png'), route: 'screens/WaterIntakeScreen' },
  { label: 'Photo Comparison', image: require('../../assets/images/gallery.png'), route: 'screens/ImageComparisonScreen' },
  { label: 'My Records', image: require('../../assets/images/trophy.png'), route: 'screens/PBScreen' },
  { label: 'Settings', image: require('../../assets/images/settings.png'), route: 'screens/SettingsScreen' },
];

export default function MenuScreen() {
  const router = useRouter();

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

    return (
      <Animated.View key={label} style={[styles.buttonWrapper, { transform: [{ scale }] }]}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.button}
        >
          <Image source={image} style={styles.icon} resizeMode="contain" />
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#35e74d", "black"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {menuItems.map(renderButton)}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 20,
    gap: 12,
  },
  buttonWrapper: {
    margin: 10,
  },
  button: {
    width: 130,
    height: 130,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderColor: '#19361e',
    borderWidth: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: 'black',
  },
});
