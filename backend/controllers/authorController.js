import Author from "../models/author.js";
import Article from "../models/article.js";
import Category from "../models/category.js";
import ResponseAPI from "../helper/response.js";
import slugify from "slugify";
import fs from "fs";

const getAllAuthor = async (req, res) => {
  try {
    const authors = await Author.findAll();
    if (authors.length === 0) {
      return ResponseAPI.notFound(res, "tidak ada author yang terdaftar");
    }
    return ResponseAPI.success(res, "berhasil mendapatkan semua authors", {
      data: authors,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan semua author",
      400,
      error.message
    );
  }
};

const getAuthorWithHisArticles = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findOne({
      where: { id: id },
      include: [
        {
          model: Article,
          as: "articles",
          attributes: ["id", "title", "content", "createdAt", "thumbnail"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    if (!author) {
      return ResponseAPI.notFound(res, "author tidak ditemukan");
    }
    return ResponseAPI.success(res, "berhasil mendapatkan author", {
      data: author,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan author",
      400,
      error.message
    );
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findOne({ where: { id: id } });
    if (!author) {
      return ResponseAPI.notFound(res, "author tidak ditemukan");
    }
    return ResponseAPI.success(res, "berhasil mendapatkan author", {
      data: author,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan author",
      400,
      error.message
    );
  }
};
const getAuthorBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const author = await Author.findOne({ where: { slug: slug } });
    if (!author) {
      return ResponseAPI.notFound(res, "author tidak ditemukan");
    }
    return ResponseAPI.success(res, "berhasil mendapatkan author", {
      data: author,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan author",
      400,
      error.message
    );
  }
};

const createAuthor = async (req, res) => {
  try {
    const { name, email } = req.body;
    const avatarPath = req.file ? req.file.path : null;
    const slugged = slugify(name, {
      replacement: "-",
      lower: true,
      strict: true,
    });
    console.log(slugged);

    const author = await Author.create({
      name,
      email,
      avatar: avatarPath,
      slug: slugged,
    });
    return ResponseAPI.success(res, "berhasil menambahkan author", {
      data: author,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal menambahkan author catch",
      400,
      error.message
    );
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const newAvatar = req.file ? req.file.path : null;

    const author = await Author.findOne({ where: { id: id } });
    if (!author) {
      return ResponseAPI.error(res, "Data kategori tidak ditemukan");
    }

    if (newAvatar) {
      if (fs.existsSync(author.avatar)) {
        fs.unlinkSync(author.avatar);
      }
    }

    await Author.update(
      { name: name, email: email, avatar: newAvatar || author.avatar },
      { where: { id: id } }
    );

    const updatedAuthor = await Author.findOne({ where: { id: id } });

    return ResponseAPI.success(res, "Berhasil mengupdate kategori", {
      author: updatedAuthor,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findOne({ where: { id: id } });
    if (author) {
      if (fs.existsSync(author.avatar)) {
        fs.unlinkSync(author.avatar);
      }

      await author.destroy();
      return ResponseAPI.success(res, "berhasil menghapus author");
    } else {
      return ResponseAPI.notFound(res, "author tidak ditemukan");
    }
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

export {
  getAllAuthor,
  getAuthorById,
  getAuthorBySlug,
  getAuthorWithHisArticles,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
