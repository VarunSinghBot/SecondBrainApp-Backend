"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHashParam = exports.validateCreateLink = void 0;
const validateCreateLink = (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: "Bad Request: userId is required" });
        return;
    }
    next();
};
exports.validateCreateLink = validateCreateLink;
const validateHashParam = (req, res, next) => {
    const { hash } = req.params;
    if (!hash) {
        res.status(400).json({ error: "Bad Request: hash is required" });
        return;
    }
    next();
};
exports.validateHashParam = validateHashParam;
