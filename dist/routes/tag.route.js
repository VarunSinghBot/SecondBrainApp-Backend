"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tag_controller_1 = require("../controllers/tag.controller");
const tagRouter = (0, express_1.Router)();
// Route to get all tags
tagRouter.get("/", tag_controller_1.getAllTags);
// Route to get a tag by ID
tagRouter.get("/:id", tag_controller_1.getTagById);
// Route to create a new tag
tagRouter.post("/", tag_controller_1.createTag);
// Route to update a tag
tagRouter.put("/:id", tag_controller_1.updateTag);
// Route to delete a tag
tagRouter.delete("/:id", tag_controller_1.deleteTag);
exports.default = tagRouter;
