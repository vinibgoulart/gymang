export const createCompanyCoreLoginPreferences = (args = {}) => ({
  CompanyCoreLoginPreferences: () => ({
    enableEmail: true,
    enableTaxID: true,
    enableEnrollment: true,
    enableSaml: false,
    ...args,
  }),
});
