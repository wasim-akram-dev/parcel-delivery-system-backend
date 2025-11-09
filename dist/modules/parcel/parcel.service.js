"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const createParcel = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = "TRK" + Date.now();
    payload.trackingId = trackingId;
    const token = req.headers.authorization || req.cookies.accessToken;
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user token is not found, please login first");
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
    if (decoded.payload.isActive === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Failed, this user is ${decoded.payload.isActive} now`);
    }
    payload.senderId = decoded === null || decoded === void 0 ? void 0 : decoded.payload.userId;
    const receiver = yield user_model_1.User.findOne({ email: payload.receiver_email });
    payload.receiverId = (receiver === null || receiver === void 0 ? void 0 : receiver._id) || null;
    payload.statusLog = [
        {
            location: "System",
            timestamp: new Date(),
            status: parcel_interface_1.ParcelStatus.Requested,
            note: "Parcel created and request submitted.",
        },
    ];
    const createdParcel = yield parcel_model_1.Parcel.create(payload);
    return createdParcel;
});
const cancelParcel = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const toCancelParcel = yield parcel_model_1.Parcel.findById(id);
    if (!toCancelParcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found for this id");
    }
    const token = req.headers.authorization || req.cookies.accessToken;
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "token not found");
    }
    const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
    if (decoded.payload.userId != toCancelParcel.senderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to cancel this parcel.");
    }
    if (decoded.payload.isActive === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Failed, this user is ${decoded.payload.isActive} now`);
    }
    // check if parcel is not approved/requested.
    if (toCancelParcel.parcel_status !== parcel_interface_1.ParcelStatus.Approved &&
        toCancelParcel.parcel_status !== parcel_interface_1.ParcelStatus.Requested) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Cancellation only allowed when status is Requested or Approved. Now parcel status is ${toCancelParcel.parcel_status}`);
    }
    // else make it cancelled.
    toCancelParcel.parcel_status = parcel_interface_1.ParcelStatus.Cancelled;
    // update the statusLog
    const newStatusLog = {
        location: "System",
        timestamp: new Date(),
        status: parcel_interface_1.ParcelStatus.Cancelled,
        note: "Parcel is Cancelled.",
    };
    toCancelParcel.statusLog.push(newStatusLog);
    const canceled = yield parcel_model_1.Parcel.findByIdAndUpdate(id, toCancelParcel, {
        new: true,
    });
    return canceled;
});
const getMyParcels = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || req.cookies.accessToken;
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user token is not found, please login first");
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
    if (decoded.payload.isActive === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Failed, this user is ${decoded.payload.isActive} now`);
    }
    // console.log("from getMYParcels: ", decoded);
    const senderId = decoded === null || decoded === void 0 ? void 0 : decoded.payload.userId;
    const parcels = yield parcel_model_1.Parcel.find({ senderId: senderId });
    return parcels;
});
const getSpecificParcelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const specificParcelDetails = yield parcel_model_1.Parcel.findById(id);
    if (!specificParcelDetails) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel Not found");
    }
    return specificParcelDetails;
});
// RECEIVERS
const getIncomingParcels = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || req.cookies.accessToken;
    // console.log("token", token);
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "token not found in the request");
    }
    const decodedToken = jsonwebtoken_1.default.decode(token, { complete: true });
    // console.log("decodedToken", decodedToken);
    const payload = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload;
    let query = {
        parcel_status: {
            $in: ["Requested", "Approved", "Dispatched", "In_Transit", "Held"],
        },
    };
    if (payload === null || payload === void 0 ? void 0 : payload.userId) {
        query = Object.assign(Object.assign({}, query), { receiverId: payload.userId });
    }
    else if (payload === null || payload === void 0 ? void 0 : payload.email) {
        query = Object.assign(Object.assign({}, query), { receiver_email: payload.email });
    }
    else {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No user identifier found in token.");
    }
    // console.log('query', query);
    const getParcels = yield parcel_model_1.Parcel.find(query);
    if (!getParcels || (getParcels === null || getParcels === void 0 ? void 0 : getParcels.length) === 0) {
        return [];
    }
    return {
        count: getParcels.length,
        Incoming_Parcels: getParcels,
    };
});
const confirmParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const toUpdateParcel = yield parcel_model_1.Parcel.findById(id);
    if (!toUpdateParcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found for this id");
    }
    if (["Cancelled", "Blocked", "Returned", "Held"].includes(toUpdateParcel.parcel_status)) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `This parcel cannot be confirmed because it is currently marked as "${toUpdateParcel.parcel_status}" now, try again`);
    }
    // otherwise make it Delivered to confirm.
    toUpdateParcel.parcel_status = parcel_interface_1.ParcelStatus.Delivered;
    // update the statusLog
    const newStatusLog = {
        location: "System",
        timestamp: new Date(),
        status: parcel_interface_1.ParcelStatus.Delivered,
        note: "Parcel is Delivered.",
    };
    toUpdateParcel.statusLog.push(newStatusLog);
    const confirmed = yield parcel_model_1.Parcel.findByIdAndUpdate(id, toUpdateParcel, {
        new: true,
    });
    return confirmed;
});
const getDeliveryHistory = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Access token not found");
    }
    const decodedToken = jsonwebtoken_1.default.decode(token, { complete: true });
    const deliveredHistory = yield parcel_model_1.Parcel.find({
        receiverId: decodedToken.payload.userId,
        parcel_status: { $ne: "Requested" },
    });
    if (!deliveredHistory) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No parcels are found");
    }
    return deliveredHistory;
});
// ADMINS
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield user_model_1.User.find();
    return allUsers;
});
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    const allParcels = yield parcel_model_1.Parcel.find()
        .populate("senderId", "name role email phone")
        .populate("receiverId", "name role email phone");
    return allParcels;
});
const updateUserRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const toUpdateUserRole = yield user_model_1.User.findById(id);
    if (!toUpdateUserRole) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found for this id");
    }
    if (toUpdateUserRole.role === "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user already a Admin");
    }
    // set
    toUpdateUserRole.role = user_interface_1.Role.ADMIN;
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, toUpdateUserRole, {
        new: true,
    });
    return updatedUser;
});
const updateUserActiveStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    const toUpdateUserIsActive = yield user_model_1.User.findById(req.body._id);
    console.log("toUpdateUserisActive", toUpdateUserIsActive);
    if (!toUpdateUserIsActive) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found for this _id");
    }
    // set (isactive/inactive/block) --> user jeta chabe sheta kore dibo
    toUpdateUserIsActive.isActive = req.body.isActive;
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.body._id, toUpdateUserIsActive, {
        new: true,
    });
    return updatedUser;
});
const updateParcelStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedParcel = yield parcel_model_1.Parcel.findById(req.body._id);
    if (!foundedParcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found for this _id");
    }
    if (["Cancelled", "Returned", "Delivered"].includes(foundedParcel.parcel_status)) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `This parcel cannot be updated coz it is currently marked as "${foundedParcel.parcel_status}" now, try again`);
    }
    foundedParcel.parcel_status = req.body.parcel_status;
    // update the statusLog
    const newStatusLog = {
        location: "System",
        timestamp: new Date(),
        status: req.body.parcel_status,
        note: `Parcel is ${req.body.parcel_status}.`,
    };
    foundedParcel.statusLog.push(newStatusLog);
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(req.body._id, foundedParcel, {
        new: true,
    });
    return updatedParcel;
});
exports.ParcelServices = {
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
