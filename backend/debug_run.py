import tensorflow as tf
import numpy as np
from PIL import Image

print("Loading model...")

model = tf.keras.models.load_model("models/seed_model.keras", compile=False)

print("Model loaded!")

# load a test image
img = Image.open("test.jpeg").convert("RGB")
img = img.resize((224,224))

img_array = np.array(img)
img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

img_array = np.expand_dims(img_array, axis=0)

print("Running prediction...")

pred = model.predict(img_array)

print("Prediction:", pred)
print("Class index:", np.argmax(pred))