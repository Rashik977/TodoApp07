import { TASK_STATUS } from "../constants/TaskStatus";
import { Task } from "../interfaces/task";

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
