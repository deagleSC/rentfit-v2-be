import multer from 'multer';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from './errorHandler';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images, videos, and PDFs
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      createError(
        'Invalid file type. Only images, videos, and PDFs are allowed.',
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper for single file upload
export const uploadSingle = (fieldName: string = 'file') => upload.single(fieldName);

// Helper for multiple files upload
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) =>
  upload.array(fieldName, maxCount);
