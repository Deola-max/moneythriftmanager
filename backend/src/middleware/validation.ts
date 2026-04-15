import { body, param, query } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('fullName').not().isEmpty().withMessage('Full name is required'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'super_admin'])
    .withMessage('Invalid role'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
];

export const createSavingsPlanValidation = [
  body('name').not().isEmpty().withMessage('Plan name is required'),
  body('planType')
    .isIn(['regular', 'fixed', 'goal_oriented'])
    .withMessage('Invalid plan type'),
  body('targetAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Target amount must be greater than 0'),
  body('maturityDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value, { req }) => {
      if (req.body.planType === 'fixed' && !value) {
        throw new Error('Maturity date is required for fixed plans');
      }
      if (value && new Date(value) <= new Date()) {
        throw new Error('Maturity date must be in the future');
      }
      return true;
    }),
];

export const transactionValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description').optional().trim().escape(),
];

export const transferValidation = [
  body('fromPlanId').not().isEmpty().withMessage('Source plan ID is required'),
  body('toPlanId').not().isEmpty().withMessage('Destination plan ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description').optional().trim().escape(),
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('search').optional().trim().escape(),
];

export const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format. Use YYYY-MM-DD'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format. Use YYYY-MM-DD')
    .custom((endDate, { req }) => {
      if (req.query.startDate && endDate < req.query.startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
];

export const userIdParamValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
];

export const planIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid plan ID'),
];

export const transactionIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid transaction ID'),
];

export const updateUserRoleValidation = [
  body('role')
    .isIn(['user', 'admin', 'super_admin'])
    .withMessage('Invalid role'),
];
