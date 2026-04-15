import { Request, Response } from 'express';
import Transaction, { ITransaction, TransactionType } from '../models/Transaction';
import SavingsPlan from '../models/SavingsPlan';

export const getTransactions = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, type, planId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const query: any = { user: req.user.id };
    
    if (type) {
      query.transactionType = type;
    }
    
    if (planId) {
      query.savingsPlan = planId;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate('savingsPlan', 'name');

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransaction = async (req: any, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('savingsPlan', 'name');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionSummary = async (req: any, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match: any = { user: req.user.id };
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate as string);
      if (endDate) match.createdAt.$lte = new Date(endDate as string);
    }

    const summary = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$transactionType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    // Convert to a more usable format
    const result = {
      deposit: { count: 0, totalAmount: 0 },
      withdrawal: { count: 0, totalAmount: 0 },
      transfer: { count: 0, totalAmount: 0 },
      interest: { count: 0, totalAmount: 0 },
      fee: { count: 0, totalAmount: 0 },
    };

    summary.forEach((item) => {
      result[item._id as keyof typeof result] = {
        count: item.count,
        totalAmount: item.totalAmount,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting transaction summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const transferFunds = async (req: any, res: Response) => {
  const { fromPlanId, toPlanId, amount, description = 'Transfer' } = req.body;

  if (fromPlanId === toPlanId) {
    return res.status(400).json({ message: 'Cannot transfer to the same plan' });
  }

  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    // Find both plans
    const fromPlan = await SavingsPlan.findOne({
      _id: fromPlanId,
      user: req.user.id,
      isActive: true,
    }).session(session);

    const toPlan = await SavingsPlan.findOne({
      _id: toPlanId,
      user: req.user.id,
      isActive: true,
    }).session(session);

    if (!fromPlan || !toPlan) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'One or both plans not found' });
    }

    // Check if sufficient balance in source plan
    if (fromPlan.currentAmount < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient funds for transfer' });
    }

    // Update balances
    fromPlan.currentAmount -= amount;
    toPlan.currentAmount += amount;

    // Save both plans
    await fromPlan.save({ session });
    await toPlan.save({ session });

    // Create withdrawal transaction
    const withdrawalTx = new Transaction({
      user: req.user.id,
      savingsPlan: fromPlan._id,
      amount,
      transactionType: 'transfer' as TransactionType,
      description: `Transfer to ${toPlan.name}: ${description}`,
      status: 'completed',
      metadata: { toPlanId: toPlan._id },
    });

    // Create deposit transaction
    const depositTx = new Transaction({
      user: req.user.id,
      savingsPlan: toPlan._id,
      amount,
      transactionType: 'transfer' as TransactionType,
      description: `Transfer from ${fromPlan.name}: ${description}`,
      status: 'completed',
      metadata: { fromPlanId: fromPlan._id },
    });

    await withdrawalTx.save({ session });
    await depositTx.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Transfer successful',
      fromPlan,
      toPlan,
      withdrawalTx,
      depositTx,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error transferring funds:', error);
    res.status(500).json({ message: 'Server error during transfer' });
  }
};
