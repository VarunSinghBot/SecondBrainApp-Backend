import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ------------------------- Create Content ----------------------------
export const createContent = async (req: Request, res: Response) => {
  const { title, body, tags, type, authorId } = req.body;

  try {
    // Ensure tags exist or create them
    const tagRecords = await Promise.all(
      tags.map(async (tagName: string) => {
        let tag = await prisma.tag.findUnique({ where: { tagName } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { tagName } });
        }
        return tag;
      })
    );

    // Create content and associate tags
    const content = await prisma.content.create({
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Get All Content ----------------------------
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const contents = await prisma.content.findMany({
      include: { tags: true, author: true },
    });
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Get Content by ID ----------------------------
export const getContentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: { tags: true, author: true },
    });

    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Update Content ----------------------------
export const updateContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body, tags, type } = req.body;

  try {
    const data: any = {};
    if (title) data.title = title;
    if (body) data.body = body;
    if (type) data.type = type;

    if (tags) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName: string) => {
          let tag = await prisma.tag.findUnique({ where: { tagName } });
          if (!tag) {
            tag = await prisma.tag.create({ data: { tagName } });
          }
          return tag;
        })
      );

      data.tags = {
        set: [],
        connect: tagRecords.map((tag) => ({ id: tag.id })),
      };
    }

    const updatedContent = await prisma.content.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: "Content updated successfully", updatedContent });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Delete Content ----------------------------
export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.content.delete({ where: { id } });
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};