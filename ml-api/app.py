from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "my_model.pkl"
PIPELINE_PATH = BASE_DIR / "models" / "clean_pipeline.pkl"

feature_names = [
    "pregnancies",
    "glucose",
    "bloodPressure",
    "skinThickness",
    "insulin",
    "bmi",
    "diabetesPedigreeFunction",
    "age",
]

model_feature_names = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]

model = joblib.load(MODEL_PATH)
pipeline = joblib.load(PIPELINE_PATH)


@app.get("/")
def health_check():
    return jsonify({"message": "ML service is running."})


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}

    for feature in feature_names:
        if feature not in data:
            return jsonify({"message": f"{feature} is required."}), 400
        try:
            data[feature] = float(data[feature])
        except (TypeError, ValueError):
            return jsonify({"message": f"{feature} must be a valid number."}), 400
        if data[feature] < 0:
            return jsonify({"message": f"{feature} cannot be negative."}), 400

    model_input = pd.DataFrame(
        [[data[feature] for feature in feature_names]],
        columns=model_feature_names,
    )

    cleaned_input = pipeline.transform(model_input)
    prediction = int(model.predict(cleaned_input)[0])

    probability = None
    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(cleaned_input)[0][prediction])

    result = (
        "Diabetes risk is likely based on the entered values."
        if prediction == 1
        else "Diabetes risk is not likely based on the entered values."
    )

    return jsonify(
        {
            "prediction": prediction,
            "result": result,
            "probability": probability,
            "message": "Please consult with doctor for professional medical advice.",
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
