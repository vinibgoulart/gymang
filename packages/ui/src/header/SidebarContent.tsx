import {
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { CgGym } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { NavItem } from "./NavItem";

type LinkItemProps = {
  name: string;
  icon: IconType;
};

type SidebarProps = BoxProps & {
  onClose: () => void;
};

const LinkItems: Array<LinkItemProps> = [{ name: "Treino A", icon: CgGym }];

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={"white"}
      borderRight="1px"
      borderRightColor={"neutral.main"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Stack spacing={1}>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
        <Divider />
        <NavItem icon={AiOutlinePlus}>Adicionar Treino</NavItem>
      </Stack>
    </Box>
  );
};
