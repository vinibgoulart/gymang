import { Theme } from '@gymang/ui';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return <Theme>{children}</Theme>;
}
