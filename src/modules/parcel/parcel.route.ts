import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";

const router = Router();

// RECEIVERS
router.get(
  "/incoming-parcels",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getIncomingParcels
);

router.get(
  "/delivery-history",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getDeliveryHistory
);

// ADMINS
router.get(
  "/view-all-users",
  checkAuth(Role.ADMIN),
  ParcelControllers.getAllUsers
);

router.get(
  "/view-all-parcels",
  checkAuth(Role.ADMIN),
  ParcelControllers.getAllParcels
);

// View all parcels created by the sender
router.get("/me", checkAuth(Role.SENDER), ParcelControllers.getMyParcels);

// View a specific parcel details
router.get(
  "/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.getSpecificParcelDetails
);

router.patch(
  "/update-user-role/:id",
  checkAuth(Role.ADMIN),
  ParcelControllers.updateUserRole
);

router.post(
  "/update-user-active-status",
  checkAuth(Role.ADMIN),
  ParcelControllers.updateUserActiveStatus
);

router.post(
  "/update-parcel-status",
  checkAuth(Role.ADMIN),
  ParcelControllers.updateParcelStatus
);

// SENDERS
router.post("/", checkAuth(Role.SENDER), ParcelControllers.createParcel);

router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);

router.patch(
  "/confirm-parcel/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.confirmParcel
);

export const ParcelRoutes = router;
