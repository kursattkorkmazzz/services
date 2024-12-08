import RoleController from "@/controllers/RoleController";
import Role from "@/database/models/Role";
import authorizationMiddleware from "@/middleware/authorization-middleware";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import Logger from "@/utils/logger";
import MyResponse from "@/utils/response/MyResponse";
import express from "express";
import { UniqueConstraintError } from "sequelize";

const RoleRoute = express.Router();

/**
 * Creating New Role
 * Deleting Role
 * Updating Role -- Adding/Removing Permissions from role
 * Viewing Specific Role
 * Viewving Roles as List
 */

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
RoleRoute.patch("/:id", async (req, res, next) => {});

// Gets list of roles. (Pagination)
RoleRoute.get("/roles", async (req, resizeBy, next) => {});

// Getting all permissions of a role
RoleRoute.get("/:id/permissions", async (req, res, next) => {});

// Deleting a permission from a role
RoleRoute.delete(
  "/:id/permission/:permission_id",
  async (req, res, next) => {}
);
// Adding a permission to a role
RoleRoute.post("/:id/permission/:permission_id", async (req, res, next) => {});

export default RoleRoute;
