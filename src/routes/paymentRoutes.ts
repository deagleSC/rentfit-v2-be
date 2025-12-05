import { Router } from 'express';
import {
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentSchema,
} from '../schemas/paymentSchemas';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment record
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agreement
 *               - amount
 *               - type
 *               - due_date
 *             properties:
 *               agreement:
 *                 type: string
 *                 description: Agreement ID
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               type:
 *                 type: string
 *                 enum: [rent, deposit, maintenance, penalty, refund, other]
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               payment_method:
 *                 type: string
 *                 enum: [upi, bank_transfer, cash, card, other]
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         $ref: '#/components/schemas/Success'
 *       403:
 *         description: Unauthorized - Only tenant can create payments
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         description: Agreement not found
 *         $ref: '#/components/schemas/Error'
 */
router.post('/', validate(createPaymentSchema), createPayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agreement
 *         schema:
 *           type: string
 *         description: Filter by agreement ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, paid, overdue, failed, refunded]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [rent, deposit, maintenance, penalty, refund, other]
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         $ref: '#/components/schemas/Success'
 */
router.get('/', getPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
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
 *         description: Payment retrieved successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Payment not found
 *         $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getPaymentSchema), getPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment status (mark as paid, add transaction details)
 *     tags: [Payments]
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
 *               status:
 *                 type: string
 *                 enum: [pending, processing, paid, overdue, failed, refunded]
 *               payment_method:
 *                 type: string
 *                 enum: [upi, bank_transfer, cash, card, other]
 *               transaction_id:
 *                 type: string
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Payment not found
 *         $ref: '#/components/schemas/Error'
 */
router.put('/:id', validate(updatePaymentSchema), updatePaymentStatus);

export default router;
