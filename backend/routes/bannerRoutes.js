import express from "express";
import {
  createBanner,
  getAllBanner,
  getBannerById,
  deleteBanner,
  updateBanner,
} from "./../controllers/bannerController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", getAllBanner);
router.get("/:id", getBannerById);
router.post("/", upload.single("thumbnail"), createBanner);
router.patch("/:id", upload.single("thumbnail"), updateBanner);
router.delete("/delete/:id", deleteBanner);

export default router;
