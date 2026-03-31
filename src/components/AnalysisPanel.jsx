import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useLanguage } from "../LanguageContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function getScoreColor(value) {
  if (value >= 80) return { fill: "#16a34a", bg: "#dcfce7", text: "#15803d", glow: "rgba(22,163,74,0.2)" };
  if (value >= 60) return { fill: "#f59e0b", bg: "#fef9c3", text: "#b45309", glow: "rgba(245,158,11,0.2)" };
  return { fill: "#ef4444", bg: "#fee2e2", text: "#b91c1c", glow: "rgba(239,68,68,0.2)" };
}

function MetricCard({ label, value, icon }) {
  const color = getScoreColor(value);
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color.fill}` }}>
      <div style={{ fontSize: "1.35rem", marginBottom: "0.3rem" }}>{icon}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: color.text, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}<span style={{ fontSize: "1rem" }}>%</span>
      </div>
      <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, icon }) {
  const color = getScoreColor(value);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          {icon} {label}
        </span>
        <span style={{
          fontSize: "0.78rem", fontWeight: 700, color: color.text,
          background: color.bg, padding: "0.1rem 0.5rem", borderRadius: "999px"
        }}>{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color.fill}, ${color.fill}cc)` }} />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <div className="shimmer" style={{ height: "13px", width: "45%", marginBottom: "8px" }} />
      <div className="shimmer" style={{ height: "9px", width: "100%" }} />
    </div>
  );
}

function PanelShell({ children }) {
  return <div className="card" style={{ padding: "1.5rem", height: "100%" }}>{children}</div>;
}

function AnalysisPanel({ results, loading }) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <PanelShell>
        <div className="panel-header" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="panel-icon panel-icon-blue">📊</div>
            <div>
              <h2 className="panel-title">{t("analysisResults")}</h2>
              <p className="panel-sub">{t("processing")}</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.75rem 0 1rem" }}>
          <div className="spinner" style={{ marginBottom: "1rem" }} />
          <p style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 600, margin: "0 0 0.25rem" }}>{t("analyzingQuality")}</p>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>{t("takeSeconds")}</p>
        </div>
        <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
      </PanelShell>
    );
  }

  if (!results) {
    return (
      <PanelShell>
        <div className="panel-header" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="panel-icon panel-icon-blue">📊</div>
            <div>
              <h2 className="panel-title">{t("analysisResults")}</h2>
              <p className="panel-sub">{t("waitingAnalysis")}</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, #f0fdf4, #e0f2fe)", borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
            marginBottom: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
          }}>🔬</div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#374151", margin: "0 0 0.45rem" }}>{t("noAnalysis")}</h3>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", maxWidth: "220px", lineHeight: 1.6, margin: 0 }}>
            {t("noAnalysisDesc")} <strong style={{ color: "#16a34a" }}>{t("analyzeBtn")}</strong> {t("toSeeResults")}
          </p>
        </div>
      </PanelShell>
    );
  }

  const visual = results.visual || 0;
  const moisture = results.moisture || 0;
  const germination = results.germination || 0;
  const yieldPotential = results.yieldPotential || 0;
  const isGood = results.quality === "Good";

  const chartData = {
    labels: [t("visualQuality"), t("moistureLabel"), t("germination"), t("yieldPotential")],
    datasets: [{
      data: [visual, moisture, germination, yieldPotential],
      backgroundColor: ["#16a34a", "#0891b2", "#f59e0b", "#8b5cf6"],
      borderRadius: 7, borderSkipped: false,
    }]
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` } } },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" }, ticks: { font: { size: 10, family: "Inter" }, color: "#94a3b8" } },
      x: { grid: { display: false }, ticks: { font: { size: 10, family: "Inter" }, color: "#64748b" } }
    }
  };

  return (
    <PanelShell>
      <div className="panel-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="panel-icon panel-icon-blue">📊</div>
          <div>
            <h2 className="panel-title">{t("analysisResults")}</h2>
            <p className="panel-sub">{t("aiAssessment")}</p>
          </div>
        </div>
        <span className={`badge ${isGood ? "badge-good" : "badge-bad"}`}>
          {isGood ? t("goodQuality") : t("poorQuality")}
        </span>
      </div>

      <div style={{
        background: isGood ? "linear-gradient(135deg, #f0fdf4, #dcfce7)" : "linear-gradient(135deg, #fff1f2, #fee2e2)",
        borderRadius: "14px", padding: "1rem 1.1rem", marginBottom: "1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        border: `1px solid ${isGood ? "#bbf7d0" : "#fecaca"}`
      }}>
        <div>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{t("aiConfidence")}</p>
          <p style={{ fontSize: "1.65rem", fontWeight: 900, color: isGood ? "#15803d" : "#b91c1c", margin: "0.15rem 0 0", letterSpacing: "-0.02em" }}>{results.confidence}%</p>
        </div>
        <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{isGood ? "🌿" : "⚠️"}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.25rem" }}>
        <MetricCard label={t("visualQuality")} value={visual} icon="👁️" />
        <MetricCard label={t("moistureLabel")} value={moisture} icon="💧" />
        <MetricCard label={t("germination")} value={germination} icon="🌱" />
        <MetricCard label={t("yieldPotential")} value={yieldPotential} icon="🌾" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <ProgressBar label={t("visualQuality")} value={visual} icon="👁️" />
        <ProgressBar label={t("moistureLevel")} value={moisture} icon="💧" />
        <ProgressBar label={t("germinationRate")} value={germination} icon="🌱" />
        <ProgressBar label={t("yieldPotential")} value={yieldPotential} icon="🌾" />
      </div>

      <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.75rem" }}>{t("perfOverview")}</p>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </PanelShell>
  );
}

export default AnalysisPanel;