import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import admin from '../config/firebase';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

// Register user with email/password
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createError('User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      roles: roles || [],
      checkpoint: 'onboarding',
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          image: user.image,
          checkpoint: user.checkpoint,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login with email/password
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw createError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Check if user has password (not Firebase-only user)
    if (!user.password) {
      throw createError('Please sign in with Firebase', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          image: user.image,
          checkpoint: user.checkpoint,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Firebase Authentication - Verify ID token and create/update user
export const firebaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      throw createError('Firebase ID token is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(id_token);
    } catch (error) {
      throw createError('Invalid or expired Firebase token', HTTP_STATUS.UNAUTHORIZED);
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      throw createError('Email not found in Firebase token', HTTP_STATUS.BAD_REQUEST);
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update user with Firebase UID if not set
      if (!user.google_id) {
        user.google_id = uid;
      }
      // Update image if not set
      if (!user.image && picture) {
        user.image = picture;
      }
      // Update name if changed
      if (name && user.name !== name) {
        user.name = name;
      }
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        google_id: uid,
        image: picture,
        roles: [],
        checkpoint: 'onboarding',
      });
    }

    // Generate our JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          image: user.image,
          checkpoint: user.checkpoint,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const updateData = req.body;

    // Handle roles array separately if provided
    if (updateData.roles !== undefined) {
      // Validate roles array
      const validRoles = ['landlord', 'tenant', 'admin'];
      const roles = Array.isArray(updateData.roles)
        ? updateData.roles.filter((role: string) => validRoles.includes(role))
        : [];

      updateData.roles = roles;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user || !user.password) {
      throw createError('User not found or password not set', HTTP_STATUS.NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw createError('Current password is incorrect', HTTP_STATUS.BAD_REQUEST);
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
