# Diabetes Detection System

Final year college project using React.js, Node.js, Express.js and a Python ML microservice.

## ML Repository Inspection

Source inspected: `https://github.com/hament069/college_project/tree/main/college%20project`

- Model files found: `my_model.pkl` and `clean_pipeline.pkl`
- Dataset found: `diabetes_dirty_1200_rows.csv`
- Training notebook found: `3_Train_model.ipynb`
- Model approach: Logistic Regression, Random Forest and SVM were trained. The notebook selects Random Forest as the best model based on recall.
- Preprocessing needed: median imputation and `StandardScaler`, saved in `clean_pipeline.pkl`
- Required feature order:
  1. pregnancies
  2. glucose
  3. bloodPressure
  4. skinThickness
  5. insulin
  6. bmi
  7. diabetesPedigreeFunction
  8. age
- Deployment decision: the pickle files are scikit-learn Python objects, so Express calls a small Flask ML API instead of trying to run the model directly in Node.js.

## Folder Structure

```text
project-root/
  client/
  server/
    routes/
    controllers/
  ml-api/
    models/
  ml-source/
```

## Setup

Install frontend and backend packages:

```bash
npm run install:all
```

Install Python packages:

```bash
cd ml-api
python -m pip install -r requirements.txt
```

## Run Locally

Open two terminals. The backend will try to start the ML service automatically.

Terminal 1:

```bash
cd server
npm start
```

Terminal 2:

```bash
cd client
npm run dev
```

Open the frontend URL shown by Vite, usually `http://127.0.0.1:5173`.

If the website shows `ML service is not running`, start the ML service manually in one extra terminal:

```bash
cd ml-api
python app.py
```

Then submit the form again.

## API Flow

React form sends:

```json
{
  "pregnancies": 2,
  "glucose": 120,
  "bloodPressure": 70,
  "skinThickness": 20,
  "insulin": 80,
  "bmi": 25.5,
  "diabetesPedigreeFunction": 0.5,
  "age": 30
}
```

Express receives it at `POST /predict`, validates it, forwards it to Flask, and returns the prediction result to the website.
