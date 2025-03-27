import express from "express";
import {
  getAllComment,
  createComment,
  deleteComment,
} from "./../controllers/commentController.js";

const router = express.Router();

router.get("/", getAllComment);
router.post("/", createComment);
router.delete("/:id", deleteComment);

export default router;
