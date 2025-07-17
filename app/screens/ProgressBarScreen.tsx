import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const screenHeight = Dimensions.get('window').height;

export default function ProgressBarScreen() {
  const router = useRouter();
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/MenuScreen')}>
            <Image source={require('../../assets/images/right-arrow.png')} style={styles.backIcon} />
          </TouchableOpacity>

          {!isDebounceActive && countdown === 0 && (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {[
                { label: 'How much time you need for excentric move?', value: fillTime, setter: setFillTime },
                { label: 'How much time you need for pause?', value: stayTime, setter: setStayTime },
                { label: 'How much time you need for izocentric move?', value: emptyTime, setter: setEmptyTime },
                { label: 'How much time you need to prepare yourself for exercise?', value: debounceTime, setter: setDebounceTime },
                { label: 'How many reps you want to do?', value: repetitions, setter: setRepetitions },
              ].map(({ label, value, setter }, idx) => (
                <View key={idx} style={styles.inputBlock}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="in seconds"
                    style={styles.input}
                    value={value}
                    onChangeText={setter}
                  />
                </View>
              ))}

              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity
                  disabled={!inputsFilled}
                  style={[styles.startButton, inputsFilled && styles.startButtonActive]}
                  onPress={startCountdown}
                >
                  <Text style={[styles.startText, inputsFilled && styles.startTextActive]}>Go!</Text>
                </TouchableOpacity>
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
    paddingBottom: 140,
    paddingHorizontal: 22,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
  },
  backIcon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '180deg' }],
  },
  inputBlock: {
    marginBottom: 22,
  },
  label: {
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    marginBottom: 4,
    color: 'white',
  },
  input: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  startButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgb(0,255,0)',
    backgroundColor: '#0ed022',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonActive: {
    backgroundColor: '#19361e',
    borderColor: '#000000',
    borderWidth: 3,
  },
  startText: {
    color: 'black',
    fontSize: 26,
    fontFamily: 'Roboto-Regular',
  },
  startTextActive: {
    color: 'white',
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
