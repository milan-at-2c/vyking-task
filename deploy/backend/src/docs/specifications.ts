import * as path from "path";

import swaggerJsdoc from "swagger-jsdoc";

import { version } from "./../../package.json";
import { config } from "./../config/config";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CEO Dashboard API",
      version,
      description: "Documentation for CEO Dashboard API",
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
      },
    ],
  },
  // Paths to files with annotations
  apis: [
    path.join(
      __dirname,
      `../routes/**/*.${config.env === "production" ? "js" : "ts"}`,
    ),
    path.join(__dirname, "*.yml"),
  ],
};

export const documentationSpecs = swaggerJsdoc(options);
