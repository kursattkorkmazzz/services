import Role from "@/database/models/Role";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import { DatabaseError, UniqueConstraintError } from "sequelize";

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
          throw MyError.createError(MyErrorTypes.ROLEN_NAME_MUST_BE_UNIQE);
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
}
