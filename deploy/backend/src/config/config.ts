import * as path from "path";

import dotenv from "dotenv";
import { cleanEnv, EnvError, EnvMissingError, num, str } from "envalid";

dotenv.config({ path: path.resolve(`${__dirname}/../../.env`) });

const envVars = cleanEnv(
  process.env,
  {
    NODE_ENV: str(),
    APP_PORT: num(),
    APP_ENVIRONMENT: str(),
    APP_LOG_LEVEL: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_CONNECTION_STRING: str(),
    DB_INTERNAL_PORT: num(),
    DB_EXTERNAL_PORT: num(),
    REDIS_HOST: str(),
    REDIS_PORT: num(),
    SOLANA_NETWORK: str(),
  },
  {
    reporter: ({ errors }) => {
      /* eslint-disable no-unreachable-loop, no-restricted-syntax */
      for (const [environmentVariable, error] of Object.entries(errors)) {
        if (error instanceof EnvError) {
          throw new EnvError(`${environmentVariable} EnvError ${error}`);
        } else if (error instanceof EnvMissingError) {
          throw new EnvMissingError(
            `${environmentVariable} EnvMissingError ${error}`,
          );
        } else {
          throw new TypeError(`${environmentVariable} error ${error}`);
        }
      }
    },
  },
);

export const config = {
  nodeEnv: envVars.NODE_ENV,
  env: envVars.APP_ENVIRONMENT,
  server: {
    port: envVars.APP_PORT,
    log_level: envVars.APP_LOG_LEVEL,
  },
  database: {
    connection_url: envVars.DB_CONNECTION_STRING,
    database_name: envVars.DB_NAME,
    database_port: envVars.DB_INTERNAL_PORT,
    options: {
      user: envVars.DB_USERNAME,
      pass: envVars.DB_PASSWORD,
    },
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },
  solana: {
    network: envVars.SOLANA_NETWORK,
  },
};
