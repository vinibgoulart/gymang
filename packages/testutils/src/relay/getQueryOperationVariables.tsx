import type { OperationDescriptor } from 'relay-runtime';

export const getQueryOperationVariables = (operation: OperationDescriptor) => {
  return operation?.request?.variables;
};
