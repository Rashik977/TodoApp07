import request from "supertest";
import express from "express";
import { Roles } from "../../constants/Roles";
import config from "../../config";
import userRoutes from "../../routes/user";

import expect from "expect";

// Integration test for User
describe("User Integration Test Suite", () => {
  const app = express();

  app.use(express.json());
  app.use("/users", userRoutes);

  // Test createUser API
  describe("createUser API Test", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${config.test_jwt}`)
        .send({
          id: "1",
          name: "test",
          email: "test@test.com",
          password: "Password1235#@",
          role: Roles.USER,
          permissions: ["users.get"],
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created");
    });
  });

  // Test getUsers API
  describe("getUsers API Test", () => {
    it("should get all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test getUsersbyId API
  describe("getUsersbyId API Test", () => {
    it("should get user by ID", async () => {
      const userID = 1;
      const response = await request(app)
        .get(`/users/?q=${userID}`)
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(userID.toString());
    });
  });

  // Test updateUsers API
  describe("updateUsers API Test", () => {
    it("should update a user", async () => {
      const userId = 1;
      const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${config.test_jwt}`)
        .send({
          name: "Updated Name",
          password: "UpdatedPassword123@",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated");
    });
  });

  // Test deleteUsers API
  describe("deleteUsers API Test", () => {
    it("should delete a user", async () => {
      const userId = 1;
      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${config.test_jwt}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted");
    });
  });
});
