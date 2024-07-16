import expect from "expect";
import sinon from "sinon";
import bcrypt from "bcrypt";

import * as UserModel from "../../../model/user";
import { NotFoundError } from "../../../error/Error";
import {
  createUser,
  deleteUsers,
  getUsers,
  updateUsers,
} from "../../../service/user";
import { describe } from "mocha";
import { Roles } from "../../../constants/Roles";

// test cases for user service
describe("User Service", () => {
  // test cases for createUser
  describe("createUser", () => {
    let bcryptHashStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;

    beforeEach(() => {
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = sinon.stub(UserModel, "createUser");
    });

    afterEach(() => {
      bcryptHashStub.restore();
      userModelCreateUserStub.restore();
    });

    it("should create user", async () => {
      bcryptHashStub.resolves("hashedPassword");
      const user = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "password123",
        role: Roles.USER,
        permissions: [],
      };

      await createUser(user);

      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);

      expect(userModelCreateUserStub.callCount).toBe(1);
      expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([
        { ...user, password: "hashedPassword" },
      ]);
    });
  });

  // test cases for getUsers
  describe("getUsers", () => {
    let userModelGetUsersStub: sinon.SinonStub;

    beforeEach(() => {
      userModelGetUsersStub = sinon.stub(UserModel, "getUsers");
    });

    afterEach(() => {
      userModelGetUsersStub.restore();
    });

    it("should get users", () => {
      const query = { q: "test" };
      const users = [{ name: "test", email: "test@test.com" }];

      userModelGetUsersStub.returns(users);

      const result = getUsers(query);

      expect(userModelGetUsersStub.callCount).toBe(1);
      expect(userModelGetUsersStub.getCall(0).args).toStrictEqual([query]);
      expect(result).toStrictEqual(users);
    });

    it("should throw NotFoundError if no users found", () => {
      const query = { q: "nonexistent" };

      userModelGetUsersStub.returns(null);

      expect(() => getUsers(query)).toThrow(
        new NotFoundError("No users found")
      );
      expect(userModelGetUsersStub.callCount).toBe(1);
      expect(userModelGetUsersStub.getCall(0).args).toStrictEqual([query]);
    });
  });

  // test cases for updateUsers
  describe("updateUsers", () => {
    let userModelFindUserIndexByIdStub: sinon.SinonStub;
    let userModelUpdateUserStub: sinon.SinonStub;
    let bcryptHashStub: sinon.SinonStub;

    beforeEach(() => {
      userModelFindUserIndexByIdStub = sinon.stub(
        UserModel,
        "findUserIndexById"
      );
      userModelUpdateUserStub = sinon.stub(UserModel, "updateUser");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
    });

    afterEach(() => {
      userModelFindUserIndexByIdStub.restore();
      userModelUpdateUserStub.restore();
      bcryptHashStub.restore();
    });

    it("should update user", async () => {
      const id = 1;
      const user = {
        name: "updated",
        password: "newpassword",
        role: Roles.USER,
        permissions: [],
        email: "update@update.com",
        id: "1",
      };
      const userIndex = 0;

      userModelFindUserIndexByIdStub.returns(userIndex);
      bcryptHashStub.resolves("hashedPassword");

      await updateUsers(id, user);

      expect(userModelFindUserIndexByIdStub.callCount).toBe(1);
      expect(userModelFindUserIndexByIdStub.getCall(0).args).toStrictEqual([
        id,
      ]);
      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);
      expect(userModelUpdateUserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual([
        id,
        { ...user, password: "hashedPassword" },
        userIndex,
      ]);
    });

    it("should throw NotFoundError if user not found", async () => {
      const id = 1;
      const user = {
        name: "updated",
        password: "newpassword",
        role: Roles.USER,
        permissions: [],
        email: "update@update.com",
        id: "1",
      };

      userModelFindUserIndexByIdStub.returns(-1);

      await expect(updateUsers(id, user)).rejects.toThrow(
        new NotFoundError("users not found")
      );
      expect(userModelFindUserIndexByIdStub.callCount).toBe(1);
      expect(userModelFindUserIndexByIdStub.getCall(0).args).toStrictEqual([
        id,
      ]);
    });
  });

  // test cases for deleteUsers
  describe("deleteUsers", () => {
    let userModelFindUserIndexByIdStub: sinon.SinonStub;
    let userModelDeleteUserStub: sinon.SinonStub;

    beforeEach(() => {
      userModelFindUserIndexByIdStub = sinon.stub(
        UserModel,
        "findUserIndexById"
      );
      userModelDeleteUserStub = sinon.stub(UserModel, "deleteUser");
    });

    afterEach(() => {
      userModelFindUserIndexByIdStub.restore();
      userModelDeleteUserStub.restore();
    });

    it("should delete user", () => {
      const id = 1;
      const userIndex = 0;

      userModelFindUserIndexByIdStub.returns(userIndex);

      deleteUsers(id);

      expect(userModelFindUserIndexByIdStub.callCount).toBe(1);
      expect(userModelFindUserIndexByIdStub.getCall(0).args).toStrictEqual([
        id,
      ]);
      expect(userModelDeleteUserStub.callCount).toBe(1);
      expect(userModelDeleteUserStub.getCall(0).args).toStrictEqual([
        userIndex,
      ]);
    });

    it("should throw NotFoundError if user not found", () => {
      const id = 1;

      userModelFindUserIndexByIdStub.returns(-1);

      expect(() => deleteUsers(id)).toThrow(
        new NotFoundError("users not found")
      );
      expect(userModelFindUserIndexByIdStub.callCount).toBe(1);
      expect(userModelFindUserIndexByIdStub.getCall(0).args).toStrictEqual([
        id,
      ]);
    });
  });
});
