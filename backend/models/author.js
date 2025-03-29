import { DataTypes } from "sequelize";
import db from "../config/database.js";

const author = db.define("author", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
});

export default author;
