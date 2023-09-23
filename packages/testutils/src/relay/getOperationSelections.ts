export const getOperationSelections = (operation) => {
  return operation?.fragment?.owner?.node?.operation?.selections;
};
