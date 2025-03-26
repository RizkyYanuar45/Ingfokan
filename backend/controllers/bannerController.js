import jwt from "jsonwebtoken";
import ResponseAPI from "../helper/response.js";
import banner from "./../models/banner.js";
import fs from "fs";

const getAllBanner = async (req, res) => {
  try {
    const bannerData = await banner.findAll();
    if (bannerData.length == 0) {
      return ResponseAPI.notFound(res, "tidak ada banner yang terbuat");
    }
    return ResponseAPI.success(res, "Berhasil mendapatkan semua data banner", {
      data: bannerData,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan semua banner",
      400,
      error.message
    );
  }
};

const getBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await banner.findOne({ where: { id: id } });
    return ResponseAPI.success(res, "berhasil mendapatkan banner", {
      data: banner,
    });
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mendapatkan banner",
      400,
      error.message
    );
  }
};

const createBanner = async (req, res) => {
  try {
    const { is_active, link } = req.body;
    const thumbnail = req.file ? req.file.path : null;
    const newBanner = await banner.create({ is_active, thumbnail, link });
    return ResponseAPI.success(res, "berhasil membuat banner", {
      data: newBanner,
    });
  } catch (error) {
    return ResponseAPI.error(res, "gagal membuat banner", 400, error.message);
  }
};

const deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await banner.findOne({ where: { id: id } });
    if (banner) {
      fs.unlinkSync(banner.thumbnail);
      await banner.destroy();
      return ResponseAPI.success(res, "berhasil menghapus banner", {
        data: banner,
      });
    } else {
      return ResponseAPI.error(
        res,
        "gagal menghapus banner",
        404,
        "banner tidak ada"
      );
    }
  } catch (error) {
    return ResponseAPI.error(res, "gagal menghapus banner", 400, error.message);
  }
};

const updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const { is_active, link } = req.body;
    const newThumbnailPath = req.file ? req.file.path : null;
    const banner = await banner.findOne({ where: { id: id } });
    if (banner) {
      if (newThumbnailPath) {
        if (fs.existsSync(banner.thumbnail)) {
          fs.unlinkSync(banner.thumbnail);
        }
        banner.thumbnail = newThumbnailPath;
      }
      banner.is_active = is_active;
      banner.link = link;
      await banner.save();
      return ResponseAPI.success(res, "berhasil mengupdate banner", {
        data: banner,
      });
    } else {
      return ResponseAPI.error(
        res,
        "gagal mengupdate banner",
        404,
        "banner tidak ada"
      );
    }
  } catch (error) {
    return ResponseAPI.error(
      res,
      "gagal mengupdate banner",
      400,
      error.message
    );
  }
};

export {
  getAllBanner,
  getBannerById,
  createBanner,
  deleteBanner,
  updateBanner,
};
