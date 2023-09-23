import { graphql } from 'react-relay';

export const UserLogout = graphql`
  mutation UserLogoutMutation($input: UserLogoutInput!) {
    UserLogout(input: $input) {
      error
      success
    }
  }
`;
