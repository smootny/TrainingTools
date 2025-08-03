import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/BackButton';
import SmallButton from '@/components/SmallButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
const MAX_LAPS = 7;

export default function StopwatchScreen() {
  const { confirmButtonSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleStartStop = () => {
    setIsRunning((prev) => {
      confirmButtonSound()
      if (!prev) {
        intervalRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 10);
        }, 10);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return !prev;
    });
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning && laps.length < MAX_LAPS) {
      setLaps((prev) => [...prev, time]);
    }
  };

  const removeLap = (index: number) => {
    setLaps((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <BackButton />

        <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(time)}</Text>

        <View style={styles.buttonContainer}>
          <SmallButton
            title={isRunning ? `${t('stop_button')}` : `${t('start_button')}`}
            onPress={toggleStartStop}
          />
          <SmallButton
            title={t('reset_button')}
            onPress={resetTimer}
            variant="red"
          />
          <SmallButton
            title={t('lap_button')}
            onPress={addLap}
            variant="yellow"
          />
        </View>

        <FlatList
          data={laps}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.lapList}
          renderItem={({ item, index }) => (
            <View style={styles.lapItem}>
              <Text style={[styles.lapText, { color: theme.text }]}>{formatTime(item)}</Text>
              <TouchableOpacity style={styles.xButton} onPress={() => removeLap(index)}>
                <Svg width={26} height={26} viewBox="0 0 24 24">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="red"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 120,
    justifyContent: 'flex-start',
  },
  timerText: {
    textAlign: 'center',
    fontSize: 80,
    fontFamily: 'Roboto-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
  },
  lapList: {
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 16,
  },
  lapItem: {
    backgroundColor: '#ffffff30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: '#ffffff33',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lapText: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  xButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
