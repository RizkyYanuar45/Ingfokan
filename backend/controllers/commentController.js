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
          attributes: ["id", "name", "avatar"],
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
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user_id from token payload
    const user_id = decoded.id; // or decoded.user_id depending on your token structure

    // Use user_id from token, not from req.body
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

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: { comment: newComment },
    });
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
