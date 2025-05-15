import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connect.js";
import userRoutes from "./routes/userRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import cateoryRoutes from "./routes/categoryRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Mendapatkan __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT;

// Konfigurasi static files yang benar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/author", authorRoutes);
app.use("/api/category", cateoryRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/article", articleRoutes);
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
