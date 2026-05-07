import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '@/components/CustomInput';
import BigButton from '@/components/BigButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [inputsFilled, setInputsFilled] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);

  const router = useRouter();
  const { theme } = useTheme();
  const { playButtonSound } = useSound();
  const { isIPad, maxContentWidth, spacingMultiplier } = useDeviceInfo();

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('userName');
        if (saved && saved.trim()) {
          router.replace('/screens/MenuScreen');
          return;
        }
      } finally {
        if (mountedRef.current) setCheckingUser(false);
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, [router]);

  const checkInputs = (value: string) => {
    setName(value);
    setInputsFilled(value.trim().length > 0);
  };

  const goToMenuPage = async () => {
    if (!inputsFilled || submitting) return;
    setSubmitting(true);
    try {
      const trimmed = name.trim();
      if (!trimmed) return;
      playButtonSound();
      await AsyncStorage.setItem('userName', trimmed);
      router.replace('/screens/MenuScreen');
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  if (checkingUser) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
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
            <View style={[styles.container, isIPad && { maxWidth: maxContentWidth, alignSelf: 'center' }]}>
              <CustomInput
                style={{ marginTop: isIPad ? 500 * spacingMultiplier : 420, marginBottom: 40 * spacingMultiplier }}
                value={name}
                onChangeText={checkInputs}
                placeholder={t('enter_name')}
                returnKeyType="done"
                onSubmitEditing={() => inputsFilled && goToMenuPage()}
                editable={!submitting}
              />
              <BigButton
                title={t('go')}
                onPress={goToMenuPage}
                disabled={!inputsFilled || submitting}
              />
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
