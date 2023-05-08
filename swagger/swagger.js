import dotenv from "dotenv";
import swaggerAutogen from "swagger-autogen";

import {
  loginSchemaSwagger,
  registerSchemaSwagger,
} from "../src/models/auth-schema.js";

import {
  transactionCreateSchemaSwagger,
  transactionParamsSchemaSwagger,
  transactionUpdateSchemaSwagger,
} from "../src/models/transactions-schema.js";

dotenv.config();
const API_PORT = process.env.API_PORT || 4000;
const API_HOST = process.env.API_HOST;
const API_URL = process.env.API_URL || `${API_HOST}:${API_PORT}`;

const doc = {
  info: {
    version: "1.0.0",
    title: "My Wallet API",
    description: "API to serve My Wallet app. A digital wallet",
  },
  host: API_URL,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  "@definitions": {
    registerSchemaSwagger,
    loginSchemaSwagger,
    transactionCreateSchemaSwagger,
    transactionUpdateSchemaSwagger,
    transactionParamsSchemaSwagger,
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../src/index.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
