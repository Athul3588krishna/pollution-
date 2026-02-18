import mongoose from "mongoose";

export default async function connection() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pollutionDB";
  const db = await mongoose.connect(mongoUri);
  console.log("database connected");
  return db;
}
