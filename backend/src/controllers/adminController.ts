import { Request, Response } from 'express';
import User from '../models/User';
import SavingsPlan from '../models/SavingsPlan';
import Transaction from '../models/Transaction';

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    // Only super admins can access all stats
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [
      totalUsers,
      activeUsers,
      totalPlans,
      activePlans,
      totalDeposits,
      totalWithdrawals,
      recentTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      SavingsPlan.countDocuments(),
      SavingsPlan.countDocuments({ isActive: true }),
      Transaction.aggregate([
        { $match: { transactionType: 'deposit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { transactionType: 'withdrawal', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'email fullName')
        .populate('savingsPlan', 'name'),
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      plans: {
        total: totalPlans,
        active: activePlans,
      },
      transactions: {
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        recent: recentTransactions,
      },
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const query: any = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit as string)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Only super admins can update roles
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prevent modifying own role
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot modify your own role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deactivateUser = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;

    // Only admins can deactivate users
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prevent deactivating self
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Only super admins can deactivate other admins
    const targetUser = await User.findById(userId);
    if (targetUser?.role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized to deactivate admin accounts' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserStats = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;

    const [user, plans, transactions] = await Promise.all([
      User.findById(userId).select('-password'),
      SavingsPlan.find({ user: userId }),
      Transaction.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$transactionType',
            count: { $sum: 1 },
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      user,
      plans: {
        total: plans.length,
        active: plans.filter((p) => p.isActive).length,
        totalBalance: plans.reduce((sum, plan) => sum + plan.currentAmount, 0),
      },
      transactions: {
        deposits: 0,
        withdrawals: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
      },
    };

    // Process transaction stats
    transactions.forEach((t) => {
      if (t._id === 'deposit') {
        stats.transactions.deposits = t.count;
        stats.transactions.totalDeposits = t.total;
      } else if (t._id === 'withdrawal') {
        stats.transactions.withdrawals = t.count;
        stats.transactions.totalWithdrawals = t.total;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
