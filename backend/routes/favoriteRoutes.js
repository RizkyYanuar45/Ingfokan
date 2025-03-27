import express from "express";
import {
  getAllFavorite,
  deleteFavorite,
  createFavorite,
} from "./../controllers/favoriteController.js";

const router = express.Router();

router.get("/", getAllFavorite);
router.delete("/:id", deleteFavorite);
router.post("/", createFavorite);

export default router;
