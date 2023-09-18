import { graphql } from 'react-relay';

export const UserAdd = graphql`
  mutation UserAddMutation($input: UserAddInput!) {
    UserAdd(input: $input) {
      user {
        id
      }
      error
      success
    }
  }
`;
