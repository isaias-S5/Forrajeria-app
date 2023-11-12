import * as AuthController from "../controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/emailVerification/:email", AuthController.emailVerification);

router.post("/verifyExistingUser", AuthController.verifyExistingUser);

router.put("/changePassword/:email", AuthController.changePassword);

export default router;
