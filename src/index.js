import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

import handleErrorMiddleware from "./middleware/handleError-middleware.js";
import authRouter from "./routes/auth-routes.js";
import sessionRouter from "./routes/session-routes.js";
import transactionsRoutes from "./routes/transaction-routes.js";

dotenv.config();
const app = express();
app.use(cors());

const jsonString = fs.readFileSync("swagger/swagger_output.json");
const swaggerFile = JSON.parse(jsonString);
var swaggerOptions = {
  customSiteTitle: "My Wallet API Doc",
};

app
  .use(express.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions))
  .use("/auth", authRouter)
  .use("/logout", sessionRouter)
  .use("/transactions", transactionsRoutes)
  .use(handleErrorMiddleware());

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
