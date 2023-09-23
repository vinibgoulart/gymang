export const FEEDBACK_FORM_TYPE = {
  TEXT: 'TEXT',
  TOPIC: 'TOPIC',
  REACTION: 'REACTION',
  SCORE: 'SCORE',
  IDENTIFIED: 'IDENTIFIED',
  RATINGS: 'RATINGS',
  PROFILE: 'PROFILE',
};

export const createFormText = () => ({
  type: FEEDBACK_FORM_TYPE.TEXT,
  params: [
    {
      key: 'LABEL',
      value: 'Faça sua avaliação',
    },
    {
      key: 'PLACEHOLDER',
      value: 'Descreva sua avaliação com o máximo de detalhes.',
    },
  ],
});

export const createFormTopic = () => ({
  type: FEEDBACK_FORM_TYPE.TOPIC,
  params: [
    {
      key: 'LABEL',
      value: 'O seu feedback se encaixa em',
    },
    {
      key: 'PLACEHOLDER',
      value: 'Selecione uma opção',
    },
  ],
});

export const createFormReaction = () => ({
  type: FEEDBACK_FORM_TYPE.REACTION,
  params: [
    {
      key: 'LABEL',
      value: 'Como você se sentiu nesse contexto?',
    },
  ],
});

export const createFormScore = () => ({
  type: FEEDBACK_FORM_TYPE.SCORE,
  params: [
    {
      key: 'LABEL',
      value: 'Como você avalia nesta situação?',
    },
  ],
});

export const createFormIdentified = () => ({
  type: FEEDBACK_FORM_TYPE.IDENTIFIED,
  params: [
    {
      key: 'LABEL',
      value: 'Deseja se identificar?',
    },
  ],
});

export const createFormRatings = () => ({
  type: FEEDBACK_FORM_TYPE.RATINGS,
  params: [
    {
      key: 'LABEL',
      value: 'Como você avalia o colaborador?',
    },
  ],
});

export const createCompanyPreferencesFeedback = (args = {}) => ({
  CompanyPreferencesFeedback: () => ({
    allowSelfReview: true,
    alwaysAnonymous: false,
    formType: 'SINGLE_TOPIC',
    scoreScale: {
      max: 10,
      min: 1,
      type: 'NUMBER',
      scoreTexts: [],
      initialScoreValue: 5,
      withNa: true,
    },
    module: {
      name: 'feedback',
    },
    formItems: [createFormTopic(), createFormScore()],
    ...args,
  }),
});
