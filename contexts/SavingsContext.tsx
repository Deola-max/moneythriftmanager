
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SavingsPlan, Transaction, PlanType, TransactionType, User } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { getItem, setItem } from '../utils/localStorage';
import { generateId } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth'; // Corrected import

interface SavingsContextType {
  savingsPlans: SavingsPlan[];
  transactions: Transaction[];
  isLoading: boolean;
  createSavingsPlan: (planName: string, planType: PlanType, targetAmount: number | null, maturityDate: string | null) => Promise<SavingsPlan | null>;
  getPlansByCurrentUser: () => SavingsPlan[];
  getPlanById: (planId: string) => SavingsPlan | null;
  depositFunds: (planId: string, amount: number, description?: string) => Promise<Transaction | null>;
  withdrawFunds: (planId: string, amount: number, description?: string) => Promise<Transaction | null>;
  getTransactionsByPlanId: (planId: string) => Transaction[];
  getTransactionsByUserId: (userId: string) => Transaction[];
}

export const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

interface SavingsProviderProps {
  children: ReactNode;
}

export const SavingsProvider: React.FC<SavingsProviderProps> = ({ children }) => {
  const auth = useAuth(); // Correct usage of useAuth hook
  const currentUser = auth?.currentUser;

  const [savingsPlans, setSavingsPlans] = useState<SavingsPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPlans = getItem<SavingsPlan[]>(LOCAL_STORAGE_KEYS.SAVINGS_PLANS) || [];
    setSavingsPlans(storedPlans);
    const storedTransactions = getItem<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS) || [];
    setTransactions(storedTransactions);
    setIsLoading(false);
  }, []);
  
  const persistPlans = useCallback((updatedPlans: SavingsPlan[]) => {
    setSavingsPlans(updatedPlans);
    setItem(LOCAL_STORAGE_KEYS.SAVINGS_PLANS, updatedPlans);
  }, []);

  const persistTransactions = useCallback((updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
  }, []);

  const createSavingsPlan = useCallback(async (planName: string, planType: PlanType, targetAmount: number | null, maturityDate: string | null): Promise<SavingsPlan | null> => {
    if (!currentUser) return null;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const newPlan: SavingsPlan = {
      id: generateId(),
      userId: currentUser.id,
      planName,
      planType,
      targetAmount: planType === PlanType.NORMAL ? null : targetAmount,
      currentBalance: 0,
      maturityDate: planType === PlanType.LOCKED ? maturityDate : null,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    const updatedPlans = [...savingsPlans, newPlan];
    persistPlans(updatedPlans);
    return newPlan;
  }, [currentUser, savingsPlans, persistPlans]);
  
  const getPlansByCurrentUser = useCallback((): SavingsPlan[] => {
    if (!currentUser) return [];
    return savingsPlans.filter(plan => plan.userId === currentUser.id && plan.isActive);
  }, [currentUser, savingsPlans]);

  const getPlanById = useCallback((planId: string): SavingsPlan | null => {
    return savingsPlans.find(plan => plan.id === planId && plan.userId === currentUser?.id) || null;
  }, [savingsPlans, currentUser]);

  const depositFunds = useCallback(async (planId: string, amount: number, description?: string): Promise<Transaction | null> => {
    if (!currentUser) return null;
    const planIndex = savingsPlans.findIndex(p => p.id === planId && p.userId === currentUser.id);
    if (planIndex === -1 || amount <= 0) return null;

    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedPlans = [...savingsPlans];
    updatedPlans[planIndex].currentBalance += amount;
    persistPlans(updatedPlans);

    const newTransaction: Transaction = {
      id: generateId(),
      planId,
      userId: currentUser.id,
      transactionType: TransactionType.DEPOSIT,
      amount,
      transactionDate: new Date().toISOString(),
      description,
    };
    const updatedTransactions = [...transactions, newTransaction];
    persistTransactions(updatedTransactions);
    return newTransaction;
  }, [currentUser, savingsPlans, transactions, persistPlans, persistTransactions]);

  const withdrawFunds = useCallback(async (planId: string, amount: number, description?: string): Promise<Transaction | null> => {
    if (!currentUser) return null;
    const planIndex = savingsPlans.findIndex(p => p.id === planId && p.userId === currentUser.id);
    if (planIndex === -1 || amount <= 0) return null;

    const plan = savingsPlans[planIndex];
    if (plan.currentBalance < amount) {
      throw new Error("Insufficient funds.");
    }
    if (plan.planType === PlanType.LOCKED && plan.maturityDate && new Date(plan.maturityDate) > new Date()) {
      throw new Error("Locked savings plan has not matured yet.");
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedPlans = [...savingsPlans];
    updatedPlans[planIndex].currentBalance -= amount;
    persistPlans(updatedPlans);

    const newTransaction: Transaction = {
      id: generateId(),
      planId,
      userId: currentUser.id,
      transactionType: TransactionType.WITHDRAWAL,
      amount,
      transactionDate: new Date().toISOString(),
      description,
    };
    const updatedTransactions = [...transactions, newTransaction];
    persistTransactions(updatedTransactions);
    return newTransaction;
  }, [currentUser, savingsPlans, transactions, persistPlans, persistTransactions]);

  const getTransactionsByPlanId = useCallback((planId: string): Transaction[] => {
    if (!currentUser) return [];
    return transactions.filter(t => t.planId === planId && t.userId === currentUser.id).sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [currentUser, transactions]);
  
  const getTransactionsByUserId = useCallback((userId: string): Transaction[] => {
    if (!currentUser || currentUser.id !== userId) return [];
    return transactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [currentUser, transactions]);


  return (
    <SavingsContext.Provider value={{ 
      savingsPlans, 
      transactions, 
      isLoading, 
      createSavingsPlan, 
      getPlansByCurrentUser,
      getPlanById,
      depositFunds, 
      withdrawFunds, 
      getTransactionsByPlanId,
      getTransactionsByUserId
    }}>
      {children}
    </SavingsContext.Provider>
  );
};
