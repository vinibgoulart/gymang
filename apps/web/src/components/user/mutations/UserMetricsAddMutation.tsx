import { graphql } from 'react-relay';

export const UserMetricsAdd = graphql`
  mutation UserMetricsAddMutation($input: UserMetricsAddInput!) {
    UserMetricsAdd(input: $input) {
      user {
        id
        metrics(first: 20) {
          edges {
            node {
              weight
              height
              age
              fat
              imc
            }
          }
        }
      }
      error
      success
    }
  }
`;
