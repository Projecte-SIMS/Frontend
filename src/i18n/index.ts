import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import ca from './locales/ca.json';
import en from './locales/en.json';

const messages = {
  es,
  ca,
  en
};

// Intentar obtener el idioma guardado o usar el del navegador, por defecto 'es'
const savedLocale = localStorage.getItem('user-locale');
const browserLocale = navigator.language.split('-')[0] || 'es';
const defaultLocale = savedLocale || (Object.keys(messages).includes(browserLocale) ? browserLocale : 'es');

const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: defaultLocale,
  fallbackLocale: 'es',
  messages,
});

export default i18n;
