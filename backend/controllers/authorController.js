import Author from "../models/author.js";
import ResponseAPI from "../helper/response.js";
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
    const author = await Author.create({ name, email, avatar: avatarPath });
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
