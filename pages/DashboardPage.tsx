
import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { useSavings } from '../hooks/useSavings';
import { SavingsPlanCard } from '../components/Savings/SavingsPlanCard';
import { Button } from '../components/Common/Button';
import { Modal } from '../components/Common/Modal';
import { CreateSavingsPlanForm } from '../components/Savings/CreateSavingsPlanForm';
import { DepositModal } from '../components/Savings/DepositModal';
import { WithdrawModal } from '../components/Savings/WithdrawModal';
import { TransactionList } from '../components/Savings/TransactionList';
import { SavingsPlan as SavingsPlanType, PlanType, Transaction, AlertMessage } from '../types';
import { Spinner } from '../components/Common/Spinner';
import { Alert } from '../components/Common/Alert';
import { formatCurrency } from '../utils/helpers';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    getPlansByCurrentUser, 
    createSavingsPlan, 
    depositFunds, 
    withdrawFunds, 
    getTransactionsByPlanId,
    getPlanById,
    isLoading: savingsLoading 
  } = useSavings();

  const [userPlans, setUserPlans] = useState<SavingsPlanType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlanType | null>(null);
  const [planTransactions, setPlanTransactions] = useState<Transaction[]>([]);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const fetchUserPlans = useCallback(() => {
    const plans = getPlansByCurrentUser();
    setUserPlans(plans);
  }, [getPlansByCurrentUser]);

  useEffect(() => {
    fetchUserPlans();
  }, [fetchUserPlans, currentUser]); // Re-fetch if currentUser changes (e.g. after login)

  const handleCreatePlan = async (planName: string, planType: PlanType, targetAmount: number | null, maturityDate: string | null) => {
    try {
      await createSavingsPlan(planName, planType, targetAmount, maturityDate);
      fetchUserPlans(); // Refresh list
      setIsCreateModalOpen(false);
      setAlert({id: Date.now().toString(), type: 'success', message: 'Savings plan created successfully!'});
    } catch (error: any) {
      console.error("Failed to create plan:", error);
      setAlert({id: Date.now().toString(), type: 'error', message: error.message || 'Failed to create plan.'});
      throw error; // rethrow to keep form error handling
    }
  };
  
  const openDepositModal = (planId: string) => {
    const plan = getPlanById(planId);
    setSelectedPlan(plan);
    setIsDepositModalOpen(true);
  };

  const openWithdrawModal = (planId: string) => {
    const plan = getPlanById(planId);
    setSelectedPlan(plan);
    setIsWithdrawModalOpen(true);
  };

  const openTransactionsModal = (planId: string) => {
    const plan = getPlanById(planId);
    setSelectedPlan(plan);
    setPlanTransactions(getTransactionsByPlanId(planId));
    setIsTransactionsModalOpen(true);
  };

  const handleDeposit = async (planId: string, amount: number, description?: string) => {
    try {
      await depositFunds(planId, amount, description);
      fetchUserPlans(); // Refresh plans to show updated balance
      setAlert({id: Date.now().toString(), type: 'success', message: 'Deposit successful!'});
    } catch (error: any) {
      console.error("Deposit failed:", error);
      setAlert({id: Date.now().toString(), type: 'error', message: error.message || 'Deposit failed.'});
      throw error;
    }
  };

  const handleWithdraw = async (planId: string, amount: number, description?: string) => {
     try {
      await withdrawFunds(planId, amount, description);
      fetchUserPlans(); // Refresh plans
      setAlert({id: Date.now().toString(), type: 'success', message: 'Withdrawal successful!'});
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      setAlert({id: Date.now().toString(), type: 'error', message: error.message || 'Withdrawal failed.'});
      throw error;
    }
  };
  
  const totalBalance = userPlans.reduce((sum, plan) => sum + plan.currentBalance, 0);

  if (savingsLoading) {
    return <PageContainer title="Dashboard"><Spinner size="lg" /></PageContainer>;
  }

  return (
    <PageContainer title={`Welcome, ${currentUser?.fullName?.split(' ')[0]}!`}>
      {alert && <Alert alert={alert} onDismiss={() => setAlert(null)} />}
      <div className="mb-6 p-6 bg-gradient-to-r from-primary/80 to-secondary/80 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Total Savings Balance</h2>
        <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Savings Plans</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Plan
        </Button>
      </div>

      {userPlans.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <img src="https://picsum.photos/seed/emptybox/150/150" alt="Empty state" className="mx-auto mb-4 opacity-70" />
          <p className="text-gray-500 text-lg mb-2">You don't have any savings plans yet.</p>
          <p className="text-gray-500 mb-4">Start by creating a new plan!</p>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="secondary">Create Your First Plan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPlans.map((plan) => (
            <SavingsPlanCard 
              key={plan.id} 
              plan={plan} 
              onDeposit={openDepositModal}
              onWithdraw={openWithdrawModal}
              onViewTransactions={openTransactionsModal}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Savings Plan">
        <CreateSavingsPlanForm 
            onSubmit={handleCreatePlan} 
            onCancel={() => setIsCreateModalOpen(false)} 
        />
      </Modal>

      {selectedPlan && (
        <>
          <DepositModal 
            isOpen={isDepositModalOpen} 
            onClose={() => setIsDepositModalOpen(false)}
            plan={selectedPlan}
            onDeposit={handleDeposit}
          />
          <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            plan={selectedPlan}
            onWithdraw={handleWithdraw}
          />
          <Modal 
            isOpen={isTransactionsModalOpen} 
            onClose={() => setIsTransactionsModalOpen(false)} 
            title={`Transactions for ${selectedPlan.planName}`}
            size="lg"
          >
            <TransactionList transactions={planTransactions} />
          </Modal>
        </>
      )}
    </PageContainer>
  );
};
