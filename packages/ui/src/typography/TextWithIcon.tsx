import type { TextProps } from '@chakra-ui/react';
import { HStack, Icon, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

type Props = {
  iconLeft?: IconType;
  iconRight?: IconType;
} & TextProps;

export const TextWithIcon = (props: Props) => {
  return (
    <HStack>
      {props.iconLeft && <Icon as={props.iconLeft} />}
      {props.children}
      {props.iconRight && <Icon as={props.iconRight} />}
    </HStack>
  );
};
