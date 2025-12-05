import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  agreement: mongoose.Types.ObjectId;
  payer: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;

  amount: number;
  type: 'rent' | 'deposit' | 'maintenance' | 'penalty' | 'refund' | 'other';
  description?: string;

  due_date: Date;
  paid_date?: Date;

  status: 'pending' | 'processing' | 'paid' | 'overdue' | 'failed' | 'refunded';

  payment_method?: 'upi' | 'bank_transfer' | 'cash' | 'card' | 'other';
  transaction_id?: string;

  // Razorpay fields
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_link?: string;

  gateway_response?: any;

  receipt_number?: string;
  receipt_url?: string;

  late_fee?: number;
  late_days?: number;

  refund_details?: {
    original_payment_id?: mongoose.Types.ObjectId;
    refund_amount: number;
    refund_reason: string;
    refund_date: Date;
  };

  notes?: string;

  created_at: Date;
  updated_at: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    agreement: {
      type: Schema.Types.ObjectId,
      ref: 'Agreement',
      required: true,
      index: true,
    },
    payer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['rent', 'deposit', 'maintenance', 'penalty', 'refund', 'other'],
      required: true,
      index: true,
    },
    description: String,

    due_date: { type: Date, required: true, index: true },
    paid_date: Date,

    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'overdue', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },

    payment_method: {
      type: String,
      enum: ['upi', 'bank_transfer', 'cash', 'card', 'other'],
    },
    transaction_id: { type: String, sparse: true },

    // Razorpay fields
    razorpay_order_id: { type: String, sparse: true },
    razorpay_payment_id: { type: String, sparse: true },
    razorpay_signature: { type: String, sparse: true },
    payment_link: { type: String, sparse: true },

    gateway_response: Schema.Types.Mixed,

    receipt_number: { type: String, unique: true, sparse: true },
    receipt_url: String,

    late_fee: { type: Number, default: 0, min: 0 },
    late_days: { type: Number, default: 0, min: 0 },

    refund_details: {
      original_payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
      refund_amount: Number,
      refund_reason: String,
      refund_date: Date,
    },

    notes: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

PaymentSchema.index({ agreement: 1, type: 1, status: 1 });
PaymentSchema.index({ payer: 1, status: 1, due_date: -1 });
PaymentSchema.index({ due_date: 1, status: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
