import { Request } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import { User } from "../user/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (req: Request, payload: Partial<IParcel>) => {
  const trackingId = "TRK" + Date.now();
  payload.trackingId = trackingId;

  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user token is not found, please login first"
    );
  }
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
  if (decoded.payload.isActive === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed, this user is ${decoded.payload.isActive} now`
    );
  }

  payload.senderId = (decoded as JwtPayload)?.payload.userId;

  const receiver = await User.findOne({ email: payload.receiver_email });
  payload.receiverId = receiver?._id || null;

  payload.statusLog = [
    {
      location: "System",
      timestamp: new Date(),
      status: ParcelStatus.Requested,
      note: "Parcel created and request submitted.",
    },
  ];

  const createdParcel = await Parcel.create(payload);
  return createdParcel;
};

const cancelParcel = async (id: string, req: Request) => {
  const toCancelParcel = await Parcel.findById(id);
  if (!toCancelParcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found for this id");
  }

  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "token not found");
  }

  const decoded = jwt.decode(token, { complete: true }) as JwtPayload;

  if (decoded.payload.userId != toCancelParcel.senderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not allowed to cancel this parcel."
    );
  }

  if (decoded.payload.isActive === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed, this user is ${decoded.payload.isActive} now`
    );
  }

  // check if parcel is not approved/requested.
  if (
    toCancelParcel.parcel_status !== ParcelStatus.Approved &&
    toCancelParcel.parcel_status !== ParcelStatus.Requested
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Cancellation only allowed when status is Requested or Approved. Now parcel status is ${toCancelParcel.parcel_status}`
    );
  }

  // else make it cancelled.
  toCancelParcel.parcel_status = ParcelStatus.Cancelled;

  // update the statusLog
  const newStatusLog = {
    location: "System",
    timestamp: new Date(),
    status: ParcelStatus.Cancelled,
    note: "Parcel is Cancelled.",
  };
  toCancelParcel.statusLog.push(newStatusLog);

  const canceled = await Parcel.findByIdAndUpdate(id, toCancelParcel, {
    new: true,
  });
  return canceled;
};

const getMyParcels = async (req: Request) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user token is not found, please login first"
    );
  }
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  const decoded = jwt.decode(token, { complete: true }) as JwtPayload;

  if (decoded.payload.isActive === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed, this user is ${decoded.payload.isActive} now`
    );
  }
  // console.log("from getMYParcels: ", decoded);

  const senderId = (decoded as JwtPayload)?.payload.userId;

  const parcels = await Parcel.find({ senderId: senderId });
  return parcels;
};

const getSpecificParcelDetails = async (id: string) => {
  const specificParcelDetails = await Parcel.findById(id);

  if (!specificParcelDetails) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel Not found");
  }

  return specificParcelDetails;
};

// RECEIVERS
const getIncomingParcels = async (req: Request) => {
  const token = req.headers.authorization;
  // console.log("token", token);

  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "token not found in the request");
  }
  const decodedToken = jwt.decode(token, { complete: true });
  // console.log("decodedToken", decodedToken);
  const payload = (decodedToken as JwtPayload)?.payload;

  let query: Record<string, unknown> = {
    parcel_status: {
      $in: ["Requested", "Approved", "Dispatched", "In_Transit", "Held"],
    },
  };

  if (payload?.userId) {
    query = {
      ...query,
      receiverId: payload.userId,
    };
  } else if (payload?.email) {
    query = {
      ...query,
      receiver_email: payload.email,
    };
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "No user identifier found in token."
    );
  }
  // console.log('query', query);
  const getParcels = await Parcel.find(query);

  if (!getParcels || getParcels?.length === 0) {
    return [];
  }

  return {
    count: getParcels.length,
    Incoming_Parcels: getParcels,
  };
};

const confirmParcel = async (id: string) => {
  const toUpdateParcel = await Parcel.findById(id);

  if (!toUpdateParcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found for this id");
  }
  if (
    ["Cancelled", "Blocked", "Returned", "Held"].includes(
      toUpdateParcel.parcel_status
    )
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This parcel cannot be confirmed because it is currently marked as "${toUpdateParcel.parcel_status}" now, try again`
    );
  }

  // otherwise make it Delivered to confirm.
  toUpdateParcel.parcel_status = ParcelStatus.Delivered;

  // update the statusLog
  const newStatusLog = {
    location: "System",
    timestamp: new Date(),
    status: ParcelStatus.Delivered,
    note: "Parcel is Delivered.",
  };
  toUpdateParcel.statusLog.push(newStatusLog);

  const confirmed = await Parcel.findByIdAndUpdate(id, toUpdateParcel, {
    new: true,
  });
  return confirmed;
};

const getDeliveryHistory = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "Access token not found");
  }
  const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload;

  const deliveredHistory = await Parcel.find({
    receiverId: decodedToken.payload.userId,
    parcel_status: { $ne: "Requested" },
  });
  if (!deliveredHistory) {
    throw new AppError(httpStatus.NOT_FOUND, "No parcels are found");
  }

  return deliveredHistory;
};

export const ParcelServices = {
  createParcel,
  cancelParcel,
  getMyParcels,
  getSpecificParcelDetails,
  getIncomingParcels,
  confirmParcel,
  getDeliveryHistory,
};
