import React, { useState } from 'react';
import { PlanType } from '../../types';
import { Input, Select } from '../Common/Input';
import { Button } from '../Common/Button';
import { PLAN_TYPE_OPTIONS } from '../../constants';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

interface CreateSavingsPlanFormProps {
  onSubmit: (planName: string, planType: PlanType, targetAmount: number | null, maturityDate: string | null) => Promise<void>;
  onCancel: () => void;
}

export const CreateSavingsPlanForm: React.FC<CreateSavingsPlanFormProps> = ({ onSubmit, onCancel }) => {
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState<PlanType>(PlanType.NORMAL);
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [maturityDate, setMaturityDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AlertMessage | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let numTargetAmount: number | null = parseFloat(targetAmount);
    if (isNaN(numTargetAmount) || planType === PlanType.NORMAL) {
      numTargetAmount = null;
    }
    
    // Changed condition to be more explicit for type checker
    if ((planType === PlanType.LOCKED || planType === PlanType.EMERGENCY) && (numTargetAmount === null || numTargetAmount <=0) ) {
        setError({id: 'target-amount-req', type: 'error', message: 'Target amount is required and must be positive for Locked and Emergency plans.'});
        setIsLoading(false);
        return;
    }

    if (planType === PlanType.LOCKED && !maturityDate) {
        setError({id: 'maturity-date-req', type: 'error', message: 'Maturity date is required for Locked plans.'});
        setIsLoading(false);
        return;
    }
    if (planType === PlanType.LOCKED && maturityDate && new Date(maturityDate) <= new Date()) {
      setError({id: 'maturity-date-past', type: 'error', message: 'Maturity date must be in the future.'});
      setIsLoading(false);
      return;
    }


    try {
      await onSubmit(planName, planType, numTargetAmount, planType === PlanType.LOCKED ? maturityDate : null);
      // Form reset can be handled by parent closing the modal or navigating away
    } catch (err: any) {
      setError({id:'create-plan-error', type: 'error', message: err.message || "Failed to create plan."});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert alert={error} onDismiss={() => setError(null)} />}
      <Input
        label="Plan Name"
        type="text"
        name="planName"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
        required
        placeholder="e.g., Vacation Fund, New Car"
      />
      <Select
        label="Plan Type"
        name="planType"
        value={planType}
        onChange={(e) => setPlanType(e.target.value as PlanType)}
        options={PLAN_TYPE_OPTIONS}
        required
      />
      {(planType === PlanType.LOCKED || planType === PlanType.EMERGENCY) && (
        <Input
          label="Target Amount"
          type="number"
          name="targetAmount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          min="0.01"
          step="0.01"
          placeholder="e.g., 5000"
          required={planType !== PlanType.NORMAL}
        />
      )}
      {planType === PlanType.LOCKED && (
        <Input
          label="Maturity Date"
          type="date"
          name="maturityDate"
          value={maturityDate}
          onChange={(e) => setMaturityDate(e.target.value)}
          min={today}
          required={planType === PlanType.LOCKED}
        />
      )}
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create Plan
        </Button>
      </div>
    </form>
  );
};