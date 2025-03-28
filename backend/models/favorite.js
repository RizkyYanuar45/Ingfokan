import { DataTypes } from "sequelize";
import db from "../config/database.js";
import user from "../models/user.js";
import article from "../models/article.js";

const favorite = db.define("favorite", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: user,
      key: "id",
    },
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: article,
      key: "id",
    },
  },
});
export default favorite;
