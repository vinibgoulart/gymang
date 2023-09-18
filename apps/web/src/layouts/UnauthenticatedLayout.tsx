import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function UnauthenticatedLayout({ children }: Props) {
  return <>{children}</>;
}
