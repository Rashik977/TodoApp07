import { permissions } from "../constants/Permissions";
import { Roles } from "../constants/Roles";
import { getUserQuery, User } from "../interfaces/User";
import { BaseModel } from "./base";

export class UserModel extends BaseModel {
  static async create(user: User, createdBy: User) {
    const userTOCreate = {
      name: user.name,
      email: user.email,
      password: user.password,
      createdBy: createdBy.id,
    };

    await this.queryBuilder().insert(userTOCreate).table("users");
  }

  static async getUserByEmail(email: string) {
    return await this.queryBuilder()
      .select("*")
      .table("users")
      .where({ email })
      .first();
  }

  static async getRoleId(role: Roles) {
    const roleId = await this.queryBuilder()
      .select("id")
      .table("roles")
      .where({ role });
    return roleId[0].id;
  }

  static async getRoleName(roleId: number) {
    const role = await this.queryBuilder()
      .select("role")
      .table("roles")
      .where({ id: roleId });
    return role[0].role;
  }

  static async getUserRoles(userId: number) {
    return await this.queryBuilder()
      .select("*")
      .table("user_roles")
      .where({ userId });
  }

  static async getRolePermissions(roleId: number) {
    const permissionsId = await this.queryBuilder()
      .select("permission_id")
      .table("role_permissions")
      .where({ roleId: roleId });

    const permissions = await Promise.all(
      permissionsId.map(async (permission) => {
        const result = await this.queryBuilder()
          .select("permission")
          .table("permissions")
          .where({ id: permission.permissionId });
        return result[0].permission;
      })
    );

    return permissions;
  }

  static async createUserRoles(userId: number, roleId: number) {
    const userRoles = {
      userId: userId,
      roleId: roleId,
    };
    await this.queryBuilder().insert(userRoles).table("user_roles");
  }
  static getUsers(filter: getUserQuery) {
    const { q, page, size } = filter;

    const query = this.queryBuilder()
      .select("id", "email", "name")
      .table("users")
      .limit(size)
      .offset((page - 1) * size);
    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }

  static count(filter: getUserQuery) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("users").first();

    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }

  static async getUserById(id: string) {
    return await this.queryBuilder()
      .select("*")
      .table("users")
      .where({ id })
      .first();
  }

  static async update(id: string, user: User, updatedBy: User) {
    const userToUpdate = {
      name: user.name,
      email: user.email,
      password: user.password,
      updatedAt: new Date(),
      updatedBy: updatedBy.id,
    };
    const query = this.queryBuilder()
      .update(userToUpdate)
      .table("users")
      .where({ id });
    await query;
  }
  static delete(id: string) {
    return this.queryBuilder().delete().table("users").where({ id });
  }

  static deleteUserRoles(userId: string) {
    return this.queryBuilder().delete().table("user_roles").where({ userId });
  }

  static deleteUserTasks(userId: string) {
    return this.queryBuilder().delete().table("tasks").where({ userId });
  }
}

// Array to store users, 1 dummy user for testing
export const users: User[] = [
  {
    name: "rashik",
    email: "rkoirala43@gmail.com",
    password: "$2b$10$TGpMkx0Vrux.jO30w88BceN1Tb8IN6MApt7uoNFt8ufiNG8gi4gyy",
    id: "1",
    role: Roles.USER,
    permissions: permissions[Roles.USER],
  },
  {
    name: "super",
    email: "super@super.com",
    password: "$2b$10$Ufl/DBoTufW19vdgbieE9uEgzaWvKJAg556y.qFLLy5pVZ0KmtarC",
    id: "2",
    role: Roles.SUPER,
    permissions: permissions[Roles.SUPER],
  },
];

export const updateUser = (id: number, updatedData: User, index: number) => {
  users[index] = { ...users[index], ...updatedData };
};

export const deleteUser = (index: number): void => {
  users.splice(index, 1);
};

export const findUserIndexById = (id: number): number => {
  return users.findIndex((user) => parseInt(user.id) === id);
};

export const findUserById = (id: number): User | undefined => {
  return users.find((user) => parseInt(user.id) === id);
};
