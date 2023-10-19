import { graphql } from 'react-relay';

export const ExerciseAdd = graphql`
  mutation ExerciseAddMutation(
    $input: ExerciseAddInput!
    $connections: [ID!]!
  ) {
    ExerciseAdd(input: $input) {
      exercise
        @prependNode(
          connections: $connections
          edgeTypeName: "ExerciseEdge"
        ) {
        id
        name
        series
        repetitions
        weight
        breakTime
        muscleGroup
        lastSession {
          finishedAt
        }
        sessionInProgress {
          id
        }
      }
      error
      success
    }
  }
`;
