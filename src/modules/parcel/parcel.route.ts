import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";

const router = Router();

router.post("/", checkAuth(Role.SENDER), ParcelControllers.createParcel);

router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);
// View all parcels created by the sender
router.get("/me", checkAuth(Role.SENDER), ParcelControllers.getMyParcels);

// View a specific parcel details
router.get(
  "/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.getSpecificParcelDetails
);

export const ParcelRoutes = router;
