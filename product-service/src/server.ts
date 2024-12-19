import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import gracefulShutdown from "./utils/gracefull-shutdown";
import Logger from "./utils/logger";
import DefineAssociation from "./utils/database/initialize_associations";
import { InitializeDatabase } from "./utils/database/initialize_database";
import MyError from "./utils/error/MyError";
import MyResponse from "./utils/response/MyResponse";
import ItemRouter from "./routers/ItemRouter";
import { BaseError, DatabaseError } from "sequelize";
import sendError from "./utils/send-error";
import MyErrorTypes from "./utils/error/MyErrorTypes";
import AttributeRouter from "./routers/AttributeRouter";
import AttributeValueRouter from "./routers/AttributeValueRouter";

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000; // default port to listen
const app = express();

// run async code
(async () => {
  // Database initialization and testing
  await InitializeDatabase();
  await DefineAssociation();

  app.use(express.json());

  app.use("/item-service/item", ItemRouter);
  app.use("/item-service/attribute", AttributeRouter);
  app.use("/item-service/attribute-value", AttributeValueRouter);

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
    } else if (err instanceof BaseError) {
      if (err instanceof DatabaseError) {
        if ((err.original as any).code == "22P02") {
          sendError(MyErrorTypes.ID_INVALID_SYNTAX, res, 400);
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
    Logger.info("Product Service is running on port " + port);
  });

  // Gracefully shutdown the server
  process.on("SIGINT", () => {
    gracefulShutdown(server);
  });
})();
export default app;
