import { graphql } from 'react-relay';

export const WorkoutSplitRemove = graphql`
  mutation WorkoutSplitRemoveMutation(
    $input: WorkoutSplitRemoveInput!
    $connections: [ID!]!
  ) {
    WorkoutSplitRemove(input: $input) {
      workoutSplit
        @prependNode(
          connections: $connections
          edgeTypeName: "WorkoutSplitEdge"
        ) {
        id
      }
      error
      success
    }
  }
`;
