"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["Requested"] = "Requested";
    ParcelStatus["Approved"] = "Approved";
    ParcelStatus["Dispatched"] = "Dispatched";
    ParcelStatus["In_Transit"] = "In_Transit";
    ParcelStatus["Delivered"] = "Delivered";
    ParcelStatus["Cancelled"] = "Cancelled";
    ParcelStatus["Returned"] = "Returned";
    ParcelStatus["Held"] = "Held";
    ParcelStatus["Blocked"] = "Blocked";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
