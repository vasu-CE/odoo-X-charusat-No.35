import os
import joblib
import numpy as np
from rest_framework.response import Response
from rest_framework.decorators import api_view

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ml_model_path = os.path.join(BASE_DIR, "ml_api", "nearest_neighbors.pkl")  # Load ML Model
districts_path = os.path.join(BASE_DIR, "ml_api", "districts.pkl")  # Load Districts List

# Check if the files exist before loading
if not os.path.exists(ml_model_path):
    print(f"❌ Error: Model file not found at {ml_model_path}")
if not os.path.exists(districts_path):
    print(f"❌ Error: Districts file not found at {districts_path}")

try:
    nn = joblib.load(ml_model_path) if os.path.exists(ml_model_path) else None
    districts = joblib.load(districts_path) if os.path.exists(districts_path) else None
except Exception as e:
    nn = None
    districts = None
    print(f"❌ Error loading model: {e}")  # Print error for debugging

@api_view(["GET"])
def predict(request):
    if nn is None or districts is None:
        return Response({"error": "Model not loaded correctly"}, status=500)

    try:
        latitude = float(request.GET.get("latitude"))
        longitude = float(request.GET.get("longitude"))

        new_point = np.array([[latitude, longitude]])
        _, nearest_idx = nn.kneighbors(new_point)
        return Response({"nearest_district": nearest_idx[0][0]})

    except (TypeError, ValueError):
        return Response({"error": "Invalid input. Provide latitude and longitude as query parameters."}, status=400)
