import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '@/components/CustomInput';
import BigButton from '@/components/BigButton';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const [inputsFilled, setInputsFilled] = useState(false);
  const router = useRouter();

  const checkInputs = (value: string) => {
    setName(value);
    setInputsFilled(value.trim() !== '');
  };

  const goToMenuPage = async () => {
    if (inputsFilled) {
      await AsyncStorage.setItem('userName', name);
      router.replace('/screens/MenuScreen');
    }
  };

  return (
    <LinearGradient
      colors={["#35e74d", "black"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flexContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
          <ImageBackground
            source={require('../../assets/images/logo-training.png')}
            resizeMode="contain"
            style={styles.background}
            imageStyle={styles.logoImage}
          >
            
            <View style={styles.container}>
              <CustomInput
                style={styles.input}
                value={name}
                onChangeText={checkInputs}
                placeholder="Enter your name"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (inputsFilled) goToMenuPage();
                }}
              />
              

              <BigButton
                title="Go!"
                onPress={goToMenuPage}
                disabled={!inputsFilled}
              />
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logoImage: {
    position: 'absolute',
    top: -180,
    left: -266,
    height: 870,
    width: 920,
    transform: [{ scale: 0.4 }],
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginTop: 420,
    marginBottom: 40,
  },
});
