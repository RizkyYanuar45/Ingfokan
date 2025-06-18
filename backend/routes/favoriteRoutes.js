import express from "express";
import {
  getAllFavorite,
  getFavoriteByUserId,
  deleteFavorite,
  createFavorite,
} from "./../controllers/favoriteController.js";
import { protect } from "./../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllFavorite);
router.get("/user/:id", getFavoriteByUserId);
router.delete("/:id", protect, deleteFavorite);
router.post("/", protect, createFavorite);

export default router;
