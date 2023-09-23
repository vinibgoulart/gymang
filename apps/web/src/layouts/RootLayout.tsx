import { Header } from '@gymang/ui';
import type { ReactNode } from 'react';
import type { PreloadedQuery} from 'react-relay';
import { usePreloadedQuery } from 'react-relay';

import type { UserMeQuery } from '../../__generated__/UserMeQuery.graphql';
import { userMeQuery } from '../components/user/UserMe';

type RootLayoutProps = {
  children: ReactNode;
  query: PreloadedQuery<UserMeQuery>;
};

export function RootLayout({ children, ...props }: RootLayoutProps) {
  const query = usePreloadedQuery(userMeQuery, props.query);
  const { me } = query;

  if (!me) return null;

  const { firstName } = me;

  return <Header name={firstName}>{children}</Header>;
}
