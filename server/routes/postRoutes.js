import { Router } from "express";
import {
  addCommentToPost,
  createPost,
  deleteCommentFromPost,
  deletePost,
  getFeedPosts,
  toggleLikePost,
} from "../controllers/postController.js";

const router = Router();

router.get("/", getFeedPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/:id/like", toggleLikePost);
router.post("/:id/comments", addCommentToPost);
router.delete("/:id/comments/:commentId", deleteCommentFromPost);

export default router;
