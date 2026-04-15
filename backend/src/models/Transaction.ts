import mongoose, { Document, Schema, Types } from 'mongoose';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'interest' | 'fee';

export interface ITransaction extends Document {
  user: Types.ObjectId;
  savingsPlan: Types.ObjectId;
  amount: number;
  transactionType: TransactionType;
  description?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    savingsPlan: {
      type: Schema.Types.ObjectId,
      ref: 'SavingsPlan',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    transactionType: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'interest', 'fee'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reversed'],
      default: 'completed',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
transactionSchema.index({ user: 1, savingsPlan: 1, createdAt: -1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
