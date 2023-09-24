import type {
  BoxProps} from '@chakra-ui/react';
import {
  Box,
  CloseButton,
  Divider,
  Flex,
  Stack,
} from '@chakra-ui/react';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgGym } from 'react-icons/cg';

import { NavItem } from './NavItem';

type LinkItemProps = {
  name: string;
  icon: IconType;
};

type SidebarProps = BoxProps & {
  onClose: () => void;
};

const LinkItems: Array<LinkItemProps> = [{ name: 'Treino A', icon: CgGym }];

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} href='#'>
            {link.name}
          </NavItem>
        ))}
        <Divider />
        <NavItem icon={AiOutlinePlus} href='/workout/create'>Adicionar Treino</NavItem>
      </Stack>
    </Box>
  );
};
