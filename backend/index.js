import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connect.js";
import userRoutes from "./routes/userRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/author", authorRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
