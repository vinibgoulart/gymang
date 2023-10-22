import { graphql } from 'react-relay';

export const ExerciseRemove = graphql`
  mutation ExerciseRemoveMutation(
    $input: ExerciseRemoveInput!
    $connections: [ID!]!
  ) {
    ExerciseRemove(input: $input) {
      deletedId @deleteEdge(connections: $connections)
      error
      success
    }
  }
`;
