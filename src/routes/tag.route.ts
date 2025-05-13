import { Router } from "express";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller";

const tagRouter = Router();

// Route to get all tags
tagRouter.get("/", getAllTags);

// Route to get a tag by ID
tagRouter.get("/:id", getTagById);

// Route to create a new tag
tagRouter.post("/", createTag);

// Route to update a tag
tagRouter.put("/:id", updateTag);

// Route to delete a tag
tagRouter.delete("/:id", deleteTag);

export default tagRouter;