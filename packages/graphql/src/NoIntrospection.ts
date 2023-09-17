import { ValidationContext } from 'graphql';

/**
 * No introspection: __schema and __type are disallowed in the query.
 */
export const NoIntrospection = (context: ValidationContext) => ({
  Field(node) {
    if (node.name.value === '__schema' || node.name.value === '__type') {
      context.reportError({
        message: 'Not allowed',
      });
    }
  },
});
