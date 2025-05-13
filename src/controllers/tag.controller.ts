import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ------------------------- Get All Tags ----------------------------
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Get Tag by ID ----------------------------
export const getTagById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tag = await prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Create Tag ----------------------------
export const createTag = async (req: Request, res: Response) => {
  const { tagName } = req.body;

  try {
    // Check if the tag already exists
    const existingTag = await prisma.tag.findUnique({ where: { tagName } });
    if (existingTag) {
      res.status(400).json({ error: "Tag already exists" });
      return;
    }

    // Create the tag
    const tag = await prisma.tag.create({
      data: { tagName },
    });

    res.status(201).json({ message: "Tag created successfully", tag });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Update Tag ----------------------------
export const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tagName } = req.body;

  try {
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { tagName },
    });

    res.status(200).json({ message: "Tag updated successfully", updatedTag });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Delete Tag ----------------------------
export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tag.delete({ where: { id } });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};