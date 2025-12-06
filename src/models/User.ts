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
    upi_id?: string;
    pan_number?: string; // For TDS compliance
    bank_details?: {
      account_number?: string;
      ifsc_code?: string;
      account_holder_name?: string;
    };
  };

  tenant_profile?: {
    kyc_status: 'pending' | 'verified' | 'rejected';
    current_employer?: string;
    permanent_address?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
      relation?: string;
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
      upi_id: { type: String, trim: true },
      pan_number: { type: String, uppercase: true, trim: true },
      bank_details: {
        account_number: String,
        ifsc_code: { type: String, uppercase: true },
        account_holder_name: String,
      },
    },

    tenant_profile: {
      kyc_status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
      current_employer: String,
      permanent_address: String,
      emergency_contact: {
        name: String,
        phone: String,
        relation: String,
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
