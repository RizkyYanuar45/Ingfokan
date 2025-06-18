import express from "express";
import {
  createBanner,
  getAllBanner,
  getBannerById,
  deleteBanner,
  updateBanner,
} from "./../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", getAllBanner);
router.get("/:id", getBannerById);
router.post("/", protect, admin, upload.single("thumbnail"), createBanner);
router.patch("/:id", protect, admin, upload.single("thumbnail"), updateBanner);
router.delete("/delete/:id", protect, admin, deleteBanner);

export default router;
