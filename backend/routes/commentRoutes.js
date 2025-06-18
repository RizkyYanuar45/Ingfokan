import express from "express";
import {
  getAllComment,
  createComment,
  deleteComment,
  getCommentWithUser,
} from "./../controllers/commentController.js";
import { protect } from "./../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:articleId", getCommentWithUser);
router.get("/", getAllComment);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);

export default router;
