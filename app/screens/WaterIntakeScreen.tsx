import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import BackButton from '@/components/BackButton';
import CustomInput from '@/components/CustomInput';
import CustomLabel from '@/components/CustomLabel';
import BigButton from '@/components/BigButton';
import SmallButton from '@/components/SmallButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme

 } from '@/contexts/ThemeContext';
export default function WaterIntakeScreen() {
  const { theme } = useTheme();
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
    Keyboard.dismiss();
  };

  const updateProgress = () => {
    const value = Number(inputWater);
    if (value > 0) {
      setDrankWater((prev) => Math.min(prev + value, totalWaterIntake));
      setInputWater('');
      Keyboard.dismiss();
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
    <LinearGradient 
      colors={[theme.background, theme.secondary]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <BackButton />
      {!showProgress ? (
        <>
          <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" enableOnAndroid>
            <View style={styles.inputBox}>
              <CustomLabel style={styles.genderQuestion}>What is your gender?</CustomLabel>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  onPress={() => setGender('male')}
                  style={[styles.genderImageWrapper, gender === 'male' && styles.genderSelected]}
                >
                  <Image source={require('../../assets/images/male.png')} style={styles.genderImage} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('female')}
                  style={[styles.genderImageWrapper, gender === 'female' && styles.genderSelected]}
                >
                  <Image source={require('../../assets/images/female.png')} style={styles.genderImage} resizeMode="contain" />
                </TouchableOpacity>
              </View>

              <CustomLabel>How old are you?</CustomLabel>
              <CustomInput
                style={styles.input}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholder="(age)"
              />
              <CustomLabel>How much do you weight?</CustomLabel>
              <CustomInput
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="(kg)"
              />
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.footer}>
            <BigButton
              title="Confirm!"
              onPress={calculateWaterIntake}
              disabled={!inputsFilled}
            />
          </View>
        </>
      ) : (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" enableOnAndroid>
          <View style={styles.progressBox}>
            <Text style={styles.waterDisplay}>You should drink {totalWaterIntake} ml of water daily.</Text>
            <AnimatedCircularProgress
              style={styles.circle}
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
            <CustomLabel>How much water did you drink today?</CustomLabel>
            <CustomInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="(ml)"
              value={inputWater}
              onChangeText={setInputWater}
            />
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
              <SmallButton title='Add' onPress={updateProgress} disabled={!waterInputFilled} />
              <SmallButton title='Reset' onPress={resetProgress} variant="red" />
              <SmallButton title='Change' onPress={handleChangeInputs} variant="yellow" />
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { 
    flex: 1 
  },
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  inputBox: {
    width: '80%',
    alignItems: 'center',
    marginTop: 180,
  },
  circle: {
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    marginBottom: 20,
  },
  waterDisplay: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    color: 'white',
    marginBottom: 10,
    marginTop: 140,
  },
  percentText: {
    fontSize: 40,
    fontFamily: 'Roboto-Regular',
    color: '#78C000',
  },
  progressBox: {
    alignItems: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  genderImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 116, 88, 0.5)',
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.6,
  },
  genderSelected: {
    borderColor: '#00FF66',
    opacity: 1,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  genderImage: {
    width: 60,
    height: 60,
  },
  genderQuestion: {
    paddingBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});
