import { graphql } from 'react-relay';

export const WorkoutRemove = graphql`
  mutation WorkoutRemoveMutation(
    $input: WorkoutRemoveInput!
    $connections: [ID!]!
  ) {
    WorkoutRemove(input: $input) {
      deletedId @deleteEdge(connections: $connections)
      error
      success
    }
  }
`;
