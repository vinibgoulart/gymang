import type { CardProps } from '@chakra-ui/react';
import { Card as _Card } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & CardProps;

export const Card = ({ children, ...props }: Props) => {
  const getProps = () => {
    if (props.onClick) {
      return {
        cursor: 'pointer',
        _hover: {
          boxShadow: 'md',
        },
      };
    }

    return {};
  };

  return (
    <_Card bg={'neutral.light'} rounded={'xl'} p={6} {...getProps()} {...props}>
      {children}
    </_Card>
  );
};
