import { DataTypes } from "sequelize";
import db from "../config/database.js";

const banner = db.define("Banner", {
  is_active: {
    type: DataTypes.ENUM("active", "not_active"),
    defaultValue: "not_active",
    allowNull: false,
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
