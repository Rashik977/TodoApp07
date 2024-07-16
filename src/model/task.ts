import { TASK_STATUS } from "../constants/TaskStatus";
import { getTaskQuery, Task } from "../interfaces/task";
import { BaseModel } from "./base";

export class TaskModel extends BaseModel {
  static async create(task: Task, statusId: number) {
    const taskToCreate = {
      userId: task.userId,
      title: task.title,
      statusId: statusId,
    };

    await this.queryBuilder().insert(taskToCreate).table("tasks");
  }

  static async getStatusId(status: TASK_STATUS) {
    const statusId = await this.queryBuilder()
      .select("id")
      .table("tasks_status")
      .where({ status });
    return statusId[0].id;
  }

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

  static count(filter: getTaskQuery) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("tasks").first();

    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  static async getUserTask(id: number, userId: number) {
    return await this.queryBuilder()
      .select("*")
      .table("tasks")
      .where({ id, userId })
      .first();
  }

  static async updateTask(id: number, task: Task) {
    const taskToUpdate = {
      title: task.title,
      statusId: task.status,
      updatedAt: new Date(),
      updatedBy: task.userId,
    };
    await this.queryBuilder().update(taskToUpdate).table("tasks").where({ id });
  }

  static async deleteTask(id: number, userId: number) {
    await this.queryBuilder().delete().table("tasks").where({ id, userId });
  }
}

// Array to store tasks
const tasks: Task[] = [
  {
    userId: 1,
    id: 1,
    title: "Complete assignment",
    status: TASK_STATUS.NOTSTARTED,
  },
  {
    userId: 2,
    id: 2,
    title: "Wash the dishes",
    status: TASK_STATUS.PENDING,
  },
  {
    userId: 1,
    id: 3,
    title: "learn about containers and docker",
    status: TASK_STATUS.PENDING,
  },
  {
    userId: 1,
    id: 4,
    title: "call mom",
    status: TASK_STATUS.DONE,
  },
];

export const addTask = (task: Task) => {
  tasks.push({
    userId: task.userId,
    id: tasks.length + 1,
    title: task.title,
    status: task.status,
  });
};

export const getTasks = () => {
  return tasks;
};

export const getTasksByUserId = (userId: number) => {
  return tasks.filter((task) => task.userId === userId);
};

export const findTaskIndexById = (id: number): number => {
  return tasks.findIndex((task) => task.id === id);
};

export const findTaskById = (id: number): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

export const updateTask = (id: number, updatedData: Task, index: number) => {
  console.log(index, updatedData);
  tasks[index] = { ...tasks[index], ...updatedData };
};

export const deleteTask = (index: number): void => {
  tasks.splice(index, 1);
};
