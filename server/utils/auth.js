import jwt from "jsonwebtoken";

const COOKIE_EXPIRE_DURATION = 7; // (in days)
const MS_PER_DAY = 24 * 60 * 60 * 1000; // (to convert days to milliseconds)

export function setAuthCookie(res, userId) {
    const payload = { userId: userId.toString() };
    const secret = process.env.JWT_SECRET;
    const tokenOptions = { expiresIn: (COOKIE_EXPIRE_DURATION * MS_PER_DAY / 1000) }; // (seconds)
    const cookieOptions = { httpOnly: true, sameSite: "lax", secure: false, maxAge: (COOKIE_EXPIRE_DURATION * MS_PER_DAY) }; // (milliseconds)

    const token = jwt.sign(payload, secret, tokenOptions);
    res.cookie("token", token, cookieOptions);
}