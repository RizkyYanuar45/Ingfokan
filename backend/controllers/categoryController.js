import Category from "../models/category.js";
import fs from "fs";
import ResponseAPI from "../helper/response.js";

const getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    if (!category) return ResponseAPI.error(res, "data category masih kosong");
    return ResponseAPI.success(res, "Berhasil mendapatkan semua kategori");
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ where: { id: id } });
    if (!category)
      return ResponseAPI.error(res, "data category tidak ditemukan");
    return ResponseAPI.success(
      res,
      "Berhasil mendapatkan kategori dengan id " + id
    );
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newThumbnail = req.file ? req.file.thumbnail : null;
    const category = await Category.create({
      name: name,
      thumbnail: newThumbnail,
    });
    return ResponseAPI.success(res, "Berhasil membuat kategori", {
      category,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const newThumbnail = req.file ? req.file.thumbnail : null;

    const category = await Category.findOne({ where: { id: id } });
    if (!category) {
      return ResponseAPI.error(res, "Data kategori tidak ditemukan");
    }

    if (newThumbnail) {
      if (fs.existsSync(category.thumbnail)) {
        fs.unlinkSync(category.thumbnail);
      }
    }

    await Category.update(
      { name: name, thumbnail: newThumbnail },
      { where: { id: id } }
    );

    const updatedCategory = await Category.findOne({ where: { id: id } });

    return ResponseAPI.success(res, "Berhasil mengupdate kategori", {
      category: updatedCategory,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ where: { id: id } });
    if (!category)
      return ResponseAPI.error(res, "data category tidak ditemukan");
    if (category) {
      if (fs.existsSync(category.thumbnail)) {
        fs.unlinkSync(category.thumbnail);
      }

      await category.destroy();
    }
    return ResponseAPI.success(res, "Berhasil menghapus kategori", {
      category,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
