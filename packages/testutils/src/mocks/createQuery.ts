export const createQuery = (args = {}) => ({
  Query: () => ({
    me: {
      lang: 'en',
      timezone: 'America/Sao_Paulo',
    },
  }),
  ...args,
});
