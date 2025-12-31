import express from "express";
import {
    createTip,
    getTips,
    getTipById,
    updateTip,
    deleteTip,
    toggleFavorite
} from "../controllers/tipController.js";
import { tipUploader } from "../utils/tipUpload.js";

const router = express.Router();

router.post("/createTip",  tipUploader.fields([
    { name: "homeLogo", maxCount: 1 },
    { name: "awayLogo", maxCount: 1 }
  ]), createTip);
router.get("/getTips", getTips);
router.get("/getTip/:id", getTipById);
router.put("/updateTip/:id",  tipUploader.fields([
    { name: "homeLogo", maxCount: 1 },
    { name: "awayLogo", maxCount: 1 }
  ]), updateTip);
router.delete("/deleteTip/:id", deleteTip);
router.put("/toggleFavorite/:id", toggleFavorite);

export default router;
