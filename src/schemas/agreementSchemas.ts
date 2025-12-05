import { z } from 'zod';

export const createAgreementSchema = z.object({
  body: z.object({
    property: z.string().min(1),
    tenant: z.string().optional(),
    agreement_type: z.enum(['11_months', 'long_term']).optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    rent_amount: z.number().min(0),
    security_deposit: z.number().min(0),
    rent_payment_date: z.number().min(1).max(31).optional(),
    late_penalty_percentage: z.number().min(0).max(100).optional(),
    maintenance_terms: z
      .object({
        amount: z.number().min(0).optional(),
        frequency: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
        included_in_rent: z.boolean().optional(),
        paid_by: z.enum(['tenant', 'landlord']).optional(),
      })
      .optional(),
    lock_in_period: z.number().min(0).optional(),
    notice_period: z.number().min(0).optional(),
    rent_escalation: z
      .object({
        enabled: z.boolean().optional(),
        percentage: z.number().min(0).max(100).optional(),
        frequency_months: z.number().optional(),
      })
      .optional(),
    clauses: z
      .array(
        z.object({
          title: z.string(),
          content: z.string(),
          is_standard: z.boolean().optional(),
          ai_explanation: z.string().optional(),
          category: z.enum(['maintenance', 'payment', 'termination', 'usage', 'other']).optional(),
        })
      )
      .optional(),
  }),
});

export const signAgreementSchema = z.object({
  body: z.object({
    role: z.enum(['landlord', 'tenant']),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getAgreementSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
