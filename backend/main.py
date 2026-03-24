import os
import numpy as np
from PIL import Image
from keras.models import load_model

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware


# -----------------------------
# FastAPI Setup
# -----------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ankura-zeta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load Model
# -----------------------------

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "seed_model.keras")

print("Loading model from:", MODEL_PATH)

model = load_model(MODEL_PATH, compile=False)

print("Model loaded successfully")

class_names = ["Bad", "good"]


# -----------------------------
# Image Preprocessing
# -----------------------------

def preprocess_image(image):

    image = image.resize((224,224))

    img_array = np.array(image).astype("float32")

    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    return img_array


# -----------------------------
# Convert Sensor Value → Moisture %
# -----------------------------

def convert_sensor_to_moisture(sensor_value):

    moisture = (sensor_value / 1023) * 100

    return round(moisture,2)


# -----------------------------
# Germination Rule System
# Balanced: Quality + Moisture + Age
# -----------------------------

def calculate_germination(confidence, moisture, seed_age):

    # Quality influence (main factor)
    germination = confidence * 0.7


    # Moisture influence
    if moisture < 40:         # Dry
        germination -= 10

    elif 40 <= moisture <= 50: # Optimal
        germination += 10

    else:                      # Wet
        germination -= 8


    # Seed age influence
    if seed_age > 24:
        germination -= 25

    elif seed_age > 18:
        germination -= 18

    elif seed_age > 12:
        germination -= 10

    elif seed_age > 6:
        germination -= 5


    germination = max(0, min(100, germination))

    return round(germination)


# -----------------------------
# Yield Rule System
# -----------------------------

def calculate_yield(germination, confidence):

    yieldPotential = germination * 0.8 + confidence * 0.2

    yieldPotential = max(0, min(100, yieldPotential))

    return round(yieldPotential)


# -----------------------------
# API Endpoint
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


    # Load Image
    image = Image.open(file.file).convert("RGB")

    img_array = preprocess_image(image)

    prediction = model.predict(img_array)

    predicted_class = class_names[np.argmax(prediction)]

    confidence = float(np.max(prediction)) * 100

    confidence = round(confidence,2)


    # Visual Quality
    if predicted_class == "good":
        visual = min(95, confidence)
    else:
        visual = max(40, confidence - 20)


    # Moisture
    moisture = convert_sensor_to_moisture(raw_sensor_value)


    # Germination
    germination = calculate_germination(confidence, moisture, seed_age)


    # Yield
    yieldPotential = calculate_yield(germination, confidence)


    # API Response
    return {

        "quality": predicted_class,
        "confidence": confidence,
        "visual": round(visual),
        "moisture": moisture,
        "germination": germination,
        "yieldPotential": yieldPotential

    }