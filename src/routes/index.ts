import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { UserRoutes } from "../modules/user/user.route";
import { userMe } from "../modules/userMe/userMe.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/parcels",
    route: ParcelRoutes,
  },
  {
    path: "/profile",
    route: userMe,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
