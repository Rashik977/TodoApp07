import { NextFunction, Request as ExpressRequest, Response } from "express";
import { Request } from "../interfaces/auth";
import * as UserService from "../service/user";

import loggerWithNameSpace from "../utils/logger";
import HTTP from "http-status-codes";
import { getUserQuery } from "../interfaces/User";

const logger = loggerWithNameSpace("UserController");

// Get all users
export async function getUsers(
  req: ExpressRequest<any, any, any, getUserQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Fetching all users");
    const { query } = req;

    res.status(HTTP.OK).json(await UserService.getUsers(query));
  } catch (e) {
    logger.error("Error fetching users", { error: e });
    next(e);
  }
}

// Create a new user
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    logger.info("Creating a new user", { user: body });
    const message = await UserService.createUser(body, req.user!);
    res.status(HTTP.CREATED).json(message);
  } catch (e) {
    logger.error("Error creating user", { error: e });
    next(e);
  }
}

// Update a user
export async function updateUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);

  try {
    logger.info("Updating user");
    const message = await UserService.updateUsers(id, req.body, req.user!);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error updating user", { error: e });
    next(e);
  }
}

// Delete a User
export async function deleteUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  try {
    logger.info("Deleting user", { id });
    const message = await UserService.deleteUsers(id);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error deleting user", { error: e });
    next(e);
  }
}
