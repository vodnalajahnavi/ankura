function SuggestionsPanel({ results }) {

  if (!results) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">
          Suggestions & Recommendations
        </h2>
        <p className="text-gray-500">
          Run analysis to receive recommendations.
        </p>
      </div>
    );
  }

  const suggestions = [];

  // ---------------------------
  // Quality Analysis
  // ---------------------------

  if (results.quality === "good") {
    suggestions.push("Seed quality is good and suitable for cultivation.");
  } else {
    suggestions.push(
      "Seed quality is poor. Consider using certified or fresh seeds."
    );
  }

  // ---------------------------
  // Moisture Analysis
  // ---------------------------

  if (results.moisture < 40) {
    suggestions.push(
      "Moisture level is too low. Seeds may be dry. Improve irrigation or storage humidity."
    );
  } 
  else if (results.moisture >= 40 && results.moisture <= 50) {
    suggestions.push(
      "Moisture level is optimal for germination."
    );
  } 
  else {
    suggestions.push(
      "Moisture level is too high. Excess moisture can cause fungal growth and poor germination."
    );
  }

  // ---------------------------
  // Germination Analysis
  // ---------------------------

  if (results.germination >= 85) {
    suggestions.push(
      "High germination probability. Seeds are suitable for high productivity farming."
    );
  } 
  else if (results.germination >= 65) {
    suggestions.push(
      "Moderate germination probability. Ensure proper irrigation and nutrient supply."
    );
  } 
  else {
    suggestions.push(
      "Low germination probability. Consider seed treatment or replacing the seed batch."
    );
  }

  // ---------------------------
  // Yield Analysis
  // ---------------------------

  if (results.yieldPotential >= 85) {
    suggestions.push(
      "Yield potential is excellent under proper farming practices."
    );
  } 
  else if (results.yieldPotential >= 60) {
    suggestions.push(
      "Yield potential is moderate. Improve soil fertility and irrigation management."
    );
  } 
  else {
    suggestions.push(
      "Yield potential is low. Consider improving soil nutrients and seed quality."
    );
  }

  // ---------------------------
  // Advanced Recommendations
  // ---------------------------

  if (results.moisture > 50) {
    suggestions.push(
      "High moisture may increase fungal risk. Ensure proper drying and storage conditions."
    );
  }

  if (results.germination < 60 && results.quality === "good") {
    suggestions.push(
      "Even though seed quality is good, environmental conditions may reduce germination."
    );
  }

  if (results.moisture < 40 && results.germination < 70) {
    suggestions.push(
      "Low moisture combined with reduced germination suggests irrigation improvements."
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">
        Suggestions & Recommendations
      </h2>

      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionsPanel;