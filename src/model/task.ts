import { TASK_STATUS } from "../constants/TaskStatus";
import { getTaskQuery, Task } from "../interfaces/task";
import { BaseModel } from "./base";

// Task model class
export class TaskModel extends BaseModel {
  // Function to create a task
  static async create(task: Task, statusId: number) {
    const taskToCreate = {
      userId: task.userId,
      title: task.title,
      statusId: statusId,
    };

    await this.queryBuilder().insert(taskToCreate).table("tasks");
  }

  // Function to get status id
  static async getStatusId(status: TASK_STATUS) {
    const statusId = await this.queryBuilder()
      .select("id")
      .table("tasks_status")
      .where({ status });
    return statusId[0].id;
  }

  // Function to get tasks by user id
  static getTasksByUserId(userId: number, filter: getTaskQuery) {
    const { q, page, size } = filter;
    const query = this.queryBuilder()
      .select("id", "title", "status_id")
      .table("tasks")
      .where({ userId })
      .limit(size)
      .offset((page - 1) * size);
    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  // Function to count tasks by user id
  static countByUserId(userId: number, filter: getTaskQuery) {
    const { q } = filter;
    const query = this.queryBuilder()
      .count("*")
      .table("tasks")
      .where({ userId })
      .first();

    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  // Function to get all tasks
  static getTasks(filter: getTaskQuery) {
    const { q, page, size } = filter;

    const query = this.queryBuilder()
      .select("id", "title", "status_id")
      .table("tasks")
      .limit(size)
      .offset((page - 1) * size);
    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  // Function to count all tasks
  static count(filter: getTaskQuery) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("tasks").first();

    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  // Function to get task by id and user id
  static async getUserTask(id: number, userId: number) {
    return await this.queryBuilder()
      .select("*")
      .table("tasks")
      .where({ id, userId })
      .first();
  }

  // Function to update a task
  static async updateTask(id: number, task: Task) {
    const taskToUpdate = {
      title: task.title,
      statusId: task.status,
      updatedAt: new Date(),
      updatedBy: task.userId,
    };
    await this.queryBuilder().update(taskToUpdate).table("tasks").where({ id });
  }

  // Function to delete a task
  static async deleteTask(id: number, userId: number) {
    await this.queryBuilder().delete().table("tasks").where({ id, userId });
  }
}
