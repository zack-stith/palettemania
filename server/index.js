import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

// When a GET request arrives for "/", run this function
app.get("/", (req, res) => {
    res.send("Hello from PaletteMania!");
});

// When a GET request arrives for "/api/health"
app.get("/api/health", (req, res) => {
    res.json({ "status": "ok"});
});

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    // Start listening for requests
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
} catch (err) {
    console.error(err);
    process.exit(1);
}
