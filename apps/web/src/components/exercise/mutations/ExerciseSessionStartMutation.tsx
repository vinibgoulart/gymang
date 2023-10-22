import { graphql } from 'react-relay';

export const ExerciseSessionStart = graphql`
  mutation ExerciseSessionStartMutation($input: ExerciseSessionStartInput!) {
    ExerciseSessionStart(input: $input) {
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
        }
        workoutSplit {
          ...WorkoutSplitInProgressTime_workoutSplit
        }
      }
      error
      success
    }
  }
`;
