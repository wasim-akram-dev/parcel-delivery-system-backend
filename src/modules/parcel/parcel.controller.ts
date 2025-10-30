import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";

const createParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdParcel = await ParcelServices.createParcel(req, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "parcel Created Successfully",
      data: createdParcel,
    });
  } catch (error) {
    next(error);
  }
};

const cancelParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const canceledParcel = await ParcelServices.cancelParcel(id, req);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "parcel canceled Successfully",
      data: canceledParcel,
    });
  } catch (error) {
    next(error);
  }
};

const getMyParcels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parcels = await ParcelServices.getMyParcels(req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcels Retrieved Successfully",
      data: parcels,
    });
  } catch (error) {
    next(error);
  }
};

const getSpecificParcelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const specificParcelDetails = await ParcelServices.getSpecificParcelDetails(
      id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get a specific parcel details successfully",
      data: specificParcelDetails,
    });
  } catch (error) {
    next(error);
  }
};

// RECEIVERS
const getIncomingParcels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const id = req.header;
    const parcels = await ParcelServices.getIncomingParcels(req);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get Incoming Parcels Successfully",
      data: parcels,
    });
  } catch (error) {
    next(error);
  }
};

const confirmParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const confirmed = await ParcelServices.confirmParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.ACCEPTED,
      message: "Parcel Confirmed Successfully",
      data: confirmed,
    });
  } catch (error) {
    next(error);
  }
};

const getDeliveryHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    const parcel = await ParcelServices.getDeliveryHistory(token as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get Parcel Delivery History Successfully",
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
};

// ADMINS
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await ParcelServices.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get All Users Successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getAllParcels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parcels = await ParcelServices.getAllParcels();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get All Parcels Successfully",
      data: parcels,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = await ParcelServices.updateUserRole(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Role Updated Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserActiveStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError(httpStatus.NOT_FOUND, "_id, isActive status required");
    }
    const updatedUser = await ParcelServices.updateUserActiveStatus(req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User isActive status updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const updateParcelStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError(httpStatus.NOT_FOUND, "_id, parcel_status required");
    }
    const updatedParcel = await ParcelServices.updateParcelStatus(req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "parcel_status updated Successfully",
      data: updatedParcel,
    });
  } catch (error) {
    next(error);
  }
};

export const ParcelControllers = {
  createParcel,
  cancelParcel,
  getMyParcels,
  getSpecificParcelDetails,
  getIncomingParcels,
  confirmParcel,
  getDeliveryHistory,
  getAllUsers,
  getAllParcels,
  updateUserRole,
  updateUserActiveStatus,
  updateParcelStatus,
};
