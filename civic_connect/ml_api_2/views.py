import torch
import clip
import torch.nn.functional as F
from rest_framework.response import Response
from rest_framework.views import APIView
import os

# Set device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP Model
model, preprocess = clip.load("ViT-B/32", device)

# Define Categories
categories = [
    "INFRASTURCTURE",
    "ENVIRONMENT",
    "COMMUNITY_SERVICES",
    "OTHER"
]

# Load precomputed text embeddings if available
text_embeddings_path = "text_embeddings.pth"
if os.path.exists(text_embeddings_path):
    text_embeddings = torch.load(text_embeddings_path, map_location=device)
    print("Loaded precomputed text embeddings from file.")
else:
    print("Precomputed text embeddings not found! Recomputing...")
    with torch.no_grad():
        input_tokens = clip.tokenize(categories).to(device)
        text_embeddings = model.encode_text(input_tokens).float()
        text_embeddings /= torch.norm(text_embeddings, dim=-1, keepdim=True)
    torch.save(text_embeddings, text_embeddings_path)
    print("Saved text embeddings to text_embeddings.pth")

def classify_text(input_text, threshold=0.2):
    if not input_text.strip():
        return "Other", 0.0

    # Tokenize input
    input_token = clip.tokenize([input_text]).to(device)

    with torch.no_grad():
        input_embedding = model.encode_text(input_token).float()
        input_embedding /= torch.norm(input_embedding, dim=-1, keepdim=True)

        # Compute cosine similarity
        similarities = F.cosine_similarity(input_embedding, text_embeddings, dim=-1)
        max_index = torch.argmax(similarities).item()
        confidence = float(similarities[max_index].item())

        # Debugging log
        print(f"Input: '{input_text}' → Predicted: {categories[max_index]} (Confidence: {confidence})")

    # If confidence is too low, return best match instead of "Other"
    predicted_category = categories[max_index] if confidence >= threshold else categories[max_index]

    return predicted_category, confidence

# API for text classification
class TextClassificationAPI(APIView):
    def post(self, request):
        text = request.data.get("text", "").strip()
        text_category, text_confidence = classify_text(text)

        return Response({
            "text_category": text_category,
            "text_confidence": text_confidence
        })