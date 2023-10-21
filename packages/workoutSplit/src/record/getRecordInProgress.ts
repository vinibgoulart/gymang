import type { IWorkoutSplit } from '../WorkoutSplitModel';

type GetRecordInProgressArgs = {
  workoutSplit: IWorkoutSplit;
};

export const getRecordInProgress = ({
  workoutSplit,
}: GetRecordInProgressArgs) => {
  return workoutSplit.records?.find(
    (record) => !record.finishedAt || record.finishedAt === null,
  );
};
