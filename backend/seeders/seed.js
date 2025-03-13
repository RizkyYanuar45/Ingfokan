import sequelize from "../config/database.js";
import user from "../models/user.js";

import banner from "../models/banner.js";
import author from "../models/author.js";
import category from "../models/category.js";
import favorite from "../models/favorite.js";
import Comment from "../models/comment.js";
import article from "../models/article.js";

const seeder = async () => {
  try {
    await sequelize.sync({ force: true }); //ini agar bila ada tabel sebelumnya akan dihapus kemudian dibuatkan
    console.log("tabel direstart");
    await user.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
      role: "admin",
      username: "JD",
    });
    return console.log("berhasil seed ke database");
  } catch (error) {
    return console.log(error);
  }
};

seeder();
