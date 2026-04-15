import React from 'react';
import { AdminStats as AdminStatsType } from '../../types';
import { StatsContainer, StatCard, TableContainer, Table, Button } from './AdminStyles';

interface AdminStatsProps {
  stats: AdminStatsType;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Sample recent users for the table
  const recentUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active', lastLogin: '5 hours ago' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', lastLogin: '2 days ago' },
  ];

  return (
    <div>
      <h2>Overview</h2>
      <p className="text-gray-600 mb-6">Welcome to your admin dashboard. Here's what's happening with your application.</p>
      
      {/* Stats Cards */}
      <StatsContainer>
        <StatCard>
          <h3>Total Users</h3>
          <p>{formatNumber(stats.totalUsers)}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </StatCard>
        
        <StatCard>
          <h3>Active Users</h3>
          <p>{formatNumber(stats.activeUsers)}</p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </StatCard>
        
        <StatCard>
          <h3>Total Savings</h3>
          <p>${formatNumber(stats.totalSavings)}</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </StatCard>
        
        <StatCard>
          <h3>Transactions</h3>
          <p>{formatNumber(stats.totalTransactions)}</p>
          <p className="text-sm text-green-600 mt-1">+22% from last month</p>
        </StatCard>
      </StatsContainer>
      
      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2>Recent Users</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-gray-500">{user.lastLogin}</td>
                  <td>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-full">
            <span className="text-2xl mb-2">👤</span>
            <span>Add New User</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-full">
            <span className="text-2xl mb-2">📊</span>
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-full">
            <span className="text-2xl mb-2">⚙️</span>
            <span>Settings</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-full">
            <span className="text-2xl mb-2">📝</span>
            <span>View Logs</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
