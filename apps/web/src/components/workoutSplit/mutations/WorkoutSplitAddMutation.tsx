import { graphql } from 'react-relay';

export const WorkoutSplitAdd = graphql`
  mutation WorkoutSplitAddMutation($input: WorkoutSplitAddInput!) {
    WorkoutSplitAdd(input: $input) {
      workoutSplit {
        id
        name
        modality
      }
      error
      success
    }
  }
`;
