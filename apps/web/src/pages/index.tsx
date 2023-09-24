import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import { usePreloadedQuery, type PreloadedQuery, graphql } from 'react-relay';

import type { pagesIndexQuery } from '../../__generated__/pagesIndexQuery.graphql';
import pagesIndexPreloadedQuery from '../../__generated__/pagesIndexQuery.graphql';
import { PageHeader } from '../components/PageHeader';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';

type HomeProps = {
  preloadedQueries: {
    home: PreloadedQuery<pagesIndexQuery>;
  };
};

const Home = (props: HomeProps) => {
  const query = usePreloadedQuery<pagesIndexQuery>(
    graphql`
      query pagesIndexQuery @preloadable {
        ...RootLayoutWorkouts_query
        me {
          ...RootLayout_me
        }
      }
    `,
    props.preloadedQueries.home,
  );

  const actions = (
    <>
      <ActionButton
        link="/workout/create"
        variant={'solid'}
        size={{ base: 'sm', md: 'md' }}
      >
        Adicionar treino
      </ActionButton>
    </>
  );

  return (
    <RootLayout me={query.me} workouts={query}>
      <PageHeader title="Bem vindo!" actions={actions} />
      Bem vindo
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        home: await getPreloadedQuery(
          pagesIndexPreloadedQuery,
          {
            first: 20,
            after: null,
          },
          context,
        ),
      },
    },
  };
};

export default Home;
