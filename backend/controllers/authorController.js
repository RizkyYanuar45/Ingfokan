import Author from "../models/author.js";
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

const createAuthor = async (req, res) => {
  try {
    const { name, email } = req.body;
    const avatarPath = req.file ? req.file.path : null;
    const slugged = slugify(name);
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
      "gagal menambahkan author",
      400,
      error.message
    );
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const avatarPath = req.file ? req.file.path : null;
    const author = await Author.findOne({ where: { id: id } });
    if (!author) {
      return ResponseAPI.notFound(res, "author tidak ditemukan");
    }
    if (author) {
      if (avatarPath) {
        if (fs.existsSync(author.avatar)) {
          fs.unlinkSync(author.avatar);
        }

        author.avatar = avatarPath;
      }
    }
    author.name = name;
    author.email = email;
    author.avatar = avatarPath;
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
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
