import { graphql } from 'react-relay';

export const userMeQuery = graphql`
  query UserMeQuery {
    me {
      firstName
      email
    }
  }
`;
