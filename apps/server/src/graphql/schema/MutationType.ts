import { GraphQLObjectType } from 'graphql';
import UserMutations from '../../modules/user/mutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
  }),
});

export default MutationType;
