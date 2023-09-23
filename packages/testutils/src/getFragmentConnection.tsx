const connectionRegex = /^__([0-9a-zA-Z_]+)_connection$/;

const getSelection = (selections: any[], alias: string) => {
  for (const selection of selections) {
    if (selection.alias === alias) {
      return selection;
    }

    if (selection.name === alias) {
      return selection;
    }

    if (selection.selections) {
      const selectionFound = getSelection(selection.selections, alias);

      if (selectionFound) {
        return selectionFound;
      }
    }
  }

  return null;
};

export const getFragmentConnection = (request: any, field: string) => {
  const aliases = field.split('.');

  const connection = aliases.reduce(
    (selection, alias) => getSelection(selection.selections, alias),
    request,
  );

  const [, name] = connectionRegex.exec(connection.name) || [];

  return name;
};
