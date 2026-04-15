import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import AdminDashboard from '../../components/Admin/AdminDashboard';

const AdminPage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!isLoading) {
      const isAdmin = currentUser && 
        (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN);
      
      if (!isAdmin) {
        navigate('/');
      }
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Will be redirected by the effect
  }

  return <AdminDashboard />;
};

export default AdminPage;
