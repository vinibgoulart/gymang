import { Header } from '@gymang/ui';
import type { ReactNode } from 'react';
import { CgGym } from 'react-icons/cg';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';

import type { RootLayout_me$key } from '../../__generated__/RootLayout_me.graphql';
import type { RootLayoutWorkouts_query$key } from '../../__generated__/RootLayoutWorkouts_query.graphql';
import type { RootLayoutWorkoutsPaginationQuery } from '../../__generated__/RootLayoutWorkoutsPaginationQuery.graphql';

type RootLayoutProps = {
  children: ReactNode;
  workouts: RootLayoutWorkouts_query$key;
  me: RootLayout_me$key;
};

export function RootLayout({ children, ...props }: RootLayoutProps) {
  const { data } = usePaginationFragment<
    RootLayoutWorkoutsPaginationQuery,
    RootLayoutWorkouts_query$key
  >(
    graphql`
      fragment RootLayoutWorkouts_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 5 }
        after: { type: String }
      )
      @refetchable(queryName: "RootLayoutWorkoutsPaginationQuery") {
        myWorkouts(first: $first, after: $after)
          @connection(key: "WorkoutList_myWorkouts") {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    `,
    props.workouts,
  );

  const { myWorkouts } = data;

  const me = useFragment<RootLayout_me$key>(
    graphql`
      fragment RootLayout_me on User {
        firstName
      }
    `,
    props.me,
  );

  const getNavItems = () => {
    if (!myWorkouts.edges.length) {
      return {};
    }

    return {
      navItems: myWorkouts.edges.map((workout) => {
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
