import express from "express";
import {
  loginUser,
  registerUser,
  deleteUser,
  getAllUser,
  getUserById,
  editUser,
} from "./../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.delete("/delete/:id", deleteUser);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.patch("/:id", protect, editUser);
