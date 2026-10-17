import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { cookieName } from "../utils/auth.js";

const notLoggedInMessage = "You must be logged in";

async function getUserFromRequest(req) {
    const token = req.cookies[cookieName];

    if (!token) {
        return null;
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }

    const user = await User.findById(payload.userId);

    return user;
}

export default async function requireLogin(req, res, next) {
    const userFromRequest = await getUserFromRequest(req);

    if (!userFromRequest) {
        return res.status(401).json({ error: notLoggedInMessage });
    }

    req.user = userFromRequest;
    next();
}

export async function optionalLogin(req, res, next) {
    req.user = await getUserFromRequest(req);
    next();
}