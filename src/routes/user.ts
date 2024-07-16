import express from "express";
import {
  createUser,
  getUsers,
  updateUsers,
  deleteUsers,
} from "../controller/user";
import { authenticate, authorize } from "../middlewares/auth";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middlewares/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserBodySchema,
  userIdSchema,
} from "../schema/user";

const userRoutes = express.Router();

userRoutes.get(
  "/",
  authenticate,
  authorize("users.get"),
  validateReqQuery(getUserQuerySchema),
  getUsers
);
userRoutes.post(
  "/",
  authenticate,
  authorize("users.post"),
  validateReqBody(createUserBodySchema),
  createUser
);
userRoutes.put(
  "/:id",
  authenticate,
  authorize("users.put"),
  validateReqParams(userIdSchema),
  validateReqBody(updateUserBodySchema),
  updateUsers
);
userRoutes.delete(
  "/:id",
  authenticate,
  authorize("users.delete"),
  validateReqParams(userIdSchema),
  deleteUsers
);

export default userRoutes;
