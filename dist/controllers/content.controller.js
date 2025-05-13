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
    const { title, body, tags, type, authorId } = req.body;
    try {
        // Ensure tags exist or create them
        const tagRecords = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
            let tag = yield prisma.tag.findUnique({ where: { tagName } });
            if (!tag) {
                tag = yield prisma.tag.create({ data: { tagName } });
            }
            return tag;
        })));
        // Create content and associate tags
        const content = yield prisma.content.create({
            data: {
                title,
                body,
                type,
                authorId,
                tags: {
                    connect: tagRecords.map((tag) => ({ id: tag.id })),
                },
            },
        });
        res.status(201).json({ message: "Content created successfully", content });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createContent = createContent;
// ------------------------- Get All Content ----------------------------
const getAllContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contents = yield prisma.content.findMany({
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
    try {
        const content = yield prisma.content.findUnique({
            where: { id },
            include: { tags: true, author: true },
        });
        if (!content) {
            res.status(404).json({ error: "Content not found" });
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
    const { title, body, tags, type } = req.body;
    try {
        const data = {};
        if (title)
            data.title = title;
        if (body)
            data.body = body;
        if (type)
            data.type = type;
        if (tags) {
            const tagRecords = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
                let tag = yield prisma.tag.findUnique({ where: { tagName } });
                if (!tag) {
                    tag = yield prisma.tag.create({ data: { tagName } });
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
    try {
        yield prisma.content.delete({ where: { id } });
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteContent = deleteContent;
