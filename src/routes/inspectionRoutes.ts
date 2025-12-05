import { Router } from 'express';
import {
  createInspection,
  getInspections,
  getInspection,
  uploadInspectionPhoto,
} from '../controllers/inspectionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createInspectionSchema, getInspectionSchema } from '../schemas/inspectionSchemas';
import { uploadSingle } from '../middleware/upload';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/inspections:
 *   post:
 *     summary: Create a new inspection (move-in, move-out, or periodic)
 *     tags: [Inspections]
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
 *               - property
 *               - type
 *               - inspection_date
 *               - overall_condition
 *             properties:
 *               agreement:
 *                 type: string
 *                 description: Agreement ID
 *               property:
 *                 type: string
 *                 description: Property ID
 *               type:
 *                 type: string
 *                 enum: [move_in, move_out, periodic]
 *               inspection_date:
 *                 type: string
 *                 format: date-time
 *               overall_condition:
 *                 type: string
 *                 enum: [excellent, good, fair, poor]
 *               issues:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                     severity:
 *                       type: string
 *                       enum: [minor, moderate, major]
 *                     room:
 *                       type: string
 *     responses:
 *       201:
 *         description: Inspection created successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Agreement not found
 *         $ref: '#/components/schemas/Error'
 */
router.post('/', validate(createInspectionSchema), createInspection);

/**
 * @swagger
 * /api/inspections:
 *   get:
 *     summary: Get all inspections
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agreement
 *         schema:
 *           type: string
 *         description: Filter by agreement ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [move_in, move_out, periodic]
 *     responses:
 *       200:
 *         description: Inspections retrieved successfully
 *         $ref: '#/components/schemas/Success'
 */
router.get('/', getInspections);

/**
 * @swagger
 * /api/inspections/{id}:
 *   get:
 *     summary: Get an inspection by ID
 *     tags: [Inspections]
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
 *         description: Inspection retrieved successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Inspection not found
 *         $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getInspectionSchema), getInspection);

/**
 * @swagger
 * /api/inspections/{id}/photos:
 *   post:
 *     summary: Upload a photo for an inspection
 *     tags: [Inspections]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               room:
 *                 type: string
 *                 description: Room/area name (e.g., bedroom_1, kitchen, bathroom)
 *               description:
 *                 type: string
 *                 description: Optional photo description
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *         $ref: '#/components/schemas/Success'
 *       400:
 *         description: No file uploaded
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inspection not found
 *         $ref: '#/components/schemas/Error'
 */
router.post(
  '/:id/photos',
  validate(getInspectionSchema),
  uploadSingle('file'),
  uploadInspectionPhoto
);

export default router;
