import MyError from "@/commons/utils/error/MyError";
import AuthenticationController from "../controllers/AuthenticationController";
import UserController from "../controllers/user-controller/UserController";
import { UserCreateOptions } from "../controllers/user-controller/UserControllerTypes";
import authorizationMiddleware from "../middleware/authorization-middleware";

import MyPagingResponse from "@/commons/utils/response/MyPagingResponse";
import MyResponse from "@/commons/utils/response/MyResponse";
import express from "express";
import CreateError from "../utils/auth-error-types";

const UserRoute = express.Router();

// Gets profile of list of users.
UserRoute.get(
  "/users",
  authorizationMiddleware("user:read-any"),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const users = await UserController.GetUsers(Number(page), Number(limit));

      res.status(200).send(
        MyPagingResponse.createPagingResponse(
          {
            page: Number(page),
            pageSize: Number(limit),
            total: users.totalCount,
            users: users.userList,
          },
          null
        )
      );
    } catch (e) {
      next(e);
    }
  }
);

// Gets Profile of **any** User.
UserRoute.get(
  "/:id",
  authorizationMiddleware("user:read-any"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await UserController.GetUserById(id);
      res.status(200).send(MyResponse.createResponse(user.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Deleting **any** user by id
UserRoute.delete(
  "/:id",
  authorizationMiddleware("user:delete-any"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }

      await UserController.DeleteUsersById(id);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);

// Updating information of **any** user information.
UserRoute.patch(
  "/:user_id",
  authorizationMiddleware("user:update-any"),
  async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { firstname, lastname, email, birth_date, gender, photo_url } =
        req.body;

      if (!user_id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }

      const updatedUser = await UserController.UpdateUser(user_id, {
        firstname,
        lastname,
        email,
        birth_date,
        gender,
        photo_url,
      });

      res.status(200).send(MyResponse.createResponse(updatedUser.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Setting PasswordBaseAuth for User
UserRoute.patch(
  "/:user_id/password-based-auth",
  authorizationMiddleware("user:update-any"),
  async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { username, password } = req.body;
      if (!user_id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }
      await UserController.SetPasswordBaseAuth(user_id, { username, password });
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);

// Creating New User
UserRoute.post(
  "/",
  authorizationMiddleware("user:create"),
  async (req, res, next) => {
    try {
      const {
        firstname,
        lastname,
        email,
        birth_date,
        gender,
        photo_url,
        username,
        password,
      }: UserCreateOptions = req.body;

      if (!username) {
        MyError.sendMyError(CreateError("USERNAME_REQUIRED"), res, 400);
        return;
      }
      if (!password) {
        MyError.sendMyError(CreateError("PASSWORD_REQUIRED"), res, 400);
        return;
      }
      if (!firstname) {
        MyError.sendMyError(CreateError("FIRSTNAME_REQUIRED"), res, 400);
        return;
      }
      if (!lastname) {
        MyError.sendMyError(CreateError("LASTNAME_REQUIRED"), res, 400);
        return;
      }
      if (!email) {
        MyError.sendMyError(CreateError("EMAIL_REQUIRED"), res, 400);
        return;
      }

      const newUser = await UserController.CreateUser({
        firstname,
        lastname,
        email,
        birth_date,
        gender,
        photo_url,
        username,
        password,
      });

      res.status(200).send(MyResponse.createResponse(newUser.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// ======================================== USER API ========================================

// Gets its own information.
UserRoute.get(
  "/",
  authorizationMiddleware("user:read"),
  async (req, res, next) => {
    try {
      const access_token = req.headers.authorization!.split(" ")[1];
      const user_id = AuthenticationController.GetUserIdFromToken(access_token);

      const user = await UserController.GetUserById(user_id);
      res.status(200).send(MyResponse.createResponse(user.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

UserRoute.delete(
  "/",
  authorizationMiddleware("user:delete"),
  async (req, res, next) => {
    try {
      const access_token = req.headers.authorization!.split(" ")[1];
      const user_id = AuthenticationController.GetUserIdFromToken(access_token);
      await UserController.DeleteUsersById(user_id);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);

UserRoute.patch(
  "/",
  authorizationMiddleware("user:update"),
  async (req, res, next) => {
    try {
      const access_token = req.headers.authorization!.split(" ")[1];
      const user_id = AuthenticationController.GetUserIdFromToken(access_token);
      const { firstname, lastname, email, birth_date, gender, photo_url } =
        req.body;

      if (!user_id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }

      const updatedUser = await UserController.UpdateUser(user_id, {
        firstname,
        lastname,
        email,
        birth_date,
        gender,
        photo_url,
      });

      res.status(200).send(MyResponse.createResponse(updatedUser.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

UserRoute.post(
  "/password-based-auth",
  authorizationMiddleware("user:update"),
  async (req, res, next) => {
    try {
      const access_token = req.headers.authorization!.split(" ")[1];
      const user_id = AuthenticationController.GetUserIdFromToken(access_token);
      const { username, password } = req.body;
      if (!user_id) {
        MyError.sendMyError(CreateError("ID_IS_REQUIRED"), res, 400);
        return;
      }
      await UserController.SetPasswordBaseAuth(user_id, password);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (e) {
      next(e);
    }
  }
);
export default UserRoute;
