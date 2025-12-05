import { Request, Response, NextFunction } from 'express';
import Inspection from '../models/Inspection';
import Agreement from '../models/Agreement';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../services/CloudinaryService';

export const createInspection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const inspectionData = { ...req.body, conducted_by: userId };

    // Verify agreement exists
    const agreement = await Agreement.findById(inspectionData.agreement);
    if (!agreement) {
      throw createError('Agreement not found', HTTP_STATUS.NOT_FOUND);
    }

    const inspection = await Inspection.create(inspectionData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { inspection },
    });
  } catch (error) {
    next(error);
  }
};

export const getInspections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agreement, type } = req.query;

    const filter: any = {};
    if (agreement) filter.agreement = agreement;
    if (type) filter.type = type;

    const inspections = await Inspection.find(filter)
      .populate('agreement')
      .populate('property')
      .populate('conducted_by', 'name email')
      .sort({ inspection_date: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { inspections },
    });
  } catch (error) {
    next(error);
  }
};

export const getInspection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const inspection = await Inspection.findById(id)
      .populate('agreement')
      .populate('property')
      .populate('conducted_by', 'name email');

    if (!inspection) {
      throw createError('Inspection not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { inspection },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadInspectionPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      throw createError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    const inspection = await Inspection.findById(id);
    if (!inspection) {
      throw createError('Inspection not found', HTTP_STATUS.NOT_FOUND);
    }

    const { url } = await uploadToCloudinary(file, {
      folder: `rentfit/inspections/${id}`,
    });

    inspection.photos.push({
      url,
      room: req.body.room || 'general',
      description: req.body.description,
      uploaded_at: new Date(),
    });

    await inspection.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { photo: inspection.photos[inspection.photos.length - 1] },
    });
  } catch (error) {
    next(error);
  }
};
