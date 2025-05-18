import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ------------------------- Create Content ----------------------------
export const createContent = async (req: Request, res: Response): Promise<void> => {
  const { title, body, tags, type, mediaUrl } = req.body;
  const uid = req.user;

  if (!uid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const tagRecords = await Promise.all(
      tags.map(async (tagName: string) => {
        let tag = await prisma.tag.findUnique({ where: { tagName: tagName.toLowerCase() } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { tagName: tagName.toLowerCase() } });
        }
        return tag;
      })
    );

    const data: any = {
      title,
      body,
      type,
      authorId: uid,
      tags: {
        connect: tagRecords.map((tag) => ({ id: tag.id })),
      },
    };

    // Only add mediaUrl if present and type is not article
    if (mediaUrl && type !== "article") {
      data.mediaUrl = mediaUrl;
    }

    const content = await prisma.content.create({ data });

    res.status(201).json({ message: "Content created successfully", content });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Get All Content ----------------------------
export const getAllContent = async (req: Request, res: Response): Promise<void> => {
  const uid = req.user; // Extract userId from the token (set by authenticate middleware)

  if (!uid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    // Fetch content specific to the authenticated user
    const contents = await prisma.content.findMany({
      where: { authorId: uid },
      include: { tags: true, author: true },
    });

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Get Content by ID ----------------------------
export const getContentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const uid = req.user; // Extract userId from the token (set by authenticate middleware)

  if (!uid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: { tags: true, author: true },
    });

    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    if (content.authorId !== uid) {
      res.status(403).json({ error: "Forbidden: You are not allowed to access this content" });
      return;
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------- Update Content ----------------------------
export const updateContent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, body, tags, type, mediaUrl } = req.body;
  const uid = req.user; // Extract userId from the token (set by authenticate middleware)

  if (!uid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const existingContent = await prisma.content.findUnique({ where: { id } });

    if (!existingContent || existingContent.authorId !== uid) {
      res.status(403).json({ error: "Forbidden: You are not allowed to update this content" });
      return;
    }

    const data: any = {};
    if (title) data.title = title;
    if (body) data.body = body;
    if (type) data.type = type;
    if (mediaUrl && type !== "article") data.mediaUrl = mediaUrl;

    if (tags) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName: string) => {
          let tag = await prisma.tag.findUnique({ where: { tagName: tagName.toLowerCase() } });
          if (!tag) {
            tag = await prisma.tag.create({ data: { tagName: tagName.toLowerCase() } });
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
export const deleteContent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const uid = req.user; // Extract userId from the token (set by authenticate middleware)

  if (!uid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const existingContent = await prisma.content.findUnique({ where: { id } });

    if (!existingContent || existingContent.authorId !== uid) {
      res.status(403).json({ error: "Forbidden: You are not allowed to delete this content" });
      return;
    }

    await prisma.content.delete({ where: { id } });
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
