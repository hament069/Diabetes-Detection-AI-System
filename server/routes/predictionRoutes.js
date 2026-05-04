import express from "express";
import { predictDiabetes } from "../controllers/predictionController.js";

const router = express.Router();

router.post("/", predictDiabetes);

export default router;
