import { GraphQLResolveInfo } from 'graphql';

import graphqlFields from 'graphql-fields';

export const isInputAnInfo = (maybeInfo: any): boolean => {
  const typeofMaybeInfo = typeof maybeInfo;

  if (typeofMaybeInfo !== 'object') {
    return false;
  }

  return !!maybeInfo?.fieldNodes || !!maybeInfo?.fieldASTs;
};

export const getFieldsByInfo = (info: GraphQLResolveInfo) => {
  if (!isInputAnInfo(info)) {
    return {};
  }

  return graphqlFields(info);
};

export const infoHasField = (info: GraphQLResolveInfo, field: string) => {
  const stringifiedFields = JSON.stringify(getFieldsByInfo(info));
  return stringifiedFields.includes(field);
};

export const infoHasOneOfFields = (
  info: GraphQLResolveInfo,
  fields: string[],
) => {
  const stringifiedFields = JSON.stringify(getFieldsByInfo(info));
  return fields.reduce(
    (acc, field) => acc || stringifiedFields.includes(field),
    false,
  );
};

export const infoHasAllFields = (
  info: GraphQLResolveInfo,
  fields: string[],
) => {
  const stringifiedFields = JSON.stringify(getFieldsByInfo(info));
  return fields.reduce(
    (acc, field) => acc && stringifiedFields.includes(field),
    true,
  );
};
