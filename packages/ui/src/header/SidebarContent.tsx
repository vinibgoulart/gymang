import type { BoxProps } from '@chakra-ui/react';
import { Box, CloseButton, Divider, Flex, Stack } from '@chakra-ui/react';
import Image from 'next/image';
import { AiOutlinePlus, AiOutlineHome } from 'react-icons/ai';

import type { NavItemProps } from './NavItem';
import { NavItem } from './NavItem';
import { NavItems } from './NavItems';

type SidebarProps = BoxProps & {
  onClose: () => void;
  navItems?: NavItemProps[];
};

export const SidebarContent = ({
  onClose,
  navItems,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={'white'}
      borderRight="1px"
      borderRightColor={'neutral.main'}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          src="/data/images/logo.webp"
          alt="logo"
          width={100}
          height={50}
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Stack spacing={1}>
      <NavItem
          icon={AiOutlineHome}
          href="/"
          name="Home"
        />
      <Divider />
        <NavItems navItems={navItems} />
        <NavItem
          icon={AiOutlinePlus}
          href="/workout/create"
          name="Adicionar Treino"
        />
      </Stack>
    </Box>
  );
};
