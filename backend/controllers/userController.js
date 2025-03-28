import jwt from "jsonwebtoken";
import ResponseAPI from "../helper/response.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

import fs from "fs";
import { log } from "console";

const registerUser = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const avatarPath = req.file ? req.file.path : null;
    // console.log(req.body);

    if (!username || !email || !password || !name) {
      if (req.file) fs.unlinkSync(req.file.path);
      return ResponseAPI.error(res, "Pastikan semua form wajib terisi");
    }

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      if (req.file) fs.unlinkSync(req.file.path);
      return ResponseAPI.error(res, "User sudah terdaftar");
    }
    const usernameExist = await User.findOne({ where: { username } });
    if (usernameExist) {
      if (req.file) fs.unlinkSync(req.file.path);
      return ResponseAPI.error(res, "Username Sudah Ada");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      avatar: avatarPath,
    });

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "20h",
    // });

    return ResponseAPI.success(res, "User berhasil terdaftar", {
      data: user,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.log(error);
    return ResponseAPI.error(res, "Terjadi kesalahan saat mendaftar");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return ResponseAPI.error(res, "Pastikan semua form wajib terisi", 400);
    }

    // Mencari pengguna berdasarkan email
    const user = await User.findOne({ where: { email: email } });
    const idUser = user.id;
    console.log(idUser);

    if (!user) {
      return ResponseAPI.error(res, "User Tidak Terdaftar", 404);
    }

    // Memeriksa kecocokan password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return ResponseAPI.error(res, "Password Salah", 401);
    }

    // Membuat token dengan informasi pengguna

    const token = jwt.sign(
      {
        email: user.email, // Menyertakan email
        role: user.role, // Menyertakan role
      },
      process.env.JWT_SECRET, // Kunci rahasia dari variabel lingkungan
      {
        expiresIn: "20h", // Waktu kedaluwarsa token
      }
    );

    // Mengembalikan respons sukses dengan token
    return ResponseAPI.success(res, "User Berhasil Login", {
      token: token,
    });
  } catch (error) {
    console.error(error);
    return ResponseAPI.error(res, "Terjadi kesalahan pada server", 500);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    return ResponseAPI.success(res, "Data User Berhasil Dibawa", {
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return ResponseAPI.error(res, "User Tidak Terdaftar");
    }
    return ResponseAPI.success(res, "Data User Berhasil Dibawa", {
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return ResponseAPI.error(res, "User Tidak Terdaftar");
    }
    user.destroy({ where: { id: id } });
    if (user.avatar) {
      fs.unlinkSync(user.avatar);
      console.log(user.avatar);
    }
    return ResponseAPI.success(res, "user berhasil dihapus", { data: user });
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };
    console.log(updates);

    if (req.file) {
      const oldAvatar = await User.findOne({ where: { id: id } });
      fs.unlinkSync(oldAvatar.avatar);
      updates.avatar = req.file.path;
    }

    const user = await User.update(updates, {
      where: { id: id },
    });

    const newData = await User.findOne({ where: { id: id } });

    if (!user) {
      return ResponseAPI.error(res, "User Tidak Terdaftar");
    }
    return ResponseAPI.success(res, "Data User Berhasil Diubah", {
      data: newData,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUser,
  editUser,
};
