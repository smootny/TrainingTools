import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/components/BackButton';
import CustomLabel from '@/components/CustomLabel';
import SmallButton from '@/components/SmallButton';

const { width: screenWidth } = Dimensions.get('window');

export default function ImageComparisonScreen() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(50);

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
    <LinearGradient colors={["#35e74d", "black"]} start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} style={styles.gradient}>
      <BackButton />
      
      <View style={styles.centeredWrapper}>
        <CustomLabel>Lets see your progress!</CustomLabel>
        <View style={styles.wrapper}>
          <View style={styles.imageContainer}>
            {beforeImage && (
              <Image source={{ uri: beforeImage }} style={styles.imageFull} resizeMode="cover" />
            )}
            {afterImage && (
              <View style={[styles.imageOverlay, { width: `${sliderValue}%` }]}> 
                <Image source={{ uri: afterImage }} style={styles.imageFull} resizeMode="cover" />
              </View>
            )}
          </View>
          {beforeImage && afterImage && (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={sliderValue}
              onValueChange={(value: number) => setSliderValue(value)}
              minimumTrackTintColor="#15d798"
              maximumTrackTintColor="#999"
              thumbTintColor="#15d798"
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <SmallButton
           title='Before'
           onPress={() => pickImage(setBeforeImage, 'beforeImage')}
           variant="yellow"
           />
           <SmallButton
           title='After'
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
  wrapper: {
    width: screenWidth - 40,
    height: 400,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  imageFull: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 60,
    marginTop: 30,
  },
});
