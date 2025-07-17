import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  // Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// const screenHeight = Dimensions.get('window').height;
const MAX_LAPS = 7;

export default function StopwatchScreen() {
  const router = useRouter();
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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#35e74d", "black"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/MenuScreen')}>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.timerText}>{formatTime(time)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleStartStop}>
            <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lapButton} onPress={addLap}>
            <Text style={styles.buttonText}>Lap</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={laps}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.lapList}
          renderItem={({ item, index }) => (
            <View style={styles.lapItem}>
              <Text style={styles.lapText}>{formatTime(item)}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    justifyContent: 'flex-start',
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
  timerText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 80,
    fontFamily: 'Roboto-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
  },
  controlButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0ed022',
    borderColor: 'rgb(0,255,0)',
    borderWidth: 3,
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e45e69',
    borderColor: '#e6a1a7',
    borderWidth: 3,
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lapButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e45e69',
    borderColor: '#e6a1a7',
    borderWidth: 3,
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  lapList: {
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 20,
  },
  lapItem: {
    backgroundColor: 'lightgreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lapText: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: 'black',
  },
  xButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
