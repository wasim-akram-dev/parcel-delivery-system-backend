import { Request } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (req: Request, payload: Partial<IParcel>) => {
  const trackingId = "TRK" + Date.now();
  payload.trackingId = trackingId;

  const token = req.headers.authorization || req.cookies.accessToken;
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

  const token = req.headers.authorization || req.cookies.accessToken;

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
  const token = req.headers.authorization || req.cookies.accessToken;

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
  const token = req.headers.authorization || req.cookies.accessToken;
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

// ADMINS
const getAllUsers = async () => {
  const allUsers = await User.find();
  return allUsers;
};

const getAllParcels = async () => {
  const allParcels = await Parcel.find()
    .populate("senderId", "name role email phone")
    .populate("receiverId", "name role email phone");
  return allParcels;
};

const updateUserRole = async (id: string) => {
  const toUpdateUserRole = await User.findById(id);

  if (!toUpdateUserRole) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found for this id");
  }
  if (toUpdateUserRole.role === "ADMIN") {
    throw new AppError(httpStatus.NOT_FOUND, "user already a Admin");
  }

  // set
  toUpdateUserRole.role = Role.ADMIN;
  const updatedUser = await User.findByIdAndUpdate(id, toUpdateUserRole, {
    new: true,
  });

  return updatedUser;
};

const updateUserActiveStatus = async (userId: string, isActive: IsActive) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (user.isActive === isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already in this ${isActive} status`
    );
  }

  user.isActive = isActive;
  if (isActive === IsActive.BLOCKED) {
    user.isActive = IsActive.BLOCKED;
  } else if (isActive === IsActive.INACTIVE) {
    user.isActive = IsActive.INACTIVE;
  } else {
    user.isActive = IsActive.ACTIVE;
  }

  // await user.save();

  const updatedUser = await User.findByIdAndUpdate(userId, user, {
    new: true,
  });
  return updatedUser;
};

const updateParcelStatus = async (
  parcelId: string,
  parcel_status: ParcelStatus
) => {
  const foundedParcel = await Parcel.findById(parcelId);

  if (!foundedParcel) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found for this _id");
  }

  if (
    ["Cancelled", "Returned", "Delivered"].includes(foundedParcel.parcel_status)
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This parcel cannot be updated coz it is currently marked as "${foundedParcel.parcel_status}" now, try again`
    );
  }

  foundedParcel.parcel_status = parcel_status;
  // update the statusLog
  const newStatusLog = {
    location: "System",
    timestamp: new Date(),
    status: parcel_status,
    note: `Parcel is ${parcel_status}.`,
  };
  foundedParcel.statusLog.push(newStatusLog);

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    foundedParcel,
    {
      new: true,
    }
  );
  return updatedParcel;
};

const updateParcelBlockStatus = async (
  parcelId: string,
  isBlocked: boolean
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found for this ID");
  }

  // Optional rule: Prevent blocking delivered or cancelled parcels
  if (["Delivered", "Cancelled"].includes(parcel.parcel_status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot block a parcel with status "${parcel.parcel_status}".`
    );
  }

  parcel.isBlocked = isBlocked;

  // Add a note in status log
  const newStatusLog = {
    location: "System",
    timestamp: new Date(),
    status: parcel.parcel_status,
    note: isBlocked ? "Parcel has been blocked." : "Parcel has been unblocked.",
  };
  parcel.statusLog.push(newStatusLog);

  await parcel.save();
  return parcel;
};

const getParcelByTrackingId = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId })
    .populate("senderId", "name email role")
    .populate("receiverId", "name email role");

  if (!parcel) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Parcel not found with this tracking ID"
    );
  }

  return parcel;
};

export const ParcelServices = {
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
  updateParcelBlockStatus,
  getParcelByTrackingId,
};
