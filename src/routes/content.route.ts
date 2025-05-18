import { Router } from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller";
import { authenticate } from "../middlewares/authMiddleware";

const contentRouter = Router();

contentRouter.post("/", authenticate, createContent);
contentRouter.get("/", authenticate, getAllContent);
contentRouter.get("/:id", authenticate, getContentById);
contentRouter.put("/:id", authenticate, updateContent);
contentRouter.delete("/:id", authenticate, deleteContent);

export default contentRouter;