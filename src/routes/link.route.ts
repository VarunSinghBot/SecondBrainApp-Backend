import { Router } from "express";
import {
  createLink,
  getLinkByHash,
  deleteLink,
} from "../controllers/link.controller";
import { authenticate } from "../middlewares/authMiddleware";
import { validateCreateLink, validateHashParam } from "../middlewares/validateLinkRequest";

const linkRouter = Router();

// Route to create a sharable link
linkRouter.post("/", authenticate, validateCreateLink, createLink);

// Route to get content by sharable link hash
linkRouter.get("/:hash", validateHashParam, getLinkByHash);

// Route to delete a sharable link
linkRouter.delete("/:hash", authenticate, validateHashParam, deleteLink);

export default linkRouter;