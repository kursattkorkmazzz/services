import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import gracefulShutdown from "./commons/utils/gracefull-shutdown";
import Logger from "./commons/utils/logger";
import cors from "cors";

import { BaseError, DatabaseError } from "sequelize";
import AuthenticationServiceDefineAssociation from "./auth-service/utils/database-association";
import AuthenticationRoute from "./auth-service/routes/AuthenticationRoutes";
import AuthorizationRoute from "./auth-service/routes/AuthorizationRoutes";
import RoleRoute from "./auth-service/routes/RoleRoute";
import UserRoute from "./auth-service/routes/UserRoutes";
import MyError from "./commons/utils/error/MyError";

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000; // default port to listen
const app = express();

// run async code
(async () => {
  // Database initialization and testing
  await AuthenticationServiceDefineAssociation();

  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use("/authn", AuthenticationRoute);
  app.use("/authz", AuthorizationRoute);
  app.use("/role-service", RoleRoute);
  app.use("/user-service", UserRoute);

  // Default error handler.
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MyError) {
      MyError.sendMyError(err, res, 400);
      return;
    } else if (err instanceof BaseError) {
      if (err instanceof DatabaseError) {
        if ((err.original as any).code == "22P02") {
          MyError.sendError(
            MyError.createError({
              error_code: "UUID_SYNTAX_ERROR",
              description: "Invalid id syntax.",
            }),
            res,
            400
          );
          return;
        }
      }
    }
    Logger.error(err);

    res.sendStatus(500);
  });

  // All other routes return 401 - Not Authorized
  app.use(
    "*",
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(401);
    }
  );

  // start the Express server
  const server: Server = app.listen(port, () => {
    Logger.info("Backend Services are running on port " + port);
  });

  // Gracefully shutdown the server
  process.on("SIGINT", () => {
    gracefulShutdown(server);
  });
})();
export default app;
