import { User, UserRole } from '../types';

declare module '../contexts/AuthContext' {
  export interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'role'>, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    getAdminStats: () => Promise<{
      totalUsers: number;
      activeUsers: number;
      totalSavings: number;
      totalTransactions: number;
    }>;
    updateUserRole: (userId: string, role: UserRole) => Promise<void>;
    toggleUserStatus: (userId: string) => Promise<void>;
    searchUsers: (query: string) => Promise<User[]>;
  }

  export const useAuth: () => AuthContextType;
}
