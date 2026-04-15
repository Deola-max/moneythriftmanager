
import React from 'react';
import { SavingsPlan, PlanType } from '../../types';
import { formatDate, formatCurrency, calculateProgress } from '../../utils/helpers';
import { ProgressBar } from '../Common/ProgressBar';
import { Button } from '../Common/Button';

interface SavingsPlanCardProps {
  plan: SavingsPlan;
  onDeposit: (planId: string) => void;
  onWithdraw: (planId: string) => void;
  onViewTransactions: (planId: string) => void;
}

const PlanTypeColors: Record<PlanType, string> = {
  [PlanType.LOCKED]: 'border-blue-500',
  [PlanType.EMERGENCY]: 'border-red-500',
  [PlanType.NORMAL]: 'border-green-500',
};

const PlanTypeBadges: Record<PlanType, {text: string, color: string}> = {
  [PlanType.LOCKED]: { text: 'Locked', color: 'bg-blue-100 text-blue-800' },
  [PlanType.EMERGENCY]: { text: 'Emergency', color: 'bg-red-100 text-red-800' },
  [PlanType.NORMAL]: { text: 'Normal', color: 'bg-green-100 text-green-800' },
}

export const SavingsPlanCard: React.FC<SavingsPlanCardProps> = ({ plan, onDeposit, onWithdraw, onViewTransactions }) => {
  const progress = calculateProgress(plan.currentBalance, plan.targetAmount);
  const isMatured = plan.planType === PlanType.LOCKED && plan.maturityDate && new Date(plan.maturityDate) <= new Date();

  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 border-l-4 ${PlanTypeColors[plan.planType]}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{plan.planName}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${PlanTypeBadges[plan.planType].color}`}>
          {PlanTypeBadges[plan.planType].text}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-2xl font-bold text-primary">{formatCurrency(plan.currentBalance)}</p>
        {plan.targetAmount !== null && (
          <p className="text-sm text-gray-500">Target: {formatCurrency(plan.targetAmount)}</p>
        )}
         {plan.planType === PlanType.LOCKED && plan.maturityDate && (
          <p className={`text-sm ${isMatured ? 'text-success' : 'text-neutral'}`}>
            Maturity: {formatDate(plan.maturityDate)} {isMatured && "(Matured)"}
          </p>
        )}
      </div>

      {plan.targetAmount !== null && plan.targetAmount > 0 && (
        <div className="mb-4">
          <ProgressBar progress={progress} color={plan.planType === PlanType.LOCKED ? 'primary' : plan.planType === PlanType.EMERGENCY ? 'error' : 'success'} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button onClick={() => onDeposit(plan.id)} variant="primary" size="sm" className="flex-1">Deposit</Button>
        <Button 
          onClick={() => onWithdraw(plan.id)} 
          variant="ghost" 
          size="sm" 
          className="flex-1"
          disabled={plan.planType === PlanType.LOCKED && !isMatured && !!plan.maturityDate}
        >
          Withdraw
        </Button>
        <Button onClick={() => onViewTransactions(plan.id)} variant="ghost" size="sm" className="flex-1 text-neutral border-neutral hover:bg-gray-200">History</Button>
      </div>
      {plan.planType === PlanType.LOCKED && !isMatured && !!plan.maturityDate && (
        <p className="text-xs text-yellow-600 mt-2 text-center">Withdrawal locked until maturity.</p>
      )}
    </div>
  );
};
