import { graphql } from 'react-relay';

export const WorkoutAdd = graphql`
  mutation WorkoutAddMutation($input: WorkoutAddInput!, $connections: [ID!]!) {
    WorkoutAdd(input: $input) {
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
