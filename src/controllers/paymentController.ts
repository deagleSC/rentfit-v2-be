import { Request, Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import Agreement from '../models/Agreement';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const paymentData = { ...req.body, payer: userId };

    // Verify agreement exists and user is tenant
    const agreement = await Agreement.findById(paymentData.agreement);
    if (!agreement) {
      throw createError('Agreement not found', HTTP_STATUS.NOT_FOUND);
    }
    if (agreement.tenant?.toString() !== userId) {
      throw createError('Unauthorized', HTTP_STATUS.FORBIDDEN);
    }

    paymentData.receiver = agreement.landlord;

    const payment = await Payment.create(paymentData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { agreement, status, type } = req.query;

    const filter: any = {
      $or: [{ payer: userId }, { receiver: userId }],
    };
    if (agreement) filter.agreement = agreement;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const payments = await Payment.find(filter)
      .populate('agreement')
      .populate('payer', 'name email')
      .populate('receiver', 'name email')
      .sort({ due_date: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const payment = await Payment.findOne({
      _id: id,
      $or: [{ payer: userId }, { receiver: userId }],
    })
      .populate('agreement')
      .populate('payer', 'name email')
      .populate('receiver', 'name email');

    if (!payment) {
      throw createError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const {
      status,
      payment_method,
      transaction_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const payment = await Payment.findOne({
      _id: id,
      $or: [{ payer: userId }, { receiver: userId }],
    });

    if (!payment) {
      throw createError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    // Update payment
    if (status) payment.status = status;
    if (payment_method) payment.payment_method = payment_method;
    if (transaction_id) payment.transaction_id = transaction_id;
    if (razorpay_order_id) payment.razorpay_order_id = razorpay_order_id;
    if (razorpay_payment_id) payment.razorpay_payment_id = razorpay_payment_id;
    if (razorpay_signature) payment.razorpay_signature = razorpay_signature;

    if (status === 'paid') {
      payment.paid_date = new Date();
    }

    await payment.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};
