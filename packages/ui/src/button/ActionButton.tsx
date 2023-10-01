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
  const commonProps = {
    size: { base: 'sm', md: 'md' },
  };

  const getPropsByVariant = (variant = props.variant) => {
    if (variant === 'link') {
      return {
        color: 'primary.main',
      };
    }

    if (variant === 'outline') {
      return {
        borderColor: 'primary.main',
        color: 'primary.main',
        _hover: {
          boxShadow: 'md',
        },
      };
    }

    return {
      bgGradient: 'linear(to-r, primary.main, primary.dark)',
      color: 'white',
      _hover: {
        boxShadow: 'md',
      },
    };
  };

  if (link) {
    if (external) {
      return (
        <Button
          target="_blank"
          href={link}
          disableElevation
          {...commonProps}
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
        disableElevation
        {...getPropsByVariant()}
        {...commonProps}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button {...getPropsByVariant()} {...commonProps} {...props}>
      {children}
    </Button>
  );
};
