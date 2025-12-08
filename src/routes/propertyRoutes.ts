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
 *                   society_name:
 *                     type: string
 *                     example: Green Valley Society
 *                   street:
 *                     type: string
 *                     example: 123 Main Street
 *                   locality:
 *                     type: string
 *                     example: Andheri West
 *                   city:
 *                     type: string
 *                     example: Mumbai
 *                   state:
 *                     type: string
 *                     example: Maharashtra
 *                   pincode:
 *                     type: string
 *                     example: 400053
 *                   latitude:
 *                     type: number
 *                     example: 19.1234
 *                   longitude:
 *                     type: number
 *                     example: 72.5678
 *                   map_link:
 *                     type: string
 *                     format: uri
 *                     example: https://maps.google.com/?q=19.1234,72.5678
 *               specs:
 *                 type: object
 *                 required:
 *                   - bhk
 *                   - property_type
 *                   - bathrooms
 *                   - furnishing_status
 *                   - size_sq_ft
 *                 properties:
 *                   bhk:
 *                     type: string
 *                     enum: [1RK, 1BHK, 2BHK, 3BHK, 4BHK+]
 *                     example: 2BHK
 *                   property_type:
 *                     type: string
 *                     enum: [apartment, house, villa, studio, penthouse, commercial, other]
 *                     example: apartment
 *                   bathrooms:
 *                     type: number
 *                     example: 2
 *                   balconies:
 *                     type: number
 *                     example: 1
 *                   furnishing_status:
 *                     type: string
 *                     enum: [fully_furnished, semi_furnished, unfurnished]
 *                     example: fully_furnished
 *                   size_sq_ft:
 *                     type: number
 *                     example: 1200
 *                   floor_number:
 *                     type: number
 *                     example: 5
 *                   total_floors:
 *                     type: number
 *                     example: 10
 *                   property_age_years:
 *                     type: number
 *                     example: 5
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Parking, Lift, Security, Gym]
 *               expected_rent:
 *                 type: number
 *                 example: 25000
 *               expected_deposit:
 *                 type: number
 *                 example: 100000
 *               description:
 *                 type: string
 *                 example: Beautiful apartment with modern amenities in prime location
 *               maintenance_details:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 2000
 *                   frequency:
 *                     type: string
 *                     enum: [monthly, quarterly, yearly]
 *                     example: monthly
 *                   included_in_rent:
 *                     type: boolean
 *                     example: false
 *                   description:
 *                     type: string
 *                     example: Maintenance charges for common area
 *               status:
 *                 type: string
 *                 enum: [vacant, occupied, maintenance]
 *                 example: vacant
 *               available_from:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-02-01T00:00:00Z
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     properties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Property'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
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
 *                 example: Beautiful 2BHK Apartment
 *               address:
 *                 type: object
 *                 properties:
 *                   society_name:
 *                     type: string
 *                   street:
 *                     type: string
 *                   locality:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   map_link:
 *                     type: string
 *                     format: uri
 *               specs:
 *                 type: object
 *                 properties:
 *                   bhk:
 *                     type: string
 *                     enum: [1RK, 1BHK, 2BHK, 3BHK, 4BHK+]
 *                   property_type:
 *                     type: string
 *                     enum: [apartment, house, villa, studio, penthouse, commercial, other]
 *                   bathrooms:
 *                     type: number
 *                   balconies:
 *                     type: number
 *                   furnishing_status:
 *                     type: string
 *                     enum: [fully_furnished, semi_furnished, unfurnished]
 *                   size_sq_ft:
 *                     type: number
 *                   floor_number:
 *                     type: number
 *                   total_floors:
 *                     type: number
 *                   property_age_years:
 *                     type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               expected_rent:
 *                 type: number
 *               expected_deposit:
 *                 type: number
 *               description:
 *                 type: string
 *               maintenance_details:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   frequency:
 *                     type: string
 *                     enum: [monthly, quarterly, yearly]
 *                   included_in_rent:
 *                     type: boolean
 *                   description:
 *                     type: string
 *               status:
 *                 type: string
 *                 enum: [vacant, occupied, maintenance]
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     property:
 *                       $ref: '#/components/schemas/Property'
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
