import request from "supertest";
import express from "express";
import { Roles } from "../../constants/Roles";
import config from "../../config";
import tasksRoutes from "../../routes/task";

import expect from "expect";

// Integration test for Task
describe("Task Integration Test Suite", () => {
  const app = express();

  app.use(express.json());
  app.use("/tasks", tasksRoutes);

  // Test createTask API
  describe("createTask API Test", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${config.test_jwt}`)
        .send({
          id: "1",
          title: "Test Task",
          status: "pending",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Task created");
    });
  });

  // Test getTasks API
  describe("getTasks API Test", () => {
    it("should get all tasks", async () => {
      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test getTaskById API
  describe("getTaskById API Test", () => {
    it("should get task by ID", async () => {
      const taskId = 2;
      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });
  });

  // Test updateTask API
  describe("updateTask API Test", () => {
    it("should update a task", async () => {
      const taskId = 2;
      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${config.test_jwt}`)
        .send({
          title: "Updated Title",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task updated");
    });
  });

  // Test deleteTask API
  describe("deleteTask API Test", () => {
    it("should delete a task", async () => {
      const taskId = 2;
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task deleted");
    });
  });
});
