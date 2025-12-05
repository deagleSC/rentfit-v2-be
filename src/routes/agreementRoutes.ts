import { Router } from 'express';
import {
  createAgreement,
  getAgreements,
  getAgreement,
  updateAgreement,
  signAgreement,
} from '../controllers/agreementController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createAgreementSchema,
  signAgreementSchema,
  getAgreementSchema,
} from '../schemas/agreementSchemas';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/agreements:
 *   post:
 *     summary: Create a new rental agreement
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property
 *               - start_date
 *               - end_date
 *               - rent_amount
 *               - security_deposit
 *             properties:
 *               property:
 *                 type: string
 *                 description: Property ID
 *               tenant:
 *                 type: string
 *                 description: Tenant user ID (optional for draft)
 *               agreement_type:
 *                 type: string
 *                 enum: [11_months, long_term]
 *                 default: 11_months
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               rent_amount:
 *                 type: number
 *                 minimum: 0
 *               security_deposit:
 *                 type: number
 *                 minimum: 0
 *               rent_payment_date:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 31
 *                 default: 5
 *               late_penalty_percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               maintenance_terms:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   frequency:
 *                     type: string
 *                     enum: [monthly, quarterly, yearly]
 *                   included_in_rent:
 *                     type: boolean
 *                   paid_by:
 *                     type: string
 *                     enum: [tenant, landlord]
 *               lock_in_period:
 *                 type: number
 *                 default: 6
 *               notice_period:
 *                 type: number
 *                 default: 1
 *               clauses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     is_standard:
 *                       type: boolean
 *                     category:
 *                       type: string
 *                       enum: [maintenance, payment, termination, usage, other]
 *     responses:
 *       201:
 *         description: Agreement created successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Property not found
 *         $ref: '#/components/schemas/Error'
 */
router.post('/', validate(createAgreementSchema), createAgreement);

/**
 * @swagger
 * /api/agreements:
 *   get:
 *     summary: Get all agreements for the authenticated user
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending_signature, active, renewing, terminated, dispute]
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [landlord, tenant]
 *           description: Filter by user role (landlord or tenant)
 *     responses:
 *       200:
 *         description: Agreements retrieved successfully
 *         $ref: '#/components/schemas/Success'
 */
router.get('/', getAgreements);

/**
 * @swagger
 * /api/agreements/{id}:
 *   get:
 *     summary: Get an agreement by ID
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agreement retrieved successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Agreement not found
 *         $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getAgreementSchema), getAgreement);

/**
 * @swagger
 * /api/agreements/{id}:
 *   put:
 *     summary: Update an agreement (only draft agreements can be updated)
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rent_amount:
 *                 type: number
 *               clauses:
 *                 type: array
 *     responses:
 *       200:
 *         description: Agreement updated successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Agreement not found or cannot be updated
 *         $ref: '#/components/schemas/Error'
 */
router.put('/:id', validate(getAgreementSchema), updateAgreement);

/**
 * @swagger
 * /api/agreements/{id}/sign:
 *   post:
 *     summary: Sign an agreement (landlord or tenant)
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [landlord, tenant]
 *                 description: Role of the person signing
 *     responses:
 *       200:
 *         description: Agreement signed successfully
 *         $ref: '#/components/schemas/Success'
 *       403:
 *         description: Unauthorized to sign this agreement
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         description: Agreement not found
 *         $ref: '#/components/schemas/Error'
 */
router.post('/:id/sign', validate(signAgreementSchema), signAgreement);

export default router;
