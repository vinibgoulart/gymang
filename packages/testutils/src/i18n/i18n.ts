import i18next from 'i18next';

import { en, ptBR } from '@gymang/i18n';

const i18n = i18next.init({
  returnObjects: true,
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },
  defaultNS: 'translation',
  nsSeparator: '#',
  keySeparator: false,
  preload: ['pt-BR', 'en'],
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
