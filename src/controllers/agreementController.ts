import { Request, Response, NextFunction } from 'express';
import Agreement from '../models/Agreement';
import Property from '../models/Property';
import { HTTP_STATUS } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

export const createAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const agreementData = { ...req.body, landlord: userId };

    // Verify property belongs to landlord
    const property = await Property.findOne({ _id: agreementData.property, owner: userId });
    if (!property) {
      throw createError('Property not found or access denied', HTTP_STATUS.NOT_FOUND);
    }

    const agreement = await Agreement.create(agreementData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { agreement },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgreements = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status, role } = req.query;

    const filter: any = role === 'landlord' ? { landlord: userId } : { tenant: userId };
    if (status) filter.status = status;

    const agreements = await Agreement.find(filter)
      .populate('property')
      .populate('landlord', 'name email')
      .populate('tenant', 'name email')
      .sort({ created_at: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { agreements },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const agreement = await Agreement.findOne({
      _id: id,
      $or: [{ landlord: userId }, { tenant: userId }],
    })
      .populate('property')
      .populate('landlord', 'name email')
      .populate('tenant', 'name email');

    if (!agreement) {
      throw createError('Agreement not found', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { agreement },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const agreement = await Agreement.findOneAndUpdate(
      { _id: id, landlord: userId, status: 'draft' },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!agreement) {
      throw createError('Agreement not found or cannot be updated', HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { agreement },
    });
  } catch (error) {
    next(error);
  }
};

export const signAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const { role } = req.body; // 'landlord' or 'tenant'

    const agreement = await Agreement.findById(id);
    if (!agreement) {
      throw createError('Agreement not found', HTTP_STATUS.NOT_FOUND);
    }

    // Verify user has permission to sign
    if (role === 'landlord' && agreement.landlord.toString() !== userId) {
      throw createError('Unauthorized', HTTP_STATUS.FORBIDDEN);
    }
    if (role === 'tenant' && agreement.tenant?.toString() !== userId) {
      throw createError('Unauthorized', HTTP_STATUS.FORBIDDEN);
    }

    // Update signature
    if (role === 'landlord') {
      agreement.signatures.landlord_signed = true;
      agreement.signatures.landlord_signed_at = new Date();
      agreement.signatures.landlord_ip = req.ip;
    } else {
      agreement.signatures.tenant_signed = true;
      agreement.signatures.tenant_signed_at = new Date();
      agreement.signatures.tenant_ip = req.ip;
    }

    // Update status if both signed
    if (agreement.signatures.landlord_signed && agreement.signatures.tenant_signed) {
      agreement.status = 'active';
    } else {
      agreement.status = 'pending_signature';
    }

    await agreement.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { agreement },
    });
  } catch (error) {
    next(error);
  }
};
