import {
  ButtonGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Children } from 'react';
import { FiChevronDown } from 'react-icons/fi';

import { IconActionButton } from './IconActionButton';

type MenuActionButtonProps = {
  actions: ReactNode;
};

export const MenuActionButton = (props: MenuActionButtonProps) => {
  if (!props.actions) {
    return null;
  }

  const actions = Children.toArray(props.actions.props.children);

  const mainButton = actions.pop();

  if (!mainButton) {
    return null;
  }

  const actionsSanitized = actions.map((action) => (
    <Text {...action.props}>{action.props.children}</Text>
  ));

  return (
    <Menu>
      <ButtonGroup isAttached size={{ base: 'sm', md: 'md' }}>
        {mainButton}
        <MenuButton>
          <IconActionButton aria-label="" icon={<FiChevronDown />} borderTopLeftRadius={0} borderBottomLeftRadius={0} />
        </MenuButton>
      </ButtonGroup>
      <MenuList>
        {actionsSanitized.map((action) => (
          <MenuItem>{action}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
