import express from "express";
import {
  getAllArticle,
  getAllById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
} from "./../controllers/articleController.js";
import upload from "./../middleware/upload.js";

const routes = express.Router();

routes.get("/", getAllArticle);
routes.get("/category", getArticlesByCategory);
routes.get("/:id", getAllById);
routes.post("/", upload.single("thumbnail"), createArticle);
routes.patch("/:id", upload.single("thumbnail"), updateArticle);
routes.delete("/:id", deleteArticle);

export default routes;
