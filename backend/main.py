import os
import numpy as np
from PIL import Image

from tensorflow.keras.models import load_model

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware


# -----------------------------
# FastAPI Setup
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load Model (FINAL FIX)
# -----------------------------
MODEL_PATH = "models/seed_model.h5"

print("Loading model from:", MODEL_PATH)

try:
    model = load_model(MODEL_PATH, compile=False)   # 🔥 IMPORTANT
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", str(e))
    model = None


# -----------------------------
# Preprocessing
# -----------------------------
def preprocess_image(image):
    image = image.resize((224, 224))
    img_array = np.array(image).astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# -----------------------------
# Utility Functions
# -----------------------------
def convert_sensor_to_moisture(sensor_value):
    return round((sensor_value / 1023) * 100, 2)


def calculate_germination(quality_score, moisture, seed_age):
    base = quality_score * 0.7

    if moisture < 40:
        base -= 10
    elif 40 <= moisture <= 50:
        base += 10
    else:
        base -= 8

    if seed_age > 24:
        base -= 25
    elif seed_age > 18:
        base -= 18
    elif seed_age > 12:
        base -= 10
    elif seed_age > 6:
        base -= 5

    return round(max(0, min(100, base)))


def calculate_yield(germination, quality_score):
    return round(max(0, min(100, germination * 0.8 + quality_score * 0.2)))


import random

class RecommendationSystem:
    # Pools of phrased suggestions for variety
    POOL = {
        "moisture_high": [
            "Reduce irrigation to prevent fungal growth and seed rot.",
            "Improve drainage and soil aeration to handle high moisture.",
            "Ensure proper storage ventilation to lower seed moisture levels.",
            "Avoid over-watering in current conditions to protect seed health."
        ],
        "moisture_low": [
            "Increase irrigation to fully utilize high germination potential.",
            "Opt for pre-soaking seeds before sowing to improve uptake.",
            "Maintain soil mulch to preserve limited moisture levels.",
            "Early morning watering recommended to sustain early growth."
        ],
        "moisture_optimal": [
            "Current moisture levels are ideal for immediate sowing.",
            "Moisture is well-balanced; maintain current irrigation schedule.",
            "Optimal watering detected; proceed with regular field management."
        ],
        "germination_high": [
            "Excellent germination potential; proceed with standard sowing density.",
            "High vitality detected; minimal seed treatment required.",
            "Strong seed vigor ensures uniform stand establishment in field."
        ],
        "germination_low": [
            "Apply bio-stimulants or seed primers to boost germination rates.",
            "Check soil temperature before sowing to avoid cold stress.",
            "Consider increasing sowing density to compensate for lower vigor.",
            "Use certified high-quality seeds for improved field productivity."
        ],
        "yield_good": [
            "Favorable conditions for high yield; maintain nutrient supply.",
            "Potential for bumper harvest; plan for efficient storage/logistics.",
            "Optimal yield projected; ensure timely fertilizer application."
        ],
        "yield_bad": [
            "Address soil nutrient deficiencies to improve predicted yield.",
            "Monitor for pests and diseases early to protect yield potential.",
            "Inter-cropping or crop rotation advised to enhance future yields.",
            "Evaluate irrigation efficiency to stabilize crop output."
        ],
        "age_warn": [
            "Older seeds detected; perform a quick home-germination test.",
            "Seed viability may decrease with age; use freshening treatments.",
            "Stored seeds require careful handling to maintain remaining vigor.",
            "Apply fungicides/pesticides early as older seeds are more vulnerable."
        ],
        "quality_good": [
            "Seed visual quality is excellent; proceed with confidence.",
            "Well-maintained seeds with minimal physical damage observed.",
            "Healthy seed appearance suggests good storage practices."
        ],
        "quality_bad": [
            "High rate of broken or discolored seeds; sort before sowing.",
            "Physical damage detected; check threshing or storage equipment.",
            "Assess seed cleanliness; remove debris and shriveled grains."
        ],
        "combinations": {
            "low_moisture_high_germ": [
                "Increase irrigation to fully utilize high germination potential.",
                "Soil moisture is low despite high vigor; consistent watering is key."
            ],
            "high_moisture_low_yield": [
                "Improve drainage and soil aeration to enhance yield potential.",
                "Excessive moisture is dampening yield; check field leveling."
            ],
            "old_seeds_low_germ": [
                "Use fresher seeds or apply intensive seed treatments.",
                "Seed age is affecting vigor; consider replacing the stock for better results."
            ]
        }
    }

    @staticmethod
    def get_recommendations(quality_label, confidence, visual, moisture, germination, yield_potential, seed_age):
        suggestions = []
        
        # 1. Combination Rules (High Priority)
        if moisture < 40 and germination > 75:
            suggestions.append(random.choice(RecommendationSystem.POOL["combinations"]["low_moisture_high_germ"]))
        elif moisture > 60 and yield_potential < 60:
            suggestions.append(random.choice(RecommendationSystem.POOL["combinations"]["high_moisture_low_yield"]))
        
        if seed_age > 18 and germination < 50:
            suggestions.append(random.choice(RecommendationSystem.POOL["combinations"]["old_seeds_low_germ"]))

        # 2. Individual Metric Rules
        # Moisture
        if moisture > 65:
            suggestions.append(random.choice(RecommendationSystem.POOL["moisture_high"]))
        elif moisture < 35:
            suggestions.append(random.choice(RecommendationSystem.POOL["moisture_low"]))
        elif 40 <= moisture <= 55:
            suggestions.append(random.choice(RecommendationSystem.POOL["moisture_optimal"]))

        # Germination
        if germination > 80:
            suggestions.append(random.choice(RecommendationSystem.POOL["germination_high"]))
        elif germination < 50:
            suggestions.append(random.choice(RecommendationSystem.POOL["germination_low"]))

        # Yield
        if yield_potential > 75:
            suggestions.append(random.choice(RecommendationSystem.POOL["yield_good"]))
        elif yield_potential < 50:
            suggestions.append(random.choice(RecommendationSystem.POOL["yield_bad"]))

        # Age
        if seed_age > 12:
            suggestions.append(random.choice(RecommendationSystem.POOL["age_warn"]))

        # Visual/Quality
        if quality_label == "Good":
            suggestions.append(random.choice(RecommendationSystem.POOL["quality_good"]))
        else:
            suggestions.append(random.choice(RecommendationSystem.POOL["quality_bad"]))

        # Clean duplicates and shuffle
        unique_suggestions = list(set(suggestions))
        random.shuffle(unique_suggestions)
        
        # Return 4-6 suggestions
        return unique_suggestions[:6]


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def home():
    return {"status": "ANKURA backend running"}


