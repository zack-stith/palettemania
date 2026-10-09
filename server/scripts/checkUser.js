import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

// Scratch tool for checking User schema functionality
// Run from server/: node scripts/checkUser.js

const TEST_USERNAMES = ["daisy123", "someone_else", "no_hash"];

async function cleanUp() {
    await User.deleteMany({ usernameLower: { $in: TEST_USERNAMES } });
}

try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.init(); // wait until the unique indexes exist
    await cleanUp(); // remove leftovers from a previous run

    // 1. A valid user saves, and the JSON hides private fields
    try {
        const daisy = await User.create({ username: "Daisy123", email: "test@testing.com", passwordHash: "1234REWD" });
        console.log("✅ 1. created:", JSON.stringify(daisy));
        console.log("   usernameLower in the database:", daisy.usernameLower);
    } catch (err) {
        console.log("❌ 1. unexpected error:", err.message);
    }

    // 2. Same username, different capitals -> rejected by the unique index
    try {
        await User.create({ username: "DAIsy123", email: "abc@123.com", passwordHash: "32535234asda" });
        console.log("❌ 2. duplicate username was saved");
    } catch (err) {
        console.log("✅ 2. rejected:", err.code, err.keyPattern);
    }

    // 3. Different username, same email (different capitals) → rejected
    try {
        await User.create({ username: "someone_else", email: "TEST@testing.com", passwordHash: "abcd1234" });
        console.log("❌ 3. duplicate email was saved");
    } catch (err) {
        console.log("✅ 3. rejected:", err.code, err.keyPattern);
    }

    // 4. Missing passwordHash → rejected by validation, before reaching the database
    try {
        await User.create({ username: "no_hash", email: "nohash@testing.com" });
        console.log("❌ 4. user without passwordHash was saved");
    } catch (err) {
        console.log("✅ 4. rejected:", err.name, "-", err.message);
    }

    await cleanUp();
} catch (err) {
    console.error("Script failed:", err);
} finally {
    await mongoose.disconnect();
}