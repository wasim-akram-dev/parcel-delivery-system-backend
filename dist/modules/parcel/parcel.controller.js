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
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
const createParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdParcel = yield parcel_service_1.ParcelServices.createParcel(req, req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "parcel Created Successfully",
            data: createdParcel,
        });
    }
    catch (error) {
        next(error);
    }
});
const cancelParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const canceledParcel = yield parcel_service_1.ParcelServices.cancelParcel(id, req);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "parcel canceled Successfully",
            data: canceledParcel,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyParcels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcels = yield parcel_service_1.ParcelServices.getMyParcels(req);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Parcels Retrieved Successfully",
            data: parcels,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSpecificParcelDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const specificParcelDetails = yield parcel_service_1.ParcelServices.getSpecificParcelDetails(id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Get a specific parcel details successfully",
            data: specificParcelDetails,
        });
    }
    catch (error) {
        next(error);
    }
});
// RECEIVERS
const getIncomingParcels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const id = req.header;
        const parcels = yield parcel_service_1.ParcelServices.getIncomingParcels(req);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Get Incoming Parcels Successfully",
            data: parcels,
        });
    }
    catch (error) {
        next(error);
    }
});
const confirmParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const confirmed = yield parcel_service_1.ParcelServices.confirmParcel(id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.ACCEPTED,
            message: "Parcel Confirmed Successfully",
            data: confirmed,
        });
    }
    catch (error) {
        next(error);
    }
});
const getDeliveryHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization || req.cookies.accessToken;
        const parcel = yield parcel_service_1.ParcelServices.getDeliveryHistory(token);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Get Parcel Delivery History Successfully",
            data: parcel,
        });
    }
    catch (error) {
        next(error);
    }
});
// ADMINS
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield parcel_service_1.ParcelServices.getAllUsers();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Get All Users Successfully",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllParcels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcels = yield parcel_service_1.ParcelServices.getAllParcels();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Get All Parcels Successfully",
            data: parcels,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield parcel_service_1.ParcelServices.updateUserRole(id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Role Updated Successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUserActiveStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "_id, isActive status required");
        }
        const updatedUser = yield parcel_service_1.ParcelServices.updateUserActiveStatus(req);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "User isActive status updated Successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateParcelStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "_id, parcel_status required");
        }
        const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelStatus(req);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "parcel_status updated Successfully",
            data: updatedParcel,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ParcelControllers = {
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
