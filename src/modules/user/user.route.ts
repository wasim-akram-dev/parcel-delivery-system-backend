import { Router } from "express";
import { validationRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.get("/all-users", UserControllers.getAllUsers);

router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);

export const UserRoutes = router;
