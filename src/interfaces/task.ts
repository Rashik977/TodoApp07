import { TASK_STATUS } from "../constants/TaskStatus";

export interface Task {
  userId: number;
  id: number;
  title: string;
  status: TASK_STATUS;
}
