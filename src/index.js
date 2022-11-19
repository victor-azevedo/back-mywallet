import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRoutes);
app.use(transactionsRoutes);

app.listen(process.env.API_PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
