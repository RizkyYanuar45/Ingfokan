import { DataTypes } from "sequelize";
import db from "./../config/database.js";

const category = db.define("category", {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

export default category;
