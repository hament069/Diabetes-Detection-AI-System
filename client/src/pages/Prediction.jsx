import React from "react";
import { useState } from "react";

const initialFormData = {
  pregnancies: "",
  glucose: "",
  bloodPressure: "",
  skinThickness: "",
  insulin: "",
  bmi: "",
  diabetesPedigreeFunction: "",
  age: ""
};

const fields = [
  { name: "pregnancies", label: "Pregnancies" },
  { name: "glucose", label: "Glucose" },
  { name: "bloodPressure", label: "BloodPressure" },
  { name: "skinThickness", label: "SkinThickness" },
  { name: "insulin", label: "Insulin" },
  { name: "bmi", label: "BMI", step: "0.1" },
  { name: "diabetesPedigreeFunction", label: "DiabetesPedigreeFunction", step: "0.001" },
  { name: "age", label: "Age" }
];

function Prediction() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const validateForm = () => {
    for (const field of fields) {
      const value = formData[field.name];
      if (value === "") {
        return `${field.label} is required.`;
      }
      if (Number(value) < 0) {
        return `${field.label} cannot be negative.`;
      }
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const requestData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, Number(value)])
    );

    try {
      setLoading(true);
      // ✅ FIXED: Changed port 5000 to 8000, and 'localhost' to '127.0.0.1' to match Flask network host
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Prediction failed. Please try again.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError("");
    setResult(null);
  };

  return (
    <section className="prediction-page">
      <div className="section-heading">
        <p className="tagline">Prediction Form</p>
        <h1>Enter Health Parameters</h1>
        <p>Fill all fields carefully to get the diabetes prediction result.</p>
      </div>

      <div className="prediction-layout">
        <form className="prediction-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map((field) => (
              <label className="form-field" key={field.name}>
                <span>{field.label}</span>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  min="0"
                  step={field.step || "1"}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                />
              </label>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Submit"}
            </button>
            <button className="secondary-btn" type="button" onClick={handleReset} disabled={loading}>
              Reset
            </button>
          </div>
        </form>

        <aside className="result-card">
          <h2>Prediction Result</h2>
          {result ? (
            <>
              <p className={result.prediction === 1 ? "risk-text" : "safe-text"}>
                {result.result}
              </p>
              {typeof result.probability === "number" && (
                <p className="probability-text">Model confidence: {Math.round(result.probability * 100)}%</p>
              )}
            </>
          ) : (
            <p className="empty-result">Your result will appear here after submitting the form.</p>
          )}
          <p className="doctor-message">Please consult with doctor for professional medical advice.</p>
        </aside>
      </div>
    </section>
  );
}

export default Prediction;