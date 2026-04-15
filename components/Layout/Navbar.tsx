
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME, ROUTE_PATHS } from '../../constants';
import { Button } from '../Common/Button';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to={ROUTE_PATHS.HOME} className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
              {APP_NAME}
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser ? (
              <>
                <span className="text-neutral text-sm sm:text-base hidden sm:block whitespace-nowrap">
                  Hi, {currentUser.fullName.split(' ')[0]}!
                </span>
                <Link to={ROUTE_PATHS.DASHBOARD} className="text-neutral hover:text-primary px-2 sm:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap">
                  Dashboard
                </Link>
                {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                  <Link 
                    to={ROUTE_PATHS.ADMIN} 
                    className="text-neutral hover:text-primary px-2 sm:px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap"
                  >
                    <span className="mr-1">👑</span> Admin
                  </Link>
                )}
                <Link to={ROUTE_PATHS.PROFILE} className="text-neutral hover:text-primary px-2 sm:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap">
                  Profile
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="whitespace-nowrap">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTE_PATHS.LOGIN} className="text-neutral hover:text-primary px-2 sm:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap">
                  Login
                </Link>
                <Link to={ROUTE_PATHS.REGISTER}>
                    <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
