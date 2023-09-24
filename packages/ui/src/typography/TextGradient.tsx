import { Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface TextGradientProps {
  children: ReactNode;
}

export function TextGradient({ children }: TextGradientProps) {
  return (
    <Text
      as="span"
      bgClip="text"
      bgGradient="linear(to-r, primary.main, primary.dark)"
    >
      {children}
    </Text>
  );
}
