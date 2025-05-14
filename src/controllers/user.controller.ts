import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// Type for Signup Request Body
interface SignupRequestBody {
  email: string;
  password: string;
  username: string;
}

// Type for Login Request Body
interface LoginRequestBody {
  email: string;
  password: string;
}

// ------------------------- User signup ----------------------------
export const signup = async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
  const { email, password, username } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ----------------------- User login ------------------------------
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    // console.log(user);
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // Compare the password
    const isPasswordValid = user.password && (await bcrypt.compare(password, user.password));
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, userId: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------- Get user contents -------------------
export const getUserContents = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });  
    return;
  }

  try {
    // Fetch the user's contents
    const contents = await prisma.content.findMany({
      where: { authorId: userId },
    });

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------- Update user -------------------
export const updateUser = async (req: Request, res: Response) => {
  const { userId, username, email, password } = req.body;

  try {
    const data: any = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------- Delete user -------------------
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};