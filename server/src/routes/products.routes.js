import { Router } from "express";
import * as ProductController from "../controllers/products.controller.js";
import * as AuthMiddleware from "../middleware/authjtw.js";

const router = Router();

router.get("/products", AuthMiddleware.verifyToken, ProductController.getProducts);

router.get("/products/:productId", AuthMiddleware.verifyToken, ProductController.getProduct);

router.post("/products", ProductController.createProduct);

router.patch("/products/:productId", AuthMiddleware.verifyToken, ProductController.updateProduct);

router.delete("/products/:productId", [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], ProductController.deleteProduct);

export default router;
