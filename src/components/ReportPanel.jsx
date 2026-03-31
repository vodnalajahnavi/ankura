import { useLanguage } from "../LanguageContext";

function getColor(value) {
  if (value >= 80) return "#15803d";
  if (value >= 60) return "#b45309";
  return "#b91c1c";
}
function getMoistureColor(value) {
  if (value >= 40 && value <= 50) return "#15803d";
  if (value < 40) return "#b91c1c";
  return "#b45309";
}

function ScorePill({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px",
      padding: "1.1rem 0.85rem", textAlign: "center", transition: "all 0.2s",
      position: "relative", overflow: "hidden"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>{icon}</div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 900, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}%</div>
    </div>
  );
}

function ReportPanel({ results }) {
  const { t } = useLanguage();
  if (!results) return null;

  const isGood = results.quality === "Good";
  const overallScore = Math.round((results.visual + results.germination + results.yieldPotential) / 3);
  const overallColor = overallScore >= 80 ? "#15803d" : overallScore >= 60 ? "#b45309" : "#b91c1c";

  return (
    <div className="card fade-in" style={{ overflow: "hidden" }}>
      <div style={{
        background: "linear-gradient(135deg, #0f4c25 0%, #15803d 45%, #0e7490 100%)",
        padding: "1.75rem 2rem", color: "white",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1.25rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "120px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", right: "300px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(8,145,178,0.15)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{t("finalReport")}</span>
          </p>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.35rem", letterSpacing: "-0.025em", fontFamily: "'Poppins', Inter, sans-serif" }}>
            {t("reportTitle")}
          </h2>
          <p style={{ fontSize: "0.82rem", opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
            AI Classification:&nbsp;<strong>{isGood ? "Good Quality" : "Needs Improvement"}</strong>&nbsp;·&nbsp;Confidence:&nbsp;<strong>{results.confidence}%</strong>
          </p>
        </div>

        <div style={{
          textAlign: "center", background: "rgba(255,255,255,0.12)", borderRadius: "16px",
          padding: "1rem 1.5rem", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 1
        }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{t("overallScore")}</div>
          <div style={{ fontSize: "2.75rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" }}>{overallScore}%</div>
          <div style={{ fontSize: "0.7rem", opacity: 0.7, marginTop: "0.2rem" }}>
            {overallScore >= 80 ? t("excellent") : overallScore >= 60 ? t("moderate") : t("needsWork")}
          </div>
        </div>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>{t("metricBreakdown")}</span>
          <span style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <ScorePill label={t("visualQuality")} value={results.visual} icon="👁️" color={getColor(results.visual)} />
          <ScorePill label={t("moistureLevel")} value={results.moisture} icon="💧" color={getMoistureColor(results.moisture)} />
          <ScorePill label={t("germination")} value={results.germination} icon="🌱" color={getColor(results.germination)} />
          <ScorePill label={t("yieldPotential")} value={results.yieldPotential} icon="🌾" color={getColor(results.yieldPotential)} />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => window.print()} style={{
            display: "flex", alignItems: "center", gap: "0.45rem",
            padding: "0.7rem 1.35rem",
            background: "linear-gradient(135deg, #15803d, #0891b2)",
            color: "white", border: "none", borderRadius: "10px",
            fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 14px rgba(21,128,61,0.2)", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >{t("exportPdf")}</button>
          <button onClick={() => {
            const text = `Ankura Seed Report\n\nQuality: ${results.quality}\nConfidence: ${results.confidence}%\nVisual: ${results.visual}%\nMoisture: ${results.moisture}%\nGermination: ${results.germination}%\nYield: ${results.yieldPotential}%`;
            navigator.clipboard.writeText(text);
          }} className="btn-secondary">{t("copyReport")}</button>
        </div>
      </div>
    </div>
  );
}

export default ReportPanel;