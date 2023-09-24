import { graphql } from 'react-relay';

export const workoutListQuery = graphql`
  query WorkoutListQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    workouts(first: $first, last: $last, before: $before, after: $after)
      @connection(key: "WorkoutList_workouts") {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`;
