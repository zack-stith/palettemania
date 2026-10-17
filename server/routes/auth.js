import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { validationMessage } from "../utils/utils.js";
import { setAuthCookie, clearAuthCookie } from "../utils/auth.js";
import requireLogin from "../middleware/requireLogin.js";

const invalidLoginMessage = "invalid login credentials";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body ?? {};

    if (typeof username !== "string") {
        return res.status(400).json({ error: "username must be of type 'string'" });
    }

    if (typeof email !== "string") {
        return res.status(400).json({ error: "email must be of type 'string'" });
    }

    if (typeof password !== "string") {
        return res.status(400).json({ error: "password must be of type 'string'" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "password must be at least 8 characters in length" });
    }

    if (password.length > 64) {
        return res.status(400).json({ error: "password must be no more than 64 characters in length" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, passwordHash });
        setAuthCookie(res, user._id);
        res.status(201).json(user);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: validationMessage(err) });
        }

        if (err.code === 11000) {
            const keyErrMessage = err.keyPattern.usernameLower ? "username is already taken" : "an account with that email already exists";
            return res.status(409).json({ error: keyErrMessage });
        }
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.post("/login", async (req, res) => {
    const { identifier, password: passwordAttempt } = req.body ?? {};

    if (typeof identifier !== "string") {
        return res.status(400).json({ error: "identifier must be of type 'string'" });
    }

    if (typeof passwordAttempt !== "string") {
        return res.status(400).json({ error: "password must be of type 'string'" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    try {
        const user = await User.findOne({ $or: [{ usernameLower: normalizedIdentifier }, { email: normalizedIdentifier }] });

        if (!user) {
            return res.status(401).json({ error: invalidLoginMessage });
        }

        const storedHash = user.passwordHash;
        const passwordsMatch = await bcrypt.compare(passwordAttempt, storedHash);

        if (!passwordsMatch) {
            return res.status(401).json({ error: invalidLoginMessage });
        }
        
        setAuthCookie(res, user._id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get("/me", requireLogin, (req, res) => {
    res.json(req.user);
});

router.post("/logout", requireLogin, (req, res) => {
    clearAuthCookie(res);
    res.sendStatus(204);
});

export default router;