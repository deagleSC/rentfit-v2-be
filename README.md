# RentFit AI Backend

Intelligent rental assistant API built with Express, TypeScript, and Mongoose.

## Features

- **Authentication**: Firebase Authentication (Google OAuth) and email/password authentication
- **Property Management**: CRUD operations for properties with Cloudinary image uploads
- **Agreement Management**: Create, manage, and sign rental agreements
- **Payment Tracking**: Track rent, deposits, and other payments with Razorpay integration support
- **Inspection System**: Move-in/move-out inspections with photo evidence
- **Notification System**: Multi-channel notifications for rent reminders, payments, etc.
- **Ticket System**: Support tickets for maintenance, disputes, and general queries

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JWT, Firebase Admin SDK (Google OAuth via Firebase)
- **File Storage**: Cloudinary
- **Payment Gateway**: Razorpay (ready for integration)

## Project Structure

```
src/
├── models/          # Mongoose models
├── schemas/         # Zod validation schemas
├── controllers/     # Route handlers
├── services/        # Business logic services
├── middleware/      # Auth, validation, error handling
├── routes/          # Express route definitions
├── utils/           # Helpers, constants
├── config/          # Database, env configs
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

3. **Required environment variables**:

   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Firebase service account JSON (as string) OR use individual variables:
     - `FIREBASE_PROJECT_ID`: Firebase project ID
     - `FIREBASE_CLIENT_EMAIL`: Firebase client email
     - `FIREBASE_PRIVATE_KEY`: Firebase private key
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay credentials (for payment integration)

4. **Run development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Documentation

Swagger documentation is available at:

- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://api.rentfit.ai/api-docs`

The Swagger UI provides interactive API documentation where you can:

- View all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- Authenticate using the "Authorize" button with your JWT token

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/firebase` - Authenticate with Firebase ID token (Google OAuth handled by Firebase)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Properties

- `POST /api/properties` - Create property
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/properties/:id/media` - Upload property media

### Agreements

- `POST /api/agreements` - Create agreement
- `GET /api/agreements` - List agreements
- `GET /api/agreements/:id` - Get agreement details
- `PUT /api/agreements/:id` - Update agreement
- `POST /api/agreements/:id/sign` - Sign agreement

### Payments

- `POST /api/payments` - Create payment record
- `GET /api/payments` - List payments
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment status

### Inspections

- `POST /api/inspections` - Create inspection
- `GET /api/inspections` - List inspections
- `GET /api/inspections/:id` - Get inspection details
- `POST /api/inspections/:id/photos` - Upload inspection photos

### Notifications

- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Tickets

- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets/:id/messages` - Add message to ticket
- `PUT /api/tickets/:id/status` - Update ticket status

## Database Models

1. **User**: User accounts with landlord/tenant profiles
2. **Property**: Rental properties
3. **Agreement**: Rental agreements
4. **Payment**: Payment records
5. **Inspection**: Move-in/move-out inspections
6. **Notification**: User notifications
7. **Ticket**: Support tickets
8. **Document**: Uploaded documents (KYC, receipts, etc.)

## Development

- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`

## Firebase Authentication Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Enable Google Sign-in** in Firebase Authentication
3. **Get Service Account Key**:

   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Copy the JSON content and set it as `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable (as a JSON string)
   - OR use individual environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

4. **Frontend Integration**:
   - Frontend should use Firebase SDK to authenticate users
   - After successful authentication, frontend receives an ID token
   - Send this ID token to `POST /api/auth/firebase` endpoint
   - Backend verifies the token and returns a JWT token for API access

## Notes

- All endpoints require authentication except `/api/auth/*` routes
- CORS is configured to allow all origins (`*`) for development
- File uploads are limited to 10MB
- Supported file types: images, videos, PDFs
- Firebase handles the OAuth flow on the frontend; backend only verifies the ID token
