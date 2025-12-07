import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/CloudinaryService';
import Document from '../models/Document';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

/**
 * Upload a single file to Cloudinary
 */
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const file = req.file;
    const { type, category, related_model, related_id, save_to_documents } = req.body;

    if (!file) {
      throw createError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    if (!userId) {
      throw createError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    // Determine folder based on type
    let folder = 'rentfit';
    if (type) {
      folder = `rentfit/${type}`;
      if (category) {
        folder = `${folder}/${category}`;
      }
    } else {
      folder = `rentfit/users/${userId}`;
    }

    // Upload to Cloudinary
    const { url, public_id } = await uploadToCloudinary(file, {
      folder,
      resource_type: 'auto',
    });

    // Optionally save to Document model
    let document = null;
    const shouldSaveToDocuments = save_to_documents === 'true' || save_to_documents === true;
    if (shouldSaveToDocuments) {
      document = await Document.create({
        uploaded_by: userId,
        name: file.originalname,
        type: type || 'other',
        category: category || undefined,
        cloudinary_url: url,
        cloudinary_public_id: public_id,
        file_size: file.size,
        mime_type: file.mimetype,
        related_model: related_model || undefined,
        related_id: related_id || undefined,
        is_public: false,
        status: 'pending',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        url,
        public_id,
        file_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        document: document
          ? {
              _id: document._id,
              type: document.type,
              category: document.category,
              status: document.status,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const files = req.files as Express.Multer.File[];
    const { type, category, related_model, related_id, save_to_documents } = req.body;

    if (!files || files.length === 0) {
      throw createError('No files uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    if (!userId) {
      throw createError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    // Determine folder based on type
    let folder = 'rentfit';
    if (type) {
      folder = `rentfit/${type}`;
      if (category) {
        folder = `${folder}/${category}`;
      }
    } else {
      folder = `rentfit/users/${userId}`;
    }

    const uploadResults = [];
    const shouldSaveToDocuments = save_to_documents === 'true' || save_to_documents === true;

    // Upload all files
    for (const file of files) {
      const { url, public_id } = await uploadToCloudinary(file, {
        folder,
        resource_type: 'auto',
      });

      let document = null;
      if (shouldSaveToDocuments) {
        document = await Document.create({
          uploaded_by: userId,
          name: file.originalname,
          type: type || 'other',
          category: category || undefined,
          cloudinary_url: url,
          cloudinary_public_id: public_id,
          file_size: file.size,
          mime_type: file.mimetype,
          related_model: related_model || undefined,
          related_id: related_id || undefined,
          is_public: false,
          status: 'pending',
        });
      }

      uploadResults.push({
        url,
        public_id,
        file_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        document: document
          ? {
              _id: document._id,
              type: document.type,
              category: document.category,
              status: document.status,
            }
          : null,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        files: uploadResults,
        count: uploadResults.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a file from Cloudinary
 */
export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { public_id } = req.params;
    const { delete_from_documents } = req.query;

    if (!userId) {
      throw createError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!public_id) {
      throw createError('Public ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if document exists and user has permission
    // Query parameters are always strings, so we only need to check for 'true'
    const shouldDeleteFromDocuments =
      delete_from_documents === 'true' || String(delete_from_documents) === 'true';
    if (shouldDeleteFromDocuments) {
      const document = await Document.findOne({
        cloudinary_public_id: public_id,
        uploaded_by: userId,
      });

      if (!document) {
        throw createError('Document not found or access denied', HTTP_STATUS.NOT_FOUND);
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(public_id);

      // Delete from database
      await Document.findByIdAndDelete(document._id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'File and document deleted successfully',
        data: {
          public_id,
          document_id: document._id,
        },
      });
    } else {
      // Only delete from Cloudinary
      await deleteFromCloudinary(public_id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'File deleted successfully from Cloudinary',
        data: {
          public_id,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
