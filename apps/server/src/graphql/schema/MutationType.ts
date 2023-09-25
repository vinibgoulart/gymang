import { GraphQLObjectType } from 'graphql';

import UserMutations from '../../modules/user/mutations';
import WorkoutMutations from '../../modules/workout/mutations';
import WorkoutSplitMutations from '../../modules/workoutSplit/mutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WorkoutMutations,
    ...WorkoutSplitMutations
  }),
});

export default MutationType;
