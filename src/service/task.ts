import { TASK_STATUS } from "../constants/TaskStatus";
import { BadRequestError, NotFoundError } from "../error/Error";
import { Task } from "../interfaces/task";

import * as TaskModel from "../model/task";

// Get all tasks
export const getTasks = () => {
  const tasks = TaskModel.getTasks();

  if (!tasks) throw new NotFoundError("No tasks found");

  return tasks;
};

export const getTasksByUserId = (userId: number) => {
  const tasks = TaskModel.getTasksByUserId(userId);

  if (!tasks) throw new NotFoundError("No tasks found");

  return tasks;
};

// Get task from the provided ID
export const getTaskById = (id: number, userId: number) => {
  const taskOfUser = TaskModel.findTaskById(id);

  if (!taskOfUser) throw new NotFoundError("No tasks found");

  if (taskOfUser.userId !== userId) throw new NotFoundError("No tasks found");

  return taskOfUser;
};

// create a task
export const createTask = (task: Task) => {
  TaskModel.addTask(task);

  return { message: "Task created" };
};

// function to update a task
export const updateTask = (id: number, task: Task, userId: number) => {
  const taskIndex = TaskModel.findTaskIndexById(id);
  const taskOfUser = TaskModel.findTaskById(id);

  if (!taskOfUser) throw new NotFoundError("No tasks found");
  if (taskOfUser.userId !== userId) throw new NotFoundError("No tasks found");

  // Check if task exists
  if (taskIndex === -1) throw new NotFoundError("No tasks found");

  TaskModel.updateTask(id, task, taskIndex);

  return { message: "Task updated" };
};

// function to delete a task
export const deleteTask = (id: number, userId: number) => {
  const taskIndex = TaskModel.findTaskIndexById(id);
  const taskOfUser = TaskModel.findTaskById(id);

  if (!taskOfUser) throw new NotFoundError("No tasks found");
  if (taskOfUser.userId !== userId) throw new NotFoundError("No tasks found");

  // Check if task exists
  if (taskIndex === -1) throw new NotFoundError("No tasks found");

  // Delete task from tasks array
  TaskModel.deleteTask(taskIndex);

  return { message: "Task deleted" };
};
