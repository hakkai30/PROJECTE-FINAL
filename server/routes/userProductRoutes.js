import { Router } from "express";
import {
  createUserProduct,
  deleteUserProduct,
  getUserProducts,
  getUserProductsByUser,
  toggleUserProductLike,
} from "../controllers/userProductController.js";

const router = Router();

router.get("/", getUserProducts);
router.post("/", createUserProduct);
router.get("/seller/:sellerEmail", getUserProductsByUser);
router.delete("/:id", deleteUserProduct);
router.patch("/:id/like", toggleUserProductLike);

export default router;
