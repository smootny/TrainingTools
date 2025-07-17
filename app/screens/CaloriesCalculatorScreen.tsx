import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Meal = {
  id: string;
  calories: number;
};

const STORAGE_KEY_MEALS = 'meals';
const STORAGE_KEY_TOTAL = 'totalCalories';

export default function CaloriesCalculatorScreen() {
  const router = useRouter();
  const [inputCalories, setInputCalories] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);

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
    if (!isNaN(calories)) {
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
    <LinearGradient
      colors={["#35e74d", "black"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/MenuScreen')}>
        <Image source={require('../../assets/images/right-arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{totalAmount} kcal</Text>
        </View>

        <Text style={styles.inputLabel}>How many calories did you eat today?</Text>
        <TextInput
          keyboardType="numeric"
          value={inputCalories}
          onChangeText={setInputCalories}
          placeholder="kcal"
          style={styles.input}
          placeholderTextColor="#ffffffaa"
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.resetButton} onPress={resetTotal}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addCalories}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {meals.length > 0 && (
          <View style={styles.mealList}>
            {meals.map((meal, index) => (
              <View key={meal.id} style={styles.mealItem}>
                <Text style={styles.mealText}>{index + 1}. Meal - {meal.calories} kcal</Text>
                <TouchableOpacity onPress={() => removeMeal(meal.id)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { 
    flex: 1 
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 999 
  },
  backIcon: { 
    width: 60, 
    height: 60, 
    transform: [{ rotate: '180deg' }] 
  },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 120, 
    paddingHorizontal: 20 
  },
  totalContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    gap: 10, 
    paddingBottom: 50
  },
  totalLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: 28,
    marginRight: 10,
    color: 'white',
  },
  totalValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
    color: 'white',
  },
  inputLabel: {
    fontFamily: 'Roboto-Light',
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 30,
    borderRadius: 10,
    paddingVertical: 10,
    width: '90%',
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 70,
  },
  addButton: {
    paddingHorizontal: 36,
    paddingVertical: 40,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgb(0,255,0)',
    backgroundColor: '#0ed022',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    alignItems: 'center',
  },
  resetButton: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#e6a1a7',
    backgroundColor: '#e45e69',
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  mealList: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 10,
  },
  mealItem: {
    backgroundColor: '#ffffff10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ffffff33',
  },
  mealText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  removeText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
