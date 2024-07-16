import { Request as ExpressRequest } from "express";
import { User } from "./User";

export interface Request extends ExpressRequest {
  user?: User;
}
