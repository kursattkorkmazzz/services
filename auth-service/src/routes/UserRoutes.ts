import AuthenticationController from "@/controllers/AuthenticationController";
import AuthorizationController from "@/controllers/AuthorizationController";
import UserController from "@/controllers/user-controller/UserController";
import authorizationMiddleware from "@/middleware/authorization-middleware";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import express from "express";

const UserRoute = express.Router();

// ======================================== ADMIN API ========================================

// Gets profile of list of users.
UserRoute.get(
  "/users",
  authorizationMiddleware("user:read-any"),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const roles = await UserController.GetUsers(Number(page), Number(limit));

      res.status(200).send(
        MyPagingResponse.createPagingResponse(
          {
            page: Number(page),
            pageSize: Number(limit),
            total: roles.totalCount,
            roles: roles.userList,
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
  "/:ids",
  authorizationMiddleware("user:delete-any"),
  async (req, res, next) => {
    try {
      const ids = req.params.ids.split(",");
      if (!ids) {
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

      await UserController.DeleteUsersByIds(ids);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
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
UserRoute.post(
  "/:user_id/password-based-auth",
  authorizationMiddleware("user:update-any"),
  async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { username, password } = req.body;
      if (!user_id) {
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
      await UserController.SetPasswordBaseAuth(user_id, password);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
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
      const { firstname, lastname, email, birth_date, gender, photo_url } =
        req.body;

      if (!firstname) {
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.FIRSTNAME_REQUIRED).toString()
            )
          );
        return;
      }

      if (!lastname) {
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.LASTNAME_REQUIRED).toString()
            )
          );
        return;
      }

      if (!email) {
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.EMAIL_REQUIRED).toString()
            )
          );
        return;
      }

      const newUser = await UserController.CreateUser({
        firstname,
        lastname,
        email,
        birth_date,
        gender,
        photo_url,
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
      await UserController.DeleteUsersByIds([user_id]);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
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
      await UserController.SetPasswordBaseAuth(user_id, password);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);
export default UserRoute;