import { Router } from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller";

const contentRouter = Router();

contentRouter.post("/", createContent);
contentRouter.get("/", getAllContent);
contentRouter.get("/:id", getContentById);
contentRouter.put("/:id", updateContent);
contentRouter.delete("/:id", deleteContent);

export default contentRouter;