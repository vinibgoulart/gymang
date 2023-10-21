import type { SimpleGridProps } from '@chakra-ui/react';
import { SimpleGrid as _SimpleGrid } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & SimpleGridProps;

export const SimpleGrid = ({ children, ...props }: Props) => {
  return (
    <_SimpleGrid columns={[1, 1, 2, 3]} spacing={4} {...props}>
      {children}
    </_SimpleGrid>
  );
};
