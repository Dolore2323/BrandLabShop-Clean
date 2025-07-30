import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      home: 'Home',
      catalog: 'Catalog',
      cart: 'Cart',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Welcome to BrandLabShop!',
      // ...добавьте остальные переводы
    },
  },
  he: {
    translation: {
      home: 'בית',
      catalog: 'קטלוג',
      cart: 'עגלה',
      profile: 'פרופיל',
      login: 'התחבר',
      logout: 'התנתק',
      welcome: 'ברוכים הבאים ל-BrandLabShop!',
      // ...добавьте остальные переводы
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0],
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 