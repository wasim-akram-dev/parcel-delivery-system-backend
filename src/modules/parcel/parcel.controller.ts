import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
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

export const ParcelControllers = {
  createParcel,
  cancelParcel,
  getMyParcels,
  getSpecificParcelDetails,
  getIncomingParcels,
  confirmParcel,
  getDeliveryHistory,
};
