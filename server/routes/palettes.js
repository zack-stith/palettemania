import express from "express";
import Palette from "../models/Palette.js";
import { normalizeHex } from "../utils/colorUtils.js";

const router = express.Router();

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

export default router;