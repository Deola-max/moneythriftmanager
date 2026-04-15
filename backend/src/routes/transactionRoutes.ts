import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import {
  getTransactions,
  getTransaction,
  getTransactionSummary,
  transferFunds,
} from '../controllers/transactionController';
import {
  paginationValidation,
  dateRangeValidation,
  transactionIdParamValidation,
  transferValidation,
} from '../middleware/validation';
import { AuthRequest } from '../types/express';

const router = Router();

// Helper to wrap async/await route handlers
const asyncHandler = (fn: RequestHandler) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Apply auth middleware to all routes
router.use(auth);

// @route   GET api/transactions
// @desc    Get all transactions for the current user
// @access  Private
router.get(
  '/',
  paginationValidation,
  dateRangeValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getTransactions(req as unknown as AuthRequest, res, next)
  )
);

// @route   GET api/transactions/summary
// @desc    Get transaction summary for the current user
// @access  Private
router.get(
  '/summary',
  dateRangeValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getTransactionSummary(req as unknown as AuthRequest, res, next)
  )
);

// @route   GET api/transactions/:id
// @desc    Get a specific transaction
// @access  Private
router.get(
  '/:id',
  transactionIdParamValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getTransaction(req as unknown as AuthRequest, res, next)
  )
);

// @route   POST api/transactions/transfer
// @desc    Transfer funds between savings plans
// @access  Private
router.post(
  '/transfer',
  transferValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    transferFunds(req as unknown as AuthRequest, res, next)
  )
);

export default router;
