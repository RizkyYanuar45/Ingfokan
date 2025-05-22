import express from "express";
import {
  getAllFavorite,
  getFavoriteByUserId,
  deleteFavorite,
  createFavorite,
} from "./../controllers/favoriteController.js";

const router = express.Router();

router.get("/", getAllFavorite);
router.get("/user/:id", getFavoriteByUserId);
router.delete("/:id", deleteFavorite);
router.post("/", createFavorite);

export default router;
