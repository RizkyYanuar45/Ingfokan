import { DataTypes, Sequelize } from "sequelize";
import db from "../config/database.js";
import Category from "./category.js";
import Author from "./author.js";

const article = db.define("Article", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_id: {
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  author_id: {
    allowNull: false,
    references: {
      model: Author,
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
  article.belongsTo(models.Category, { foreignKey: "category_id" });
  article.belongsTo(models.Author, { foreignKey: "author_id" });
};

export default article;
