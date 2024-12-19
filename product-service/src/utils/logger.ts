import log4js from "log4js";

const environment = process.env.ENV || "development";

log4js.configure({
  appenders: {
    console: { type: "stdout", layout: { type: "colored" } },
  },
  categories: {
    default: { appenders: ["console"], level: "debug" },
    development: { appenders: ["console"], level: "debug" },
    production: { appenders: ["console"], level: "info" },
  },
});

const Logger = log4js.getLogger(environment);
Logger.level = "debug";

export default Logger;
