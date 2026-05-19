import mongoose from "mongoose";

let connected = false;

export async function connectDb(uri: string | undefined): Promise<boolean> {
  if (!uri) {
    console.warn("[db] MONGODB_URI not set — using in-memory storage.");
    return false;
  }
  try {
    await mongoose.connect(uri);
    connected = true;
    console.log("[db] Connected to MongoDB");
    return true;
  } catch (e) {
    console.warn("[db] MongoDB unavailable — using in-memory storage.", e);
    return false;
  }
}

export function isDbConnected(): boolean {
  return connected && mongoose.connection.readyState === 1;
}
