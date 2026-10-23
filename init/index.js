require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL;

const initDB = async () => {
  // Find an existing registered user
  const user = await User.findOne({});

  if (!user) {
    throw new Error("No user found. Please sign up first.");
  }

  // Remove existing listings before re-initializing
  await Listing.deleteMany({});

  // Assign the registered user as owner
  const listings = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  await Listing.insertMany(listings);

  console.log("Data was initialized");
};

async function main() {
  if (!MONGO_URL) {
    throw new Error("ATLASDB_URL is missing from .env");
  }

  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  await initDB();
}

main()
  .catch((err) => {
    console.error("Initialization failed:", err);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
