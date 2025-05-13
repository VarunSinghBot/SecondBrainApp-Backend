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
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagById = exports.getAllTags = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// ------------------------- Get All Tags ----------------------------
const getAllTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield prisma.tag.findMany();
        res.status(200).json(tags);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTags = getAllTags;
// ------------------------- Get Tag by ID ----------------------------
const getTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tag = yield prisma.tag.findUnique({ where: { id } });
        if (!tag) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }
        res.status(200).json(tag);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getTagById = getTagById;
// ------------------------- Create Tag ----------------------------
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagName } = req.body;
    try {
        // Check if the tag already exists
        const existingTag = yield prisma.tag.findUnique({ where: { tagName } });
        if (existingTag) {
            res.status(400).json({ error: "Tag already exists" });
            return;
        }
        // Create the tag
        const tag = yield prisma.tag.create({
            data: { tagName },
        });
        res.status(201).json({ message: "Tag created successfully", tag });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createTag = createTag;
// ------------------------- Update Tag ----------------------------
const updateTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { tagName } = req.body;
    try {
        const updatedTag = yield prisma.tag.update({
            where: { id },
            data: { tagName },
        });
        res.status(200).json({ message: "Tag updated successfully", updatedTag });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateTag = updateTag;
// ------------------------- Delete Tag ----------------------------
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.tag.delete({ where: { id } });
        res.status(200).json({ message: "Tag deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteTag = deleteTag;
