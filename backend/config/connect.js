import sequelize from "./database.js";

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("koneksi ke database berhasil");
  } catch (error) {
    console.error("koneksi ke database gagal", error);
  }
};

export default connectDB;
