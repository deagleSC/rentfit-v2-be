import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'RentFit AI API',
    version: '1.0.0',
    description: 'Intelligent rental assistant API documentation',
    contact: {
      name: 'RentFit AI',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: 'Development server',
    },
    {
      url: 'https://api.rentfit.ai',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /api/auth/login or /api/auth/firebase',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error message',
              },
            },
          },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['landlord', 'tenant', 'admin'],
            },
            example: [],
            description: 'User roles array. Empty by default for new users.',
          },
          checkpoint: {
            type: 'string',
            enum: ['onboarding', 'complete'],
            example: 'onboarding',
            description: 'User onboarding status. Set to "onboarding" for new users.',
          },
          image: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/image.jpg',
          },
          landlord_profile: {
            type: 'object',
            properties: {
              verification_status: {
                type: 'string',
                enum: ['pending', 'verified', 'rejected'],
                example: 'pending',
              },
              phone: { type: 'string', example: '9876543210' },
              alternate_phone: { type: 'string', example: '9876543211' },
              address: { type: 'string', example: '123 Main Street' },
              city: { type: 'string', example: 'Mumbai' },
              state: { type: 'string', example: 'Maharashtra' },
              pincode: { type: 'string', example: '400001' },
              upi_id: { type: 'string', example: 'john@upi' },
              pan_number: { type: 'string', example: 'ABCDE1234F' },
              aadhaar_number: { type: 'string', example: '1234 5678 9012' },
              gst_number: { type: 'string', example: '27ABCDE1234F1Z5' },
              company_name: { type: 'string', example: 'ABC Properties' },
              company_registration_number: { type: 'string', example: 'U12345MH2020PTC123456' },
              bank_details: {
                type: 'object',
                properties: {
                  account_number: { type: 'string', example: '1234567890' },
                  ifsc_code: { type: 'string', example: 'HDFC0001234' },
                  account_holder_name: { type: 'string', example: 'John Doe' },
                  bank_name: { type: 'string', example: 'HDFC Bank' },
                  branch_name: { type: 'string', example: 'Mumbai Main Branch' },
                },
              },
              documents: {
                type: 'object',
                properties: {
                  pan_document: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/pan.jpg',
                  },
                  aadhaar_document: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/aadhaar.jpg',
                  },
                  bank_statement: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/bank.pdf',
                  },
                  gst_certificate: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/gst.pdf',
                  },
                },
              },
            },
          },
          tenant_profile: {
            type: 'object',
            properties: {
              kyc_status: {
                type: 'string',
                enum: ['pending', 'verified', 'rejected'],
                example: 'pending',
              },
              phone: { type: 'string', example: '9876543210' },
              alternate_phone: { type: 'string', example: '9876543211' },
              date_of_birth: { type: 'string', format: 'date', example: '1990-01-01' },
              gender: {
                type: 'string',
                enum: ['male', 'female', 'other', 'prefer_not_to_say'],
                example: 'male',
              },
              current_employer: { type: 'string', example: 'Tech Corp' },
              job_title: { type: 'string', example: 'Software Engineer' },
              employment_type: {
                type: 'string',
                enum: [
                  'full_time',
                  'part_time',
                  'contract',
                  'self_employed',
                  'unemployed',
                  'student',
                ],
                example: 'full_time',
              },
              monthly_income: { type: 'number', example: 50000 },
              permanent_address: { type: 'string', example: '123 Main Street, City' },
              current_address: { type: 'string', example: '456 Current Street, City' },
              city: { type: 'string', example: 'Mumbai' },
              state: { type: 'string', example: 'Maharashtra' },
              pincode: { type: 'string', example: '400001' },
              pan_number: { type: 'string', example: 'ABCDE1234F' },
              aadhaar_number: { type: 'string', example: '1234 5678 9012' },
              emergency_contact: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  phone: { type: 'string', example: '9876543212' },
                  relation: { type: 'string', example: 'Spouse' },
                  email: { type: 'string', format: 'email', example: 'jane@example.com' },
                },
              },
              previous_landlord_contact: {
                type: 'object',
                description: 'Optional previous landlord contact information',
                properties: {
                  name: { type: 'string', example: 'Previous Landlord' },
                  phone: { type: 'string', example: '9876543213' },
                  email: { type: 'string', format: 'email', example: 'landlord@example.com' },
                },
              },
              employer_contact: {
                type: 'object',
                description: 'Optional employer contact information',
                properties: {
                  name: { type: 'string', example: 'HR Manager' },
                  phone: { type: 'string', example: '9876543214' },
                  email: { type: 'string', format: 'email', example: 'hr@techcorp.com' },
                  designation: { type: 'string', example: 'HR Manager' },
                },
              },
              documents: {
                type: 'object',
                properties: {
                  pan_document: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/pan.jpg',
                  },
                  aadhaar_document: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/aadhaar.jpg',
                  },
                  employment_letter_document: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/employment.pdf',
                    description: 'Employment letter document URL',
                  },
                  salary_slip: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/salary.pdf',
                  },
                  previous_rent_agreement: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://cloudinary.com/agreement.pdf',
                    description: 'Optional previous rent agreement document URL',
                  },
                },
              },
            },
          },
        },
      },
      Property: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          owner: {
            type: 'string',
            example: '507f1f77bcf86cd799439012',
            description: 'User ID of the property owner',
          },
          title: {
            type: 'string',
            example: 'Beautiful 2BHK Apartment',
          },
          address: {
            type: 'object',
            properties: {
              society_name: {
                type: 'string',
                example: 'Green Valley Society',
              },
              street: {
                type: 'string',
                example: '123 Main Street',
              },
              locality: {
                type: 'string',
                example: 'Andheri West',
              },
              city: {
                type: 'string',
                example: 'Mumbai',
              },
              state: {
                type: 'string',
                example: 'Maharashtra',
              },
              pincode: {
                type: 'string',
                example: '400053',
              },
              latitude: {
                type: 'number',
                example: 19.1234,
              },
              longitude: {
                type: 'number',
                example: 72.5678,
              },
              map_link: {
                type: 'string',
                format: 'uri',
                example: 'https://maps.google.com/?q=19.1234,72.5678',
              },
            },
            required: ['street', 'city', 'state', 'pincode'],
          },
          specs: {
            type: 'object',
            properties: {
              bhk: {
                type: 'string',
                enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+'],
                example: '2BHK',
              },
              property_type: {
                type: 'string',
                enum: ['apartment', 'house', 'villa', 'studio', 'penthouse', 'commercial', 'other'],
                example: 'apartment',
              },
              bathrooms: {
                type: 'number',
                example: 2,
              },
              balconies: {
                type: 'number',
                example: 1,
              },
              furnishing_status: {
                type: 'string',
                enum: ['fully_furnished', 'semi_furnished', 'unfurnished'],
                example: 'fully_furnished',
              },
              size_sq_ft: {
                type: 'number',
                example: 1200,
              },
              floor_number: {
                type: 'number',
                example: 5,
              },
              total_floors: {
                type: 'number',
                example: 10,
              },
              property_age_years: {
                type: 'number',
                example: 5,
              },
            },
            required: ['bhk', 'property_type', 'bathrooms', 'furnishing_status', 'size_sq_ft'],
          },
          amenities: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Parking', 'Lift', 'Security', 'Gym'],
          },
          media: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  format: 'uri',
                },
                type: {
                  type: 'string',
                  enum: ['image', 'video'],
                },
                caption: {
                  type: 'string',
                },
                uploaded_at: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
          expected_rent: {
            type: 'number',
            example: 25000,
          },
          expected_deposit: {
            type: 'number',
            example: 100000,
          },
          description: {
            type: 'string',
            example: 'Beautiful apartment with modern amenities in prime location',
          },
          maintenance_details: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                example: 2000,
              },
              frequency: {
                type: 'string',
                enum: ['monthly', 'quarterly', 'yearly'],
                example: 'monthly',
              },
              included_in_rent: {
                type: 'boolean',
                example: false,
              },
              description: {
                type: 'string',
                example: 'Maintenance charges for common area',
              },
            },
          },
          status: {
            type: 'string',
            enum: ['vacant', 'occupied', 'maintenance'],
            example: 'vacant',
          },
          available_from: {
            type: 'string',
            format: 'date-time',
            example: '2024-02-01T00:00:00Z',
          },
          current_agreement: {
            type: 'string',
            nullable: true,
            example: '507f1f77bcf86cd799439013',
            description: 'Agreement ID if property is currently occupied',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: [
          'owner',
          'title',
          'address',
          'specs',
          'expected_rent',
          'expected_deposit',
          'status',
        ],
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Properties',
      description: 'Property management endpoints',
    },
    {
      name: 'Agreements',
      description: 'Rental agreement management endpoints',
    },
    {
      name: 'Payments',
      description: 'Payment tracking and management endpoints',
    },
    {
      name: 'Inspections',
      description: 'Move-in/move-out inspection endpoints',
    },
    {
      name: 'Notifications',
      description: 'User notification endpoints',
    },
    {
      name: 'Tickets',
      description: 'Support ticket management endpoints',
    },
    {
      name: 'System',
      description: 'System health and status endpoints',
    },
    {
      name: 'Cloudinary',
      description: 'File upload and management endpoints using Cloudinary',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
