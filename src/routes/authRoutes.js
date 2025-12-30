import express from "express";
import { login, register, saveSports, getAllUsers, deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sports", protect, saveSports);
router.get("/getAllUsers", getAllUsers);
router.delete("/deleteUser", protect, deleteAccount);

export default router;
