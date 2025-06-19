import jwt, { decode } from "jsonwebtoken";
import User from "./../models/user.js";
import ResponseApi from "./../helper/response.js";

const protect = async (req, res, next) => {
  try {
    // Debug: Lihat raw Authorization header
    console.log("Raw Authorization header:", req.header("Authorization"));

    // Mengambil token dari header Authorization
    let token = req.header("Authorization")?.replace("Bearer ", "");

    // Debug: Lihat token setelah di-extract
    console.log("Extracted token:", token);
    console.log("Token length:", token?.length);
    console.log("Token type:", typeof token);

    if (!token) return ResponseApi.error(res, "Tidak ada token");

    // Memverifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Rest of your code...
    console.log("User ID from Token:", decoded.id);
    console.log("User Email from Token:", decoded.email);
    console.log("User decoded from Token:", decoded);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) return ResponseApi.error(res, "User tidak ditemukan");

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    console.error("Full error:", error);
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
