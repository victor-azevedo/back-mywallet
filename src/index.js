import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient
  .connect()
  .then(() => {
    console.log("Connected successfully to data server");
  })
  .catch(() => {
    console.error("ERROR: Not connected to data server");
  });

const db = mongoClient.db("myWallet");

app.listen(process.env.API_PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
