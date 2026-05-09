import mongoose from "mongoose";

type MongooseGlobal = typeof globalThis & {
  __mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalForMongoose = globalThis as MongooseGlobal;

export async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!globalForMongoose.__mongoose) {
    globalForMongoose.__mongoose = { conn: null, promise: null };
  }

  if (globalForMongoose.__mongoose.conn) {
    return globalForMongoose.__mongoose.conn;
  }

  if (!globalForMongoose.__mongoose.promise) {
    globalForMongoose.__mongoose.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DBNAME || undefined,
    });
  }

  globalForMongoose.__mongoose.conn = await globalForMongoose.__mongoose.promise;
  return globalForMongoose.__mongoose.conn;
}
