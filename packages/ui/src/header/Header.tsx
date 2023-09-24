import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { MobileNav } from './MobileNav';
import type { NavItemProps } from './NavItem';
import { SidebarContent } from './SidebarContent';

type Props = {
  children: ReactNode;
  name: string;
  navItems?: NavItemProps[];
};

export const Header = ({ children, name, navItems }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={'neutral.light'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        navItems={navItems}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} navItems={navItems} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} name={name} />
      <Box ml={{ base: 0, md: 60 }} p={{ base: 2, md: 4 }}>
        {children}
      </Box>
    </Box>
  );
};
