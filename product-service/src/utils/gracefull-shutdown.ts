import { Server } from "http";
import Logger from "./logger";
import { SEQUELIZE_DATABASE } from "@/database/Database";

export default function gracefulShutdown(server: Server): void {
  Logger.mark("=================");
  Logger.info("Received kill signal, shutting down gracefully");
  Logger.info("Closing database connection...");
  SEQUELIZE_DATABASE.close();
  Logger.info("Database connection closed.");
  Logger.info("Closing server...");
  server.close();
  Logger.info("Server closed.");
  process.exit();
}
