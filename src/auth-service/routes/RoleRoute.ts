import MyError from "@/commons/utils/error/MyError";
import RoleController from "../controllers/role-controller/RoleController";
import authorizationMiddleware from "../middleware/authorization-middleware";

import MyPagingResponse from "@/commons/utils/response/MyPagingResponse";
import MyResponse from "@/commons/utils/response/MyResponse";
import express from "express";
import CreateError from "../utils/auth-error-types";

// /role
const RoleRoute = express.Router();

// Gets list of roles. (Pagination) It must be top most because of conflict with "/:id" route path.
RoleRoute.get(
  "/roles",
  authorizationMiddleware("role:read"),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const roles = await RoleController.GetRoles(Number(page), Number(limit));

      res.status(200).send(
        MyPagingResponse.createPagingResponse(
          {
            page: Number(page),
            pageSize: Number(limit),
            total: roles.totalCount,
            roles: roles.roleList,
          },
          null
        )
      );
    } catch (e) {
      next(e);
    }
  }
);

RoleRoute.get(
  "/permissions",
  authorizationMiddleware("role:read"),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;

      const permissions = await RoleController.GetAllPermissions(
        Number(page),
        Number(limit)
      );

      res.status(200).send(
        MyPagingResponse.createPagingResponse(
          {
            page: Number(page),
            pageSize: Number(limit),
            total: permissions.totalCount,
            permissions: permissions.permissionsList,
          },
          null
        )
      );
    } catch (e) {
      next(e);
    }
  }
);

// Creating New Role
RoleRoute.post(
  "/",
  authorizationMiddleware("role:create"),
  async (req, res, next) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        MyError.sendMyError(CreateError("ROLE_NAME_REQUIRED"), res, 400);
        return;
      }
      const newRole = await RoleController.CreateRole(name, description);
      res.status(200).send(MyResponse.createResponse(newRole.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Deleting Role by id
RoleRoute.delete(
  "/:ids",
  authorizationMiddleware("role:delete"),
  async (req, res, next) => {
    try {
      const ids = req.params.ids.split(",");
      await RoleController.DeleteRolesByIds(ids);
      res.status(200).send(MyResponse.createResponse("Roles are deleted."));
    } catch (e) {
      next(e);
    }
  }
);

// Getting role information (id,name and description)
RoleRoute.get(
  "/:id",
  authorizationMiddleware("role:read"),
  async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }

      const role = await RoleController.ReadRoleById(id);
      if (!role) {
        MyError.sendMyError(CreateError("ROLE_NOT_FOUND"), res, 404);
        return;
      }
      res.status(200).send(MyResponse.createResponse(role.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Updating Role information such as name and description.
RoleRoute.patch(
  "/:id",
  authorizationMiddleware("role:update"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { name, description } = req.body;

      if (!id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }

      const updatedRole = await RoleController.UpdateRole(id, {
        name,
        description,
      });

      res.status(200).send(MyResponse.createResponse(updatedRole.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Getting all permissions of a role
RoleRoute.get(
  "/:id/permissions",
  authorizationMiddleware("role:read"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const permissions = await RoleController.GetPermissionsOfRole(id);
      res.status(200).send(MyResponse.createResponse(permissions));
    } catch (e) {
      next(e);
    }
  }
);

// Deleting a permission from a role
RoleRoute.delete(
  "/:role_id/permission/:permission_id",
  authorizationMiddleware("role:update"),
  async (req, res, next) => {
    try {
      const { role_id, permission_id } = req.params;

      if (!role_id) {
        MyError.sendMyError(CreateError("ROLE_ID_REQURIED"), res, 400);
        return;
      }

      if (!permission_id) {
        MyError.sendMyError(CreateError("PERMISSION_ID_REQURIED"), res, 400);
        return;
      }

      const status: boolean = await RoleController.DeletePermissionFromRole(
        role_id,
        permission_id
      );
      if (status) {
        res.status(200).send(MyResponse.createSuccessResponse());
        return;
      } else {
        res.status(400).send(MyResponse.createFailResponse());
        return;
      }
    } catch (e) {
      next(e);
    }
  }
);

// Adding a permission to a role
RoleRoute.post(
  "/:role_id/permission/:permission_id",
  authorizationMiddleware("role:update"),
  async (req, res, next) => {
    try {
      const { role_id, permission_id } = req.params;

      const result: boolean = await RoleController.AddPermissionToRole(
        role_id,
        permission_id
      );

      if (result) {
        res.status(200).send(MyResponse.createSuccessResponse());
        return;
      } else {
        res.status(200).send(MyResponse.createFailResponse());
        return;
      }
    } catch (e) {
      next(e);
    }
  }
);

// Add a role to a user
RoleRoute.post(
  "/:role_id/user/:user_id",
  authorizationMiddleware("role:assign"),
  async (req, res, next) => {
    try {
      const { role_id, user_id } = req.params;
      await RoleController.AddRoleToUser(user_id, role_id);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);

// Delete a role from a user
RoleRoute.delete(
  "/:role_id/user/:user_id",
  authorizationMiddleware("role:assign"),
  async (req, res, next) => {
    try {
      const { role_id, user_id } = req.params;
      await RoleController.RemoveRoleFromUser(user_id, role_id);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);
export default RoleRoute;
