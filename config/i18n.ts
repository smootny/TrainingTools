import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en/translation.json';
import pl from '../locales/pl/translation.json';

const LANGUAGE_KEY = 'appLanguage';

export const initI18n = async () => {
  const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  const deviceLanguage = Localization.getLocales()[0].languageCode;
  const language = storedLanguage || (deviceLanguage === 'pl' ? 'pl' : 'en');

  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    interpolation: { escapeValue: false },
  });
};

export const changeLanguage = async (lang: 'en' | 'pl') => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
};

export default i18n;
