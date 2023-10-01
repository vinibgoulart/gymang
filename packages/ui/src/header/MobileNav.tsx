import type { FlexProps } from '@chakra-ui/react';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';
import { FiMenu, FiChevronDown } from 'react-icons/fi';

type MobileProps = FlexProps & {
  onOpen: () => void;
  name: string;
};

export const MobileNav = ({ onOpen, name, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={'white'}
      borderBottomWidth="1px"
      borderBottomColor={'neutral.main'}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Box display={{ base: 'flex', md: 'none' }}>
        <Image
          src="/data/images/logo.webp"
          alt="logo"
          width={100}
          height={50}
        />
      </Box>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  icon={<AiOutlineUser size={20}/>}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{name}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={'white'} borderColor={'neutral.main'}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem as={Link} href={'/logout'}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
