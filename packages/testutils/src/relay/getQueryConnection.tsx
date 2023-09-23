export const getQueryConnection = (request) => {
  const { selections } = request.operation;

  const connectionSelection = selections.find(
    (selection) =>
      selection.kind === 'LinkedHandle' && selection.handle === 'connection',
  );

  return connectionSelection.key;
};
