"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserContents = exports.login = exports.signup = void 0;
const prisma_1 = require("../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new prisma_1.PrismaClient();
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error("JWT_SECRET is not defined");
// ------------------------- User signup ----------------------------
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create the user
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.signup = signup;
// ----------------------- User login ------------------------------
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        // Compare the password
        const isPasswordValid = user.password && (yield bcrypt_1.default.compare(password, user.password));
        if (!isPasswordValid) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token, userId: user.id });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
//----------------------- Get user contents -------------------
const getUserContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        // Fetch the user's contents
        const contents = yield prisma.content.findMany({
            where: { authorId: userId },
        });
        res.status(200).json(contents);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserContents = getUserContents;
//----------------------- Update user -------------------
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username, email, password } = req.body;
    try {
        const data = {};
        if (username)
            data.username = username;
        if (email)
            data.email = email;
        if (password)
            data.password = yield bcrypt_1.default.hash(password, 10);
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data,
        });
        res.status(200).json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateUser = updateUser;
//----------------------- Delete user -------------------
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        yield prisma.user.delete({ where: { id: userId } });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
