import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import gracefulShutdown from "./utils/gracefull-shutdown";
import Logger from "./utils/logger";
import DefineAssociation from "./utils/database/initialize_associations";
import { InitializeDatabase } from "./utils/database/initialize_database";
import AuthenticationRoute from "./routes/AuthenticationRoutes";
import AuthorizationRoute from "./routes/AuthorizationRoutes";
import MyError from "./utils/error/MyError";
import MyResponse from "./utils/response/MyResponse";
import RoleRoute from "./routes/RoleRoute";
import UserRoute from "./routes/UserRoutes";
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000; // default port to listen
const app = express();

// IIFE to run async code
(async () => {
  // Database initialization and testing
  await InitializeDatabase();
  await DefineAssociation();

  app.use(express.json());

  app.use("/authn", AuthenticationRoute);
  app.use("/authz", AuthorizationRoute);
  app.use("/role-service", RoleRoute);
  app.use("/user-service", UserRoute);

  // Default error handler.
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MyError) {
      res
        .status(400)
        .send(
          MyResponse.createResponse(
            null,
            err.message || err.errorType.toString()
          )
        );
      return;
    } else {
      Logger.error(err);
    }

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
    Logger.info("Server is running on port " + port);
  });

  // Gracefully shutdown the server
  process.on("SIGINT", () => {
    gracefulShutdown(server);
  });
})();
export default app;
