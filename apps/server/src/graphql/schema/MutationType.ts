import { GraphQLObjectType } from 'graphql';

import UserMutations from '../../modules/user/mutations';
import WorkoutMutations from '../../modules/workout/mutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WorkoutMutations,
  }),
});

export default MutationType;
