import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;

  address: {
    society_name?: string;
    street: string;
    locality?: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    map_link?: string;
  };

  specs: {
    bhk: '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK+';
    property_type:
      | 'apartment'
      | 'house'
      | 'villa'
      | 'studio'
      | 'penthouse'
      | 'commercial'
      | 'other';
    bathrooms: number;
    balconies: number;
    furnishing_status: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
    size_sq_ft: number;
    floor_number?: number;
    total_floors?: number;
    property_age_years?: number;
  };

  amenities: string[];

  media: Array<{
    url: string;
    type: 'image' | 'video';
    caption?: string;
    uploaded_at: Date;
  }>;

  expected_rent: number;
  expected_deposit: number;
  description?: string;
  maintenance_details?: {
    amount: number;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    included_in_rent: boolean;
    description?: string;
  };

  status: 'vacant' | 'occupied' | 'maintenance';
  available_from?: Date;
  current_agreement?: mongoose.Types.ObjectId;

  created_at: Date;
  updated_at: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },

    address: {
      society_name: { type: String, trim: true },
      street: { type: String, required: true, trim: true },
      locality: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      latitude: Number,
      longitude: Number,
      map_link: { type: String, trim: true },
    },

    specs: {
      bhk: {
        type: String,
        enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+'],
        required: true,
      },
      property_type: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'studio', 'penthouse', 'commercial', 'other'],
        required: true,
      },
      bathrooms: { type: Number, required: true, min: 0 },
      balconies: { type: Number, default: 0, min: 0 },
      furnishing_status: {
        type: String,
        enum: ['fully_furnished', 'semi_furnished', 'unfurnished'],
        required: true,
      },
      size_sq_ft: { type: Number, required: true, min: 1 },
      floor_number: Number,
      total_floors: Number,
      property_age_years: Number,
    },

    amenities: [{ type: String, trim: true }],

    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        caption: String,
        uploaded_at: { type: Date, default: Date.now },
      },
    ],

    expected_rent: { type: Number, required: true, min: 0 },
    expected_deposit: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },

    maintenance_details: {
      amount: { type: Number, min: 0 },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly',
      },
      included_in_rent: { type: Boolean, default: false },
      description: String,
    },

    status: {
      type: String,
      enum: ['vacant', 'occupied', 'maintenance'],
      default: 'vacant',
      index: true,
    },
    available_from: Date,
    current_agreement: { type: Schema.Types.ObjectId, ref: 'Agreement' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

PropertySchema.index({ owner: 1, status: 1 });
PropertySchema.index({ 'address.city': 1, status: 1 });
PropertySchema.index({ 'specs.bhk': 1, 'address.city': 1 });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
