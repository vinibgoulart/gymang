import { GraphQLScalarType } from 'graphql';

export const GraphQLStringOrInt = new GraphQLScalarType({
  name: 'StringOrInt',
  description: 'A custom scalar that accepts both strings and integers',

  serialize(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    throw new Error('Value must be either a string or an integer');
  },

  parseValue(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    throw new Error('Value must be either a string or an integer');
  },

  parseLiteral(ast) {
    if (ast.kind === 'StringValue' || ast.kind === 'IntValue') {
      return ast.value;
    }

    throw new Error('Value must be either a string or an integer');
  },
});
