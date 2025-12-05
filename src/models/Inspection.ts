import mongoose, { Schema, Document } from 'mongoose';

export interface IInspection extends Document {
  agreement: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  type: 'move_in' | 'move_out' | 'periodic';

  inspection_date: Date;
  conducted_by: mongoose.Types.ObjectId;

  photos: Array<{
    url: string;
    room: string;
    description?: string;
    uploaded_at: Date;
  }>;

  issues: Array<{
    description: string;
    severity: 'minor' | 'moderate' | 'major';
    room: string;
    photo_url?: string;
    resolved: boolean;
    resolved_by?: 'landlord' | 'tenant';
    resolved_at?: Date;
    resolution_cost?: number;
  }>;

  overall_condition: 'excellent' | 'good' | 'fair' | 'poor';

  signatures: {
    landlord_signed: boolean;
    landlord_signed_at?: Date;
    tenant_signed: boolean;
    tenant_signed_at?: Date;
  };

  ai_summary?: string;
  ai_comparison?: string;
  recommended_deduction?: number;

  disputed: boolean;
  dispute_reason?: string;

  created_at: Date;
  updated_at: Date;
}

const InspectionSchema = new Schema<IInspection>(
  {
    agreement: {
      type: Schema.Types.ObjectId,
      ref: 'Agreement',
      required: true,
      index: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    type: {
      type: String,
      enum: ['move_in', 'move_out', 'periodic'],
      required: true,
      index: true,
    },

    inspection_date: { type: Date, required: true },
    conducted_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    photos: [
      {
        url: { type: String, required: true },
        room: { type: String, required: true },
        description: String,
        uploaded_at: { type: Date, default: Date.now },
      },
    ],

    issues: [
      {
        description: { type: String, required: true },
        severity: {
          type: String,
          enum: ['minor', 'moderate', 'major'],
          required: true,
        },
        room: { type: String, required: true },
        photo_url: String,
        resolved: { type: Boolean, default: false },
        resolved_by: { type: String, enum: ['landlord', 'tenant'] },
        resolved_at: Date,
        resolution_cost: Number,
      },
    ],

    overall_condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true,
    },

    signatures: {
      landlord_signed: { type: Boolean, default: false },
      landlord_signed_at: Date,
      tenant_signed: { type: Boolean, default: false },
      tenant_signed_at: Date,
    },

    ai_summary: String,
    ai_comparison: String,
    recommended_deduction: { type: Number, min: 0 },

    disputed: { type: Boolean, default: false },
    dispute_reason: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

InspectionSchema.index({ agreement: 1, type: 1 });
InspectionSchema.index({ property: 1, inspection_date: -1 });

export default mongoose.models.Inspection ||
  mongoose.model<IInspection>('Inspection', InspectionSchema);
