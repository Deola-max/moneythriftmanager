import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Use a simple approach with any to bypass TypeScript errors
const styledAny: any = styled;

interface StyledComponentProps {
  children?: React.ReactNode;
  className?: string;
  $isActive?: boolean;
  [key: string]: any;
}

export const SidebarContainer = styledAny('div')`
  width: 250px;
  background: #1a202c;
  color: #e2e8f0;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px; /* Height of the navbar */
  padding-top: 1rem;
  overflow-y: auto;
  z-index: 10;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    &.open {
      transform: translateX(0);
    }
  }
`;

export const SidebarHeader = styled.div<StyledComponentProps>`
  padding: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #2d3748;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  background: #1a202c;
  z-index: 1;
`;

export const SidebarNav = styledAny('nav')`
  padding: 0 1rem;
`;

export const NavItem = styledAny('div')<{ $isActive?: boolean }>`
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  background: ${(props: { $isActive?: boolean }) => props.$isActive ? '#2d3748' : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background: #2d3748;
  }
`;

export const NavLink = styledAny(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

export const NavIcon = styledAny('span')`
  margin-right: 0.75rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`;

export const NavText = styledAny('span')`
  font-weight: 500;
`;

export const AdminSection = styledAny('div')`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #2d3748;
`;

export const AdminLabel = styledAny('div')`
  padding: 0 1rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a0aec0;
`;
