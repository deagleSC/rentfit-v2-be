import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    agreement: z.string().min(1),
    amount: z.number().min(0),
    type: z.enum(['rent', 'deposit', 'maintenance', 'penalty', 'refund', 'other']),
    description: z.string().optional(),
    due_date: z.string().datetime(),
    payment_method: z.enum(['upi', 'bank_transfer', 'cash', 'card', 'other']).optional(),
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'paid', 'overdue', 'failed', 'refunded']).optional(),
    payment_method: z.enum(['upi', 'bank_transfer', 'cash', 'card', 'other']).optional(),
    transaction_id: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    razorpay_signature: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
