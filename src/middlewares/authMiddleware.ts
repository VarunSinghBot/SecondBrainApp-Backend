import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the username property
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};