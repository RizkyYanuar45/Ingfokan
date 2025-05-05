import multer from "multer";

import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // Ambil ekstensi file asli, misal ".png"
    const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    // Gabungkan UUID dengan ekstensi
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
