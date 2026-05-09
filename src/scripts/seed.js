const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { Schema, model, models } = mongoose;

// Inline Model Definition
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

const UserModel = models.User || model("User", UserSchema);

// Inline Connection Logic
async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(uri);
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@smartwardrobe.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Smart Wardrobe Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await dbConnect();

  const existing = await UserModel.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = "ADMIN";
    existing.status = "ACTIVE";
    await existing.save();
    console.log("Admin user updated:", email);
  } else {
    await UserModel.create({
      name,
      email,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    });
    console.log("Admin user created:", email);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect();
    process.exit(0);
  });
