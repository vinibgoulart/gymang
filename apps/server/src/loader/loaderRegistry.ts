import { ExerciseLoader } from '@gymang/exercise';
import { getLoaderRegistry } from '@gymang/graphql';
import { UserLoader } from '@gymang/user';
import { WorkoutLoader } from '@gymang/workout';
import { WorkoutSplitLoader } from '@gymang/workout-split';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);
registerLoader('WorkoutLoader', WorkoutLoader.getLoader);
registerLoader('WorkoutSplitLoader', WorkoutSplitLoader.getLoader);
registerLoader('ExerciseLoader', ExerciseLoader.getLoader);

export { getDataloaders, registerLoader };
