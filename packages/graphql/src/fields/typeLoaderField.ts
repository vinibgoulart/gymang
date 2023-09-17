import { GraphQLObjectType } from 'graphql';

type TypeLoaderField<Context> = {
  name: string;
  type: GraphQLObjectType;
  load: (context: Context, id: string) => any;
  field?: string;
};
export const typeLoaderField = <Context extends object>({
  name,
  type,
  load,
  field,
}: TypeLoaderField) => ({
  [name]: {
    type,
    resolve: (obj, _, context) => load(context, obj[field || name]),
  },
});
