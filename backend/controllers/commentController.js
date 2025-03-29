import Comment from "./../models/comment.js";
import ResponseAPI from "../helper/response.js";

const getAllComment = async (req, res) => {
  try {
    const { article_id } = req.body;
    const comment = await Comment.findAll({
      where: { article_id: article_id },
    });
    if (!comment) {
      return ResponseAPI.notFound(res, "tidak ada komentar");
    }
    return ResponseAPI.success(res, "success", {
      comment,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const createComment = async (req, res) => {
  try {
    const { user_id, article_id, content } = req.body;
    if (!user_id || !article_id || !content) {
      return ResponseAPI.error(res, "mohon isi semua");
    }
    const comment = await Comment.create({
      user_id: user_id,
      article_id: article_id,
      content: content,
    });
    return ResponseAPI.success(res, "success", {
      comment,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.destroy({ where: { id: id } });
    return ResponseAPI.success(res, "success", {
      comment,
    });
  } catch (error) {
    return ResponseAPI.error(res, error.message);
  }
};

export { createComment, deleteComment, getAllComment };
