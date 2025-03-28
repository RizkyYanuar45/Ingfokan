import jwt, { decode } from "jsonwebtoken";
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
    console.log("User ID from Token:", decoded.id);
    console.log("User Email from Token:", decoded.email);
    console.log("User decoded from Token:", decoded);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) return ResponseApi.error(res, "User tidak ditemukan");

    // Menyimpan informasi pengguna di request untuk digunakan di rute berikutnya
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return ResponseApi.error(res, "Token tidak valid");
  }
};

const admin = async (req, res, next) => {
  try {
    // console.log("req.user = " + req.User);
    // let token = req.header("Authorization")?.replace("Bearer ", "");
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findOne({ where: { email: decoded.email } });

    if (req.user && req.user.role == "admin") {
      next();
    } else {
      return ResponseApi.unauthorized(res, "kamu bukan admin");
    }
  } catch (error) {
    console.error(error);
  }
};

export { protect, admin };
