import type { GraphQLResolveInfo } from 'graphql/type/definition';

export const getNodeInterfaceSelections = (info: GraphQLResolveInfo) => {
  try {
    return info.fieldNodes[0].selectionSet.selections
      .filter((selection) => selection.kind === 'InlineFragment')
      .map((selection) => selection.typeCondition.name.value);
  } catch (err) {
    // eslint-disable-next-line
    console.log('err: ', err);

    return [];
  }
};
