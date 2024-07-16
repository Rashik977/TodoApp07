import expect from "expect";
import sinon from "sinon";
import * as TaskModel from "../../../model/task";
import { NotFoundError } from "../../../error/Error";
import {
  createTask,
  getTasks,
  getTaskById,
  getTasksByUserId,
  updateTask,
  deleteTask,
} from "../../../service/task";
import { describe } from "mocha";
import { TASK_STATUS } from "../../../constants/TaskStatus";

// test cases for task service
describe("Task Service", () => {
  let taskModelStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });

  // test cases for getTasks
  describe("getTasks", () => {
    it("should get all tasks", () => {
      taskModelStub = sinon.stub(TaskModel, "getTasks").returns([
        {
          userId: 1,
          id: 1,
          title: "Complete assignment",
          status: TASK_STATUS.NOTSTARTED,
        },
      ]);

      const result = getTasks();
      expect(taskModelStub.calledOnce).toBe(true);
      expect(result).toStrictEqual([
        {
          userId: 1,
          id: 1,
          title: "Complete assignment",
          status: TASK_STATUS.NOTSTARTED,
        },
      ]);
    });

    it("should throw NotFoundError if no tasks found", () => {
      taskModelStub = sinon.stub(TaskModel, "getTasks").returns(null);

      expect(() => getTasks()).toThrow(new NotFoundError("No tasks found"));
      expect(taskModelStub.calledOnce).toBe(true);
    });
  });

  // test cases for getTasksByUserId
  describe("getTasksByUserId", () => {
    it("should get tasks by user ID", () => {
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "getTasksByUserId").returns([
        {
          userId: 1,
          id: 1,
          title: "Complete assignment",
          status: TASK_STATUS.NOTSTARTED,
        },
      ]);

      const result = getTasksByUserId(userId);
      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(userId)).toBe(true);
      expect(result).toStrictEqual([
        {
          userId: 1,
          id: 1,
          title: "Complete assignment",
          status: TASK_STATUS.NOTSTARTED,
        },
      ]);
    });

    it("should throw NotFoundError if no tasks found for user", () => {
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "getTasksByUserId").returns(null);

      expect(() => getTasksByUserId(userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(userId)).toBe(true);
    });
  });

  // test cases for getTaskById
  describe("getTaskById", () => {
    it("should get task by ID and user ID", () => {
      const id = 1;
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });

      const result = getTaskById(id, userId);
      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(id)).toBe(true);
      expect(result).toStrictEqual({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });
    });

    it("should throw NotFoundError if task not found", () => {
      const id = 1;
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns(null);

      expect(() => getTaskById(id, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(id)).toBe(true);
    });

    it("should throw NotFoundError if task userId does not match", () => {
      const id = 1;
      const userId = 2;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });

      expect(() => getTaskById(id, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(id)).toBe(true);
    });
  });

  // test cases for createTask
  describe("createTask", () => {
    it("should create a task", () => {
      taskModelStub = sinon.stub(TaskModel, "addTask").returns();

      const task = {
        userId: 1,
        title: "New Task",
        status: TASK_STATUS.NOTSTARTED,
        id: 1,
      };
      const result = createTask(task);

      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskModelStub.calledWith(task)).toBe(true);
      expect(result).toStrictEqual({ message: "Task created" });
    });
  });

  // test cases for updateTask
  describe("updateTask", () => {
    it("should update a task", () => {
      const id = 1;
      const userId = 1;
      const task = {
        title: "Updated Task",
        status: TASK_STATUS.DONE,
        id: id,
        userId: userId,
      };
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });
      const taskIndexStub = sinon
        .stub(TaskModel, "findTaskIndexById")
        .returns(0);
      const updateTaskStub = sinon.stub(TaskModel, "updateTask").returns();

      const result = updateTask(id, task, userId);

      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskIndexStub.calledOnce).toBe(true);
      expect(updateTaskStub.calledOnce).toBe(true);
      expect(result).toStrictEqual({ message: "Task updated" });
    });

    it("should throw NotFoundError if task not found", () => {
      const id = 1;
      const userId = 1;
      const task = {
        title: "Updated Task",
        status: TASK_STATUS.DONE,
        id: id,
        userId: userId,
      };
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns(null);

      expect(() => updateTask(id, task, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
    });

    it("should throw NotFoundError if task userId does not match", () => {
      const id = 1;
      const userId = 2;
      const task = {
        title: "Updated Task",
        status: TASK_STATUS.DONE,
        id: id,
        userId: userId,
      };
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });

      expect(() => updateTask(id, task, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
    });
  });

  // test cases for deleteTask
  describe("deleteTask", () => {
    it("should delete a task", () => {
      const id = 1;
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });
      const taskIndexStub = sinon
        .stub(TaskModel, "findTaskIndexById")
        .returns(0);
      const deleteTaskStub = sinon.stub(TaskModel, "deleteTask").returns();

      const result = deleteTask(id, userId);

      expect(taskModelStub.calledOnce).toBe(true);
      expect(taskIndexStub.calledOnce).toBe(true);
      expect(deleteTaskStub.calledOnce).toBe(true);
      expect(result).toStrictEqual({ message: "Task deleted" });
    });

    it("should throw NotFoundError if task not found", () => {
      const id = 1;
      const userId = 1;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns(null);

      expect(() => deleteTask(id, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
    });

    it("should throw NotFoundError if task userId does not match", () => {
      const id = 1;
      const userId = 2;
      taskModelStub = sinon.stub(TaskModel, "findTaskById").returns({
        userId: 1,
        id: 1,
        title: "Complete assignment",
        status: TASK_STATUS.NOTSTARTED,
      });

      expect(() => deleteTask(id, userId)).toThrow(
        new NotFoundError("No tasks found")
      );
      expect(taskModelStub.calledOnce).toBe(true);
    });
  });
});
