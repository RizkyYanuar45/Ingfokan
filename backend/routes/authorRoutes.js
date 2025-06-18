import express from "express";
import {
  getAllAuthor,
  getAuthorById,
  getAuthorWithHisArticles,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorBySlug,
} from "./../controllers/authorController.js";
import { protect, admin } from "./../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("avatar"), createAuthor);
router.get("/", getAllAuthor);
router.get("/articles/:id", getAuthorWithHisArticles);
router.get("/slug/:slug", getAuthorBySlug);
router.get("/:id", getAuthorById);
router.patch("/:id", protect, admin, upload.single("avatar"), updateAuthor);
router.delete("/delete/:id", protect, admin, deleteAuthor);

export default router;
