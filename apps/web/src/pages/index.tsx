import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import type { PreloadedQuery } from 'react-relay';

import type {
  UserMeQuery,
} from '../../__generated__/UserMeQuery.graphql';
import UserMePreloadedQuery from '../../__generated__/UserMeQuery.graphql';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';


type HomeProps = {
  preloadedQueries: {
    me: PreloadedQuery<UserMeQuery>;
  };
};

const Home = () => {
  return <>Bem Vindo!</>;
};

Home.getLayout = function getLayout(page: ReactElement, props: HomeProps) {
  return <RootLayout query={props.preloadedQueries.me}>{page}</RootLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        me: await getPreloadedQuery(UserMePreloadedQuery, {}, context),
      },
    },
  };
};

export default Home;
