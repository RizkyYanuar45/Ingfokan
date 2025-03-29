import Article from "../models/article.js";
import ResponseAPI from "../helper/response.js";
import fs from "fs";
import slugify from "slugify";

const getAllArticle = async (req, res) => {
  try {
    const article = await Article.findAll();
    if (!article) {
      ResponseAPI.notFound(res, "article tidak ditemukan");
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
      ResponseAPI.notFound(res, "article tidak ditemukan");
    }
    return ResponseAPI.success(res, "Artikel berhasil didapatkan", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, category_id, author_id } = req.body;
    const thumbnailPath = req.file ? req.file.path : null;
    const dateNow = Date.now();
    const slugged = slugify(title, {
      replacement: "-",
      lower: true,
      strict: true,
    });
    const article = await Article.create({
      title,
      thumbnail: thumbnailPath,
      content,
      category_id,
      author_id,
      published_date: dateNow,
      slug: slugged,
    });
    return ResponseAPI.success(res, "Artikel berhasil dibuat", {
      article,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const updateArticle = async (req, res) => {
  // try {
  //   const id = req.params.id;
  //   const article = await Article.findOne({ where: { id: id } });
  //   if (!article) {
  //     ResponseAPI.notFound(res, "article tidak ditemukan");
  //   }
  //   const { title, content, category_id, article_id, published_date } = req.body;
  //   const thumbnailPath = req.file ? req.file.thumbnail : null;
  //   const slugged = slugify(title, {
  //     replacement: "-",
  //     lower: true,
  //     strict: true,
  //   });
  //   article.title = title;
  //   article.thumbnail = thumbnailPath;
  //   article.content = content;
  //   article.category_id = category_id;
  //   article.article_id = article_id;
  //   article.published_date = published_date;
  //   article.slug = slugged;
  //   await article.save();
  //   return ResponseAPI.success(res, "Artikel berhasil diupdate", {
  //     article,
  //   });
  // } catch (error) {
  //   return ResponseAPI.error(res, error.message);
  // }
  try {
    const id = req.params.id;
    const { title, content, category_id, author_id } = req.body;
    const newThumbnail = req.file ? req.file.path : null;
    const timeNow = Date.now();

    const article = await Article.findOne({ where: { id: id } });
    if (!article) {
      return ResponseAPI.error(res, "Data article tidak ditemukan");
    }

    if (newThumbnail) {
      if (fs.existsSync(article.avatar)) {
        fs.unlinkSync(article.avatar);
      }
    }

    await Article.update(
      {
        title,
        content,
        category_id,
        author_id,
        published_date: timeNow,
        slug: slugify(title, {
          replacement: "-",
          lower: true,
          strict: true,
        }),
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
    if (article) {
      if (fs.existsSync(article.thumbnail)) {
        fs.unlinkSync(article.thumbnail);
      }

      await article.destroy();
    }
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
};
