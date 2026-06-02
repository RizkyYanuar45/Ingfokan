import jwt, { decode } from "jsonwebtoken";
import User from "./../models/user.js";
import ResponseAPI from "./../helper/response.js";

const protect = async (req, res, next) => {
  try {
    // Ambil token dari cookie atau Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return ResponseAPI.unauthorized(res, "Tidak ada token, silakan login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) return ResponseAPI.unauthorized(res, "User tidak ditemukan");

    req.user = user;
    next();
  } catch (error) {
    return ResponseAPI.unauthorized(res, "Token tidak valid");
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
      return ResponseAPI.unauthorized(res, "kamu bukan admin");
    }
  } catch (error) {
    console.error(error);
    return ResponseAPI.serverError(res, error);
  }
};

export { protect, admin };
