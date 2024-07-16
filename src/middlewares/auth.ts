import config from "../config";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../interfaces/User";
import { Request } from "../interfaces/auth";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../error/Error";

import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("AuthMiddleware");

// Middleware to authenticate user
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = new UnauthorizedError("Unauthorized");
    next(error);
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    const error = new BadRequestError("Invalid token");
    next(error);
    return;
  }

  try {
    logger.info("Verifying token");
    const user = (await verify(token[1], config.jwt.secret!)) as User;

    req.user = user;
  } catch (error) {
    logger.error("Error verifying token", { error });
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        const customError = new UnauthorizedError("Token has expired");
        next(customError);
        return;
      } else if (error.name === "JsonWebTokenError") {
        const customError = new BadRequestError("Invalid token");
        next(customError);
        return;
      }
    }
    const unknownError = new InternalServerError("Could not authenticate");
    next(unknownError);
  }
  next();
}

// Middleware to authorize user
export function authorize(permission: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user!;

    if (!user.permissions.includes(permission)) {
      logger.error("User not authorized");
      const error = new ForbiddenError("Forbidden");
      next(error);
      return;
    }
    logger.info("User authorized");
    next();
  };
}
