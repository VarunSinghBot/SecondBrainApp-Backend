import { Router } from "express";
import { signup, login, getUserContents, updateUser, deleteUser } from "../controllers/user.controller";
// import { signup } from "../controllers/user.controller";
const userRouter = Router();

// Route for user signup
userRouter.post("/signup", signup);

// Route for user login
userRouter.post("/login", login);

// Route to get user contents
userRouter.get("/contents", getUserContents);

// Route to update user
userRouter.put("/update", updateUser);

// Route to delete user
userRouter.delete("/delete", deleteUser);

export default userRouter;
