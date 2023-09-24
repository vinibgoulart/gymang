import { graphql } from 'react-relay';

export const WorkoutAdd = graphql`
  mutation WorkoutAddMutation($input: WorkoutAddInput!) {
    WorkoutAdd(input: $input) {
      workout {
        id
        name
        description
      }
      error
      success
    }
  }
`;
