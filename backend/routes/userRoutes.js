import express from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
  verifyResetToken,
  changePasswordWithToken,
  cancelResetPassword,
  deleteUser,
  getAllUser,
  getUserById,
  editUser,
  logoutUser,
} from "./../controllers/userController.js";
import handler from "../helper/contactUsPage.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import ResponseAPI from "../helper/response.js";
const router = express.Router();
router.get("/me", protect, (req, res) => {
  try {
    // Pastikan user ada dan konversi ke plain object jika itu instance Sequelize
    const user = req.user && typeof req.user.get === "function" 
      ? req.user.get({ plain: true }) 
      : req.user;

    if (!user) {
      return ResponseAPI.error(res, "User tidak ditemukan", 404);
    }

    // Hapus password untuk keamanan
    if (user.password) delete user.password;
    
    return ResponseAPI.success(res, "User data context", user);
  } catch (error) {
    console.error("Error in /me route:", error);
    return ResponseAPI.serverError(res, error);
  }
});
router.post("/logout", logoutUser);
router.post("/login", loginUser);
router.post("/contact", handler); // Contact form handler
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token/:token", verifyResetToken);
router.post("/change-password-with-token", changePasswordWithToken);
router.post("/cancel-reset-password", cancelResetPassword);
router.post("/register", upload.single("avatar"), registerUser);
router.delete("/delete/:id", deleteUser);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.patch("/:id", protect, upload.single("avatar"), editUser);

export default router;
