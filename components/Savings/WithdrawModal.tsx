
import React, { useState } from 'react';
import { SavingsPlan, PlanType } from '../../types';
import { Modal } from '../Common/Modal';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SavingsPlan | null;
  onWithdraw: (planId: string, amount: number, description?: string) => Promise<void>;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, plan, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AlertMessage | null>(null);

  if (!plan) return null;
  
  const isMatured = plan.planType === PlanType.LOCKED && plan.maturityDate && new Date(plan.maturityDate) <= new Date();
  const canWithdraw = plan.planType !== PlanType.LOCKED || (plan.planType === PlanType.LOCKED && isMatured);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canWithdraw) {
        setError({id:'withdraw-locked', type: 'error', message: 'Withdrawal is not allowed for this plan at this time.'});
        return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError({id:'invalid-amount', type: 'error', message: 'Please enter a valid positive amount.'});
      return;
    }
    if (withdrawAmount > plan.currentBalance) {
      setError({id:'insufficient-funds', type: 'error', message: 'Insufficient funds for this withdrawal.'});
      return;
    }

    setIsLoading(true);
    try {
      await onWithdraw(plan.id, withdrawAmount, description);
      setAmount('');
      setDescription('');
      onClose(); // Close modal on success
    } catch (err: any) {
      setError({id:'withdraw-error', type: 'error', message: err.message || 'Withdrawal failed.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Withdraw from ${plan.planName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert alert={error} onDismiss={() => setError(null)} />}
        <p className="text-sm text-gray-600">Current Balance: {formatCurrency(plan.currentBalance)}</p>
        <Input
          label="Amount"
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          max={plan.currentBalance.toString()}
          required
          placeholder="e.g., 50.00"
          disabled={!canWithdraw}
        />
        <Input
          label="Description (Optional)"
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Emergency expense"
          disabled={!canWithdraw}
        />
         {!canWithdraw && (
          <Alert alert={{id: 'locked-info', type: 'warning', message: 'This Locked Savings plan has not matured yet. Withdrawal is disabled.'}} />
        )}
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!canWithdraw || isLoading}>
            Withdraw
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">This is a simulated transaction. No real money will be moved.</p>
      </form>
    </Modal>
  );
};
