import multer, { FileFilterCallback, Multer } from "multer";
import Error from "../handlers/errors/Error";

// Multer storage configuration
const storage = multer.memoryStorage();

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/svg+xml",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and SVG are allowed.",
        400
      )
    );
  }
};

// Multer configuration with limits and file type filter
export const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }, // 5MB in bytes
});
