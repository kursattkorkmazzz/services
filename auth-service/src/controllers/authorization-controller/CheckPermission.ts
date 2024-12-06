import Permission from "@/database/models/Permission";
import Role from "@/database/models/Role";
import User from "@/database/models/User";
import Logger from "@/utils/logger";

export default async function CheckPermission(
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
    Logger.info(new Date(Date.now()).toISOString());
    throw e;
  }
}
