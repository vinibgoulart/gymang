import { graphql } from 'react-relay';

export const ExerciseAdd = graphql`
  mutation ExerciseAddMutation($input: ExerciseAddInput!) {
    ExerciseAdd(input: $input) {
      exercise {
        id
        name
      }
      error
      success
    }
  }
`;
