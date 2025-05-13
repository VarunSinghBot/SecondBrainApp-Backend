"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const authenticate = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else {
        next();
    }
};
exports.authenticate = authenticate;
