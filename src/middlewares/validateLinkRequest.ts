import { Request, Response, NextFunction } from "express";

export const validateCreateLink = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: "Bad Request: userId is required" });
    return;
 }

  next();
};

export const validateHashParam = (req: Request, res: Response, next: NextFunction) => {
  const { hash } = req.params;

  if (!hash) {
    res.status(400).json({ error: "Bad Request: hash is required" });
    return;
  }

  next();
};