import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import Navbar from "../components/Navbar";
import InputPanel from "../components/InputPanel";
import AnalysisPanel from "../components/AnalysisPanel";
import SuggestionsPanel from "../components/SuggestionsPanel";

function StatBadge({ icon, label, value, color = "#15803d" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.45rem",
      background: "rgba(255,255,255,0.9)", border: "1px solid rgba(187,247,208,0.7)",
      borderRadius: "999px", padding: "0.35rem 0.9rem", fontSize: "0.78rem",
      color: "#374151", fontWeight: 500, backdropFilter: "blur(8px)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s", cursor: "default"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      <span style={{ fontSize: "0.9rem" }}>{icon}</span>
      <span style={{ color: "#94a3b8" }}>{label}:</span>
      <span style={{ fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function Dashboard() {
  const { t } = useLanguage();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.75rem 1.5rem 3rem" }}>

        {/* Hero Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0f4c25 0%, #15803d 40%, #0e7490 100%)",
          borderRadius: "20px", padding: "1.75rem 2rem", marginBottom: "1.75rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1.25rem", position: "relative", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(15,76,37,0.22)"
        }}>
          <div style={{ position: "absolute", top: "-30px", right: "60px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-40px", right: "200px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(8,145,178,0.12)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                {t("aiPlatform")}
              </span>
            </div>
            <h1 style={{
              fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: "0 0 0.3rem",
              letterSpacing: "-0.02em", fontFamily: "'Poppins', Inter, sans-serif"
            }}>{t("dashboardTitle")}</h1>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>
              {t("dashboardDesc")}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <StatBadge icon="🌾" label={t("model")} value={t("allSeeds")} color="#86efac" />
            <StatBadge icon="🤖" label={t("engine")} value={t("tensorFlowCNN")} color="#67e8f9" />
            <StatBadge icon="⚡" label={t("status")} value={results ? t("analyzed") : t("ready")} color={results ? "#86efac" : "#fde68a"} />
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="dashboard-grid" style={{ marginBottom: "1.75rem" }}>
          <div className="fade-in">
            <InputPanel setResults={setResults} setLoading={setLoading} />
          </div>
          <div className="fade-in-delay-1">
            <AnalysisPanel results={results} loading={loading} />
          </div>
          <div className="fade-in-delay-2">
            <SuggestionsPanel results={results} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "2rem 0 0.5rem",
          borderTop: "1px solid #e2e8f0", marginTop: "2.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "linear-gradient(135deg, #16a34a, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>🌱</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", letterSpacing: "-0.01em", fontFamily: "'Poppins', sans-serif" }}>ANKURA</span>
          </div>
          <p style={{ fontSize: "0.73rem", color: "#94a3b8", margin: 0 }}>
            {t("footerText")}
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;