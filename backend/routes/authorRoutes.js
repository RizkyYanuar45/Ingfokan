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
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("avatar"), createAuthor);
router.get("/", getAllAuthor);
router.get("/articles/:id", getAuthorWithHisArticles);
router.get("/slug/:slug", getAuthorBySlug);
router.get("/:id", getAuthorById);
router.patch("/:id", upload.single("avatar"), updateAuthor);
router.delete("/delete/:id", deleteAuthor);

export default router;
