import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import SavingsPlan, { ISavingsPlan, PlanType } from '../models/SavingsPlan';
import Transaction from '../models/Transaction';

export const createSavingsPlan = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, planType, targetAmount, maturityDate } = req.body;

  try {
    const newPlan = new SavingsPlan({
      user: req.user.id,
      name,
      planType,
      currentAmount: 0,
      targetAmount: planType !== 'regular' ? targetAmount : null,
      maturityDate: planType === 'fixed' ? maturityDate : null,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    console.error('Error creating savings plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavingsPlans = async (req: any, res: Response) => {
  try {
    const plans = await SavingsPlan.find({ user: req.user.id });
    res.json(plans);
  } catch (error) {
    console.error('Error getting savings plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavingsPlan = async (req: any, res: Response) => {
  try {
    const plan = await SavingsPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error getting savings plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSavingsPlan = async (req: any, res: Response) => {
  const { name, isActive } = req.body;

  try {
    let plan = await SavingsPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    if (name) plan.name = name;
    if (isActive !== undefined) plan.isActive = isActive;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating savings plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSavingsPlan = async (req: any, res: Response) => {
  try {
    const plan = await SavingsPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }

    // Check if plan has balance
    if (plan.currentAmount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete a savings plan with balance. Please withdraw all funds first.' 
      });
    }

    await plan.remove();
    res.json({ message: 'Savings plan removed' });
  } catch (error) {
    console.error('Error deleting savings plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const depositFunds = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, description = 'Deposit' } = req.body;

  try {
    const plan = await SavingsPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Active savings plan not found' });
    }

    // Update plan balance
    plan.currentAmount += amount;
    await plan.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      savingsPlan: plan._id,
      amount,
      transactionType: 'deposit',
      description,
      status: 'completed',
    });

    await transaction.save();

    res.status(201).json({
      plan,
      transaction,
      message: 'Deposit successful',
    });
  } catch (error) {
    console.error('Error depositing funds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawFunds = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, description = 'Withdrawal' } = req.body;

  try {
    const plan = await SavingsPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Active savings plan not found' });
    }

    // Check if sufficient balance
    if (plan.currentAmount < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update plan balance
    plan.currentAmount -= amount;
    await plan.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      savingsPlan: plan._id,
      amount,
      transactionType: 'withdrawal',
      description,
      status: 'completed',
    });

    await transaction.save();

    res.status(201).json({
      plan,
      transaction,
      message: 'Withdrawal successful',
    });
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
