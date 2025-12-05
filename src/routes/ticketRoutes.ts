import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicket,
  addMessage,
  updateTicketStatus,
} from '../controllers/ticketController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTicketSchema,
  addMessageSchema,
  updateTicketStatusSchema,
  getTicketSchema,
} from '../schemas/ticketSchemas';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - description
 *             properties:
 *               agreement:
 *                 type: string
 *                 description: Related agreement ID (optional)
 *               type:
 *                 type: string
 *                 enum: [maintenance, rent_receipt_issue, agreement_renewal, early_exit, dispute, payment_issue, general]
 *               title:
 *                 type: string
 *                 example: Water leakage in bathroom
 *               description:
 *                 type: string
 *                 example: There is a water leakage issue in the bathroom that needs immediate attention.
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         $ref: '#/components/schemas/Success'
 */
router.post('/', validate(createTicketSchema), createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets for the authenticated user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, resolved, closed, escalated]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [maintenance, rent_receipt_issue, agreement_renewal, early_exit, dispute, payment_issue, general]
 *       - in: query
 *         name: agreement
 *         schema:
 *           type: string
 *         description: Filter by agreement ID
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *         $ref: '#/components/schemas/Success'
 */
router.get('/', getTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID with all messages
 *     tags: [Tickets]
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
 *         description: Ticket retrieved successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Ticket not found
 *         $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getTicketSchema), getTicket);

/**
 * @swagger
 * /api/tickets/{id}/messages:
 *   post:
 *     summary: Add a message to a ticket
 *     tags: [Tickets]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: I have fixed the issue. Please check.
 *               sender_type:
 *                 type: string
 *                 enum: [user, ai, system]
 *                 default: user
 *     responses:
 *       200:
 *         description: Message added successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Ticket not found
 *         $ref: '#/components/schemas/Error'
 */
router.post('/:id/messages', validate(addMessageSchema), addMessage);

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   put:
 *     summary: Update ticket status
 *     tags: [Tickets]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved, closed, escalated]
 *               resolution_notes:
 *                 type: string
 *                 description: Required when status is 'resolved'
 *                 example: Issue has been resolved by replacing the faulty pipe.
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Ticket not found
 *         $ref: '#/components/schemas/Error'
 */
router.put('/:id/status', validate(updateTicketStatusSchema), updateTicketStatus);

export default router;
