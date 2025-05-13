"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
// import { signup } from "../controllers/user.controller";
const userRouter = (0, express_1.Router)();
// Route for user signup
userRouter.post("/signup", user_controller_1.signup);
// Route for user login
userRouter.post("/login", user_controller_1.login);
// Route to get user contents
userRouter.get("/contents", user_controller_1.getUserContents);
// Route to update user
userRouter.put("/update", user_controller_1.updateUser);
// Route to delete user
userRouter.delete("/delete", user_controller_1.deleteUser);
exports.default = userRouter;
