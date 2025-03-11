import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connect.js";

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, (req, res) => {
  console.log("Server is running on port 3000");
});
