import { DataTypes, Sequelize } from "sequelize";
import db from "../config/database.js";
import category from "./category.js";
import author from "./author.js";

const article = db.define("Article", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: category,
      key: "id",
    },
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: author,
      key: "id",
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  published_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.Now,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

article.associate = (models) => {
  article.belongsTo(models.category, { foreignKey: "category_id" });
  article.belongsTo(models.author, { foreignKey: "author_id" });
};

export default article;
