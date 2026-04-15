
export enum PlanType {
  LOCKED = 'LOCKED',
  EMERGENCY = 'EMERGENCY',
  NORMAL = 'NORMAL',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hash. Stored as plain text for simulation.
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
}

export interface SavingsPlan {
  id: string;
  userId: string;
  planName: string;
  planType: PlanType;
  targetAmount: number | null;
  currentBalance: number;
  maturityDate: string | null; // ISO date string
  createdAt: string; // ISO date string
  isActive: boolean;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface Transaction {
  id: string;
  planId: string;
  userId: string;
  transactionType: TransactionType;
  amount: number;
  transactionDate: string; // ISO date string
  description?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSavings: number;
  totalTransactions: number;
}

export interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
