import express from "express";
import {
  getAllComment,
  createComment,
  deleteComment,
  getCommentWithUser,
} from "./../controllers/commentController.js";

const router = express.Router();

router.get("/user/:articleId", getCommentWithUser);
router.get("/", getAllComment);
router.post("/", createComment);
router.delete("/:id", deleteComment);

export default router;
