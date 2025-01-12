import Role from "@/database/models/Role";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";
import { RoleUpdateOptions } from "./RoleControllerTypes";
import Permission from "@/database/models/Permission";
import PermissionRole from "@/database/models/junction_models/PermissionRole";
import UserController from "../user-controller/UserController";
import UserRole from "@/database/models/junction_models/UserRole";

export default class RoleController {
  private static staticRoleIdList: string[] = [
    "a3cf85b7-4995-43fc-9790-58c032b27ab6",
    "b3cf85b7-4995-43fc-9790-58c032b27ab6",
  ];

  /**
   * Creates a new role with the given name and optional description.
   *
   * @param name - The name of the role to be created.
   * @param description - An optional description of the role.
   * @returns A promise that resolves to the newly created Role object.
   * @throws {MyError} If the role name is not unique.
   * @throws {Error} If any other error occurs during role creation.
   */
  public static async CreateRole(
    name: string,
    description?: string
  ): Promise<Role> {
    try {
      const newRole = await Role.create({
        name: name,
        description: description,
      });

      return newRole;
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        if (e.errors[0].path === "name") {
          throw MyError.createError(MyErrorTypes.ROLE_NAME_MUST_BE_UNIQE);
        }
      }
      throw e;
    }
  }

  /**
   * Deletes roles by their IDs.
   *
   * This method takes an array of role IDs and deletes the corresponding roles from the database.
   * If a database error occurs, it throws a error indicating the error.
   *
   * @param {string[]} ids - An array of role IDs to be deleted.
   * @returns {Promise<void>} A promise that resolves when the roles are deleted.
   * @throws {MyError} Throws a custom error if a database error occurs.
   */
  public static async DeleteRolesByIds(ids: string[]): Promise<void> {
    try {
      await Promise.all(
        ids.map(async (id) => {
          if (this.staticRoleIdList.includes(id)) {
            throw MyError.createError(MyErrorTypes.ROLE_DELETE_RESTRICTION);
          }

          await Role.destroy({
            where: {
              id: ids,
            },
          });
        })
      );
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw MyError.createError(MyErrorTypes.UUID_SYNTAX_ERROR);
      }
      throw e;
    }
  }

  /**
   * Retrieves a role by its ID.
   *
   * @param {string} role_id - The ID of the role to retrieve.
   * @returns {Promise<Role>} A promise that resolves to the role object.
   * @throws {MyError} Throws an error if the role is not found.
   */
  public static async ReadRoleById(id: string): Promise<Role> {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw MyError.createError(MyErrorTypes.ROLE_NOT_FOUND);
      }
      return role;
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw MyError.createError(MyErrorTypes.UUID_SYNTAX_ERROR);
      }
      throw e;
    }
  }

  /**
   * Updates the role with the given ID using the provided new data.
   *
   * @param id - The ID of the role to update.
   * @param newData - An object containing the new data for the role.
   * @returns A promise that resolves to the updated role.
   * @throws Will throw an error if the role is not found or if an update error occurs.
   */
  public static async UpdateRole(
    id: string,
    newData: RoleUpdateOptions
  ): Promise<Role> {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw MyError.createError(MyErrorTypes.ROLE_NOT_FOUND);
      }
      // Check if the role name is in the restricted list.
      if (this.staticRoleIdList.includes(role.id!)) {
        throw MyError.createError(MyErrorTypes.ROLE_DELETE_RESTRICTION);
      }

      await role.update({
        name: newData.name,
        description: newData.description,
      });

      return role;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves a paginated list of roles from the database.
   *
   * @param {number} [page] - The page number for pagination (optional).
   * @param {number} [limit] - The number of roles to retrieve per page (optional).
   * @returns {Promise<{ roleList: Role[]; totalCount: number }>} A promise that resolves to an object containing the list of roles and the total count of roles.
   * @throws Will throw an error if the retrieval fails.
   */
  public static async GetRoles(
    page?: number,
    limit?: number
  ): Promise<{ roleList: Role[]; totalCount: number }> {
    try {
      const Paginagiton: any = {};

      if (limit && page) {
        Paginagiton["offset"] = (page - 1) * limit;
        Paginagiton["limit"] = limit;
      }

      const roles = await Role.findAll({
        ...Paginagiton,
      });

      const totalRoleCount = await Role.count();
      return {
        roleList: roles,
        totalCount: totalRoleCount,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves the permissions associated with a specific role.
   *
   * @param role_id - The unique identifier of the role.
   * @returns A promise that resolves to an array of permissions associated with the role.
   * @throws Will throw an error if the role does not exist.
   */
  public static async GetPermissionsOfRole(
    role_id: string
  ): Promise<Permission[]> {
    try {
      const role = await this.ReadRoleById(role_id); // Checks the role is exist or not. If not exist throws error.
      return role.getPermissions();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deletes a permission from a role.
   *
   * @param role_id - The ID of the role from which the permission will be removed.
   * @param permission_id - The ID of the permission to be removed.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   * @throws Will throw an error if the deletion operation fails.
   */
  public static async DeletePermissionFromRole(
    role_id: string,
    permission_id: string
  ): Promise<boolean> {
    try {
      // Check if the role name is in the restricted list.
      if (this.staticRoleIdList.includes(role_id)) {
        throw MyError.createError(MyErrorTypes.ROLE_DELETE_RESTRICTION);
      }
      const deletedPermissionCount: number = await PermissionRole.destroy({
        where: {
          role_id: role_id,
          permission_id: permission_id,
        },
      });
      if (deletedPermissionCount <= 0) return false;
      return true;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Adds a permission to a role by creating an entry in the PermissionRole table.
   *
   * @param role_id - The ID of the role to which the permission will be added.
   * @param permission_id - The ID of the permission to be added to the role.
   * @returns A promise that resolves to a boolean indicating whether the operation was successful.
   * @throws {MyError} If the permission is not found (ForeignKeyConstraintError).
   */
  public static async AddPermissionToRole(
    role_id: string,
    permission_id: string
  ): Promise<boolean> {
    try {
      // Check if the role name is in the restricted list.
      if (this.staticRoleIdList.includes(role_id)) {
        throw MyError.createError(MyErrorTypes.ROLE_DELETE_RESTRICTION);
      }
      const result: PermissionRole = await PermissionRole.create({
        role_id,
        permission_id,
      });
      return true;
    } catch (e) {
      if (e instanceof ForeignKeyConstraintError) {
        throw MyError.createError(MyErrorTypes.PERMISSION_NOT_FOUND);
      }
      throw e;
    }
  }

  /**
   * Adds a role to a user by their respective IDs.
   *
   * @param user_id - The ID of the user to whom the role will be added.
   * @param role_id - The ID of the role to be added to the user.
   * @returns A promise that resolves when the role has been successfully added to the user.
   * @throws Will throw an error if the role or user cannot be found, or if there is an issue creating the user-role association.
   */
  public static async AddRoleToUser(
    user_id: string,
    role_id: string
  ): Promise<void> {
    try {
      const role = await this.ReadRoleById(role_id);
      const user = await UserController.GetUserById(user_id);

      await UserRole.create({
        user_id: user.id,
        role_id: role.id,
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Removes a role from a user.
   *
   * @param user_id - The ID of the user from whom the role will be removed.
   * @param role_id - The ID of the role to be removed from the user.
   * @returns A promise that resolves when the role has been removed from the user.
   * @throws Will throw an error if the role or user cannot be found, or if the removal operation fails.
   */
  public static async RemoveRoleFromUser(
    user_id: string,
    role_id: string
  ): Promise<void> {
    try {
      const role = await this.ReadRoleById(role_id);
      const user = await UserController.GetUserById(user_id);

      await UserRole.destroy({
        where: {
          user_id: user.id,
          role_id: role.id,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public static async GetAllPermissions(
    page?: number,
    limit?: number
  ): Promise<{ permissionsList: Permission[]; totalCount: number }> {
    try {
      const Paginagiton: any = {};

      if (limit && page) {
        Paginagiton["offset"] = (page - 1) * limit;
        Paginagiton["limit"] = limit;
      }

      const permissions = await Permission.findAll({
        ...Paginagiton,
      });

      const totalPermissionCount = await Permission.count();
      
      return {
        permissionsList: permissions,
        totalCount: totalPermissionCount,
      };
    } catch (e) {
      throw e;
    }
  }
}
