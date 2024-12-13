from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
import os
import xgboost

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
     allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"], 
)

class PredictionInput(BaseModel):
    gender: str
    card_type: str
    city: str
    expense_type: str
    month: int
    day: int


model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xgboost_model.pkl')

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")
print(f"Model file found at: {model_path}")

try:
    model = joblib.load(model_path)
except Exception as e:
    model = None
    print(f"Error loading the model: {e}")

if model is None:
    raise RuntimeError("Failed to load the machine learning model.")

@app.post("/predict")
async def predict_amount(input: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not available")
    
    try:
        prediction = model.predict([[input.gender, input.card_type, input.city, input.expense_type, input.month, input.day]])
        return {"predicted_amount": float(prediction[0])}
    except Exception as e:
        return {"error": str(e)}
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
