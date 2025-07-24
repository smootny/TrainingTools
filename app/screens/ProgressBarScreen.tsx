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

const screenHeight = Dimensions.get('window').height;

export default function ProgressBarScreen() {
  const progressHeight = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;

  const [countdown, setCountdown] = useState(0);
  const [isDebounceActive, setIsDebounceActive] = useState(false);
  const [barColor, setBarColor] = useState('#204829');
  const [barDirection, setBarDirection] = useState<'top-down' | 'right-left' | 'bottom-up'>('top-down');

  const [fillTime, setFillTime] = useState('');
  const [stayTime, setStayTime] = useState('');
  const [emptyTime, setEmptyTime] = useState('');
  const [debounceTime, setDebounceTime] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [inputsFilled, setInputsFilled] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const repCountRef = useRef(0);

  useEffect(() => {
    const valid = [fillTime, stayTime, emptyTime, debounceTime, repetitions].every(
      (val) => val !== '' && !isNaN(Number(val))
    );
    setInputsFilled(valid);
  }, [fillTime, stayTime, emptyTime, debounceTime, repetitions]);

  const startCountdown = () => {
    repCountRef.current = Number(repetitions);
    setCountdown(Number(debounceTime));
    setIsDebounceActive(true);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setIsDebounceActive(false);
          runRepetitions();
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
    setBarColor('#FF0033');
    setBarDirection('top-down');
    progressHeight.setValue(0);
    Animated.timing(progressHeight, {
      toValue: 100,
      duration: Number(fillTime) * 1000,
      useNativeDriver: false,
    }).start(() => {
      stayPhase();
    });
  };

  const stayPhase = () => {
    setBarColor('#FFFF00');
    setBarDirection('right-left');
    progressWidth.setValue(100);
    Animated.timing(progressWidth, {
      toValue: 0,
      duration: Number(stayTime) * 1000,
      useNativeDriver: false,
    }).start(() => {
      emptyPhase();
    });
  };

  const emptyPhase = () => {
    setBarColor('#00FFFF');
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
          progressWidth.setValue(100);
          setBarColor('#204829');
          setBarDirection('top-down');
        }, 1000);
      }
    });
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
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
         <BackButton />

          {!isDebounceActive && countdown === 0 && (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {[
                { label: 'How much time you need for excentric move?', value: fillTime, setter: setFillTime },
                { label: 'How much time you need for pause?', value: stayTime, setter: setStayTime },
                { label: 'How much time you need for izocentric move?', value: emptyTime, setter: setEmptyTime },
                { label: 'How much time you need to prepare for an exercise?', value: debounceTime, setter: setDebounceTime },
                { label: 'How many reps you want to do?', value: repetitions, setter: setRepetitions },
              ].map(({ label, value, setter }, idx) => (
                <View key={idx} style={styles.inputBlock}>
                  <CustomLabel style={styles.label}>{label}</CustomLabel>
                  <CustomInput
                  value={value}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={idx === 4 ? '(number)' : '(seconds)'}
                  onChangeText={setter}
                />
                </View>
              ))}

              <View style={{ alignItems: 'center', marginTop: 80 }}>
              <BigButton
                title="Start!"
                onPress={startCountdown}
                disabled={!inputsFilled}
              />
              </View>
            </ScrollView>
          )}

          <Animated.View
            style={[StyleSheet.absoluteFill, {
              backgroundColor: barColor,
              height: barDirection !== 'right-left'
                ? progressHeight.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',
              width: barDirection === 'right-left'
                ? progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : '100%',
              top: barDirection === 'bottom-up' ? undefined : 0,
              bottom: barDirection === 'bottom-up' ? 0 : undefined,
              zIndex: 998,
            }]}
          />

          {isDebounceActive && countdown > 0 && (
            <View style={styles.countdownOverlay}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
  },
  inputBlock: {
    marginBottom: 30,
  },
  input: {
    alignSelf: 'center'
  },
  label: {
    paddingLeft: 4
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: screenHeight,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  countdownText: {
    fontSize: 100,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
});
