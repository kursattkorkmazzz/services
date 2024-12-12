import Role from "@/database/models/Role";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import Logger from "@/utils/logger";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  InferAttributes,
  InstanceUpdateOptions,
  UniqueConstraintError,
} from "sequelize";
import { RoleUpdateOptions } from "./RoleControllerTypes";
import Permission from "@/database/models/Permission";
import PermissionRole from "@/database/models/junction_models/PermissionRole";

export default class RoleController {
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
   * @param id - The ID of the role to retrieve.
   * @returns A promise that resolves to the role if found.
   * @throws {MyError} If the role is not found.
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
      let offset = undefined;
      if (limit && page) {
        offset = (page - 1) * limit;
      }

      const roles = await Role.findAll({
        offset,
        limit: limit,
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
}
