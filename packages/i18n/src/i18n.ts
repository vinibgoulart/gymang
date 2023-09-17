import i18next from 'i18next';

import { en, es, ptBR } from './index';

const i18n = i18next.init({
  returnObjects: true,
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
    es: {
      translation: es,
    },
  },
  defaultNS: 'translation',
  nsSeparator: '#',
  keySeparator: false,
  preload: ['pt-BR', 'en', 'es'],
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export const setupI18n = async () => {
  await i18n;
};

export default i18n;
