import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from './errorHandler';
import User from '../models/User';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        roles: string[];
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token) as JWTPayload;

    // Verify user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw createError('User not found', HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', HTTP_STATUS.UNAUTHORIZED));
    } else if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(createError('Token expired', HTTP_STATUS.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

// Role-based access control middleware
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(createError('Insufficient permissions', HTTP_STATUS.FORBIDDEN));
    }

    next();
  };
};
