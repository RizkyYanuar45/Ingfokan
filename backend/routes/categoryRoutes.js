import {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./../controllers/categoryController.js";
import express from "express";
import upload from "./../middleware/upload.js";
import { protect, admin } from "./../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.post("/", protect, upload.single("thumbnail"), createCategory);
router.patch("/:id", upload.single("thumbnail"), updateCategory);
router.delete("/delete/:id", protect, admin, deleteCategory);

export default router;
