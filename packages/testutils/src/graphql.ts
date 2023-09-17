// Used to improve DX on tests
export const graphql = (strings: TemplateStringsArray) => {
  if (strings?.schema) {
    throw new Error('use graphqlExecute');
  }

  return strings[0];
};
