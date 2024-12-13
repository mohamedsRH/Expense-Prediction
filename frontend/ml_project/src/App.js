import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { cities } from "./cities";

function App() {
  const [formData, setFormData] = useState({
    gender: '',
    card_type: '',
    city: '',
    expense_type: '',
    month: 1,
    day: 1,
    year:2019
  });
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const predictionUrl = 'http://localhost:8000/predict';
      const response = await axios.post(predictionUrl, formData);
      setPrediction(response.data.predicted_amount);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center py-10">
      <style>
        {`
          .indian-border {
            border: 2px solid #FF9933;
            background-image: linear-gradient(45deg, #fff 90%, #FF9933 90%),
                            linear-gradient(-45deg, #fff 90%, #FF9933 90%),
                            linear-gradient(45deg, #FF9933 90%, #fff 90%),
                            linear-gradient(-45deg, #FF9933 90%, #fff 90%);
            background-size: 20px 20px;
            background-position: top left, top right, bottom right, bottom left;
            background-repeat: no-repeat;
          }

          .indian-input {
            border: 1px solid #FF9933;
            background-color: rgba(255, 255, 255, 0.9);
          }

          .indian-input:focus {
            border-color: #138808;
            ring-color: #138808;
          }

          .indian-button {
            background: linear-gradient(45deg, #FF9933, #FF7F00);
            border: none;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          }

          .indian-button:hover {
            background: linear-gradient(45deg, #FF7F00, #FF9933);
            transform: translateY(-1px);
          }

          .indian-flag {
            height: 60px;
            background: linear-gradient(to bottom,
              #FF9933 33.33%,
              #FFFFFF 33.33%, #FFFFFF 66.66%,
              #138808 66.66%);
            position: relative;
            overflow: hidden;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .chakra {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: #000080;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .chakra::before {
            content: '';
            position: absolute;
            width: 36px;
            height: 36px;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
          }

          .spokes {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .spokes::before {
            content: '';
            position: absolute;
            width: 2px;
            height: 40px;
            background: #FFFFFF;
            left: 50%;
            transform-origin: 50% 50%;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .spokes {
            animation: rotate 8s linear infinite;
          }

          .spokes::before {
            box-shadow: 0 0 0 2px #FFFFFF,
                      rotate(22.5deg) 0 0 0 2px #FFFFFF,
                      rotate(45deg) 0 0 0 2px #FFFFFF,
                      rotate(67.5deg) 0 0 0 2px #FFFFFF,
                      rotate(90deg) 0 0 0 2px #FFFFFF,
                      rotate(112.5deg) 0 0 0 2px #FFFFFF,
                      rotate(135deg) 0 0 0 2px #FFFFFF,
                      rotate(157.5deg) 0 0 0 2px #FFFFFF;
          }
        `}
      </style>
      <div className="indian-border bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="indian-flag">
          <div className="chakra">
            <div className="spokes"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
          💰 Expense Prediction
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense Type */}
          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">
              Expense Type
            </label>
            <select
              value={formData.expense_type}
              onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
              className="indian-input w-full rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select expense type</option>
              <option value="Bills">Bills</option>
              <option value="Food">Food</option>
              <option value="Fuel">Fuel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Grocery">Grocery</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          {/* Card Type */}
          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">
              Card Type
            </label>
            <select
              value={formData.card_type}
              onChange={(e) => setFormData({ ...formData, card_type: e.target.value })}
              className="indian-input w-full rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select card type</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Silver">Silver</option>
              <option value="Signature">Signature</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="indian-input w-full rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select city</option>
              {cities.map((city, index) => (
                <option key={index} value={`${city}, India`}>{city}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="indian-input w-full rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="indian-button w-full py-2 px-4 rounded-lg transition duration-300"
            >
              Predict Amount
            </button>
          </div>
        </form>

        {/* Prediction Result */}
        {prediction !== null && (
          <div className="mt-6 bg-orange-50 p-4 rounded-lg text-center border-2 border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800">Predicted Amount</h3>
            <p className="text-xl text-orange-600 mt-2">₹{prediction.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;