import { Box, Flex, FlexProps, Icon } from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

type NavItemProps = FlexProps & {
  icon: IconType;
  children: ReactNode;
};

export const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
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
          bg: "primary.main",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};
