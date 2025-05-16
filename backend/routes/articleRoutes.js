import express from "express";
import {
  getAllArticle,
  getAllById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesBySlug,
  getArticleComments,
  getArticlesByCategory,
  getArticlesByAuthor,
} from "./../controllers/articleController.js";
import upload from "./../middleware/upload.js";

const routes = express.Router();

routes.get("/", getAllArticle);
routes.get("/slug/:slug", getArticlesBySlug);
routes.get("/comment/:id", getArticleComments);
routes.get("/category", getArticlesByCategory);
routes.get("/author", getArticlesByAuthor);
routes.get("/:id", getAllById);
routes.post("/", upload.single("thumbnail"), createArticle);
routes.patch("/:id", upload.single("thumbnail"), updateArticle);
routes.delete("/:id", deleteArticle);

export default routes;
