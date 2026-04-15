import React from 'react';
import { Link } from 'react-router-dom'; // Removed unused useNavigate
import { 
  SidebarContainer, 
  SidebarHeader, 
  SidebarNav, 
  NavItem, 
  NavLink, 
  NavIcon, 
  NavText,
  AdminSection,
  AdminLabel
} from './SidebarStyles';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSuperAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isSuperAdmin }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', text: 'Dashboard' },
    { id: 'users', icon: '👥', text: 'User Management' },
    { id: 'transactions', icon: '💸', text: 'Transactions' },
    { id: 'settings', icon: '⚙️', text: 'Settings' },
  ];

  // Only show admin-specific items to super admins
  const adminItems = isSuperAdmin
    ? [
        { id: 'admin', icon: '🔑', text: 'Admin Management' },
        { id: 'audit', icon: '📝', text: 'Audit Logs' },
      ]
    : [];

  return (
    <SidebarContainer>
      <SidebarHeader>Admin Panel</SidebarHeader>
      
      <SidebarNav>
        {navItems.map((item) => (
          <NavItem key={item.id} $isActive={activeTab === item.id}>
            <NavLink 
              to={`/admin/${item.id}`} 
              onClick={() => onTabChange(item.id)}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText>{item.text}</NavText>
            </NavLink>
          </NavItem>
        ))}
        
        {adminItems.length > 0 && (
          <>
            <AdminSection>
              <AdminLabel>Admin</AdminLabel>
              {adminItems.map((item) => (
                <NavItem key={item.id} $isActive={activeTab === item.id}>
                  <NavLink 
                    to={`/admin/${item.id}`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <NavIcon>{item.icon}</NavIcon>
                    <NavText>{item.text}</NavText>
                  </NavLink>
                </NavItem>
              ))}
            </AdminSection>
          </>
        )}
      </SidebarNav>
      
      <div style={{ padding: '1rem' }}>
        <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          ← Back to App
        </Link>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
