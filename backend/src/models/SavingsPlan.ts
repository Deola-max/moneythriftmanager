import mongoose, { Document, Schema, Types } from 'mongoose';

export type PlanType = 'regular' | 'fixed' | 'goal_oriented';

export interface ISavingsPlan extends Document {
  user: Types.ObjectId;
  name: string;
  planType: PlanType;
  currentAmount: number;
  targetAmount: number | null;
  maturityDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const savingsPlanSchema = new Schema<ISavingsPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    planType: {
      type: String,
      enum: ['regular', 'fixed', 'goal_oriented'],
      required: true,
    },
    currentAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    targetAmount: {
      type: Number,
      min: 0,
    },
    maturityDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SavingsPlan = mongoose.model<ISavingsPlan>('SavingsPlan', savingsPlanSchema);
export default SavingsPlan;
