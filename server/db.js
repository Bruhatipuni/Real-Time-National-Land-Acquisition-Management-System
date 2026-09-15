import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bhusetu_db';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return true;
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${MONGODB_URI}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${MONGODB_URI}. Operating in offline/mock fallback mode.`);
    console.warn(`[MongoDB] Details: ${error.message}`);
    isConnected = false;
    return false;
  }
}

export function getIsConnected() {
  return isConnected;
}
