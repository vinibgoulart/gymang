import type { HeadingProps } from '@chakra-ui/react';
import { Heading, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  headingProps?: HeadingProps;
  action?: ReactNode;
};

export const Section = (props: Props) => {
  return (
    <Stack spacing={4}>
      <Stack direction={'row'} justify={'space-between'} align={'center'}>
        <Heading size={'md'} as={'h4'} {...props.headingProps}>
          {props.title}
        </Heading>
        {props.action}
      </Stack>
      {props.children}
    </Stack>
  );
};
