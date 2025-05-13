import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ------------------------- Create Sharable Link ----------------------------
export const createLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body;

  try {
    // Generate a unique hash for the link
    const hash = require("crypto").randomBytes(16).toString("hex");

    // Create the link in the database
    const link = await prisma.link.create({
      data: {
        hash,
        authorId: userId,
      },
    });

    res.status(201).json({ message: "Sharable link created successfully", link });
  } catch (error) {
    next(error);
  }
};

// ------------------------- Get Content by Link Hash ----------------------------
export const getLinkByHash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { hash } = req.params;

  try {
    // Find the link by hash
    const link = await prisma.link.findUnique({
      where: { hash },
      include: { author: { include: { Content: true } } },
    });

    if (!link) {
      res.status(404).json({ message: "Link not found" });
      return;
    }

    // Return the content associated with the link
    res.status(200).json(link.author.Content);
  } catch (error) {
    next(error);
  }
};

// ------------------------- Delete Sharable Link ----------------------------
export const deleteLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  

  try {
    const { hash } = req.params;
    // Check if the link exists
    const existingLink = await prisma.link.findUnique({
      where: { hash },
    });
    if (!existingLink) {
      res.status(404).json({ message: "Link not found" });
      return;
    }

    // Delete the link by hash
    const deletedLink = await prisma.link.delete({
      where: { hash },
    });

    if (deletedLink) {
      res.status(200).json({ message: "Link deleted successfully" });
    } else {
      res.status(404).json({ message: "Link not found" });
    }
  } catch (error) {
    next(error);
  }
};

