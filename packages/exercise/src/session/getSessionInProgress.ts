import type { IExercise } from '../ExerciseModel';

type GetSessionInProgressArgs = {
  exercise: IExercise;
};

export const getSessionInProgress = ({
  exercise,
}: GetSessionInProgressArgs) => {
  return exercise.sessions?.find(
    (session) => !session.finishedAt || session.finishedAt === null,
  );
};
