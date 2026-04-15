// Enums
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// Admin types
export interface AdminStatsData {
  totalUsers: number;
  activeUsers: number;
  totalSavings: number;
  totalTransactions: number;
  recentUsers?: Array<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    lastLogin?: string;
    createdAt: string;
  }>;
}

export interface AdminStats extends AdminStatsData {
  recentUsers?: Array<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    lastLogin?: string;
    createdAt: string;
  }>;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Savings types
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
