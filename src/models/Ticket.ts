import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  agreement?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  assigned_to?: mongoose.Types.ObjectId;

  type:
    | 'maintenance'
    | 'rent_receipt_issue'
    | 'agreement_renewal'
    | 'early_exit'
    | 'dispute'
    | 'payment_issue'
    | 'general';

  title: string;
  description: string;

  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  messages: Array<{
    sender_id: mongoose.Types.ObjectId;
    sender_type: 'user' | 'ai' | 'system';
    content: string;
    attachments?: Array<{
      url: string;
      type: 'image' | 'document' | 'video';
      filename: string;
    }>;
    timestamp: Date;
  }>;

  ai_summary?: string;
  ai_suggestions?: string[];

  resolved_at?: Date;
  resolved_by?: mongoose.Types.ObjectId;
  resolution_notes?: string;

  escalated_at?: Date;
  escalation_reason?: string;

  created_at: Date;
  updated_at: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    agreement: { type: Schema.Types.ObjectId, ref: 'Agreement', index: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },

    type: {
      type: String,
      enum: [
        'maintenance',
        'rent_receipt_issue',
        'agreement_renewal',
        'early_exit',
        'dispute',
        'payment_issue',
        'general',
      ],
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'],
      default: 'open',
      index: true,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },

    messages: [
      {
        sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sender_type: {
          type: String,
          enum: ['user', 'ai', 'system'],
          required: true,
        },
        content: { type: String, required: true },
        attachments: [
          {
            url: String,
            type: { type: String, enum: ['image', 'document', 'video'] },
            filename: String,
          },
        ],
        timestamp: { type: Date, default: Date.now },
      },
    ],

    ai_summary: String,
    ai_suggestions: [String],

    resolved_at: Date,
    resolved_by: { type: Schema.Types.ObjectId, ref: 'User' },
    resolution_notes: String,

    escalated_at: Date,
    escalation_reason: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

TicketSchema.index({ agreement: 1, status: 1 });
TicketSchema.index({ author: 1, status: 1, created_at: -1 });
TicketSchema.index({ status: 1, priority: 1 });

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
