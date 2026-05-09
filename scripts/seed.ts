import "dotenv/config";
import mongoose from "mongoose";
import { hash } from "bcryptjs";
import { UserModel } from "@/models/User";
import { WardrobeItemModel } from "@/models/WardrobeItem";
import { OutfitModel } from "@/models/Outfit";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DBNAME || undefined,
  });

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@smartwardrobe.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminName = process.env.ADMIN_NAME || "Smart Wardrobe Admin";

  const demoEmail = "demo@smartwardrobe.local";
  const demoName = "Demo User";
  const demoPassword = "Demo123!";

  const [adminHash, demoHash] = await Promise.all([
    hash(adminPassword, 12),
    hash(demoPassword, 12),
  ]);

  const admin = await UserModel.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: adminName,
        email: adminEmail,
        passwordHash: adminHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
    },
    { upsert: true, new: true },
  );

  const demo = await UserModel.findOneAndUpdate(
    { email: demoEmail },
    {
      $set: {
        name: demoName,
        email: demoEmail,
        passwordHash: demoHash,
        role: "USER",
        status: "ACTIVE",
      },
    },
    { upsert: true, new: true },
  );

  const existingItems = await WardrobeItemModel.countDocuments({ userId: demo._id });
  if (existingItems === 0) {
    await WardrobeItemModel.insertMany([
      {
        userId: demo._id,
        name: "Classic White Tee",
        category: "Tops",
        color: "White",
        brand: "Basics Co",
        imageUrl: "https://picsum.photos/seed/white-tee/600/600",
        notes: "Great for layering. Slightly oversized fit.",
      },
      {
        userId: demo._id,
        name: "Blue Denim Jacket",
        category: "Outerwear",
        color: "Denim Blue",
        brand: "Urban Stitch",
        imageUrl: "https://picsum.photos/seed/denim-jacket/600/600",
        notes: "Works with most casual outfits.",
      },
      {
        userId: demo._id,
        name: "Black Slim Jeans",
        category: "Bottoms",
        color: "Black",
        brand: "Nightline",
        imageUrl: "https://picsum.photos/seed/black-jeans/600/600",
        notes: "Good for both casual and semi-formal looks.",
      },
      {
        userId: demo._id,
        name: "Everyday Sneakers",
        category: "Shoes",
        color: "White/Gray",
        brand: "Run&Go",
        imageUrl: "https://picsum.photos/seed/sneakers/600/600",
        notes: "Comfortable for long walks.",
      },
      {
        userId: demo._id,
        name: "Brown Leather Belt",
        category: "Accessories",
        color: "Brown",
        brand: "Heritage",
        imageUrl: "https://picsum.photos/seed/leather-belt/600/600",
        notes: "Pairs well with denim and chinos.",
      },
    ]);
  }

  const starter = await OutfitModel.findOne({ userId: demo._id, name: "Starter Outfit" })
    .select({ _id: 1 })
    .lean();

  if (!starter) {
    const items = await WardrobeItemModel.find({ userId: demo._id })
      .sort({ createdAt: 1 })
      .limit(3)
      .select({ _id: 1 })
      .lean();

    if (items.length > 0) {
      await OutfitModel.create({
        userId: demo._id,
        name: "Starter Outfit",
        occasion: "Casual",
        itemIds: items.map((i) => i._id),
      });
    }
  }

  console.log("Seed complete.");
  console.log("Admin:", admin.email, `(password: ${adminPassword})`);
  console.log("Demo:", demo.email, "(password: Demo123!)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

