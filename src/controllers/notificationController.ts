import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { is_read, type } = req.query;

    const filter: any = { user: userId };
    if (is_read !== undefined) filter.is_read = is_read === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter).sort({ created_at: -1 }).limit(50);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { is_read: true, read_at: new Date() },
      { new: true }
    );

    if (!notification) {
      throw createError('Notification not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    await Notification.updateMany(
      { user: userId, is_read: false },
      { is_read: true, read_at: new Date() }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};
