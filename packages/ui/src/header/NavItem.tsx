import type { FlexProps } from '@chakra-ui/react';
import { Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import type { IconType } from 'react-icons';

export type NavItemProps = FlexProps & {
  icon: IconType;
  name: string;
  href: string;
};

export const NavItem = ({ icon, name, href, ...rest }: NavItemProps) => {
  return (
    <Flex
      as={Link}
      href={href}
      align="center"
      p="4"
      mx="4"
      gap={2}
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'primary.main',
        color: 'white',
      }}
      {...rest}
    >
      {icon && (
        <Icon
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      {name}
    </Flex>
  );
};
