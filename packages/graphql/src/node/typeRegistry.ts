import { getTypeRegister } from './typeRegister';
import { connectionDefinitions } from '../connection/connectionDefinitions';

const {
  registerTypeLoader,
  nodeInterface,
  nodeField,
  nodesField,
  getType,
  getLoader,
  idFetcher,
  typeResolver,
} = getTypeRegister();

export const nodeConnection = connectionDefinitions({
  name: 'Node',
  nodeType: nodeInterface,
  resolveNode: async (obj, args, context) =>
    await idFetcher(obj.node.id, context),
});

export {
  getLoader,
  getType,
  idFetcher,
  nodeField,
  nodeInterface,
  nodesField,
  registerTypeLoader,
  typeResolver,
};
