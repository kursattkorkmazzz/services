import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import gracefulShutdown from "./utils/gracefull-shutdown";
import Logger from "./utils/logger";
import DefineAssociation from "./utils/database/initialize_associations";
import { InitializeDatabase } from "./utils/database/initialize_database";
import AuthenticationRoute from "./routes/AuthenticationRoutes";
import AuthorizationRoute from "./routes/AuthorizationRoutes";
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

  // Default error handler.
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err.message);
    res.sendStatus(500);
  });
  // All other routes return 401 - Not Authorized
  app.use("*", (req, res) => {
    res.status(401).send();
  });

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
