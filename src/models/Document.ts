import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  uploaded_by: mongoose.Types.ObjectId;

  // Document metadata
  name: string;
  type: 'kyc' | 'agreement' | 'receipt' | 'inspection' | 'other';
  category?: string; // e.g., 'aadhar', 'pan', 'rent_receipt', etc.

  // Cloudinary details
  cloudinary_url: string;
  cloudinary_public_id: string;
  file_size?: number; // in bytes
  mime_type?: string;

  // Related entities
  related_model?: 'User' | 'Property' | 'Agreement' | 'Payment' | 'Inspection' | 'Ticket';
  related_id?: mongoose.Types.ObjectId;

  // Access control
  is_public: boolean;
  access_roles?: string[]; // ['landlord', 'tenant'] - who can view

  // Status
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: mongoose.Types.ObjectId;
  verified_at?: Date;
  rejection_reason?: string;

  // Expiry (for temporary documents)
  expires_at?: Date;

  created_at: Date;
  updated_at: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['kyc', 'agreement', 'receipt', 'inspection', 'other'],
      required: true,
      index: true,
    },
    category: { type: String, trim: true },

    cloudinary_url: { type: String, required: true },
    cloudinary_public_id: { type: String, required: true },
    file_size: { type: Number, min: 0 },
    mime_type: { type: String },

    related_model: {
      type: String,
      enum: ['User', 'Property', 'Agreement', 'Payment', 'Inspection', 'Ticket'],
    },
    related_id: Schema.Types.ObjectId,

    is_public: { type: Boolean, default: false },
    access_roles: [{ type: String }],

    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    verified_by: { type: Schema.Types.ObjectId, ref: 'User' },
    verified_at: Date,
    rejection_reason: String,

    expires_at: Date,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

DocumentSchema.index({ uploaded_by: 1, type: 1 });
DocumentSchema.index({ related_model: 1, related_id: 1 });
DocumentSchema.index({ status: 1, type: 1 });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
