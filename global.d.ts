// Global type declarations for styled-components
declare module 'styled-components' {
  export interface DefaultTheme {
    // Add your theme types here if needed
  }
}

// Declare modules for admin components using @/ prefix
declare module '@/components/Admin/AdminStyles' {
  export const AdminContainer: any;
  export const MainContent: any;
  export const ContentHeader: any;
  export const StatsContainer: any;
  export const StatCard: any;
  export const TableContainer: any;
  export const Table: any;
  export const Button: any;
  export const LoadingSpinner: any;
  export const ErrorMessage: any;
  export const SuccessMessage: any;
}

declare module '@/components/Admin/SidebarStyles' {
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

// Declare modules for admin components
declare module '@/components/Admin/AdminStats' {
  import { FC } from 'react';
  import { AdminStats as AdminStatsType } from 'types';
  
  interface AdminStatsProps {
    stats: AdminStatsType;
  }
  
  const AdminStats: FC<AdminStatsProps>;
  export default AdminStats;
}

declare module '@/components/Admin/UserManagement' {
  import { FC } from 'react';
  
  const UserManagement: FC;
  export default UserManagement;
}

declare module '@/components/Admin/Sidebar' {
  import { FC } from 'react';
  
  interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isSuperAdmin: boolean;
  }
  
  const Sidebar: FC<SidebarProps>;
  export default Sidebar;
}

declare module '@/components/Admin/AdminDashboard' {
  import { FC } from 'react';
  
  const AdminDashboard: FC;
  export default AdminDashboard;
}
