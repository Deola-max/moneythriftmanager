
import React, { useState } from 'react';
import { SavingsPlan } from '../../types';
import { Modal } from '../Common/Modal';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SavingsPlan | null;
  onDeposit: (planId: string, amount: number, description?: string) => Promise<void>;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, plan, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AlertMessage | null>(null);

  if (!plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError({id:'invalid-amount', type: 'error', message: 'Please enter a valid positive amount.'});
      return;
    }

    setIsLoading(true);
    try {
      await onDeposit(plan.id, depositAmount, description);
      setAmount('');
      setDescription('');
      onClose(); // Close modal on success
    } catch (err: any) {
      setError({id:'deposit-error', type: 'error', message: err.message || 'Deposit failed.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit to ${plan.planName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert alert={error} onDismiss={() => setError(null)} />}
        <Input
          label="Amount"
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
          placeholder="e.g., 100.00"
        />
        <Input
          label="Description (Optional)"
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Monthly savings"
        />
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Deposit
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">This is a simulated transaction. No real money will be moved.</p>
      </form>
    </Modal>
  );
};
