import type { IExercise } from '../ExerciseModel';

type GetLastSessionArgs = {
  exercise: IExercise;
};

export const getLastSession = ({ exercise }: GetLastSessionArgs) => {
  return exercise.sessions && [...exercise.sessions].pop();
};
