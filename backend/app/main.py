from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

class ErrorResponse(BaseModel):
    error: str
    detail: str
    status_code: int

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xgboost_model.pkl')

# Custom exception for model-related errors
class ModelException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

# Exception handler for ModelException
@app.exception_handler(ModelException)
async def model_exception_handler(request, exc: ModelException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "Model Error", "detail": str(exc), "status_code": exc.status_code}
    )

# General exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc), "status_code": 500}
    )

# Load model
try:
    if not os.path.exists(model_path):
        raise ModelException(f"Model file not found: {model_path}", 500)
    
    model = joblib.load(model_path)
    print(f"Model successfully loaded from: {model_path}")
except Exception as e:
    raise ModelException(f"Failed to load model: {str(e)}", 500)

@app.post("/predict")
async def predict_amount(input: PredictionInput):
    try:
        if model is None:
            raise ModelException("Model is not available", 500)
        
        # Input validation
        if not all([input.gender, input.card_type, input.city, input.expense_type]):
            raise ModelException("Missing required input fields", 400)
        
        if not (1 <= input.month <= 12):
            raise ModelException("Month must be between 1 and 12", 400)
        
        if not (1 <= input.day <= 31):
            raise ModelException("Day must be between 1 and 31", 400)

        # Make prediction
        prediction = model.predict([[
            input.gender,
            input.card_type,
            input.city,
            input.expense_type,
            input.month,
            input.day
        ]])

        return JSONResponse(
            content={"predicted_amount": float(prediction[0])},
            status_code=200
        )

    except ModelException as e:
        raise e
    except ValueError as e:
        raise ModelException(f"Invalid input format: {str(e)}", 400)
    except Exception as e:
        raise ModelException(f"Prediction error: {str(e)}", 500)