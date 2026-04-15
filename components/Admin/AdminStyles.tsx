import styled from 'styled-components';

// Use a simple approach with any to bypass TypeScript errors
const styledAny: any = styled;

type DivProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

export const AdminContainer = styledAny('div')<DivProps>`
  display: flex;
  flex: 1;
  background-color: #f5f7fa;
  margin-top: 64px; /* Height of the navbar */
  min-height: calc(100vh - 64px);
`;

export const MainContent = styledAny('main')<DivProps>`
  flex: 1;
  padding: 2rem;
  margin-left: 250px; /* Width of sidebar */
  transition: all 0.3s ease;
  width: calc(100% - 250px);
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
`;

export const ContentHeader = styledAny('div')<DivProps>`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  
  h1 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
    font-size: 1.5rem;
  }
  
  div {
    color: #718096;
    font-size: 0.95rem;
  }
`;

export const StatsContainer = styledAny('div')<DivProps>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styledAny('div')<DivProps>`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #718096;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  p {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
  }
`;

export const TableContainer = styledAny('div')<DivProps>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const Table = styledAny('table')<DivProps>`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
  }
  
  th {
    background-color: #f7fafc;
    color: #4a5568;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: #f8fafc;
  }
`;

export const Button = styledAny('button')<{ variant?: string } & DivProps>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  ${({ variant = 'primary' }) => 
    variant === 'primary' ? `
      background-color: #4299e1;
      color: white;
      &:hover {
        background-color: #3182ce;
      }
    ` : variant === 'danger' ? `
      background-color: #f56565;
      color: white;
      &:hover {
        background-color: #e53e3e;
      }
    ` : `
      background-color: transparent;
      color: #4a5568;
      border-color: #cbd5e0;
      &:hover {
        background-color: #f7fafc;
      }
    `
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styledAny('div')<DivProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #4a5568;

  &::after {
    content: '';
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #4299e1;
    animation: spin 1s linear infinite;
    margin-left: 0.5rem;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

export const ErrorMessage = styledAny('div')<DivProps>`
  background-color: #fff5f5;
  color: #c53030;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #f56565;
  margin: 1rem 0;
`;

export const SuccessMessage = styledAny('div')<DivProps>`
  background-color: #f0fff4;
  color: #2f855a;
  border-left-color: #48bb78;
`;
