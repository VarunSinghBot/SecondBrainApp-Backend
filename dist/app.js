"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config({
    path: "./.env"
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
// Middlewares
// -----------------------------------------------------------------------------------------------------------------
// Middleware for express to get items in JSON format
app.use(express_1.default.json({ limit: "16kb" }));
// Middleware for parsing URL-encoded data
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
// Serve static files from the "public" folder
app.use(express_1.default.static("public"));
// Cookie parser middleware
app.use((0, cookie_parser_1.default)());
// -----------------------------------------------------------------------------------------------------------------
// Routes Import
// Duplicate import removed
const user_route_1 = __importDefault(require("./routes/user.route"));
const content_route_1 = __importDefault(require("./routes/content.route"));
const tag_route_1 = __importDefault(require("./routes/tag.route"));
const link_route_1 = __importDefault(require("./routes/link.route"));
// Routes Declaration
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/content", content_route_1.default);
app.use("/api/v1/tags", tag_route_1.default);
app.use("/api/v1/links", link_route_1.default);
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
exports.default = app;
