import { z } from 'zod';

export const createInspectionSchema = z.object({
  body: z.object({
    agreement: z.string().min(1),
    property: z.string().min(1),
    type: z.enum(['move_in', 'move_out', 'periodic']),
    inspection_date: z.string().datetime(),
    overall_condition: z.enum(['excellent', 'good', 'fair', 'poor']),
    issues: z
      .array(
        z.object({
          description: z.string(),
          severity: z.enum(['minor', 'moderate', 'major']),
          room: z.string(),
          photo_url: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const getInspectionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
