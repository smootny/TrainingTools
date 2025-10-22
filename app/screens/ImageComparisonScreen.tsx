import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/components/BackButton';
import CustomLabel from '@/components/CustomLabel';
import SmallButton from '@/components/SmallButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

const { width: screenWidth } = Dimensions.get('window');
const COMPARISON_HEIGHT = 400;

export default function ImageComparisonScreen() {
  const { photoConfirmSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(50);
  const pan = useRef(new Animated.Value(50)).current;


  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const containerWidth = screenWidth - 40;
      const relativeX = gestureState.moveX - 20;
      const newValue = Math.min(100, Math.max(0, (relativeX / containerWidth) * 100));
      setSliderValue(newValue);
      pan.setValue(newValue);
    },
  });

  useEffect(() => {
    pan.addListener(({ value }) => {
      setSliderValue(value);
    });

    return () => pan.removeAllListeners();
  }, [pan]);

  useEffect(() => {
    const loadImages = async () => {
      const before = await AsyncStorage.getItem('beforeImage');
      const after = await AsyncStorage.getItem('afterImage');
      if (before) setBeforeImage(before);
      if (after) setAfterImage(after);
    };
    loadImages();
  }, []);

  const pickImage = async (setImage: (uri: string) => void, key: string) => {
    photoConfirmSound();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem(key, uri);
    }
  };

  return (
    <LinearGradient 
      colors={[theme.background, theme.secondary]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <BackButton />
      
      <View style={styles.centeredWrapper}>
        <CustomLabel>{t('progress')}</CustomLabel>
        
        <View style={styles.comparisonWrapper} {...panResponder.panHandlers}>
          {afterImage && (
            <Image 
              source={{ uri: afterImage }} 
              style={styles.imageBase} 
              resizeMode="cover"
            />
          )}
          
          {beforeImage && (
            <Animated.View 
              style={[
                styles.imageOverlayContainer, 
                { 
                  width: pan.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            >
              <Image 
                source={{ uri: beforeImage }} 
                style={styles.imageOverlay}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {beforeImage && afterImage && (
            <Animated.View 
              style={[
                styles.dragLine, 
                { 
                  left: pan.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            >
              <View style={styles.dragLineTop} />
              <View style={styles.dragHandle}>
              </View>
              <View style={styles.dragLineBottom} />
            </Animated.View>
          )}
          
          {beforeImage && afterImage && (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={sliderValue}
              onValueChange={(value: number) => {
                setSliderValue(value);
                pan.setValue(value);
              }}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <SmallButton
            title={t('before_button')}
            onPress={() => pickImage(setBeforeImage, 'beforeImage')}
            variant="yellow"
          />
          <SmallButton
            title={t('after_button')}
            onPress={() => pickImage(setAfterImage, 'afterImage')}
            variant="yellow"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  comparisonWrapper: {
    width: screenWidth - 40,
    height: COMPARISON_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  imageBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imageOverlayContainer: {
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  },
  imageOverlay: {
    width: screenWidth - 40,
    height: '100%',
  },
  slider: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    top: 180
  },
  dragLine: {
    position: 'absolute',
    width: 3,
    height: '100%',
    backgroundColor: 'skyblue',
    zIndex: 2,
  },
  dragLineTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: COMPARISON_HEIGHT / 2 - 25,
    backgroundColor: 'skyblue',
  },
  dragLineBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: COMPARISON_HEIGHT / 2 - 25,
    backgroundColor: 'skyblue',
  },
  dragHandle: {
    position: 'absolute',
    top: '50%',
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'skyblue',
    backgroundColor: '#FF4C4C',
    transform: [{ translateY: -20 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 60,
    marginTop: 30,
  },
});