import { Router } from "express";
import {
  createThreadMessage,
  getMessageThreads,
  streamMessages,
} from "../controllers/messageController.js";

const router = Router();

router.get("/threads", getMessageThreads);
router.post("/threads/:threadId/messages", createThreadMessage);
router.get("/stream", streamMessages);

export default router;
