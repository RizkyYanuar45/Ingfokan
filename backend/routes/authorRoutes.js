import express, { Router } from "express";
import {
  getAllAuthor,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "./../controllers/authorController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("avatar"), createAuthor);
router.get("/", getAllAuthor);
router.get("/:id", getAuthorById);
router.patch("/update/:id", upload.single("avatar"), updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
