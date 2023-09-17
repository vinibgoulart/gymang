import type { GraphQLObjectType } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import type { GraphQLResolveInfo } from 'graphql/type/definition';

import type { GraphQLContext } from '@gymang/types';

import { getNodeInterfaceSelections } from './getNodeInterfaceSelections';
import { nodeDefinitions } from './nodeDefinitions';

type Load = (context: GraphQLContext, id: string) => any;
type TypeLoaders = {
  [key: string]: {
    type: GraphQLObjectType;
    load: Load;
    checkInlineFragments: boolean;
  };
};

export const getTypeRegister = () => {
  const typesLoaders: TypeLoaders = {};

  const getTypesLoaders = () => typesLoaders;

  /**
   * checkInlineFragments will check the spread asked by user
   * it can resolve another type from a global id
   *
   * example
   *
   * node(id: "QrCode:_id) {
   *   ... on QrCodeAdmin {
   *     name
   *   }
   * }
   *
   * this enable QrCodeAdmin be resolve when type is QrCode
   */
  const registerTypeLoader = (
    type: GraphQLObjectType,
    load: Load,
    checkInlineFragments = false,
  ) => {
    typesLoaders[type.name] = {
      type,
      load,
      checkInlineFragments,
    };

    return type;
  };

  const getType = (typename: string) => typesLoaders[typename]?.type;

  const getLoader = (typename: string) => typesLoaders[typename]?.loader;

  const getLoadFromTypeOrInfo = (type: string, info: GraphQLResolveInfo) => {
    const defaultLoader = typesLoaders[type];

    if (!defaultLoader) {
      return {
        load: null,
      };
    }

    if (!defaultLoader.checkInlineFragments) {
      return defaultLoader;
    }

    const interfaceSelections = getNodeInterfaceSelections(info);

    if (interfaceSelections.length === 0) {
      return defaultLoader;
    }

    const sameAsType = interfaceSelections.find((i) => i === type);

    if (sameAsType) {
      return defaultLoader;
    }

    const anotherType = interfaceSelections[0];

    const inlineLoader = typesLoaders[anotherType];

    if (!inlineLoader) {
      return {
        load: null,
      };
    }

    return inlineLoader;
  };

  const idFetcher = (
    globalId: string,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => {
    const { type, id } = fromGlobalId(globalId);

    const loader = getLoadFromTypeOrInfo(type, info);
    const { load } = loader;

    return (load && load(context, id)) || null;
  };

  const getTypename = (obj) => {
    const tl = typesLoaders[obj.constructor.name];

    if (tl) {
      if (tl.checkInlineFragments) {
        const relatedTl = typesLoaders[obj.__typename];

        if (relatedTl) {
          return relatedTl.type;
        }

        return null;
      }

      return tl.type;
    }

    return null;
  };

  const typeResolver = (obj) => {
    const t = getTypename(obj);

    return t;
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
