import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  link?: string;
  external?: boolean;
} & ButtonProps;

export const ActionButton = ({
  children,
  link,
  external = false,
  ...props
}: Props) => {
  const getColor = () => {
    if (props.variant === 'solid') {
      return {
        bgGradient: 'linear(to-r, primary.main, primary.dark)',
        color: 'white',
        _hover: {
          boxShadow: 'md',
        },
      };
    }

    if (props.variant === 'outline') {
      return {
        borderColor: 'primary.main',
        _hover: {
          boxShadow: 'md',
        },
      };
    }

    return {};
  };

  if (link) {
    if (external) {
      return (
        <Button
          target="_blank"
          href={link}
          color={'primary.main'}
          disableElevation
          {...props}
        >
          {children}
        </Button>
      );
    }

    return (
      <Button
        as={Link}
        variant={'link'}
        href={link}
        color={'primary.main'}
        disableElevation
        {...getColor()}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      bgGradient="linear(to-r, primary.main, primary.dark)"
      color={'white'}
      _hover={{
        boxShadow: 'md',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
