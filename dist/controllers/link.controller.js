"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLink = exports.getLinkByHash = exports.createLink = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// ------------------------- Create Sharable Link ----------------------------
const createLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        // Generate a unique hash for the link
        const hash = require("crypto").randomBytes(16).toString("hex");
        // Create the link in the database
        const link = yield prisma.link.create({
            data: {
                hash,
                authorId: userId,
            },
        });
        res.status(201).json({ message: "Sharable link created successfully", link });
    }
    catch (error) {
        next(error);
    }
});
exports.createLink = createLink;
// ------------------------- Get Content by Link Hash ----------------------------
const getLinkByHash = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    try {
        // Find the link by hash
        const link = yield prisma.link.findUnique({
            where: { hash },
            include: { author: { include: { Content: true } } },
        });
        if (!link) {
            res.status(404).json({ message: "Link not found" });
            return;
        }
        // Return the content associated with the link
        res.status(200).json(link.author.Content);
    }
    catch (error) {
        next(error);
    }
});
exports.getLinkByHash = getLinkByHash;
// ------------------------- Delete Sharable Link ----------------------------
const deleteLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        // Check if the link exists
        const existingLink = yield prisma.link.findUnique({
            where: { hash },
        });
        if (!existingLink) {
            res.status(404).json({ message: "Link not found" });
            return;
        }
        // Delete the link by hash
        const deletedLink = yield prisma.link.delete({
            where: { hash },
        });
        if (deletedLink) {
            res.status(200).json({ message: "Link deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Link not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteLink = deleteLink;
