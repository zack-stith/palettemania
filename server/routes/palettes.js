import express from "express";
import mongoose from "mongoose";
import Palette from "../models/Palette.js";
import { normalizeHex } from "../utils/colorUtils.js";

const router = express.Router();
const PAGE_SIZE = 3;
const SORT_OPTIONS = {
    newest: { createdAt: -1, _id: -1 },
    likes: { likeCount: -1, createdAt: -1, _id: -1 },
};

router.post("/", async (req, res) => {
    const { name, colors, isPublic } = req.body;

    if (!Array.isArray(colors)) {
        return res.status(400).json({ error: "colors must be an array" });
    }

    const normalizedColors = colors.map((c) => normalizeHex(c));

    try {
        const palette = await Palette.create({ name, colors: normalizedColors, isPublic });
        res.status(201).json(palette);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: "Palette not found" });
    }

    try {
        const palette = await Palette.findById(id);
        if (palette === null) {
            return res.status(404).json({ error: "Palette not found" });
        }
        res.json(palette);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get("/", async (req, res) => {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ error: "page must be a positive whole number" });
    }

    const sort = req.query.sort === undefined ? "newest" : req.query.sort;
    if (!Object.hasOwn(SORT_OPTIONS, sort)) {
        return res.status(400).json({ error: "sort must be 'newest' or 'likes'"});
    }
    
    const filter = { isPublic: true, retiredAt: null };

    try {
        const results = await Palette.find(filter)
            .sort(SORT_OPTIONS[sort])
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE + 1);

        const hasMore = results.length > PAGE_SIZE;
        const items = results.slice(0, PAGE_SIZE);

        res.json({ items, hasMore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }

});

export default router;