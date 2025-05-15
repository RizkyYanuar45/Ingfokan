import Article from "../models/article.js";
import ResponseAPI from "../helper/response.js";
import fs from "fs";
import slugify from "slugify";
import { Op } from "sequelize"; // Menambahkan import Op dari sequelize

const generateUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    // Find any article with the current slug, excluding the current article if updating
    const whereClause = { slug: slug };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId }; // Op.ne = not equal
    }

    const existingArticle = await Article.findOne({ where: whereClause });

    if (!existingArticle) {
      isUnique = true;
    } else {
      // If slug exists, append counter to the slug and try again
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

const getAllArticle = async (req, res) => {
  try {
    const article = await Article.findAll();
    if (!article || article.length === 0) {
      return ResponseAPI.notFound(res, "article tidak ditemukan");
    }
    return ResponseAPI.success(res, "Semua artikel berhasil didapatkan", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const getAllById = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findOne({ where: { id: id } });
    if (!article) {
      return ResponseAPI.notFound(res, "article tidak ditemukan");
    }
    return ResponseAPI.success(res, "Artikel berhasil didapatkan", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const getArticlesByCategory = async (req, res) => {
  try {
    const categoryId = req.query.category_id;

    if (!categoryId) {
      return res
        .status(400)
        .json({ message: "category_id query parameter is required" });
    }

    const articles = await Article.findAll({
      where: { category_id: categoryId },
      order: [["published_date", "DESC"]],
    });

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, category_id, author_id } = req.body;
    const thumbnailPath = req.file ? req.file.path : null;
    const dateNow = Date.now();

    // Generate base slug from title
    const baseSlug = slugify(title, {
      replacement: "-",
      lower: true,
      strict: true,
    });

    // Get unique slug
    const slug = await generateUniqueSlug(baseSlug);

    const article = await Article.create({
      title,
      thumbnail: thumbnailPath,
      content,
      category_id,
      author_id,
      published_date: dateNow,
      slug: slug,
    });

    return ResponseAPI.success(res, "Artikel berhasil dibuat", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const updateArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, category_id, author_id } = req.body;
    const newThumbnail = req.file ? req.file.path : null;
    const timeNow = Date.now();

    const article = await Article.findOne({ where: { id: id } });
    if (!article) {
      return ResponseAPI.error(res, "Data article tidak ditemukan");
    }

    if (newThumbnail && article.thumbnail) {
      if (fs.existsSync(article.thumbnail)) {
        // Mengubah article.avatar menjadi article.thumbnail
        fs.unlinkSync(article.thumbnail);
      }
    }

    // Generate base slug from title
    const baseSlug = slugify(title, {
      replacement: "-",
      lower: true,
      strict: true,
    });

    // Only generate new slug if title changed
    const slug =
      title !== article.title
        ? await generateUniqueSlug(baseSlug, article.id)
        : article.slug;

    await Article.update(
      {
        title,
        content,
        category_id,
        author_id,
        published_date: timeNow,
        slug: slug,
        thumbnail: newThumbnail || article.thumbnail,
      },
      { where: { id: id } }
    );

    const updatedArticle = await Article.findOne({ where: { id: id } });

    return ResponseAPI.success(res, "Berhasil mengupdate Article", {
      article: updatedArticle,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findOne({ where: { id: id } });
    if (!article) return ResponseAPI.error(res, "data article tidak ditemukan");

    if (article.thumbnail) {
      if (fs.existsSync(article.thumbnail)) {
        fs.unlinkSync(article.thumbnail);
      }
    }

    await article.destroy();

    return ResponseAPI.success(res, "Berhasil menghapus artikel", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

export {
  getAllArticle,
  getAllById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
};
