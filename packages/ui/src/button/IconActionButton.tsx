import type { IconButtonProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';

export const IconActionButton = (props: IconButtonProps) => {
  const commonProps = {
    size: { base: 'sm', md: 'md' },
    _hover: {
      boxShadow: 'md',
    },
  };

  const getPropsByVariant = (variant = props.variant) => {
    if (variant === 'outline') {
      return {
        borderColor: 'primary.main',
        color: 'primary.main',
      };
    }

    return {
      bgGradient: 'linear(to-r, primary.main, primary.dark)',
      color: 'white',
    };
  };

  return <IconButton {...getPropsByVariant()} {...commonProps} {...props} />;
};
