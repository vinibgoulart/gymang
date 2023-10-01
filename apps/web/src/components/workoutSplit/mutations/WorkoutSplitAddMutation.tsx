import { graphql } from 'react-relay';

export const WorkoutSplitAdd = graphql`
  mutation WorkoutSplitAddMutation(
    $input: WorkoutSplitAddInput!
    $connections: [ID!]!
  ) {
    WorkoutSplitAdd(input: $input) {
      workoutSplit
        @prependNode(
          connections: $connections
          edgeTypeName: "WorkoutSplitEdge"
        ) {
        id
        name
        modality
      }
      error
      success
    }
  }
`;
