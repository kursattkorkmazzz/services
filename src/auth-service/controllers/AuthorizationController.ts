import Permission from "../models/Permission";
import Role from "../models/Role";
import User from "../models/User";

export default class AuthorizationController {
  /**
   * Checks if a user has permission to perform a specific operation.
   *
   * @param user_id - The ID of the user whose permissions are being checked.
   * @param operation_code - The code of the operation for which permission is being checked.
   * @returns A promise that resolves to a boolean indicating whether the user has the required permission.
   * @throws Will throw an error if there is an issue with the database query.
   */
  public static async CheckPermission(
    user_id: string,
    operation_code: string
  ): Promise<boolean> {
    let flag: boolean = false;
    try {
      const permission = await Permission.findOne({
        where: {
          code: operation_code,
        },
      });
      if (!permission) {
        return flag;
      }

      const required_roles = await permission.getRoles();

      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) return flag;

      await Promise.all(
        required_roles.map(async (required_role: Role) => {
          if (await user.hasRole(required_role)) {
            flag = true;
          }
        })
      );
      return flag;
    } catch (e) {
      throw e;
    }
  }
}
