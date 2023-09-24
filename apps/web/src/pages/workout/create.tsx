import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import type { PreloadedQuery } from 'react-relay';

import type { UserMeQuery } from '../../../__generated__/UserMeQuery.graphql';
import UserMePreloadedQuery from '../../../__generated__/UserMeQuery.graphql';
import { PageHeader } from '../../components/PageHeader';
import { WorkoutAddForm } from '../../components/workout/WorkoutAddForm';
import { RootLayout } from '../../layouts/RootLayout';
import { getPreloadedQuery } from '../../relay/network';

type WorkoutCreateProps = {
  preloadedQueries: {
    me: PreloadedQuery<UserMeQuery>;
  };
};

const WorkoutCreate = () => {
  return <WorkoutAddForm />
};

WorkoutCreate.getLayout = function getLayout(
  page: ReactElement,
  props: WorkoutCreateProps,
) {
  return (
    <RootLayout query={props.preloadedQueries.me}>
      <PageHeader title="Adicionar treino" />
      {page}
    </RootLayout>
  );
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

export default WorkoutCreate;
