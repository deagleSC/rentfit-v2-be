import { Request, Response, NextFunction } from 'express';
import Ticket from '../models/Ticket';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const ticketData = { ...req.body, author: userId };

    const ticket = await Ticket.create(ticketData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status, type, agreement } = req.query;

    const filter: any = { author: userId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (agreement) filter.agreement = agreement;

    const tickets = await Ticket.find(filter)
      .populate('agreement')
      .populate('author', 'name email')
      .populate('assigned_to', 'name email')
      .sort({ created_at: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { tickets },
    });
  } catch (error) {
    next(error);
  }
};

export const getTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const ticket = await Ticket.findOne({
      _id: id,
      $or: [{ author: userId }, { assigned_to: userId }],
    })
      .populate('agreement')
      .populate('author', 'name email')
      .populate('assigned_to', 'name email')
      .populate('messages.sender_id', 'name email');

    if (!ticket) {
      throw createError('Ticket not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const { content, sender_type = 'user' } = req.body;

    const ticket = await Ticket.findOne({
      _id: id,
      $or: [{ author: userId }, { assigned_to: userId }],
    });

    if (!ticket) {
      throw createError('Ticket not found', HTTP_STATUS.NOT_FOUND);
    }

    ticket.messages.push({
      sender_id: userId,
      sender_type,
      content,
      timestamp: new Date(),
    });

    // Update status if it was closed
    if (ticket.status === 'closed') {
      ticket.status = 'open';
    }

    await ticket.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const { status, resolution_notes } = req.body;

    const ticket = await Ticket.findOne({
      _id: id,
      $or: [{ author: userId }, { assigned_to: userId }],
    });

    if (!ticket) {
      throw createError('Ticket not found', HTTP_STATUS.NOT_FOUND);
    }

    ticket.status = status;
    if (status === 'resolved' && resolution_notes) {
      ticket.resolved_at = new Date();
      ticket.resolved_by = userId;
      ticket.resolution_notes = resolution_notes;
    }

    await ticket.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};
