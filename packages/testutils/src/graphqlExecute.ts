import type {
  ExecutionResult,
  GraphQLFieldResolver,
  GraphQLSchema,
  GraphQLTypeResolver,
  Source,
} from 'graphql';
import { graphql } from 'graphql';
import type { Maybe } from 'graphql/jsutils/Maybe';

type GraphQLArgs<V> = {
  schema: GraphQLSchema;
  source: string | Source;
  rootValue?: unknown;
  contextValue?: unknown;
  variableValues?: V;
  operationName?: Maybe<string>;
  fieldResolver?: Maybe<GraphQLFieldResolver<unknown, unknown>>;
  typeResolver?: Maybe<GraphQLTypeResolver<unknown, unknown>>;
};

type OperationType = {
  readonly variables: Record<string, unknown>;
  readonly response: unknown;
  readonly rawResponse?: unknown | undefined;
};

export const graphqlExecute = async <T extends OperationType>(
  args: GraphQLArgs<T['variables']>,
) => {
  const result = await graphql(args);

  return result as unknown as ExecutionResult<T['response']>;
};
