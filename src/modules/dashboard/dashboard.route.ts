import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DashboardControllers } from "./dashboard.controller";

const router = Router();

// Admin-only overview
router.get(
  "/admin/overview",
  checkAuth(Role.ADMIN),
  DashboardControllers.getAdminOverview
);

export const DashboardRoutes = router;
