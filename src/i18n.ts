import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  tr: { translation: tr },
};

const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.split('-')[0];
const supportedLangs = ['ar', 'en', 'tr'];
const defaultLang = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    saveMissing: true,
    missingKeyHandler: function(lng, ns, key) {
      return key;
    }
  });

export default i18n;
