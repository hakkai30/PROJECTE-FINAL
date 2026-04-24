import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { followProfile, getProfile, unfollowProfile } from "../controllers/socialController.js";

const router = Router();

router.get("/profiles/:handle", getProfile);
router.post("/profiles/:handle/follow", requireAuth, followProfile);
router.delete("/profiles/:handle/follow", requireAuth, unfollowProfile);

export default router;
