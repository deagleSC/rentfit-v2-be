import { Router } from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyMedia,
} from '../controllers/propertyController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPropertySchema,
  updatePropertySchema,
  getPropertySchema,
} from '../schemas/propertySchemas';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - address
 *               - specs
 *               - expected_rent
 *               - expected_deposit
 *             properties:
 *               title:
 *                 type: string
 *                 example: Beautiful 2BHK Apartment
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - pincode
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               specs:
 *                 type: object
 *                 required:
 *                   - bhk
 *                   - bathrooms
 *                   - furnishing_status
 *                   - size_sq_ft
 *                 properties:
 *                   bhk:
 *                     type: string
 *                     enum: [1RK, 1BHK, 2BHK, 3BHK, 4BHK+]
 *                   bathrooms:
 *                     type: number
 *                   furnishing_status:
 *                     type: string
 *                     enum: [fully_furnished, semi_furnished, unfurnished]
 *                   size_sq_ft:
 *                     type: number
 *               expected_rent:
 *                 type: number
 *               expected_deposit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Property created successfully
 *         $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.post('/', validate(createPropertySchema), createProperty);

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties for the authenticated user
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [vacant, occupied, maintenance]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: bhk
 *         schema:
 *           type: string
 *           enum: [1RK, 1BHK, 2BHK, 3BHK, 4BHK+]
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         $ref: '#/components/schemas/Success'
 */
router.get('/', getProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags: [Properties]
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
 *         description: Property retrieved successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Property not found
 *         $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getPropertySchema), getProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
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
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [vacant, occupied, maintenance]
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Property not found
 *         $ref: '#/components/schemas/Error'
 */
router.put('/:id', validate(updatePropertySchema), updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
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
 *         description: Property deleted successfully
 *         $ref: '#/components/schemas/Success'
 *       404:
 *         description: Property not found
 *         $ref: '#/components/schemas/Error'
 */
router.delete('/:id', validate(getPropertySchema), deleteProperty);

/**
 * @swagger
 * /api/properties/{id}/media:
 *   post:
 *     summary: Upload media for a property
 *     tags: [Properties]
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
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         $ref: '#/components/schemas/Success'
 *       400:
 *         description: No file uploaded
 *         $ref: '#/components/schemas/Error'
 */
router.post('/:id/media', validate(getPropertySchema), uploadSingle('file'), uploadPropertyMedia);

export default router;
