import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import paletteRouter from "./routes/palettes.js";


const app = express();
const PORT = 3000;

app.use(express.json());

// ROUTES
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/palettes", paletteRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Request must be valid JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
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