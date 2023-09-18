import { Header } from '@gymang/ui';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function RootLayout({ children }: Props) {
  return <Header>{children}</Header>;
}
