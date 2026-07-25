import mongoose, { type ConnectOptions } from "mongoose";
import { getEnv } from "./env.js";

const { MONGODB_URI, DB_NAME } = getEnv();

const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
  dbName: DB_NAME,
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
};

export async function connectDB() {
  try {
    console.log("Database connecting...");
    const conn = await mongoose.connect(MONGODB_URI, clientOptions);
    console.log("✅ Database connected");

    conn.connection.db;

    return conn;
  } catch (err: unknown) {
    throw err;
  }
}

export function getNativeDb() {
  const client = mongoose.connection.getClient();

  if (!client) {
    throw new Error("Database not connected");
  }

  return client?.db(DB_NAME);
}
