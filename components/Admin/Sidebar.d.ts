interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSuperAdmin: boolean;
}

declare const Sidebar: React.FC<SidebarProps>;

export default Sidebar;
