import { Router } from 'express';
import {
  register,
  login,
  firebaseAuth,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  firebaseAuthSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../schemas/authSchemas';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [landlord, tenant, admin]
 *                 description: Optional. Defaults to empty array if not provided.
 *                 example: []
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       409:
 *         description: User already exists
 *         $ref: '#/components/schemas/Error'
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/firebase:
 *   post:
 *     summary: Authenticate with Firebase ID token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Firebase ID token from frontend
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2...
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid or expired token
 *         $ref: '#/components/schemas/Error'
 */
router.post('/firebase', validate(firebaseAuthSchema), firebaseAuth);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               image:
 *                 type: string
 *                 format: uri
 *               checkpoint:
 *                 type: string
 *                 enum: [onboarding, complete]
 *                 description: Update user onboarding status
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [landlord, tenant, admin]
 *                 description: Update user roles. Optional array of roles.
 *                 example: [landlord, tenant]
 *               landlord_profile:
 *                 type: object
 *                 properties:
 *                   verification_status:
 *                     type: string
 *                     enum: [pending, verified, rejected]
 *                   phone:
 *                     type: string
 *                   alternate_phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   upi_id:
 *                     type: string
 *                   pan_number:
 *                     type: string
 *                   aadhaar_number:
 *                     type: string
 *                   gst_number:
 *                     type: string
 *                   company_name:
 *                     type: string
 *                   company_registration_number:
 *                     type: string
 *                   bank_details:
 *                     type: object
 *                     properties:
 *                       account_number:
 *                         type: string
 *                       ifsc_code:
 *                         type: string
 *                       account_holder_name:
 *                         type: string
 *                       bank_name:
 *                         type: string
 *                       branch_name:
 *                         type: string
 *                   documents:
 *                     type: object
 *                     properties:
 *                       pan_document:
 *                         type: string
 *                         format: uri
 *                       aadhaar_document:
 *                         type: string
 *                         format: uri
 *                       bank_statement:
 *                         type: string
 *                         format: uri
 *                       gst_certificate:
 *                         type: string
 *                         format: uri
 *               tenant_profile:
 *                 type: object
 *                 properties:
 *                   kyc_status:
 *                     type: string
 *                     enum: [pending, verified, rejected]
 *                   phone:
 *                     type: string
 *                   alternate_phone:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other, prefer_not_to_say]
 *                   current_employer:
 *                     type: string
 *                   job_title:
 *                     type: string
 *                   employment_type:
 *                     type: string
 *                     enum: [full_time, part_time, contract, self_employed, unemployed, student]
 *                   monthly_income:
 *                     type: number
 *                     minimum: 0
 *                   permanent_address:
 *                     type: string
 *                   current_address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   pan_number:
 *                     type: string
 *                   aadhaar_number:
 *                     type: string
 *                   emergency_contact:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       relation:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 *                   previous_landlord_contact:
 *                     type: object
 *                     description: Optional previous landlord contact information
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 *                   employer_contact:
 *                     type: object
 *                     description: Optional employer contact information
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 *                       designation:
 *                         type: string
 *                   documents:
 *                     type: object
 *                     properties:
 *                       pan_document:
 *                         type: string
 *                         format: uri
 *                       aadhaar_document:
 *                         type: string
 *                         format: uri
 *                       employment_letter_document:
 *                         type: string
 *                         format: uri
 *                         description: Employment letter document URL
 *                       salary_slip:
 *                         type: string
 *                         format: uri
 *                       previous_rent_agreement:
 *                         type: string
 *                         format: uri
 *                         description: Optional previous rent agreement document URL
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid current password
 *         $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
