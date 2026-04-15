
import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { User, UserRole, AdminStats } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { getItem, setItem, removeItem } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, passwordHash: string) => Promise<User | null>;
  register: (fullName: string, email: string, passwordHash: string, role?: UserRole) => Promise<User | null>;
  logout: () => void;
  updateProfile: (userId: string, fullName: string) => Promise<User | null>;
  changePassword: (userId: string, currentPasswordHash: string, newPasswordHash: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<string | null>;
  resetPassword: (token: string, newPasswordHash: string) => Promise<boolean>;
  // Admin methods
  getAdminStats: () => Promise<AdminStats>;
  updateUserRole: (adminId: string, userId: string, role: UserRole) => Promise<User | null>;
  toggleUserStatus: (adminId: string, userId: string, isActive: boolean) => Promise<User | null>;
  searchUsers: (query: string, page?: number, limit?: number) => Promise<{ users: User[]; total: number }>;
  getUserById: (userId: string) => User | undefined;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsers = getItem<User[]>(LOCAL_STORAGE_KEYS.USERS) || [];
    setUsers(storedUsers);
    const currentUserId = getItem<string>(LOCAL_STORAGE_KEYS.CURRENT_USER_ID);
    if (currentUserId) {
      const user = storedUsers.find(u => u.id === currentUserId);
      setCurrentUser(user || null);
    }
    setIsLoading(false);
  }, []);

  const persistUsers = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
    setItem(LOCAL_STORAGE_KEYS.USERS, updatedUsers);
  }, []);

  const persistCurrentUser = useCallback((user: User | null) => {
    setCurrentUser(user);
    if (user) {
      setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, user.id);
    } else {
      removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, []);

  const login = useCallback(async (email: string, passwordHash: string): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.email === email && u.passwordHash === passwordHash);
    if (user) {
      persistCurrentUser(user);
      return user;
    }
    return null;
  }, [users, persistCurrentUser]);

  const register = useCallback(async (fullName: string, email: string, passwordHash: string, role: UserRole = UserRole.USER): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (users.some(u => u.email === email)) {
      throw new Error("User with this email already exists.");
    }
    const newUser: User = {
      id: generateId(),
      fullName,
      email,
      passwordHash, // In real app, hash this on backend
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    // If this is the first user, make them a super admin
    if (users.length === 0) {
      newUser.role = UserRole.SUPER_ADMIN;
    }
    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    persistCurrentUser(newUser); // Auto-login after registration
    return newUser;
  }, [users, persistUsers, persistCurrentUser]);

  const logout = useCallback(() => {
    persistCurrentUser(null);
  }, [persistCurrentUser]);

  const updateProfile = useCallback(async (userId: string, fullName: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      const updatedUser = { ...users[userIndex], fullName };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      persistUsers(updatedUsers);
      if (currentUser?.id === userId) {
        persistCurrentUser(updatedUser);
      }
      return updatedUser;
    }
    return null;
  }, [users, currentUser, persistUsers, persistCurrentUser]);

  const changePassword = useCallback(async (userId: string, currentPasswordHash: string, newPasswordHash: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.id === userId && u.passwordHash === currentPasswordHash);
    if (userIndex > -1) {
      const updatedUser = { ...users[userIndex], passwordHash: newPasswordHash };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      persistUsers(updatedUsers);
       if (currentUser?.id === userId) {
        persistCurrentUser(updatedUser); // Update current user if it's them
      }
      return true;
    }
    return false;
  }, [users, currentUser, persistUsers, persistCurrentUser]);

  const forgotPassword = useCallback(async (email: string): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      const token = generateId(); // Simulated token
      const expires = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour expiry
      const updatedUser = { ...users[userIndex], resetPasswordToken: token, resetPasswordExpires: expires };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      persistUsers(updatedUsers);
      console.log(`Simulated password reset email sent to ${email}. Token: ${token}`);
      return token;
    }
    return null;
  }, [users, persistUsers]);

  const resetPassword = useCallback(async (token: string, newPasswordHash: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.resetPasswordToken === token && u.resetPasswordExpires && new Date(u.resetPasswordExpires) > new Date());
    if (userIndex > -1) {
      const updatedUser = { 
        ...users[userIndex], 
        passwordHash: newPasswordHash, 
        resetPasswordToken: undefined, 
        resetPasswordExpires: undefined,
        lastLogin: new Date().toISOString()
      };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      persistUsers(updatedUsers);
      
      // Update current user if it's them
      if (currentUser?.id === updatedUser.id) {
        persistCurrentUser(updatedUser);
      }
      
      return true;
    }
    return false;
  }, [users, currentUser, persistUsers, persistCurrentUser]);

  const getUserById = useCallback((userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  }, [users]);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.includes(currentUser.role);
  }, [currentUser]);

  const getAdminStats = useCallback(async (): Promise<AdminStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate some stats
    const activeUsers = users.filter(u => u.isActive).length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return {
      totalUsers: users.length,
      activeUsers,
      totalSavings: 0, // This would come from your savings service
      totalTransactions: 0, // This would come from your transactions service
    };
  }, [users]);

  const updateUserRole = useCallback(async (adminId: string, userId: string, role: UserRole): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if admin has permission
    const admin = users.find(u => u.id === adminId);
    if (!admin || admin.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Unauthorized: Only super admins can change user roles');
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...users[userIndex], role };
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    persistUsers(updatedUsers);
    
    // Update current user if it's them
    if (currentUser?.id === userId) {
      persistCurrentUser(updatedUser);
    }
    
    return updatedUser;
  }, [users, currentUser, persistUsers, persistCurrentUser]);

  const toggleUserStatus = useCallback(async (adminId: string, userId: string, isActive: boolean): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if admin has permission
    const admin = users.find(u => u.id === adminId);
    if (!admin || (admin.role !== UserRole.ADMIN && admin.role !== UserRole.SUPER_ADMIN)) {
      throw new Error('Unauthorized: Only admins can change user status');
    }
    
    // Prevent admins from disabling other admins unless super admin
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.role === UserRole.ADMIN && admin.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Unauthorized: Only super admins can disable other admins');
    }
    
    // Prevent disabling super admins
    if (targetUser?.role === UserRole.SUPER_ADMIN) {
      throw new Error('Cannot disable a super admin');
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...users[userIndex], isActive };
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    persistUsers(updatedUsers);
    
    // Log out the user if they were deactivated
    if (!isActive && currentUser?.id === userId) {
      logout();
    }
    
    return updatedUser;
  }, [users, currentUser, persistUsers, logout]);

  const searchUsers = useCallback(async (query: string, page = 1, limit = 10): Promise<{ users: User[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const normalizedQuery = query.toLowerCase();
    const filteredUsers = users.filter(user => 
      user.email.toLowerCase().includes(normalizedQuery) || 
      user.fullName.toLowerCase().includes(normalizedQuery)
    );
    
    const start = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length
    };
  }, [users]);

  const value = {
    currentUser, 
    users, 
    isLoading, 
    login, 
    register, 
    logout, 
    updateProfile, 
    changePassword, 
    forgotPassword, 
    resetPassword,
    getAdminStats,
    updateUserRole,
    toggleUserStatus,
    searchUsers,
    getUserById,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
