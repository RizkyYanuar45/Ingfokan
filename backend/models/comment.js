// models/Comment.js
import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import Article from "./article.js";
import User from "./user.js";

const Comment = db.define("Comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Article,
      key: "id",
    },
  },
});

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: "user_id" });
  Comment.belongsTo(models.Article, { foreignKey: "article_id" });
};

export default Comment;
