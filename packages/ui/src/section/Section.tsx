import { Heading, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export const Section = (props: Props) => {
  return (
    <Stack spacing={4}>
      <Heading size={'md'} as={'h4'}>
        {props.title}
      </Heading>
      {props.children}
    </Stack>
  );
};
