import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to verify JWT token
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string; role: string } };
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check for admin role
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    next();
  };
};

// Middleware to check for admin role
export const adminAuth = [
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  },
];

// Middleware to check for super admin role
export const superAdminAuth = [
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ msg: 'Super admin access required' });
    }
    next();
  },
];
