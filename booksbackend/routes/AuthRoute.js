import express from "express";
import { login, logout, me } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
