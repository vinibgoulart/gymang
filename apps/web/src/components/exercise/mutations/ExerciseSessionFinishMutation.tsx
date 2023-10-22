import { graphql } from 'react-relay';

export const ExerciseSessionFinish = graphql`
  mutation ExerciseSessionFinishMutation($input: ExerciseSessionFinishInput!) {
    ExerciseSessionFinish(input: $input) {
      exercise {
        id
        name
        series
        repetitions
        weight
        breakTime
        muscleGroup
        sessionInProgress {
          id
        }
        lastSession {
          finishedAt
          record
        }
        workoutSplit {
          recordInProgress {
            id
            createdAt
          }
          ...WorkoutSplitInProgressTime_workoutSplit
        }
      }
      error
      success
    }
  }
`;
