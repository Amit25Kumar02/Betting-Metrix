import express from "express";
import { updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploader } from "../utils/multerUpload.js";

const router = express.Router();

router.put("/updateProfile", protect, uploader.single("profileImage"), updateProfile);

export default router;
