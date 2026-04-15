import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { auth, requireRole } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deactivateUser,
  getUserStats,
} from '../controllers/adminController';
import {
  paginationValidation,
  userIdParamValidation,
  updateRoleValidation,
  dateRangeValidation,
} from '../middleware/validation';
import { AuthRequest } from '../types/express';

const router = Router();

// Helper to wrap async/await route handlers
const asyncHandler = (fn: RequestHandler) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Apply auth and admin role middleware to all routes
router.use(auth);
router.use(requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

// @route   GET api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get(
  '/dashboard/stats',
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getDashboardStats(req as unknown as AuthRequest, res, next)
  )
);

// @route   GET api/admin/users
// @desc    Get all users with pagination and search
// @access  Private/Admin
router.get(
  '/users',
  paginationValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getUsers(req as unknown as AuthRequest, res, next)
  )
);

// @route   PUT api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put(
  '/users/:id/role',
  userIdParamValidation,
  updateRoleValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    updateUserRole(req as unknown as AuthRequest, res, next)
  )
);

// @route   PUT api/admin/users/:id/deactivate
// @desc    Deactivate a user account
// @access  Private/Admin
router.put(
  '/users/:id/deactivate',
  userIdParamValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    deactivateUser(req as unknown as AuthRequest, res, next)
  )
);

// @route   GET api/admin/users/:id/stats
// @desc    Get statistics for a specific user
// @access  Private/Admin
router.get(
  '/users/:id/stats',
  userIdParamValidation,
  dateRangeValidation,
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    getUserStats(req as unknown as AuthRequest, res, next)
  )
);

export default router;
