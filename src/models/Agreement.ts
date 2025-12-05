import mongoose, { Schema, Document } from 'mongoose';

export interface IAgreement extends Document {
  property: mongoose.Types.ObjectId;
  landlord: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;

  agreement_type: '11_months' | 'long_term';
  start_date: Date;
  end_date: Date;

  rent_amount: number;
  security_deposit: number;
  rent_payment_date: number;
  late_penalty_percentage: number;

  maintenance_terms?: {
    amount: number;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    included_in_rent: boolean;
    paid_by: 'tenant' | 'landlord';
  };

  lock_in_period: number;
  notice_period: number;
  police_verification_status: 'pending' | 'submitted' | 'verified';

  rent_escalation?: {
    enabled: boolean;
    percentage: number;
    frequency_months: number;
  };

  clauses: Array<{
    title: string;
    content: string;
    is_standard: boolean;
    ai_explanation?: string;
    category?: 'maintenance' | 'payment' | 'termination' | 'usage' | 'other';
  }>;

  status: 'draft' | 'pending_signature' | 'active' | 'renewing' | 'terminated' | 'dispute';

  document_url?: string;
  signatures: {
    landlord_signed: boolean;
    landlord_signed_at?: Date;
    landlord_ip?: string;
    tenant_signed: boolean;
    tenant_signed_at?: Date;
    tenant_ip?: string;
  };

  termination?: {
    initiated_by?: 'landlord' | 'tenant';
    initiated_at?: Date;
    reason?: string;
    effective_date?: Date;
    deposit_status?: 'full_refund' | 'partial_refund' | 'no_refund' | 'pending';
    deposit_deduction_amount?: number;
    deposit_deduction_reason?: string;
  };

  created_at: Date;
  updated_at: Date;
}

const AgreementSchema = new Schema<IAgreement>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    agreement_type: {
      type: String,
      enum: ['11_months', 'long_term'],
      default: '11_months',
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },

    rent_amount: { type: Number, required: true, min: 0 },
    security_deposit: { type: Number, required: true, min: 0 },
    rent_payment_date: { type: Number, default: 5, min: 1, max: 31 },
    late_penalty_percentage: { type: Number, default: 0, min: 0, max: 100 },

    maintenance_terms: {
      amount: { type: Number, min: 0 },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly',
      },
      included_in_rent: { type: Boolean, default: false },
      paid_by: { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },
    },

    lock_in_period: { type: Number, default: 6, min: 0 },
    notice_period: { type: Number, default: 1, min: 0 },
    police_verification_status: {
      type: String,
      enum: ['pending', 'submitted', 'verified'],
      default: 'pending',
    },

    rent_escalation: {
      enabled: { type: Boolean, default: false },
      percentage: { type: Number, min: 0, max: 100 },
      frequency_months: { type: Number, default: 12 },
    },

    clauses: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        is_standard: { type: Boolean, default: false },
        ai_explanation: String,
        category: {
          type: String,
          enum: ['maintenance', 'payment', 'termination', 'usage', 'other'],
          default: 'other',
        },
      },
    ],

    status: {
      type: String,
      enum: ['draft', 'pending_signature', 'active', 'renewing', 'terminated', 'dispute'],
      default: 'draft',
      index: true,
    },

    document_url: String,

    signatures: {
      landlord_signed: { type: Boolean, default: false },
      landlord_signed_at: Date,
      landlord_ip: String,
      tenant_signed: { type: Boolean, default: false },
      tenant_signed_at: Date,
      tenant_ip: String,
    },

    termination: {
      initiated_by: { type: String, enum: ['landlord', 'tenant'] },
      initiated_at: Date,
      reason: String,
      effective_date: Date,
      deposit_status: {
        type: String,
        enum: ['full_refund', 'partial_refund', 'no_refund', 'pending'],
      },
      deposit_deduction_amount: { type: Number, min: 0 },
      deposit_deduction_reason: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

AgreementSchema.index({ landlord: 1, status: 1 });
AgreementSchema.index({ tenant: 1, status: 1 });
AgreementSchema.index({ property: 1, status: 1 });
AgreementSchema.index({ end_date: 1, status: 1 });

AgreementSchema.pre('save', function (next) {
  if (this.end_date <= this.start_date) {
    next(new Error('end_date must be after start_date'));
  }
  next();
});

export default mongoose.models.Agreement ||
  mongoose.model<IAgreement>('Agreement', AgreementSchema);
