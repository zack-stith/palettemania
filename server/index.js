import express from "express";

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

// Start listening for requests
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
