import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, AdminStats as AdminStatsType } from '../../types';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import Sidebar from './Sidebar';
import { ContentHeader, LoadingSpinner, ErrorMessage } from './AdminStyles';

const AdminDashboard: React.FC = () => {
  const { currentUser, isLoading, getAdminStats } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is admin or super admin
      const hasAdminAccess = currentUser && 
        (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN);
      
      if (!hasAdminAccess) {
        navigate('/');
      } else {
        setIsAuthorized(true);
        loadStats();
      }
    }
  }, [currentUser, isLoading, navigate]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const statsData = await getAdminStats() as AdminStatsType;
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner>Loading dashboard...</LoadingSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-4">
        <ErrorMessage>You do not have permission to access this page.</ErrorMessage>
      </div>
    );
  }

  const renderContent = () => {
    if (loadingStats) {
      return <LoadingSpinner>Loading dashboard...</LoadingSpinner>;
    }

    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    // Default stats if not loaded
    const defaultStats: AdminStatsType = {
      totalUsers: 0,
      activeUsers: 0,
      totalSavings: 0,
      totalTransactions: 0
    };

    // Use stats if available, otherwise use default stats
    const statsToUse = stats || defaultStats;

    switch (activeTab) {
      case 'dashboard':
        return <AdminStats stats={statsToUse} />;
      case 'users':
        return <UserManagement />;
      // Add more cases for other admin sections
      default:
        return <AdminStats stats={statsToUse} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100">
      <div className="flex flex-1">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isSuperAdmin={currentUser?.role === UserRole.SUPER_ADMIN} 
        />
        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 overflow-auto">
          <ContentHeader>
            <h1>Admin Dashboard</h1>
            <div>
              Welcome back, <strong>{currentUser?.fullName}</strong>
              {currentUser?.role === UserRole.SUPER_ADMIN && ' (Super Admin)'}
              {currentUser?.role === UserRole.ADMIN && ' (Admin)'}
            </div>
          </ContentHeader>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
