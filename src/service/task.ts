import { TASK_STATUS } from "../constants/TaskStatus";
import { BadRequestError, NotFoundError } from "../error/Error";
import { getTaskQuery, Task } from "../interfaces/task";

import * as TaskModel from "../model/task";

// Get all tasks
export const getTasks = async (query: getTaskQuery) => {
  const data = await TaskModel.TaskModel.getTasks(query);
  if (!data) throw new NotFoundError("No tasks found");

  const count = await TaskModel.TaskModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

export const getTasksByUserId = async (userId: number, query: getTaskQuery) => {
  const data = await TaskModel.TaskModel.getTasksByUserId(userId, query);

  if (!data) throw new NotFoundError("No tasks found");

  const count = await TaskModel.TaskModel.countByUserId(userId, query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Get task from the provided ID
export const getTaskById = async (id: number, userId: number) => {
  const taskOfUser = await TaskModel.TaskModel.getUserTask(id, userId);

  if (!taskOfUser) throw new NotFoundError("No tasks found");

  return taskOfUser;
};

// create a task
export const createTask = async (task: Task) => {
  const statusId = await TaskModel.TaskModel.getStatusId(task.status);
  await TaskModel.TaskModel.create(task, statusId);

  return { message: "Task created" };
};

// function to update a task
export const updateTask = async (id: number, task: Task, userId: number) => {
  const taskOfUser = await TaskModel.TaskModel.getUserTask(id, userId);

  if (!taskOfUser) throw new NotFoundError("No tasks found");

  if (task.status) {
    const statusId = await TaskModel.TaskModel.getStatusId(task.status);
    task.status = statusId;
  }

  await TaskModel.TaskModel.updateTask(id, task);

  return { message: "Task updated" };
};

// function to delete a task
export const deleteTask = async (id: number, userId: number) => {
  const taskOfUser = await TaskModel.TaskModel.getUserTask(id, userId);
  if (!taskOfUser) throw new NotFoundError("No tasks found");

  // Delete task from tasks array
  await TaskModel.TaskModel.deleteTask(id, userId);

  return { message: "Task deleted" };
};
