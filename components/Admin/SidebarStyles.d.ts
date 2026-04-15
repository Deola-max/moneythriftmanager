import { Link } from 'react-router-dom';

declare module './SidebarStyles' {
  interface NavItemProps {
    $isActive?: boolean;
  }

  export const SidebarContainer: any;
  export const SidebarHeader: any;
  export const SidebarNav: any;
  export const NavItem: any;
  export const NavLink: any;
  export const NavIcon: any;
  export const NavText: any;
  export const AdminSection: any;
  export const AdminLabel: any;
}
