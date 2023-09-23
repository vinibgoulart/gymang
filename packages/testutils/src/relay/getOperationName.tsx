import type { OperationDescriptor } from 'relay-runtime';

export const getOperationName = (operation: OperationDescriptor) => {
  return operation.root.node.name
}