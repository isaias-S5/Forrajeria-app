import { Router } from "express";
import * as AuthMiddleware from "../middleware/authjtw.js";
import * as userController from "../controllers/users.controller.js";

const router = Router();

router.get("/users", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], userController.getUsers);

router.get("/users/:userId",AuthMiddleware.verifyToken, userController.getUser);

router.patch("/users/:userId",AuthMiddleware.verifyToken, userController.updateUser);

// router.delete("/users/:userId", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], userController.deleteUser);

export default router;
