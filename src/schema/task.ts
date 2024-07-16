import Joi from "joi";
import { TASK_STATUS } from "../constants/TaskStatus";

// Define the schema for the task query
export const createTaskBodySchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title must be a string",
  }),
  status: Joi.string()
    .required()
    .messages({
      "any.only": `Status must be one of ${Object.values(TASK_STATUS).join(
        ", "
      )}`,
    })
    .custom((value, helpers) => {
      if (!Object.values(TASK_STATUS).includes(value)) {
        return helpers.error("any.only");
      }

      return value;
    }),
}).options({ stripUnknown: true });

// Define the schema for the update task body
export const updateTaskBodySchema = Joi.object({
  title: Joi.string().optional().messages({
    "any.required": "Title must be a string",
  }),
  status: Joi.string()
    .optional()
    .messages({
      "any.only": `Status must be one of ${Object.values(TASK_STATUS).join(
        ", "
      )}`,
    })
    .custom((value, helpers) => {
      if (!Object.values(TASK_STATUS).includes(value)) {
        return helpers.error("any.only");
      }

      return value;
    }),
}).options({ stripUnknown: true });

// Define the schema for the task ID
export const taskIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
