import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controller/task";
import { authenticate, authorize } from "../middlewares/auth";
import { validateReqBody, validateReqParams } from "../middlewares/validator";
import {
  createTaskBodySchema,
  updateTaskBodySchema,
  taskIdSchema,
} from "../schema/task";

const tasksRoutes = express.Router();

tasksRoutes.get("/", authenticate, authorize("tasks.get"), getTasks);

tasksRoutes.get(
  "/:id",
  authenticate,
  authorize("tasks.get"),
  validateReqParams(taskIdSchema),
  getTaskById
);

tasksRoutes.post(
  "/",
  authenticate,
  authorize("tasks.post"),
  validateReqBody(createTaskBodySchema),
  createTask
);

tasksRoutes.put(
  "/:id",
  authenticate,
  authorize("tasks.put"),
  validateReqParams(taskIdSchema),
  validateReqBody(updateTaskBodySchema),
  updateTask
);

tasksRoutes.delete(
  "/:id",
  authenticate,
  authorize("tasks.delete"),
  validateReqParams(taskIdSchema),
  deleteTask
);

export default tasksRoutes;
