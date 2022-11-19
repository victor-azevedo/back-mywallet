import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

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
export const usersCollection = db.collection("users");
export const transactionsCollection = db.collection("transactions");
export const sessionsCollection = db.collection("sessions");
