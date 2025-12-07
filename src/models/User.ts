import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Hashed password, optional for Google OAuth users
  image?: string;
  google_id?: string;
  roles: ('landlord' | 'tenant' | 'admin')[];
  checkpoint: 'onboarding' | 'complete';

  landlord_profile?: {
    verification_status: 'pending' | 'verified' | 'rejected';
    phone?: string;
    alternate_phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    upi_id?: string;
    pan_number?: string; // For TDS compliance
    aadhaar_number?: string;
    gst_number?: string; // For business landlords
    company_name?: string;
    company_registration_number?: string;
    bank_details?: {
      account_number?: string;
      ifsc_code?: string;
      account_holder_name?: string;
      bank_name?: string;
      branch_name?: string;
    };
    documents?: {
      pan_document?: string; // Cloudinary URL
      aadhaar_document?: string; // Cloudinary URL
      bank_statement?: string; // Cloudinary URL
      gst_certificate?: string; // Cloudinary URL
    };
  };

  tenant_profile?: {
    kyc_status: 'pending' | 'verified' | 'rejected';
    phone?: string;
    alternate_phone?: string;
    date_of_birth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    current_employer?: string;
    job_title?: string;
    employment_type?:
      | 'full_time'
      | 'part_time'
      | 'contract'
      | 'self_employed'
      | 'unemployed'
      | 'student';
    monthly_income?: number;
    permanent_address?: string;
    current_address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    pan_number?: string;
    aadhaar_number?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
      relation?: string;
      email?: string;
    };
    previous_landlord_contact?: {
      name?: string;
      phone?: string;
      email?: string;
    };
    employer_contact?: {
      name?: string;
      phone?: string;
      email?: string;
      designation?: string;
    };
    documents?: {
      pan_document?: string; // Cloudinary URL
      aadhaar_document?: string; // Cloudinary URL
      employment_letter_document?: string; // Cloudinary URL
      salary_slip?: string; // Cloudinary URL
      previous_rent_agreement?: string; // Cloudinary URL
    };
  };

  // Subscription tracking (for future monetization)
  subscription?: {
    plan_type: 'free' | 'basic' | 'premium';
    expires_at?: Date;
    payment_method?: string;
  };

  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false }, // Don't return password by default
    image: String,
    google_id: { type: String, sparse: true, unique: true },
    roles: {
      type: [String],
      enum: ['landlord', 'tenant', 'admin'],
      default: [],
    },
    checkpoint: {
      type: String,
      enum: ['onboarding', 'complete'],
      default: 'onboarding',
    },

    landlord_profile: {
      verification_status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
      phone: { type: String, trim: true },
      alternate_phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      upi_id: { type: String, trim: true },
      pan_number: { type: String, uppercase: true, trim: true },
      aadhaar_number: { type: String, trim: true },
      gst_number: { type: String, uppercase: true, trim: true },
      company_name: { type: String, trim: true },
      company_registration_number: { type: String, trim: true },
      bank_details: {
        account_number: String,
        ifsc_code: { type: String, uppercase: true },
        account_holder_name: String,
        bank_name: String,
        branch_name: String,
      },
      documents: {
        pan_document: String, // Cloudinary URL
        aadhaar_document: String, // Cloudinary URL
        bank_statement: String, // Cloudinary URL
        gst_certificate: String, // Cloudinary URL
      },
    },

    tenant_profile: {
      kyc_status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
      phone: { type: String, trim: true },
      alternate_phone: { type: String, trim: true },
      date_of_birth: Date,
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      },
      current_employer: String,
      job_title: { type: String, trim: true },
      employment_type: {
        type: String,
        enum: ['full_time', 'part_time', 'contract', 'self_employed', 'unemployed', 'student'],
      },
      monthly_income: Number,
      permanent_address: String,
      current_address: String,
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      pan_number: { type: String, uppercase: true, trim: true },
      aadhaar_number: { type: String, trim: true },
      emergency_contact: {
        name: String,
        phone: String,
        relation: String,
        email: String,
      },
      previous_landlord_contact: {
        name: String,
        phone: String,
        email: String,
      },
      employer_contact: {
        name: String,
        phone: String,
        email: String,
        designation: String,
      },
      documents: {
        pan_document: String, // Cloudinary URL
        aadhaar_document: String, // Cloudinary URL
        employment_letter_document: String, // Cloudinary URL
        salary_slip: String, // Cloudinary URL
        previous_rent_agreement: String, // Cloudinary URL
      },
    },

    subscription: {
      plan_type: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free',
      },
      expires_at: Date,
      payment_method: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes for performance
// Note: email and google_id already have indexes from unique: true
UserSchema.index({ roles: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
