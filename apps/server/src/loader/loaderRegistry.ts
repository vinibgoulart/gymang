import { getLoaderRegistry } from '@gymang/graphql';
import { UserLoader } from '@gymang/user';
import { WorkoutLoader } from '@gymang/workout';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);
registerLoader('WorkoutLoader', WorkoutLoader.getLoader);

export { getDataloaders, registerLoader };
