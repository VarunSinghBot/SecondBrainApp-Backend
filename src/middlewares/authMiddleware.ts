import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: string; // Attach the userId to the request object
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token and decode it
    const decoded = verify(token, JWT_SECRET) as { userId: string };

    // Attach the userId to the request object
    req.user = decoded.userId;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};