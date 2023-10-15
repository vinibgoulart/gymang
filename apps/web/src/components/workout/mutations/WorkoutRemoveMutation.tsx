import { graphql } from 'react-relay';

export const WorkoutRemove = graphql`
  mutation WorkoutRemoveMutation(
    $input: WorkoutRemoveInput!
    $connections: [ID!]!
  ) {
    WorkoutRemove(input: $input) {
      workout
        @prependNode(connections: $connections, edgeTypeName: "WorkoutEdge") {
        id
        name
      }
      error
      success
    }
  }
`;
