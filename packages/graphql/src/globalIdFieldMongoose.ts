import { globalIdField } from 'graphql-relay';

export const globalIdFieldMongoose = (type: string) =>
  globalIdField(type, ({ id, _id }) => id || _id);
