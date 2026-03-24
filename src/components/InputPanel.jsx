import { useState } from "react";

function InputPanel({ setResults, setLoading }) {

  const [formData, setFormData] = useState({
    seedType: "",
    seedAge: "",
    soilType: "",
    season: "",
    moistureValue: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }

  };

  const handleSubmit = async () => {

    if (!imageFile) {
      alert("Please upload seed image");
      return;
    }

    if (!formData.moistureValue) {
      alert("Please enter moisture sensor value");
      return;
    }

    if (!formData.seedAge) {
      alert("Please enter seed age");
      return;
    }

    if(formData.seedType === "SoyaBeans" || formData.seedType === "Maize"){
      alert("Model not trained for this seed yet. Results may not be accurate.");
    }

    setLoading(true);

    const data = new FormData();

    data.append("file", imageFile);

    // Backend parameters
    data.append("raw_sensor_value", formData.moistureValue);
    data.append("seed_age", formData.seedAge);

    data.append("seedType", formData.seedType);
    data.append("soilType", formData.soilType);
    data.append("season", formData.season);

    try {

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      setResults(result);

    } catch (error) {

      console.error(error);
      alert("Backend connection error");

    }

    setLoading(false);

  };

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

      <h2 className="text-lg font-semibold mb-4">Seed Input Panel</h2>

      {/* Seed Type */}

      <select
        name="seedType"
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      >

        <option value="">Select Seed Type</option>

        <option value="GreenGram">Green Gram (Trained)</option>

        <option value="Paddy">Paddy (Trained)</option>

        <option value="SoyaBeans">Soya Beans (Not Trained)</option>

        <option value="Maize">Maize (Not Trained)</option>

      </select>


      {/* Seed Age */}

      <input
        type="number"
        name="seedAge"
        placeholder="Seed Age (months)"
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      />


      {/* Moisture Sensor Value */}

      <input
        type="number"
        name="moistureValue"
        placeholder="Enter Arduino Moisture Sensor Value (0 - 1023)"
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      />


      {/* Updated Soil Types (Agricultural Soils) */}

      <select
        name="soilType"
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      >

        <option value="">Select Soil Type</option>

        <option value="Alluvial">Alluvial Soil</option>

        <option value="Black">Black Soil</option>

        <option value="Red">Red Soil</option>

        <option value="Laterite">Laterite Soil</option>

        <option value="Loamy">Loamy Soil</option>

      </select>


      {/* Season */}

      <select
        name="season"
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
      >

        <option value="">Select Season</option>

        <option value="Kharif">Kharif</option>

        <option value="Rabi">Rabi</option>

        <option value="Summer">Summer</option>

      </select>


      {/* Image Upload */}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-3"
      />


      {imagePreview && (

        <img
          src={imagePreview}
          alt="Seed Preview"
          className="w-full h-32 object-cover rounded-lg mb-3 border"
        />

      )}


      {/* Submit Button */}

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
      >
        Analyze Seed
      </button>

    </div>

  );

}

export default InputPanel;