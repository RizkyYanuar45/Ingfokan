// config/associations.js
import user from "../models/user.js";
import banner from "../models/banner.js";
import author from "../models/author.js";
import category from "../models/category.js";
import favorite from "../models/favorite.js";
import Comment from "../models/comment.js";
import article from "../models/article.js";

const setupAssociations = () => {
  // Author-Article association (One-to-Many)
  author.hasMany(article, {
    foreignKey: "author_id",
    onDelete: "SET NULL",
    as: "articles",
  });
  article.belongsTo(author, {
    foreignKey: "author_id",
    as: "author",
  });

  // Category-Article association (One-to-Many)
  category.hasMany(article, {
    foreignKey: "category_id",
    as: "articles",
  });
  article.belongsTo(category, {
    foreignKey: "category_id",
    as: "category",
  });

  // User-Favorite-Article association (Many-to-Many)
  user.belongsToMany(article, {
    through: favorite,
    foreignKey: "user_id",
    otherKey: "article_id",
    as: "favoritedArticles",
  });
  article.belongsToMany(user, {
    through: favorite,
    onDelete: "CASCADE",
    foreignKey: "article_id",
    otherKey: "user_id",
    as: "favoriteByUsers",
  });

  // User-Comment association (One-to-Many)
  user.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comments",
  });
  Comment.belongsTo(user, {
    foreignKey: "user_id",
    as: "user",
  });

  // Article-Comment association (One-to-Many)
  article.hasMany(Comment, {
    foreignKey: "article_id",
    as: "comments",
  });
  Comment.belongsTo(article, {
    foreignKey: "article_id",
    as: "article",
  });
};

export default setupAssociations;
