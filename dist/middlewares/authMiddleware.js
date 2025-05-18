"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the Authorization header is present and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: Token missing" });
        return;
    }
    const token = authHeader.split(" ")[1]; // Extract the token
    try {
        // Verify the token and decode it
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        // Attach the userId to the request object
        req.user = decoded.userId;
        // Pass control to the next middleware or route handler
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.authenticate = authenticate;
