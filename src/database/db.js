import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

mongoClient
  .connect()
  .then(() => {
    console.log("Connected successfully to data server");
  })
  .catch((err) => {
    console.error("ERROR: Not connected to data server");
    console.log(err);
  });

const db = mongoClient.db(process.env.MONGO_DATABASE);

export const usersCollection = db.collection("users");
export const transactionsCollection = db.collection("transactions");
export const sessionsCollection = db.collection("sessions");
