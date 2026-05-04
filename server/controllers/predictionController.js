import { ensureMlServiceRunning } from "../utils/mlService.js";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000/predict";

const requiredFields = [
  "pregnancies",
  "glucose",
  "bloodPressure",
  "skinThickness",
  "insulin",
  "bmi",
  "diabetesPedigreeFunction",
  "age"
];

function validatePredictionData(data) {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      return `${field} is required.`;
    }

    if (Number.isNaN(Number(data[field]))) {
      return `${field} must be a valid number.`;
    }

    if (Number(data[field]) < 0) {
      return `${field} cannot be negative.`;
    }
  }

  return "";
}

export async function predictDiabetes(req, res, next) {
  try {
    const {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age
    } = req.body;

    const predictionData = {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age
    };

    const validationMessage = validatePredictionData(predictionData);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const mlReady = await ensureMlServiceRunning();
    if (!mlReady) {
      return res.status(503).json({
        message: "ML service could not start. Open a separate terminal, go to ml-api folder, and run: python app.py"
      });
    }

    const mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(predictionData)
    });

    const mlResult = await mlResponse.json();
    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json({
        message: mlResult.message || "ML prediction service failed."
      });
    }

    return res.json(mlResult);
  } catch (error) {
    if (error.cause?.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "ML service is not running."
      });
    }

    return next(error);
  }
}
