import Redis from "ioredis";
import mysql from "mysql2/promise";

import { app } from "./app";
import { config } from "./config/config";
import { logger } from "./config/logger";
import { startCronJobs } from "./jobs";

// @ts-ignore
let server: any;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.warn("Server closed");
      process.exit(1);
    });
  } else {
    logger.warn("Server not started");
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

export const pool = mysql.createPool({
  host: config.database.connection_url,
  user: config.database.options.user,
  password: config.database.options.pass,
  database: config.database.database_name,
  port: config.database.database_port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const redis: Redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  offlineQueue: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 1,
});

const startServer = () => {
  server = app.listen(config.server.port, () => {
    logger.info(`Server started at port: ${config.server.port}`);
    startCronJobs();
  });
};

startServer();

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
