import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
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

const PREP_SECONDS = 10 as const;

type Direction = 'top-down' | 'right-left' | 'bottom-up' | 'left-right';

export default function ProgressBarScreen() {
  const { confirmButtonSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isIPad, maxContentWidth } = useDeviceInfo();

  const [isSequenceActive, setIsSequenceActive] = useState(false);

  const progressHeight = useRef(new Animated.Value(0)).current;
  const progressWidth  = useRef(new Animated.Value(100)).current;

  const [countdown, setCountdown] = useState(0);
  const [isDebounceActive, setIsDebounceActive] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [barColor, setBarColor] = useState('#204829');
  const [barDirection, setBarDirection] = useState<Direction>('top-down');

  const [phaseLabel, setPhaseLabel] = useState<string | null>(null);

  const [fillTime, setFillTime] = useState('');
  const [stayTime, setStayTime] = useState('');
  const [emptyTime, setEmptyTime] = useState('');
  const [restTime, setRestTime] = useState('');
  const [repetitions, setRepetitions] = useState('');

  const [inputsFilled, setInputsFilled] = useState(false);

  const startScale = useRef(new Animated.Value(0)).current;
  const startOpacity = useRef(new Animated.Value(0)).current;

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repCountRef = useRef(0);

  useEffect(() => {
    const valid = [fillTime, stayTime, emptyTime, restTime, repetitions].every(
      (val) => val !== '' && !isNaN(Number(val))
    );
    setInputsFilled(valid);
  }, [fillTime, stayTime, emptyTime, restTime, repetitions]);

  useEffect(() => {
    return () => {
      stopAllAnimsAndTimers();
    };
  }, []);

  const uiLocked = isSequenceActive || isDebounceActive || showStart;

  const stopAllAnimsAndTimers = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    progressHeight.stopAnimation?.();
    progressWidth.stopAnimation?.();
  };

  const resetOverlays = () => {
    setShowStart(false);
    setIsDebounceActive(false);
    setPhaseLabel(null);
  };

  const resetBarsToIdle = () => {
    setBarDirection('top-down');
    setBarColor('#204829');
    progressHeight.setValue(0);
    progressWidth.setValue(100);
  };

  const startCountdown = () => {
    if (isSequenceActive || isDebounceActive || showStart) return;

    stopAllAnimsAndTimers();
    resetOverlays();
    resetBarsToIdle();

    setIsSequenceActive(true);
    repCountRef.current = Number(repetitions);
    setCountdown(PREP_SECONDS);
    setIsDebounceActive(true);

    countdownRef.current = setInterval(() => {
      confirmButtonSound();
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          setIsDebounceActive(false);

          setShowStart(true);
          startScale.setValue(0.5);
          startOpacity.setValue(0);

          Animated.parallel([
            Animated.timing(startScale,  { toValue: 1.2, duration: 500, useNativeDriver: true }),
            Animated.timing(startOpacity,{ toValue: 1,   duration: 500, useNativeDriver: true }),
          ]).start(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            startTimeoutRef.current = setTimeout(() => {
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
    } else {
      stopAllAnimsAndTimers();
      resetOverlays();
      resetBarsToIdle();
      setIsSequenceActive(false);
    }
  };

  const fillPhase = () => {
    setPhaseLabel(t('down'));
    setBarColor('#FF4C4C');
    setBarDirection('top-down');

    progressHeight.setValue(0);
    progressWidth.setValue(100);
    Animated.timing(progressHeight, {
      toValue: 100,
      duration: Number(fillTime) * 1000,
      useNativeDriver: false,
    }).start(() => stayPhase());
  };

  const stayPhase = () => {
    setPhaseLabel(t('pause'));
    setBarColor('#FFD93D');
    setBarDirection('right-left');

    progressHeight.setValue(100);
    progressWidth.setValue(0);
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: Number(stayTime) * 1000,
      useNativeDriver: false,
    }).start(() => emptyPhase());
  };

  const emptyPhase = () => {
    setPhaseLabel(t('up'));
    setBarColor('#6BCB77');
    setBarDirection('bottom-up');

    progressWidth.setValue(100);
    progressHeight.setValue(0);
    Animated.timing(progressHeight, {
      toValue: 100,
      duration: Number(emptyTime) * 1000,
      useNativeDriver: false,
    }).start(() => leftToRightPhase());
  };

  const leftToRightPhase = () => {
    setPhaseLabel(t('pause'));
    setBarColor('#3FA0FF');
    setBarDirection('left-right');

    progressHeight.setValue(100);
    progressWidth.setValue(0);
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: Number(restTime) * 1000,
      useNativeDriver: false,
    }).start(() => {
      if (repCountRef.current > 0) {
        runRepetitions();
      } else {
        setTimeout(() => {
          stopAllAnimsAndTimers();
          resetOverlays();
          resetBarsToIdle();
          setIsSequenceActive(false);
        }, 400);
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

      <Animated.View
        pointerEvents="none"
        style={[
          styles.fullOverlay,
          {
            backgroundColor: barColor,

            height:
              barDirection === 'top-down' || barDirection === 'bottom-up'
                ? progressHeight.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',
            width:
              barDirection === 'left-right' || barDirection === 'right-left'
                ? progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',

            top:    barDirection === 'bottom-up' ? undefined : 0,
            bottom: barDirection === 'bottom-up' ? 0 : undefined,

            left:  barDirection === 'right-left' ? undefined : 0,
            right: barDirection === 'right-left' ? 0 : undefined,

            zIndex: 998,
          },
        ]}
      />

      {(isSequenceActive || isDebounceActive || showStart) && (
        <View pointerEvents="none" style={[styles.dimOverlay, styles.absoluteFill]} />
      )}

      {isDebounceActive && countdown > 0 && (
        <View pointerEvents="none" style={[styles.countdownOverlay, styles.absoluteFill]}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {showStart && (
        <View pointerEvents="none" style={[styles.countdownOverlay, styles.absoluteFill]}>
          <Animated.Text style={[styles.bigPhaseText, { opacity: startOpacity, transform: [{ scale: startScale }] }]}>
            START!
          </Animated.Text>
        </View>
      )}

      {!!phaseLabel && (
        <View pointerEvents="none" style={[styles.countdownOverlay, styles.absoluteFill, { zIndex: 1000 }]}>
          <Text style={styles.bigPhaseText}>{phaseLabel}</Text>
        </View>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={[styles.container, isIPad && { maxWidth: maxContentWidth, alignSelf: 'center' }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
          {!isDebounceActive && !showStart && (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {[
                { label: t('excentric'), value: fillTime, setter: setFillTime, ph: t('input_seconds') },
                { label: t('pause_label'), value: stayTime, setter: setStayTime, ph: t('input_seconds') },
                { label: t('izocentric'), value: emptyTime, setter: setEmptyTime, ph: t('input_seconds') },
                { label: t('pause_between'), value: restTime, setter: setRestTime, ph: t('input_seconds') },
                { label: t('reps'), value: repetitions, setter: setRepetitions, ph: t('input_number') },
              ].map(({ label, value, setter, ph }, idx) => (
                <View key={idx} style={styles.inputBlock}>
                  <CustomLabel style={styles.label}>{label}</CustomLabel>
                  <CustomInput
                    value={value}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={ph}
                    onChangeText={setter}
                    editable={!uiLocked}
                  />
                </View>
              ))}

              <View style={{ alignItems: 'center', marginTop: 80 }}>
                <BigButton
                  title={t('start')}
                  onPress={startCountdown}
                  disabled={!inputsFilled || uiLocked}
                />
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
  hint: { fontFamily: 'Roboto-Light', fontSize: 14 },

  absoluteFill: { ...StyleSheet.absoluteFillObject },

  fullOverlay: { ...StyleSheet.absoluteFillObject },

  dimOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 997,
  },

  countdownOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  countdownText: { fontSize: 100, fontFamily: 'Roboto-Regular', color: 'white' },

  bigPhaseText: {
    fontSize: 80,
    fontFamily: 'Roboto-Bold',
    color: '#00FFAA',
    textShadowColor: 'rgba(0, 255, 170, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
  },
});
