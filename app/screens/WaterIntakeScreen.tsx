import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';

export default function WaterIntakeScreen() {
  const router = useRouter();

  const [gender, setGender] = useLocalStorageState<'male' | 'female'>('gender', 'male');
  const [age, setAge] = useLocalStorageState<string>('age', '');
  const [weight, setWeight] = useLocalStorageState<string>('weight', '');
  const [inputWater, setInputWater] = useState('');
  const [totalWaterIntake, setTotalWaterIntake] = useLocalStorageState<number>('totalWater', 0);
  const [drankWater, setDrankWater] = useLocalStorageState<number>('drankWater', 0);
  const [inputsFilled, setInputsFilled] = useState(false);
  const [waterInputFilled, setWaterInputFilled] = useState(false);
  const [showProgress, setShowProgress] = useLocalStorageState<boolean>('showProgress', false);

  useEffect(() => {
    const allValid = age !== '' && weight !== '' && !isNaN(Number(age)) && !isNaN(Number(weight));
    setInputsFilled(allValid);
  }, [age, weight]);

  useEffect(() => {
    const valid = inputWater !== '' && Number(inputWater) > 0;
    setWaterInputFilled(valid);
  }, [inputWater]);

  const calculateWaterIntake = () => {
    if (!inputsFilled) return;
    const total = Number(weight) * 30;
    setTotalWaterIntake(total);
    setDrankWater(0);
    setShowProgress(true);
  };

  const updateProgress = () => {
    const value = Number(inputWater);
    if (value > 0) {
      setDrankWater((prev) => Math.min(prev + value, totalWaterIntake));
      setInputWater('');
    }
  };

  const resetProgress = () => {
    setDrankWater(0);
    setInputWater('');
  };

  const handleChangeInputs = () => {
    setShowProgress(false);
  };

  const percentage = totalWaterIntake ? (drankWater / totalWaterIntake) * 100 : 0;

  return (
    <LinearGradient colors={["#35e74d", "black"]} start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} style={styles.gradient}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={10}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/MenuScreen')}>
              <Image source={require('../../assets/images/right-arrow.png')} style={styles.backIcon} />
            </TouchableOpacity>

            {!showProgress ? (
              <View style={styles.inputBox}>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
                    onPress={() => setGender('male')}
                  >
                    <Text style={styles.genderText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
                    onPress={() => setGender('female')}
                  >
                    <Text style={styles.genderText}>Female</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.inputLabel}>How old are you?</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Age"
                  placeholderTextColor="#fff"
                  value={age}
                  onChangeText={setAge}
                />
                <Text style={styles.inputLabel}>How much do you weight?</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Weight (kg)"
                  placeholderTextColor="#fff"
                  value={weight}
                  onChangeText={setWeight}
                />
                <TouchableOpacity
                  style={[styles.calculateButton, inputsFilled && styles.calculateButtonActive]}
                  onPress={calculateWaterIntake}
                  disabled={!inputsFilled}
                >
                  <Text style={[styles.buttonText, inputsFilled && styles.buttonTextActive]}>Calculate</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.progressBox}>
                <Text style={styles.waterDisplay}>You should drink {totalWaterIntake} ml of water daily.</Text>
                <AnimatedCircularProgress
                  size={200}
                  width={16}
                  fill={percentage}
                  tintColor="#78C000"
                  backgroundColor="#C7E596"
                  rotation={0}
                  lineCap="round"
                  duration={600}
                >
                  {() => <Text style={styles.percentText}>{Math.floor(percentage)}%</Text>}
                </AnimatedCircularProgress>
                <TextInput
                  style={styles.waterInput}
                  keyboardType="numeric"
                  placeholder="Water intake (ml)"
                  placeholderTextColor="#fff"
                  value={inputWater}
                  onChangeText={setInputWater}
                />
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                  <TouchableOpacity
                    style={[styles.addButton, waterInputFilled && styles.addButtonActive]}
                    onPress={updateProgress}
                    disabled={!waterInputFilled}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.changeButton} onPress={handleChangeInputs}>
                    <Text style={styles.buttonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
  inputBox: {
    width: '80%',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 22,
    width: '100%',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    fontFamily: 'Roboto-Regular',
  },
  inputLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: 16,
    color: 'white',
  },
  waterInput: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 22,
    width: 200,
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    fontFamily: 'Roboto-Regular',
  },
  calculateButton: {
    marginTop: 20,
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgb(0,255,0)',
    backgroundColor: '#0ed022',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    opacity: 0.5,
  },
  calculateButtonActive: {
    backgroundColor: '#19361e',
    opacity: 0.8,
  },
  addButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgb(0,255,0)',
    backgroundColor: '#0ed022',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: '#19361e',
    opacity: 0.8,
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
  changeButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'yellow',
    borderColor: 'orange',
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
  buttonTextActive: {
    color: 'black',
  },
  waterDisplay: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    color: 'white',
    marginBottom: 10,
  },
  percentText: {
    fontSize: 40,
    fontFamily: 'Roboto-Regular',
    color: '#78C000',
  },
  progressBox: {
    alignItems: 'center',
    gap: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  genderButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#587458',
    opacity: 0.7,
  },
  genderButtonSelected: {
    backgroundColor: '#00FF66',
    opacity: 1,
  },
  genderText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});
