import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', registerValidation, (req, res, next) => {
  register(req, res, next).catch(next);
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, (req, res, next) => {
  login(req, res, next).catch(next);
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, (req, res, next) => {
  getCurrentUser(req as any, res, next).catch(next);
});

export default router;
