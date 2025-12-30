import multer from "multer";
import fs from "fs";
import path from "path";

// Folder where uploads will be saved
const uploadDir = path.join(process.cwd(), "uploads", "profile");

// Auto-create folder if not present
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload folder:", uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // replace spaces to prevent Windows ENOENT issues
    const cleanName = file.originalname.replace(/\s+/g, "_");
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName);
  }
});

// File filter (allowed mime types)
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type! Only images allowed"), false);
  }
  cb(null, true);
}

export const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 } // 1mb limit
});
