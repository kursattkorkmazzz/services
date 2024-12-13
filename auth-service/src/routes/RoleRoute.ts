import RoleController from "@/controllers/role-controller/RoleController";
import authorizationMiddleware from "@/middleware/authorization-middleware";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import express from "express";

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

// Creating New Role
RoleRoute.post(
  "/",
  authorizationMiddleware("role:create"),
  async (req, res, next) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.ROLE_NAME_REQUIRED).toString()
            )
          );
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
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.ID_IS_REQUIRED).toString()
            )
          );
      }

      const role = await RoleController.ReadRoleById(id);
      if (!role) {
        res
          .status(404)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.ROLE_NOT_FOUND).toString()
            )
          );
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
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.ID_IS_REQUIRED).toString()
            )
          );
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
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.ROLE_ID_REQURIED).toString()
            )
          );
      }

      if (!permission_id) {
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(
                MyErrorTypes.PERMISSION_ID_REQURIED
              ).toString()
            )
          );
      }

      const status: boolean = await RoleController.DeletePermissionFromRole(
        role_id,
        permission_id
      );
      if (status) {
        res
          .status(200)
          .send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
        return;
      } else {
        res.status(400).send(MyResponse.createResponse(MyResponseTypes.FAILED));
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
        res
          .status(200)
          .send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
        return;
      } else {
        res.status(200).send(MyResponse.createResponse(MyResponseTypes.FAILED));
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
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
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
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);
export default RoleRoute;
