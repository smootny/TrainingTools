import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import BackButton from '@/components/BackButton';
import CustomLabel from '@/components/CustomLabel';
import CustomInput from '@/components/CustomInput';
import SmallButton from '@/components/SmallButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

type Meal = {
  id: string;
  calories: number;
};

const STORAGE_KEY_MEALS = 'meals';
const STORAGE_KEY_TOTAL = 'totalCalories';

export default function CaloriesCalculatorScreen() {
  const { eatAddSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [inputCalories, setInputCalories] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [caloriesInputFilled, setCaloriesInputFilled] = useState(false);
  const isAtLimit = meals.length >= 6;

  useEffect(() => {
    const valid = inputCalories !== '' && Number(inputCalories) > 0;
    setCaloriesInputFilled(valid);
  }, [inputCalories]);

  useEffect(() => {
    const loadData = async () => {
      const storedMeals = await AsyncStorage.getItem(STORAGE_KEY_MEALS);
      const storedTotal = await AsyncStorage.getItem(STORAGE_KEY_TOTAL);

      if (storedMeals) setMeals(JSON.parse(storedMeals));
      if (storedTotal) setTotalAmount(Number(storedTotal));
    };

    loadData();
  }, []);

  const saveToStorage = async (updatedMeals: Meal[], updatedTotal: number) => {
    await AsyncStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updatedMeals));
    await AsyncStorage.setItem(STORAGE_KEY_TOTAL, updatedTotal.toString());
  };

  const addCalories = () => {
    const calories = parseInt(inputCalories);
    if (!isNaN(calories) && !isAtLimit) {
      eatAddSound();
      const newMeal: Meal = {
        id: Date.now().toString(),
        calories,
      };

      const updatedMeals = [...meals, newMeal].slice(-6);
      const updatedTotal = totalAmount + calories;

      setMeals(updatedMeals);
      setTotalAmount(updatedTotal);
      saveToStorage(updatedMeals, updatedTotal);
      setInputCalories('');
    }
  };

  const removeMeal = (id: string) => {
    const mealToRemove = meals.find((m) => m.id === id);
    if (mealToRemove) {
      const updatedMeals = meals.filter((m) => m.id !== id);
      const updatedTotal = totalAmount - mealToRemove.calories;

      setMeals(updatedMeals);
      setTotalAmount(updatedTotal);
      saveToStorage(updatedMeals, updatedTotal);
    }
  };

  const resetTotal = async () => {
    setTotalAmount(0);
    setMeals([]);
    await AsyncStorage.multiRemove([STORAGE_KEY_MEALS, STORAGE_KEY_TOTAL]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <BackButton />
      
      <View style={styles.container}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, {color: theme.text}]}>{t('total')}:</Text>
          <Text style={[styles.totalValue, {color: theme.text}]}>{totalAmount} kcal</Text>
        </View>

        <CustomLabel>{t('calories')}</CustomLabel>
        <CustomInput
          keyboardType="numeric"
          value={inputCalories}
          onChangeText={setInputCalories}
          placeholder={t('input_calories')}
          style={styles.input}
        />

        <View style={styles.buttonGroup}>
        <SmallButton
            title={t('add_button')}
            onPress={addCalories}
            variant="green"
            disabled={!caloriesInputFilled || isAtLimit}
          />
          <SmallButton title={t('reset_button')} onPress={resetTotal} variant="red" />
        </View>

        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.mealList}
          renderItem={({ item, index }) => (
            <View style={styles.mealItem}>
              <Text style={[styles.mealText, {color: theme.text}]}>
                {index + 1}. {t('meal')} - {item.calories} kcal
              </Text>
              <TouchableOpacity onPress={() => removeMeal(item.id)} style={styles.xButton}>
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
          {isAtLimit && ( 
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 18 }}>
          {t('max_meals')}
        </Text>
      )}
      </View>
    
    </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 120,
  },
  totalContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  totalLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: 28,
    color: 'white',
  },
  totalValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
    color: 'white',
  },
  input: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 70,
  },
  mealList: {
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 16,
  },
  mealItem: {
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
  mealText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  xButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
