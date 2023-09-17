import type { GraphQLObjectType } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import type { GraphQLContext } from '@gymang/types';

import { nodeDefinitions } from './nodeDefinitions';

type Load = (context: GraphQLContext, id: string) => any;
type TypeLoaders = {
  [key: string]: {
    type: GraphQLObjectType;
    load: Load;
  };
};

export const getTypeRegister = () => {
  const typesLoaders: TypeLoaders = {};

  const getTypesLoaders = () => typesLoaders;

  const registerTypeLoader = (type: GraphQLObjectType, load: Load) => {
    typesLoaders[type.name] = {
      type,
      load,
    };

    return type;
  };

  const getType = (typename: string) => typesLoaders[typename]?.type;

  const getLoader = (typename: string) => typesLoaders[typename]?.loader;

  const idFetcher = (globalId, context: GraphQLContext) => {
    const { type, id } = fromGlobalId(globalId);

    const { load } = typesLoaders[type] || { load: null };

    return (load && load(context, id)) || null;
  };

  const typeResolver = (obj) => {
    // prefer __typename
    const objType = obj.__typename || obj.constructor.name;

    const { type } = typesLoaders[objType] || { type: null };

    return type?.name;
  };

  const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
    idFetcher,
    typeResolver,
  );

  return {
    registerTypeLoader,
    getTypesLoaders,
    getType,
    getLoader,
    nodeField,
    nodesField,
    nodeInterface,
    idFetcher,
    typeResolver,
  };
};
