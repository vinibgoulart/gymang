import { Header } from '@gymang/ui';
import type { ReactNode } from 'react';
import { CgGym } from 'react-icons/cg';
import {
  graphql,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
} from 'react-relay';

import type { RootLayout_me$key } from '../../__generated__/RootLayout_me.graphql';
import type { RootLayoutQuery } from '../../__generated__/RootLayoutQuery.graphql';
import type { RootLayoutWorkouts_query$key } from '../../__generated__/RootLayoutWorkouts_query.graphql';
import type { RootLayoutWorkoutsPaginationQuery } from '../../__generated__/RootLayoutWorkoutsPaginationQuery.graphql';

type RootLayoutProps = {
  children: ReactNode;
  fetchKey?: string;
};

export function RootLayout({ children, fetchKey }: RootLayoutProps) {
  const response = useLazyLoadQuery<RootLayoutQuery>(
    graphql`
      query RootLayoutQuery {
        ...RootLayoutWorkouts_query
        me {
          ...RootLayout_me
        }
      }
    `,
    {},
    {
      fetchKey,
      fetchPolicy: 'network-only',
    },
  );

  const { data } = usePaginationFragment<
    RootLayoutWorkoutsPaginationQuery,
    RootLayoutWorkouts_query$key
  >(
    graphql`
      fragment RootLayoutWorkouts_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 10 }
        after: { type: String }
      )
      @refetchable(queryName: "RootLayoutWorkoutsPaginationQuery") {
        meWorkouts(first: $first, after: $after)
          @connection(key: "WorkoutList_meWorkouts") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    response,
  );

  const { meWorkouts } = data;

  const me = useFragment<RootLayout_me$key>(
    graphql`
      fragment RootLayout_me on User {
        firstName
      }
    `,
    response.me,
  );

  const getNavItems = () => {
    if (!meWorkouts.edges.length) {
      return {};
    }

    return {
      navItems: meWorkouts.edges.map((workout) => {
        return {
          name: workout.node.name,
          icon: CgGym,
          href: `/workout/${workout.node.id}`,
        };
      }),
    };
  };

  return (
    <Header name={me?.firstName} {...getNavItems()}>
      {children}
    </Header>
  );
}
