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
exports.deleteContent = exports.updateContent = exports.getContentById = exports.getAllContent = exports.createContent = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// ------------------------- Create Content ----------------------------
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, tags, type, mediaUrl } = req.body;
    const uid = req.user; // Extract userId from the token (set by authenticate middleware)
    if (!uid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const tagRecords = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
            let tag = yield prisma.tag.findUnique({ where: { tagName: tagName.toLowerCase() } });
            if (!tag) {
                tag = yield prisma.tag.create({ data: { tagName: tagName.toLowerCase() } });
            }
            return tag;
        })));
        const data = {
            title,
            body,
            type,
            authorId: uid,
            tags: {
                connect: tagRecords.map((tag) => ({ id: tag.id })),
            },
        };
        if (mediaUrl && type !== "article") {
            data.mediaUrl = mediaUrl;
        }
        const content = yield prisma.content.create({ data });
        res.status(201).json({ message: "Content created successfully", content });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createContent = createContent;
// ------------------------- Get All Content ----------------------------
const getAllContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.user; // Extract userId from the token (set by authenticate middleware)
    if (!uid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        // Fetch content specific to the authenticated user
        const contents = yield prisma.content.findMany({
            where: { authorId: uid },
            include: { tags: true, author: true },
        });
        res.status(200).json(contents);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllContent = getAllContent;
// ------------------------- Get Content by ID ----------------------------
const getContentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const uid = req.user; // Extract userId from the token (set by authenticate middleware)
    if (!uid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const content = yield prisma.content.findUnique({
            where: { id },
            include: { tags: true, author: true },
        });
        if (!content) {
            res.status(404).json({ error: "Content not found" });
            return;
        }
        if (content.authorId !== uid) {
            res.status(403).json({ error: "Forbidden: You are not allowed to access this content" });
            return;
        }
        res.status(200).json(content);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getContentById = getContentById;
// ------------------------- Update Content ----------------------------
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, body, tags, type, mediaUrl } = req.body;
    const uid = req.user; // Extract userId from the token (set by authenticate middleware)
    if (!uid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingContent = yield prisma.content.findUnique({ where: { id } });
        if (!existingContent || existingContent.authorId !== uid) {
            res.status(403).json({ error: "Forbidden: You are not allowed to update this content" });
            return;
        }
        const data = {};
        if (title)
            data.title = title;
        if (body)
            data.body = body;
        if (type)
            data.type = type;
        if (mediaUrl && type !== "article")
            data.mediaUrl = mediaUrl;
        if (tags) {
            const tagRecords = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
                let tag = yield prisma.tag.findUnique({ where: { tagName: tagName.toLowerCase() } });
                if (!tag) {
                    tag = yield prisma.tag.create({ data: { tagName: tagName.toLowerCase() } });
                }
                return tag;
            })));
            data.tags = {
                set: [],
                connect: tagRecords.map((tag) => ({ id: tag.id })),
            };
        }
        const updatedContent = yield prisma.content.update({
            where: { id },
            data,
        });
        res.status(200).json({ message: "Content updated successfully", updatedContent });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateContent = updateContent;
// ------------------------- Delete Content ----------------------------
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const uid = req.user; // Extract userId from the token (set by authenticate middleware)
    if (!uid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingContent = yield prisma.content.findUnique({ where: { id } });
        if (!existingContent || existingContent.authorId !== uid) {
            res.status(403).json({ error: "Forbidden: You are not allowed to delete this content" });
            return;
        }
        yield prisma.content.delete({ where: { id } });
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteContent = deleteContent;
