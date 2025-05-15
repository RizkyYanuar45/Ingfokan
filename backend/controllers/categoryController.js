import Category from "../models/category.js";
import Article from "../models/article.js";
import fs from "fs";

import ResponseAPI from "../helper/response.js";

const getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    if (!category) return ResponseAPI.error(res, "data category masih kosong");
    return ResponseAPI.success(res, "Berhasil mendapatkan semua kategori", {
      category,
    });
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
      "Berhasil mendapatkan kategori dengan id ",
      category
    );
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let newThumbnail = null;

    if (req.file && req.file.path) {
      // Normalisasi path agar menggunakan forward slash
      newThumbnail = req.file.path.replace(/\\/g, "/");
      console.log("Normalized thumbnail path:", newThumbnail);
    }

    const category = await Category.create({
      name,
      thumbnail: newThumbnail,
    });

    console.log("Category created successfully", category);
    return ResponseAPI.success(res, "Berhasil membuat kategori", {
      category,
    });
  } catch (error) {
    // Jika ada file yang sudah ter-upload tapi terjadi error, hapus file tersebut
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return ResponseAPI.error(res, error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const newThumbnail = req.file ? req.file.path : null; // Use file.path instead of file.thumbnail

    const category = await Category.findOne({ where: { id: id } });
    if (!category) {
      return ResponseAPI.error(res, "Data kategori tidak ditemukan");
    }

    console.log("New thumbnail:", newThumbnail);
    console.log("Current thumbnail:", category.thumbnail);

    // If a new thumbnail is uploaded, delete the old one
    if (newThumbnail && category.thumbnail) {
      try {
        if (fs.existsSync(category.thumbnail)) {
          fs.unlinkSync(category.thumbnail);
          console.log("Old thumbnail deleted successfully");
        }
      } catch (fsError) {
        console.error("Error deleting old thumbnail:", fsError);
        // Continue with the update even if file deletion fails
      }
    }

    // Update with new data
    const updateData = {
      name: name,
    };

    // Only update thumbnail if a new one was uploaded
    if (newThumbnail) {
      updateData.thumbnail = newThumbnail;
    }

    // Use a single update method (don't mix update and save)
    await Category.update(updateData, { where: { id: id } });

    // Fetch the updated record to return
    const updatedCategory = await Category.findOne({ where: { id: id } });

    return ResponseAPI.success(res, "Berhasil mengupdate kategori", {
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return ResponseAPI.error(res, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    // 1. Cari kategori
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      return ResponseAPI.error(res, "Kategori tidak ditemukan");
    }

    // 2. Temukan artikel yang memakai kategori ini
    const articles = await Article.findAll({ where: { category_id: id } });
    if (articles.length > 0 && req.query.confirm !== "true") {
      // 3. Kirim peringatan jika ada artikel terkait
      return ResponseAPI.success(
        res,
        "Peringatan: " +
          articles.length +
          " artikel masih menggunakan kategori ini. Sertakan query ?confirm=true untuk melanjutkan penghapusan.",
        { count: articles.length }
      );
    }

    // Jika sudah konfirmasi, update artikel terkait menjadi null
    if (articles.length > 0) {
      await Article.update(
        { category_id: null },
        { where: { category_id: id } }
      );
    }

    // 4. Hapus thumbnail jika ada
    if (category.thumbnail && fs.existsSync(category.thumbnail)) {
      fs.unlinkSync(category.thumbnail);
    }

    // 5. Hapus kategori
    await category.destroy();
    return ResponseAPI.success(
      res,
      "Berhasil menghapus kategori dan memutus relasi artikel",
      { category }
    );
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
