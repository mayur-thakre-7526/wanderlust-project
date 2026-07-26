require("dotenv").config();
const mongoose = require("mongoose");

async function test() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ Connected");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();