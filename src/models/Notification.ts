import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;

  type:
    | 'rent_due'
    | 'rent_overdue'
    | 'payment_received'
    | 'agreement_expiring'
    | 'agreement_signed'
    | 'ticket_update'
    | 'inspection_scheduled'
    | 'system'
    | 'other';

  title: string;
  message: string;

  is_read: boolean;
  read_at?: Date;

  scheduled_for?: Date;
  sent_at?: Date;

  link_to?: string;
  related_model?: 'Agreement' | 'Payment' | 'Ticket' | 'Inspection';
  related_id?: mongoose.Types.ObjectId;

  channels: {
    in_app: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  delivery_status: {
    email_sent?: boolean;
    email_sent_at?: Date;
    sms_sent?: boolean;
    sms_sent_at?: Date;
    push_sent?: boolean;
    push_sent_at?: Date;
  };

  priority: 'low' | 'medium' | 'high' | 'urgent';

  created_at: Date;
  updated_at: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        'rent_due',
        'rent_overdue',
        'payment_received',
        'agreement_expiring',
        'agreement_signed',
        'ticket_update',
        'inspection_scheduled',
        'system',
        'other',
      ],
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    is_read: { type: Boolean, default: false, index: true },
    read_at: Date,

    scheduled_for: { type: Date, index: true },
    sent_at: Date,

    link_to: String,
    related_model: {
      type: String,
      enum: ['Agreement', 'Payment', 'Ticket', 'Inspection'],
    },
    related_id: Schema.Types.ObjectId,

    channels: {
      in_app: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },

    delivery_status: {
      email_sent: Boolean,
      email_sent_at: Date,
      sms_sent: Boolean,
      sms_sent_at: Date,
      push_sent: Boolean,
      push_sent_at: Date,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

NotificationSchema.index({ user: 1, is_read: 1, created_at: -1 });
NotificationSchema.index({ scheduled_for: 1, sent_at: 1 });

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
