import db from "./database.js";

const connectDB = async () => {
  try {
    await db.authenticate();
    console.log("koneksi ke database berhasil");
  } catch (error) {
    console.error("koneksi ke database gagal", error);
  }
};

export default connectDB;
