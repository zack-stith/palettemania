import express from "express";

const router = express.Router();

// GET /api/palettes (temporary stub; the real feed comes in Part E)
router.get("/", (req, res) => {
    res.json({ items: [], hasMore: false });
});

export default router;