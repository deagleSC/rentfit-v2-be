import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    address: z.object({
      society_name: z.string().optional(),
      street: z.string().min(1, 'Street is required'),
      locality: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }),
    specs: z.object({
      bhk: z.enum(['1RK', '1BHK', '2BHK', '3BHK', '4BHK+']),
      bathrooms: z.number().min(0),
      balconies: z.number().min(0).optional(),
      furnishing_status: z.enum(['fully_furnished', 'semi_furnished', 'unfurnished']),
      size_sq_ft: z.number().min(1),
      floor_number: z.number().optional(),
      total_floors: z.number().optional(),
      property_age_years: z.number().optional(),
    }),
    amenities: z.array(z.string()).optional(),
    expected_rent: z.number().min(0),
    expected_deposit: z.number().min(0),
    maintenance_details: z
      .object({
        amount: z.number().min(0).optional(),
        frequency: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
        included_in_rent: z.boolean().optional(),
        description: z.string().optional(),
      })
      .optional(),
    status: z.enum(['vacant', 'occupied', 'maintenance']).optional(),
    available_from: z.string().datetime().optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    address: z
      .object({
        society_name: z.string().optional(),
        street: z.string().optional(),
        locality: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
    specs: z
      .object({
        bhk: z.enum(['1RK', '1BHK', '2BHK', '3BHK', '4BHK+']).optional(),
        bathrooms: z.number().min(0).optional(),
        balconies: z.number().min(0).optional(),
        furnishing_status: z.enum(['fully_furnished', 'semi_furnished', 'unfurnished']).optional(),
        size_sq_ft: z.number().min(1).optional(),
        floor_number: z.number().optional(),
        total_floors: z.number().optional(),
        property_age_years: z.number().optional(),
      })
      .optional(),
    amenities: z.array(z.string()).optional(),
    expected_rent: z.number().min(0).optional(),
    expected_deposit: z.number().min(0).optional(),
    status: z.enum(['vacant', 'occupied', 'maintenance']).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
