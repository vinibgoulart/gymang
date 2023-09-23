export const createCompany = (args = {}) => ({
  Company: () => ({
    id: `companyId`,
    lang: 'en',
    timezone: 'America/Sao_Paulo',
    ...args,
    __typename: 'Company',
  }),
});
