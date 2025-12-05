import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    agreement: z.string().optional(),
    type: z.enum([
      'maintenance',
      'rent_receipt_issue',
      'agreement_renewal',
      'early_exit',
      'dispute',
      'payment_issue',
      'general',
    ]),
    title: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  }),
});

export const addMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    sender_type: z.enum(['user', 'ai', 'system']).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateTicketStatusSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed', 'escalated']),
    resolution_notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
