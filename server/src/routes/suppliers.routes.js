import { Router } from "express";
import * as supplierController from "../controllers/suppliers.controller.js"
import * as AuthMiddleware from "../middleware/authjtw.js";

const router = Router();

router.get("/suppliers", AuthMiddleware.verifyToken, supplierController.getSuppliers);

router.get("/suppliers/:supplierId",AuthMiddleware.verifyToken, supplierController.getSupplier);

router.post("/suppliers",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], supplierController.createSupplier);

router.patch("/suppliers/:supplierId",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], supplierController.updateSupplier);

router.delete("/suppliers/:supplierId",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], supplierController.deleteSupplier);

export default router;
