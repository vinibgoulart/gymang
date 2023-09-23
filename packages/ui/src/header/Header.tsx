import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { MobileNav } from './MobileNav';
import { SidebarContent } from './SidebarContent';

type Props = {
  children: ReactNode;
  name: string;
};

export const Header = ({ children, name }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={'neutral.light'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} name={name} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};
