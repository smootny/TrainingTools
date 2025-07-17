import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    AsyncStorage.getItem(key).then((stored) => {
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          setState(parsed);
        } catch (err) {
          console.error('Parse error', err);
        }
      }
    });
  }, [key]);

  const updateState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    const newValue = value instanceof Function ? value(state) : value;
    setState(newValue);
    AsyncStorage.setItem(key, JSON.stringify(newValue)).catch((err) => {
      console.error('Save error', err);
    });
  };

  return [state, updateState];
}
