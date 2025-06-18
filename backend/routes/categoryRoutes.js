import {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} from "./../controllers/categoryController.js";
import express from "express";
import upload from "./../middleware/upload.js";
import { protect, admin } from "./../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.post("/", protect, admin, upload.single("thumbnail"), createCategory);
router.patch(
  "/:id",
  protect,
  admin,
  upload.single("thumbnail"),
  updateCategory
);
router.delete("/delete/:id", protect, admin, deleteCategory);

export default router;
