import { useState, useRef } from "react";
import { useLanguage } from "../LanguageContext";

const seedTypes = ["Green Gram", "Paddy", "Soya Beans", "Maize"];
const soilTypes = ["Alluvial Soil", "Black Soil", "Red Soil", "Laterite Soil", "Loamy Soil"];
const seasons   = ["Kharif", "Rabi", "Summer"];

const seedValues = {
  "Green Gram": "GreenGram",
  "Paddy":      "Paddy",
  "Soya Beans": "SoyaBeans",
  "Maize":      "Maize"
};
const soilValues = {
  "Alluvial Soil":  "Alluvial",
  "Black Soil":     "Black",
  "Red Soil":       "Red",
  "Laterite Soil":  "Laterite",
  "Loamy Soil":     "Loamy"
};

function Label({ children, icon }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      fontSize: "0.73rem", fontWeight: 700, color: "#475569",
      marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase"
    }}>
      {icon && <span style={{ fontSize: "0.85rem" }}>{icon}</span>}
      {children}
    </label>
  );
}

function FieldGroup({ children }) {
  return <div style={{ marginBottom: "1.05rem" }}>{children}</div>;
}

function InputPanel({ setResults, setLoading }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ seedType: "", seedAge: "", soilType: "", season: "", moistureValue: "" });
  const [imagePreview, setImagePreview]   = useState(null);
  const [imageFile, setImageFile]         = useState(null);
  const [dragging, setDragging]           = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [errorMsg, setErrorMsg]           = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!imageFile)              { setErrorMsg(t("errUpload")); return; }
    if (!formData.moistureValue) { setErrorMsg(t("errMoisture")); return; }
    if (!formData.seedAge)       { setErrorMsg(t("errAge")); return; }

    const resolvedSeedType = seedValues[formData.seedType] || formData.seedType;

    setSubmitting(true);
    setLoading(true);

    const data = new FormData();
    data.append("file", imageFile);
    data.append("raw_sensor_value", formData.moistureValue);
    data.append("seed_age", formData.seedAge);
    data.append("seedType", resolvedSeedType);
    data.append("soilType", soilValues[formData.soilType] || formData.soilType);
    data.append("season", formData.season);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/analyze`, { method: "POST", body: data });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const detail = errData?.detail || `${t("errServer")} (${response.status})`;
        console.error("Backend error:", response.status, detail);
        setErrorMsg(detail);
        setSubmitting(false);
        setLoading(false);
        return;
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error("Network error:", error);
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      setErrorMsg(`${t("errBackend")} ${API_URL}`);
    }

    setSubmitting(false);
    setLoading(false);
  };

  const selectStyle = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.5rem"
  };

  return (
    <div className="card" style={{ padding: "1.5rem", height: "100%" }}>
      <div className="panel-header">
        <div className="panel-icon panel-icon-green">🌱</div>
        <div>
          <h2 className="panel-title">{t("seedParams")}</h2>
          <p className="panel-sub">{t("seedParamsSub")}</p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div style={{
          background: "#fff1f2", border: "1px solid #fecaca", borderRadius: "10px",
          padding: "0.65rem 0.9rem", marginBottom: "1rem", display: "flex",
          alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#b91c1c"
        }}>
          <span>⚠️</span>
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} style={{
            background: "none", border: "none", color: "#b91c1c", cursor: "pointer",
            fontSize: "1rem", padding: 0, lineHeight: 1
          }}>×</button>
        </div>
      )}

      <FieldGroup>
        <Label icon="🌾">{t("seedType")}</Label>
        <select name="seedType" onChange={handleChange} value={formData.seedType} className="input-field" style={selectStyle}>
          <option value="">{t("selectSeed")}</option>
          {seedTypes.map(s => <option key={s} value={s}>{t("seed_" + s.toLowerCase().replace(/ /g, ""))}</option>)}
        </select>
      </FieldGroup>

      <FieldGroup>
        <Label icon="📅">{t("seedAge")}</Label>
        <input type="number" name="seedAge" placeholder="e.g. 6" min={0}
          onChange={handleChange} value={formData.seedAge} className="input-field" />
      </FieldGroup>

      <FieldGroup>
        <Label icon="💧">{t("moisture")}</Label>
        <input type="number" name="moistureValue" placeholder="e.g. 450" min={0} max={1023}
          onChange={handleChange} value={formData.moistureValue} className="input-field" />
      </FieldGroup>

      <FieldGroup>
        <Label icon="🪨">{t("soilType")}</Label>
        <select name="soilType" onChange={handleChange} value={formData.soilType} className="input-field" style={selectStyle}>
          <option value="">{t("selectSoil")}</option>
          {soilTypes.map(s => <option key={s} value={s}>{t("soil_" + s.toLowerCase().replace(/ /g, ""))}</option>)}
        </select>
      </FieldGroup>

      <FieldGroup>
        <Label icon="☀️">{t("season")}</Label>
        <select name="season" onChange={handleChange} value={formData.season} className="input-field" style={selectStyle}>
          <option value="">{t("selectSeason")}</option>
          {seasons.map(s => <option key={s} value={s}>{t("season_" + s.toLowerCase().replace(/ /g, ""))}</option>)}
        </select>
      </FieldGroup>

      <FieldGroup>
        <Label icon="📷">{t("seedImage")}</Label>
        <div
          className={`dropzone ${dragging ? "active" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div>
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "10px" }} />
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s"
                }}
                  className="img-overlay"
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 600 }}>{t("changeImage")}</span>
                </div>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0 }}>{t("clickChange")}</p>
            </div>
          ) : (
            <div>
              <div style={{
                width: "48px", height: "48px",
                background: "linear-gradient(135deg, #dcfce7, #d1fae5)", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.75rem", fontSize: "1.4rem"
              }}>📁</div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", margin: "0 0 0.3rem" }}>
                {t("dropImage")} <span style={{ color: "#16a34a", textDecoration: "underline" }}>{t("browse")}</span>
              </p>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>{t("imageFormats")}</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      </FieldGroup>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        {submitting ? (
          <>
            <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
            {t("analyzing")}
          </>
        ) : t("analyzeBtn")}
      </button>
    </div>
  );
}

export default InputPanel;