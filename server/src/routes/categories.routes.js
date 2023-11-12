import { Router } from "express";
import * as categoryController from "../controllers/categories.controller.js"
import * as AuthMiddleware from "../middleware/authjtw.js";

const router = Router();

router.get("/categories", AuthMiddleware.verifyToken, categoryController.getCategories);

router.get("/categories/:categoryId", AuthMiddleware.verifyToken, categoryController.getCategory);

router.post("/categories", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], categoryController.createCategory);

router.patch("/categories/:categoryId", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], categoryController.updateCategory);

router.delete("/categories/:categoryId", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], categoryController.deleteCategory);

export default router;
