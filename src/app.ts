import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env"
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// Middlewares
// -----------------------------------------------------------------------------------------------------------------
// Middleware for express to get items in JSON format
app.use(express.json({ limit: "16kb" }));
// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Serve static files from the "public" folder
app.use(express.static("public"));
// Cookie parser middleware
app.use(cookieParser());

// -----------------------------------------------------------------------------------------------------------------

// Routes Import
// Duplicate import removed
import userRouter from "./routes/user.route";
import contentRouter from "./routes/content.route";
import tagRouter from "./routes/tag.route";
import linkRouter from "./routes/link.route";

// Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/links", linkRouter);

// Root endpoint to list all available endpoints
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API!",
        endpoints: {
            users: "/api/v1/users",
            content: "/api/v1/content",
            tags: "/api/v1/tags",
            links: "/api/v1/links",
        },
    });
});

export default app;