import { Router } from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  toggleLikePost,
} from "../controllers/postController.js";

const router = Router();

router.get("/", getFeedPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/:id/like", toggleLikePost);

export default router;
