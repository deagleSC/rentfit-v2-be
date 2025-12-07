import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import { uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/cloudinaryController';

const router = Router();

/**
 * @swagger
 * /api/cloudinary/upload:
 *   post:
 *     summary: Upload a single file to Cloudinary
 *     tags: [Cloudinary]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: File to upload (image, video, or PDF, max 10MB)
 *       - in: formData
 *         name: type
 *         type: string
 *         enum: [kyc, agreement, receipt, inspection, other]
 *         description: Document type
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Document category (e.g., 'aadhar', 'pan', 'rent_receipt')
 *       - in: formData
 *         name: related_model
 *         type: string
 *         enum: [User, Property, Agreement, Payment, Inspection, Ticket]
 *         description: Related model type
 *       - in: formData
 *         name: related_id
 *         type: string
 *         description: ID of the related entity
 *       - in: formData
 *         name: save_to_documents
 *         type: boolean
 *         description: Whether to save the file metadata to Document model
 *     responses:
 *       200:
 *         description: File uploaded successfully
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
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: Cloudinary URL of the uploaded file
 *                     public_id:
 *                       type: string
 *                       description: Cloudinary public ID
 *                     file_name:
 *                       type: string
 *                     file_size:
 *                       type: number
 *                     mime_type:
 *                       type: string
 *                     document:
 *                       type: object
 *                       nullable: true
 *                       description: Document record if save_to_documents is true
 *       400:
 *         description: Bad request (no file or invalid file type)
 *         $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.post('/upload', authenticate, uploadSingle('file'), uploadFile);

/**
 * @swagger
 * /api/cloudinary/upload-multiple:
 *   post:
 *     summary: Upload multiple files to Cloudinary
 *     tags: [Cloudinary]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *         description: Files to upload (max 10 files, 10MB each)
 *       - in: formData
 *         name: type
 *         type: string
 *         enum: [kyc, agreement, receipt, inspection, other]
 *         description: Document type
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Document category
 *       - in: formData
 *         name: related_model
 *         type: string
 *         enum: [User, Property, Agreement, Payment, Inspection, Ticket]
 *         description: Related model type
 *       - in: formData
 *         name: related_id
 *         type: string
 *         description: ID of the related entity
 *       - in: formData
 *         name: save_to_documents
 *         type: boolean
 *         description: Whether to save file metadata to Document model
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                     files:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                             format: uri
 *                           public_id:
 *                             type: string
 *                           file_name:
 *                             type: string
 *                           file_size:
 *                             type: number
 *                           mime_type:
 *                             type: string
 *                           document:
 *                             type: object
 *                             nullable: true
 *                     count:
 *                       type: number
 *       400:
 *         description: Bad request (no files or invalid file types)
 *         $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 */
router.post('/upload-multiple', authenticate, uploadMultiple('files', 10), uploadMultipleFiles);

/**
 * @swagger
 * /api/cloudinary/delete/{public_id}:
 *   delete:
 *     summary: Delete a file from Cloudinary
 *     tags: [Cloudinary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary public ID of the file to delete
 *       - in: query
 *         name: delete_from_documents
 *         schema:
 *           type: boolean
 *         description: Whether to also delete the document record from database
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     public_id:
 *                       type: string
 *                     document_id:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: Bad request (missing public_id)
 *         $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         description: Document not found (when delete_from_documents is true)
 *         $ref: '#/components/schemas/Error'
 */
router.delete('/delete/:public_id', authenticate, deleteFile);

export default router;
