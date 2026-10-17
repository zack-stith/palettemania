import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { cookieName } from "../utils/auth.js";

const notLoggedInMessage = "You must be logged in";

export default async function requireLogin(req, res, next) {
    const token = req.cookies[cookieName];

    if (!token) {
        return res.status(401).json({ error: notLoggedInMessage });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: notLoggedInMessage });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
        return res.status(401).json({ error: notLoggedInMessage });
    }
    
    req.user = user;
    next();
}