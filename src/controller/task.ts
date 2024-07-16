import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import * as TaskService from "../service/task";
import { Roles } from "../constants/Roles";
import { UnauthorizedError } from "../error/Error";
import HTTP from "http-status-codes";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("TaskController");

// Get all tasks
export function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info("Fetching all tasks");
    const user = req.user!;
    let tasks;
    if (user.role === Roles.SUPER) {
      tasks = TaskService.getTasks(); // Fetch all tasks for superuser
    } else {
      const id = parseInt(user.id);
      tasks = TaskService.getTasksByUserId(id); // Fetch only user-specific tasks for normal users
    }
    res.status(HTTP.OK).json(tasks);
  } catch (e) {
    logger.error("Error fetching tasks", { error: e });
    next(e);
  }
}

// Get task by id
export function getTaskById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  const user = req.user!;

  try {
    logger.info("Fetching task by id", { id });
    const message = TaskService.getTaskById(parseInt(id), parseInt(user.id));

    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error fetching task by id", { error: e });
    next(e);
  }
}

// Create a new task
export function createTask(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError("Unauthenticated");
  const id = parseInt(req.user.id);
  try {
    logger.info("Creating a new task", { task: req.body });
    req.body.userId = id;
    const message = TaskService.createTask(req.body);
    res.status(HTTP.CREATED).json(message);
  } catch (e) {
    logger.error("Error creating task", { error: e });
    next(e);
  }
}

// Update a task
export function updateTask(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  if (!req.user) throw new UnauthorizedError("Unauthenticated");
  const userId = parseInt(req.user.id);

  try {
    logger.info("Updating task", { id });
    const message = TaskService.updateTask(id, req.body, userId);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error updating task", { error: e });
    next(e);
  }
}

// Delete a task
export function deleteTask(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  if (!req.user) throw new UnauthorizedError("Unauthenticated");
  const userId = parseInt(req.user.id);

  try {
    logger.info("Deleting task", { id });
    const message = TaskService.deleteTask(id, userId);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error deleting task", { error: e });
    next(e);
  }
}
