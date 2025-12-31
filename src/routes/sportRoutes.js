import express from "express";
import { sportsUploader } from "../utils/sportUpload.js";  
import {
  createSport,
  getSports,
  getSport,
  updateSport,
  deleteSport
} from "../controllers/sportController.js";

const router = express.Router();

router.post("/createSport", sportsUploader.single("icon"), createSport);
router.get("/getSports", getSports);
router.get("/getSport/:id", getSport);
router.put("/updateSport/:id", sportsUploader.single("icon"), updateSport);
router.delete("/deleteSport/:id", deleteSport);

export default router;
