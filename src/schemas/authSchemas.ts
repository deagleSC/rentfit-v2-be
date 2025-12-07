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
    checkpoint: z.enum(['onboarding', 'complete']).optional(),
    landlord_profile: z
      .object({
        verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
        phone: z.string().optional(),
        alternate_phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        upi_id: z.string().optional(),
        pan_number: z.string().optional(),
        aadhaar_number: z.string().optional(),
        gst_number: z.string().optional(),
        company_name: z.string().optional(),
        company_registration_number: z.string().optional(),
        bank_details: z
          .object({
            account_number: z.string().optional(),
            ifsc_code: z.string().optional(),
            account_holder_name: z.string().optional(),
            bank_name: z.string().optional(),
            branch_name: z.string().optional(),
          })
          .optional(),
        documents: z
          .object({
            pan_document: z.string().url().optional(),
            aadhaar_document: z.string().url().optional(),
            bank_statement: z.string().url().optional(),
            gst_certificate: z.string().url().optional(),
          })
          .optional(),
      })
      .optional(),
    tenant_profile: z
      .object({
        kyc_status: z.enum(['pending', 'verified', 'rejected']).optional(),
        phone: z.string().optional(),
        alternate_phone: z.string().optional(),
        date_of_birth: z.union([z.string().datetime(), z.coerce.date()]).optional(),
        gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
        current_employer: z.string().optional(),
        job_title: z.string().optional(),
        employment_type: z
          .enum(['full_time', 'part_time', 'contract', 'self_employed', 'unemployed', 'student'])
          .optional(),
        monthly_income: z.number().positive().optional(),
        permanent_address: z.string().optional(),
        current_address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        pan_number: z.string().optional(),
        aadhaar_number: z.string().optional(),
        emergency_contact: z
          .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            relation: z.string().optional(),
            email: z.string().email().optional(),
          })
          .optional(),
        previous_landlord_contact: z
          .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().email().optional(),
          })
          .optional(),
        employer_contact: z
          .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().email().optional(),
            designation: z.string().optional(),
          })
          .optional(),
        documents: z
          .object({
            pan_document: z.string().url().optional(),
            aadhaar_document: z.string().url().optional(),
            employment_letter_document: z.string().url().optional(),
            salary_slip: z.string().url().optional(),
            previous_rent_agreement: z.string().url().optional(),
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
