"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const link_controller_1 = require("../controllers/link.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateLinkRequest_1 = require("../middlewares/validateLinkRequest");
const linkRouter = (0, express_1.Router)();
// Route to create a sharable link
linkRouter.post("/", authMiddleware_1.authenticate, validateLinkRequest_1.validateCreateLink, link_controller_1.createLink);
// Route to get content by sharable link hash
linkRouter.get("/:hash", validateLinkRequest_1.validateHashParam, link_controller_1.getLinkByHash);
// Route to delete a sharable link
linkRouter.delete("/:hash", authMiddleware_1.authenticate, validateLinkRequest_1.validateHashParam, link_controller_1.deleteLink);
exports.default = linkRouter;
