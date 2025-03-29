import ResponseAPI from "../helper/response.js";
import Favorite from "./../models/favorite.js";

const getAllFavorite = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await Favorite.findAll({ where: { user_id: user_id } });
    if (!result) {
      return ResponseAPI.notFound(res, "belum ada yang di favoritkan");
    }
    return ResponseAPI.success(res, "success", {
      result,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const createFavorite = async (req, res) => {
  try {
    const { user_id, article_id } = req.body;
    const result = await Favorite.create({ user_id, article_id });
    return ResponseAPI.success(res, "success", {
      result,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Favorite.destroy({ where: { id: id } });
    return ResponseAPI.success(res, "success", {
      result,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

export { getAllFavorite, createFavorite, deleteFavorite };
