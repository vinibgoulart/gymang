import type { NavItemProps } from './NavItem';
import { NavItem } from './NavItem';

type NavItemsProps = {
  navItems?: NavItemProps[];
};

export const NavItems = (props: NavItemsProps) => {
  if (!props.navItems?.length) {
    return null;
  }

  return props.navItems.map((link) => (
    <NavItem
      key={link.name}
      icon={link.icon}
      href={link.href}
      name={link.name}
    />
  ));
};
