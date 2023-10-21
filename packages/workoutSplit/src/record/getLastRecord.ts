import type { IWorkoutSplit } from '../WorkoutSplitModel';

type GetLastRecordArgs = {
  workoutSplit: IWorkoutSplit;
};

export const getLastRecord = ({ workoutSplit }: GetLastRecordArgs) => {
  return [...workoutSplit.records].pop();
};
