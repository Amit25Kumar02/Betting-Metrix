import express from "express";
import { login, register, saveSports, getAllUsers, resetPassword, deleteAccount, sendResetOtp, verifyResetOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sports", protect, saveSports);
router.post("/send-reset-otp", sendResetOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.put("/reset-password", resetPassword);
router.get("/getAllUsers", getAllUsers);
router.delete("/deleteUser", protect, deleteAccount);

export default router;
