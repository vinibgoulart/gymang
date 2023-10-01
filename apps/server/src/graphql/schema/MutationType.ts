import { GraphQLObjectType } from 'graphql';

import ExerciseMutations from '../../modules/exercise/mutations';
import UserMutations from '../../modules/user/mutations';
import WorkoutMutations from '../../modules/workout/mutations';
import WorkoutSplitMutations from '../../modules/workoutSplit/mutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WorkoutMutations,
    ...WorkoutSplitMutations,
    ...ExerciseMutations,
  }),
});

export default MutationType;
