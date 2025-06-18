import jwt from "jsonwebtoken";
import ResponseAPI from "../helper/response.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import sendEmail from "../helper/sendMail.js";
import crypto from "crypto";

import fs from "fs";

// Fungsi untuk mengirim link reset password
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ResponseAPI.error(res, "Email tidak boleh kosong", 400);
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return ResponseAPI.error(res, "Email tidak terdaftar", 404);
    }

    // Generate token reset yang unik dan secure
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set waktu expired (misalnya 1 jam dari sekarang)
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 1);

    // Simpan token reset dan waktu expired ke database
    await User.update(
      {
        reset_token: resetToken,
        reset_token_expired: expiredAt,
      },
      { where: { email: email } }
    );

    // Buat link reset password
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Template email HTML yang lebih menarik
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Password</h2>
        <p>Halo, ${user.name || "User"},</p>
        <p>Anda telah meminta untuk mereset password akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>Atau copy dan paste link berikut di browser Anda:</p>
        <p style="word-wrap: break-word; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
          ${resetLink}
        </p>
        
        <p><strong>Link ini akan expired dalam 1 jam.</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Jika Anda tidak meminta reset password, silakan abaikan email ini. 
          Password akun Anda tidak akan berubah.
        </p>
      </div>
    `;

    await sendEmail(email, "Reset Password - Link Reset", htmlMessage, true); // true untuk HTML email

    return ResponseAPI.success(
      res,
      "Link reset password telah dikirim ke email Anda"
    );
  } catch (error) {
    console.error(error);
    return ResponseAPI.error(
      res,
      "Terjadi kesalahan saat mengirim email reset password",
      500
    );
  }
};

// Fungsi untuk memverifikasi token reset password dari link
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return ResponseAPI.error(res, "Token reset tidak ditemukan", 400);
    }

    const user = await User.findOne({ where: { reset_token: token } });
    if (!user) {
      return ResponseAPI.error(res, "Token reset tidak valid", 400);
    }

    // Cek apakah token sudah expired
    const now = new Date();
    if (user.reset_token_expired && now > user.reset_token_expired) {
      return ResponseAPI.error(res, "Link reset password sudah expired", 400);
    }

    // Token valid, return user info (tanpa sensitive data)
    return ResponseAPI.success(res, "Token reset valid", {
      email: user.email,
      name: user.name,
      tokenValid: true,
    });
  } catch (error) {
    console.error(error);
    return ResponseAPI.error(
      res,
      "Terjadi kesalahan saat memverifikasi token reset",
      500
    );
  }
};

// Fungsi untuk mengubah password dengan token reset
const changePasswordWithToken = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return ResponseAPI.error(res, "Semua field harus diisi", 400);
    }

    // Validasi password
    if (newPassword !== confirmPassword) {
      return ResponseAPI.error(
        res,
        "Password dan konfirmasi password tidak sama",
        400
      );
    }

    if (newPassword.length < 6) {
      return ResponseAPI.error(res, "Password minimal 6 karakter", 400);
    }

    const user = await User.findOne({ where: { reset_token: token } });
    if (!user) {
      return ResponseAPI.error(res, "Token reset tidak valid", 400);
    }

    // Cek apakah token sudah expired
    const now = new Date();
    if (user.reset_token_expired && now > user.reset_token_expired) {
      return ResponseAPI.error(res, "Link reset password sudah expired", 400);
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan hapus token reset
    await User.update(
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiredAt: null,
      },
      { where: { id: user.id } }
    );

    // Kirim email konfirmasi bahwa password telah berhasil diubah
    const confirmationMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Password Berhasil Diubah</h2>
        <p>Halo, ${user.name || "User"},</p>
        <p>Password akun Anda telah berhasil diubah pada ${new Date().toLocaleString(
          "id-ID"
        )}.</p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; 
                    padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Keamanan Akun:</strong> Jika Anda tidak melakukan perubahan ini, 
          segera hubungi tim support kami.
        </div>
        
        <p>Terima kasih telah menggunakan layanan kami.</p>
      </div>
    `;

    await sendEmail(
      user.email,
      "Password Berhasil Diubah",
      confirmationMessage,
      true
    );

    return ResponseAPI.success(res, "Password berhasil diubah");
  } catch (error) {
    console.error(error);
    return ResponseAPI.error(
      res,
      "Terjadi kesalahan saat mengubah password",
      500
    );
  }
};

// Fungsi untuk membatalkan reset password (opsional)
const cancelResetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) {
      return ResponseAPI.error(res, "Token reset tidak valid", 400);
    }

    // Hapus token reset
    await User.update(
      {
        resetToken: null,
        resetTokenExpiredAt: null,
      },
      { where: { id: user.id } }
    );

    return ResponseAPI.success(res, "Reset password dibatalkan");
  } catch (error) {
    console.error(error);
    return ResponseAPI.error(res, "Terjadi kesalahan", 500);
  }
};

// ... sisanya fungsi yang sudah ada ...

const registerUser = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const avatarPath = req.file ? req.file.path : null;

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

    if (!email || !password) {
      return ResponseAPI.error(res, "Pastikan semua form wajib terisi", 400);
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return ResponseAPI.error(res, "User Tidak Terdaftar", 404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return ResponseAPI.error(res, "Password Salah", 401);
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "20h",
      }
    );

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
    }
    return ResponseAPI.success(res, "user berhasil dihapus", { data: user });
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user_id = decoded.id;
    if (user_id !== parseInt(req.params.id)) {
      return ResponseAPI.error(
        res,
        "Anda tidak memiliki akses untuk mengedit user ini",
        403
      );
    }

    const id = req.params.id;
    const updates = { ...req.body };

    if (req.file) {
      const oldAvatar = await User.findOne({ where: { id: id } });
      if (oldAvatar && oldAvatar.avatar) {
        fs.unlinkSync(oldAvatar.avatar);
      }
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
  resetPassword,
  verifyResetToken,
  changePasswordWithToken,
  cancelResetPassword,
  loginUser,
  getAllUser,
  getUserById,
  deleteUser,
  editUser,
};
