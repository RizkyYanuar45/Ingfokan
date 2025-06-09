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
} from "./../controllers/userController.js";
import handler from "../helper/contactUsPage.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

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
