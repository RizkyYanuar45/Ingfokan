import jwt from "jsonwebtoken";
import User from "./../models/user.js";
import ResponseApi from "./../helper/response.js";

const protect = async (req, res, next) => {
  try {
    // Mengambil token dari header Authorization
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return ResponseApi.error(res, "Tidak ada token");

    // Memverifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Mengambil pengguna berdasarkan ID dari token
    const user = await User.findByPk(decoded.id);
    if (!user) return ResponseApi.error(res, "User tidak ditemukan");

    // Menyimpan informasi pengguna di request untuk digunakan di rute berikutnya
    req.user = user;
    next(); // Melanjutkan ke middleware atau rute berikutnya
  } catch (error) {
    console.error(error);
    return ResponseApi.error(res, "Token tidak valid");
  }
};

export default protect;
