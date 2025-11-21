import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/BackButton';
import CustomInput from '@/components/CustomInput';
import CustomLabel from '@/components/CustomLabel';
import BigButton from '@/components/BigButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import * as Haptics from 'expo-haptics';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';

const screenHeight = Dimensions.get('window').height;

export default function ProgressBarScreen() {
  const { confirmButtonSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isIPad, maxContentWidth } = useDeviceInfo();

  const progressHeight = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;

  const [countdown, setCountdown] = useState(0);
  const [isDebounceActive, setIsDebounceActive] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [barColor, setBarColor] = useState('#204829');
  const [barDirection, setBarDirection] = useState<'top-down' | 'right-left' | 'bottom-up'>('top-down');

  const [fillTime, setFillTime] = useState('');
  const [stayTime, setStayTime] = useState('');
  const [emptyTime, setEmptyTime] = useState('');
  const [debounceTime, setDebounceTime] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [inputsFilled, setInputsFilled] = useState(false);

  const startScale = useRef(new Animated.Value(0)).current;
  const startOpacity = useRef(new Animated.Value(0)).current;

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const repCountRef = useRef(0);

  useEffect(() => {
    const valid = [fillTime, stayTime, emptyTime, debounceTime, repetitions].every(
      (val) => val !== '' && !isNaN(Number(val))
    );
    setInputsFilled(valid);
  }, [fillTime, stayTime, emptyTime, debounceTime, repetitions]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = () => {
    repCountRef.current = Number(repetitions);
    setCountdown(Number(debounceTime));
    setIsDebounceActive(true);

    countdownRef.current = setInterval(() => {
      confirmButtonSound();
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setIsDebounceActive(false);

          setShowStart(true);
          startScale.setValue(0.5);
          startOpacity.setValue(0);

          Animated.parallel([
            Animated.timing(startScale, { toValue: 1.2, duration: 500, useNativeDriver: true }),
            Animated.timing(startOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          ]).start(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setTimeout(() => {
              setShowStart(false);
              runRepetitions();
            }, 400);
          });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const runRepetitions = () => {
    if (repCountRef.current > 0) {
      repCountRef.current--;
      fillPhase();
    }
  };

  const fillPhase = () => {
    setBarColor('#FF4C4C');
    setBarDirection('top-down');
    progressHeight.setValue(0);
    Animated.timing(progressHeight, {
      toValue: 100,
      duration: Number(fillTime) * 1000,
      useNativeDriver: false,
    }).start(() => stayPhase());
  };

  const stayPhase = () => {
    setBarColor('#FFD93D');
    setBarDirection('right-left');
    progressWidth.setValue(0);
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: Number(stayTime) * 1000,
      useNativeDriver: false,
    }).start(() => emptyPhase());
  };

  const emptyPhase = () => {
    setBarColor('#6BCB77');
    setBarDirection('bottom-up');
    progressHeight.setValue(0);
    progressWidth.setValue(100);
    Animated.timing(progressHeight, {
      toValue: 100,
      duration: Number(emptyTime) * 1000,
      useNativeDriver: false,
    }).start(() => {
      if (repCountRef.current > 0) {
        runRepetitions();
      } else {
        setTimeout(() => {
          progressHeight.setValue(0);
          progressWidth.setValue(0);
          setBarColor('#204829');
          setBarDirection('top-down');
        }, 1000);
      }
    });
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <BackButton />

      {/* === FULLSCREEN OVERLAYS === */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fullOverlay,
          {
            backgroundColor: barColor,
            height:
              barDirection !== 'right-left'
                ? progressHeight.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',
            width:
              barDirection === 'right-left'
                ? progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',
            top: barDirection === 'bottom-up' ? undefined : 0,
            bottom: barDirection === 'bottom-up' ? 0 : undefined,
            zIndex: 998,
          },
        ]}
      />

      {isDebounceActive && countdown > 0 && (
        <View pointerEvents="none" style={[styles.countdownOverlay, styles.absoluteFill]}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {showStart && (
        <View pointerEvents="none" style={[styles.countdownOverlay, styles.absoluteFill]}>
          <Animated.Text style={[styles.startText, { opacity: startOpacity, transform: [{ scale: startScale }] }]}>
            START!
          </Animated.Text>
        </View>
      )}

      {/* === WĄSKI, WYcentrowany KONTENER Z FORMULARZEM === */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={[styles.container, isIPad && { maxWidth: maxContentWidth, alignSelf: 'center' }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
          {!isDebounceActive && countdown === 0 && !showStart && (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {[
                { label: t('excentric'), value: fillTime, setter: setFillTime },
                { label: t('pause'), value: stayTime, setter: setStayTime },
                { label: t('izocentric'), value: emptyTime, setter: setEmptyTime },
                { label: t('exercise'), value: debounceTime, setter: setDebounceTime },
                { label: t('reps'), value: repetitions, setter: setRepetitions },
              ].map(({ label, value, setter }, idx) => (
                <View key={idx} style={styles.inputBlock}>
                  <CustomLabel style={styles.label}>{label}</CustomLabel>
                  <CustomInput
                    value={value}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={idx === 4 ? `${t('input_number')}` : `${t('input_seconds')}`}
                    onChangeText={setter}
                  />
                </View>
              ))}

              <View style={{ alignItems: 'center', marginTop: 80 }}>
                <BigButton title={t('start')} onPress={startCountdown} disabled={!inputsFilled} />
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingTop: 120 },
  inputBlock: { marginBottom: 24 },
  input: { alignSelf: 'center' },
  label: { paddingLeft: 4 },
  absoluteFill: { ...StyleSheet.absoluteFillObject },
  fullOverlay: { ...StyleSheet.absoluteFillObject },
  countdownOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 999,
  },
  countdownText: { fontSize: 100, fontFamily: 'Roboto-Regular', color: 'white' },
  startText: {
    fontSize: 80,
    fontFamily: 'Roboto-Bold',
    color: '#00FFAA',
    textShadowColor: 'rgba(0, 255, 170, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
});
