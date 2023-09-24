import type { FlexProps} from '@chakra-ui/react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

type NavItemProps = FlexProps & {
  icon: IconType;
  children: ReactNode;
  href: string;
};

export const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <Box
      as={Link}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
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
        {children}
      </Flex>
    </Box>
  );
};
