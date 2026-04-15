import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants';
import { Spinner } from '../Common/Spinner';
import { UserRole } from '../../types';

export const AdminRoute: React.FC = () => {
  const { currentUser, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: ROUTE_PATHS.ADMIN }} replace />;
  }

  // Check if user has admin role
  const isAdmin = hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  // Redirect to dashboard if not admin
  if (!isAdmin) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
