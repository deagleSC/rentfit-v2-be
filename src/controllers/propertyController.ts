import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../services/CloudinaryService';

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const propertyData = { ...req.body, owner: userId };

    const property = await Property.create(propertyData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status, city, bhk } = req.query;

    const filter: any = { owner: userId };
    if (status) filter.status = status;
    if (city) filter['address.city'] = city;
    if (bhk) filter['specs.bhk'] = bhk;

    const properties = await Property.find(filter)
      .populate('current_agreement')
      .sort({ created_at: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const property = await Property.findOne({ _id: id, owner: userId })
      .populate('owner', 'name email')
      .populate('current_agreement');

    if (!property) {
      throw createError('Property not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const property = await Property.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!property) {
      throw createError('Property not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const property = await Property.findOneAndDelete({ _id: id, owner: userId });

    if (!property) {
      throw createError('Property not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPropertyMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const file = req.file;

    if (!file) {
      throw createError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    const property = await Property.findOne({ _id: id, owner: userId });
    if (!property) {
      throw createError('Property not found', HTTP_STATUS.NOT_FOUND);
    }

    const { url } = await uploadToCloudinary(file, {
      folder: `rentfit/properties/${id}`,
    });

    property.media.push({
      url,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      uploaded_at: new Date(),
    });

    await property.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { media: property.media[property.media.length - 1] },
    });
  } catch (error) {
    next(error);
  }
};
