import express from "express";
import mongoose from "mongoose";
import Palette from "../models/Palette.js";
import { normalizeHex } from "../utils/colorUtils.js";

const router = express.Router();
const PAGE_SIZE = 24;
const SORT_OPTIONS = {
    newest: { createdAt: -1, _id: -1 },
    likes: { likeCount: -1, createdAt: -1, _id: -1 },
};

function validationMessage(err) {
    return Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
}

router.post("/", async (req, res) => {
    const { name, colors, isPublic } = req.body ?? {};

    if (isPublic !== undefined && typeof isPublic !== "boolean") {
        return res.status(400).json({ error: "isPublic must be of type 'boolean'"});
    }

    if (name !== undefined && typeof name !== "string") {
        return res.status(400).json({ error: "name must be of type 'string'"});
    }

    if (!Array.isArray(colors)) {
        return res.status(400).json({ error: "colors must be an array" });
    }

    const normalizedColors = colors.map((c) => normalizeHex(c));

    try {
        const palette = await Palette.create({ name, colors: normalizedColors, isPublic });
        res.status(201).json(palette);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: validationMessage(err) });
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

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, colors, isPublic } = req.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: "Palette not found" });
    }

    if (colors !== undefined) {
        return res.status(400).json({ error: "A palette's colors cannot be changed" });
    }

    if (isPublic !== undefined && typeof isPublic !== "boolean") {
        return res.status(400).json({ error: "isPublic must be of type 'boolean'"});
    }

    if (name !== undefined && typeof name !== "string") {
        return res.status(400).json({ error: "name must be of type 'string'"});
    }

    try {
        const palette = await Palette.findById(id);
        if (palette === null) {
            return res.status(404).json({ error: "Palette not found" });
        }
        // TODO Phase 2: 403 unless the logged-in member owns it
        if (name !== undefined) palette.name = name;
        if (isPublic !== undefined) palette.isPublic = isPublic;

        await palette.save();
        res.json(palette);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: validationMessage(err) });
        }
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ error: "Palette not found" });
    }

    try {
        const palette = await Palette.findById(id);
        if (palette === null) {
            return res.status(404).json({ error: "Palette not found"});
        }
        // TODO Phase 2: 403 unless the logged-in member owns it
        // TODO Phase 4: retire instead if others have liked it
        await palette.deleteOne();
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;