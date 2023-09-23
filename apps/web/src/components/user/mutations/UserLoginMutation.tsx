import { graphql } from 'react-relay';

export const UserLogin = graphql`
  mutation UserLoginMutation($input: UserLoginInput!) {
    UserLogin(input: $input) {
      user {
        id
      }
      error
      success
    }
  }
`;
