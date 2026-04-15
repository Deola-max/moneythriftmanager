import { Request } from 'express';
import { UserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}
