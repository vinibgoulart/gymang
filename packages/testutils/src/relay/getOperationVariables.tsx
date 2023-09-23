import type { OperationDescriptor } from 'relay-runtime';

export const getOperationVariables = (
  operation: OperationDescriptor,
) => {
  return operation.fragment.variables;
};