@app.get("/health")
def health():
    return {"model_loaded": model is not None}


# -----------------------------
# MAIN API
# -----------------------------
@app.post("/analyze")
async def analyze_seed(
    file: UploadFile = File(...),
    raw_sensor_value: float = Form(...),
    seed_age: float = Form(...),
    soilType: str = Form(None),
    season: str = Form(None),
    seedType: str = Form(None)
):
    try:
        print("📥 Request received")

        if model is None:
            return {"error": "Model not loaded"}

        # Load image
        image = Image.open(file.file).convert("RGB")
        img_array = preprocess_image(image)

        # Predict
        prediction = model.predict(img_array)
        prob = float(prediction[0][0])

        print("🔍 Raw Probability:", prob)

        # 🔥 FINAL THRESHOLD FIX
        THRESHOLD = 0.6

        if prob > THRESHOLD:
            quality_label = "Good"
        else:
            quality_label = "Bad"

        quality_score = round(prob * 100, 2)
        visual = int(quality_score)

        # Metrics
        moisture = convert_sensor_to_moisture(raw_sensor_value)
        germination = calculate_germination(quality_score, moisture, seed_age)
        yieldPotential = calculate_yield(germination, quality_score)

        return {
            "quality": quality_label,
            "confidence": quality_score,
            "visual": visual,
            "moisture": moisture,
            "germination": germination,
            "yieldPotential": yieldPotential,
            "seedType": seedType,
            "soilType": soilType,
            "season": season,
            "recommendations": RecommendationSystem.get_recommendations(
                quality_label, quality_score, visual, moisture, germination, yieldPotential, seed_age
            )
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}