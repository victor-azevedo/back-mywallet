import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth-routes.js";
import sessionRouter from "./routes/session-routes.js";
import transactionsRoutes from "./routes/transaction-routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/logout", sessionRouter);
app.use("/transactions", transactionsRoutes);

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
