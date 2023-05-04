import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

import handleErrorMiddleware from "./middleware/handleError-middleware.js";
import authRouter from "./routes/auth-routes.js";
import sessionRouter from "./routes/session-routes.js";
import transactionsRoutes from "./routes/transaction-routes.js";

dotenv.config();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use("/auth", authRouter)
  .use("/logout", sessionRouter)
  .use("/transactions", transactionsRoutes)
  .use(handleErrorMiddleware());

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
