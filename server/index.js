import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import predictionRoutes from "./routes/predictionRoutes.js";
import { startMlService } from "./utils/mlService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Diabetes Detection System backend is running." });
});

app.use("/predict", predictionRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong on the server."
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  startMlService();
});
