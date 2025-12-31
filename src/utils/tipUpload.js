import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads", "tips");

// Auto-create folder if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created folder:", uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Remove spaces, make safe
    const clean = file.originalname.replace(/\s+/g, "_");
    const uniqueName = Date.now() + "-" + clean;
    cb(null, uniqueName);
  }
});

// Validate allowed images
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type – only images allowed"), false);
  }
  cb(null, true);
}

export const tipUploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // max 2MB
});
