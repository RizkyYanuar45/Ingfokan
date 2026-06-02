import Comment from "./../models/comment.js";
import User from "./../models/user.js";
import ResponseAPI from "../helper/response.js";
import jwt from "jsonwebtoken";

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

const getCommentWithUser = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const comment = await Comment.findAll({
      where: { article_id: articleId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar", "username"],
        },
      ],
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
    // User is already authenticated and attached to req.user by protect middleware
    const user_id = req.user.id;
    const { article_id, content } = req.body;

    if (!article_id || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create comment in DB with user_id from token
    const newComment = await Comment.create({
      article_id,
      content,
      user_id,
    });

    return ResponseAPI.success(res, "Comment created successfully", {
      comment: newComment,
    }, 201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
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

export { createComment, deleteComment, getAllComment, getCommentWithUser };
