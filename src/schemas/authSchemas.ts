import { z } from 'zod';

// Register schema
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roles: z.array(z.enum(['landlord', 'tenant', 'admin'])).optional(),
  }),
});

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Firebase authentication schema
export const firebaseAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Firebase ID token is required'),
  }),
});

// Update profile schema
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    image: z.string().url().optional(),
    landlord_profile: z
      .object({
        verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
        upi_id: z.string().optional(),
        pan_number: z.string().optional(),
        bank_details: z
          .object({
            account_number: z.string().optional(),
            ifsc_code: z.string().optional(),
            account_holder_name: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    tenant_profile: z
      .object({
        kyc_status: z.enum(['pending', 'verified', 'rejected']).optional(),
        current_employer: z.string().optional(),
        permanent_address: z.string().optional(),
        emergency_contact: z
          .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            relation: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
});

// Change password schema
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});
