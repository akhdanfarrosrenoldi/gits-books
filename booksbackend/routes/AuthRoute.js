import express from "express";
import { login, logout, me } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
