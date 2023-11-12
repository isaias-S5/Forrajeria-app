import { Router } from "express";
import * as AuthMiddleware from "../middleware/authjtw.js";
import * as SalesController from "../controllers/sales.controller.js";

const router = Router();

router.get("/sales", AuthMiddleware.verifyToken, SalesController.getSales);

router.get("/salesdate", AuthMiddleware.verifyToken, SalesController.getSalesByDate);

router.get("/salesdate/user/:userId", AuthMiddleware.verifyToken, SalesController.getUserSalesByDate);

router.get("/sales/user/:userId", AuthMiddleware.verifyToken, SalesController.getSaleByUserId);

router.get("/sales/:saleId/saleDetails",AuthMiddleware.verifyToken, SalesController.getSaleDetails);

router.post("/sales",AuthMiddleware.verifyToken, SalesController.createSale);

router.post("/sales/:saleId/saleDetails",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], SalesController.createSaleDetails);

router.patch("/sales/:saleId",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], SalesController.updateSale);

router.delete("/sales/:saleId",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], SalesController.deleteSale);

router.delete("/sales/:saleId/saleDetails/:saleDetailsId",[AuthMiddleware.verifyToken, AuthMiddleware.isAdmin], SalesController.deleteSaleDetails);

export default router;
