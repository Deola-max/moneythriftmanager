import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import {
  createSavingsPlan,
  getSavingsPlans,
  getSavingsPlan,
  updateSavingsPlan,
  deleteSavingsPlan,
  depositFunds,
  withdrawFunds,
} from '../controllers/savingsPlanController';
import {
  createSavingsPlanValidation,
  transactionValidation,
  planIdParamValidation,
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

// @route   GET api/savings-plans
// @desc    Get all savings plans for the current user
// @access  Private
router.get('/', asyncHandler((req: Request, res: Response, next: NextFunction) => 
  getSavingsPlans(req as unknown as AuthRequest, res, next)
));

// @route   POST api/savings-plans
// @desc    Create a new savings plan
// @access  Private
router.post(
  '/', 
  createSavingsPlanValidation, 
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    createSavingsPlan(req as unknown as AuthRequest, res, next)
  )
);

// @route   GET api/savings-plans/:id
// @desc    Get a specific savings plan
// @access  Private
router.get(
  '/:id', 
  planIdParamValidation, 
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getSavingsPlan(req as unknown as AuthRequest, res, next)
  )
);

// @route   PUT api/savings-plans/:id
// @desc    Update a savings plan
// @access  Private
router.put(
  '/:id', 
  planIdParamValidation, 
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    updateSavingsPlan(req as unknown as AuthRequest, res, next)
  )
);

// @route   DELETE api/savings-plans/:id
// @desc    Delete a savings plan
// @access  Private
router.delete(
  '/:id', 
  planIdParamValidation, 
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    deleteSavingsPlan(req as unknown as AuthRequest, res, next)
  )
);

// @route   POST api/savings-plans/:id/deposit
// @desc    Deposit funds into a savings plan
// @access  Private
router.post(
  '/:id/deposit',
  planIdParamValidation,
  transactionValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    depositFunds(req as unknown as AuthRequest, res, next)
  )
);

// @route   POST api/savings-plans/:id/withdraw
// @desc    Withdraw funds from a savings plan
// @access  Private
router.post(
  '/:id/withdraw',
  planIdParamValidation,
  transactionValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    withdrawFunds(req as unknown as AuthRequest, res, next)
  )
);

export default router;
