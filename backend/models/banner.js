import { DataTypes } from "sequelize";
import db from "../config/database.js";

const banner = db.define("Banner", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  is_active: {
    type: DataTypes.ENUM("active", "not_active"),
    defaultValue: "active",
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default banner;
