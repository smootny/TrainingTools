import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#ffffffaa"
                value={name}
                onChangeText={checkInputs}
              />

              <Pressable
                onPress={goToMenuPage}
                style={({ pressed }) => [
                  styles.button,
                  inputsFilled && styles.buttonActive
                ]}
                disabled={!inputsFilled}
              >
                <Text style={[
                  styles.buttonText,
                  inputsFilled && styles.buttonTextActive
                ]}>Go!</Text>
              </Pressable>
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
    left: -265,
    height: 870,
    width: 920,
    transform: [{ scale: 0.4 }],
    opacity: 1,
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
    height: 50,
    width: 300,
    borderRadius: 30,
    textAlign: 'center',
    backgroundColor: '#587458',
    color: '#ffffff',
    borderColor: '#19361e',
    borderWidth: 0.5,
    fontSize: 20,
    opacity: 0.8,
    fontFamily: 'Roboto-Light',
  },
  button: {
    paddingHorizontal: 36,
    paddingVertical: 40,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgb(0,255,0)',
    backgroundColor: '#0ed022',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    opacity: 0.5,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#19361e',
    borderColor: '#000000',
    borderWidth: 3,
  },
  buttonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular'
  },
  buttonTextActive: {
    color: '#ffffff',
  },
});
