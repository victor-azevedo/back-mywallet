import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import transactionsRoutes from "./routes/transactionsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRoutes);
app.use(transactionsRoutes);

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
