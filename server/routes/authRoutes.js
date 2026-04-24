import { Router } from "express";
import { login, logout, register, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/profile", requireAuth, updateProfile);

export default router;
