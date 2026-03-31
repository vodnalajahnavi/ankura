import { useLanguage } from "../LanguageContext";

const typeConfig = {
  good: { icon: "✅", class: "suggestion-good", accent: "#16a34a" },
  warn: { icon: "⚠️", class: "suggestion-warn", accent: "#f59e0b" },
  bad:  { icon: "❌", class: "suggestion-bad",  accent: "#ef4444" },
};

function SuggestionItem({ text, type, index }) {
  const config = typeConfig[type] || typeConfig["warn"];
  return (
    <div className={`suggestion-item ${config.class}`} style={{ animationDelay: `${index * 0.06}s` }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.05rem" }}>{config.icon}</span>
      <p style={{ fontSize: "0.82rem", color: "#374151", margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function SuggestionsPanel({ results }) {
  const { t } = useLanguage();

  if (!results) {
    return (
      <div className="card" style={{ padding: "1.5rem", height: "100%" }}>
        <div className="panel-header">
          <div className="panel-icon panel-icon-amber">💡</div>
          <div>
            <h2 className="panel-title">{t("recommendations")}</h2>
            <p className="panel-sub">{t("recSub")}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, #fef9c3, #fde68a)", borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
            marginBottom: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
          }}>💡</div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#374151", margin: "0 0 0.45rem" }}>{t("noRecYet")}</h3>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", maxWidth: "200px", lineHeight: 1.6, margin: 0 }}>{t("noRecDesc")}</p>
        </div>
      </div>
    );
  }

  const isGood = results.quality === "Good";
  const backendRecs = results.recommendations;

  let suggestions = [];

  if (backendRecs && Array.isArray(backendRecs) && backendRecs.length > 0) {
    // Use dynamic recommendations from backend
    suggestions = backendRecs.map(text => ({
      text,
      type: isGood ? "good" : (text.toLowerCase().includes("avoid") || text.toLowerCase().includes("reduce") ? "warn" : "bad")
    }));
  } else {
    // Fallback if backend doesn't provide them yet
    if (isGood) {
      suggestions.push({ text: t("sug_good1"), type: "good" });
      suggestions.push({ text: t("sug_good2"), type: "good" });
      suggestions.push({ text: t("sug_good3"), type: "good" });
    } else {
      suggestions.push({ text: t("sug_bad1"), type: "bad" });
      suggestions.push({ text: t("sug_bad2"), type: "bad" });
      suggestions.push({ text: t("sug_bad3"), type: "bad" });
      suggestions.push({ text: t("sug_bad4"), type: "bad" });
    }
  }

  const goodCount = suggestions.filter(s => s.type === "good").length;
  const warnCount = suggestions.filter(s => s.type === "warn").length;
  const badCount  = suggestions.filter(s => s.type === "bad").length;

  return (
    <div className="card fade-in" style={{ padding: "1.5rem", height: "100%" }}>
      <div className="panel-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="panel-icon panel-icon-amber">💡</div>
          <div>
            <h2 className="panel-title">{t("recommendations")}</h2>
            <p className="panel-sub">{suggestions.length} {t("insightsGenerated")}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {goodCount > 0 && <span className="badge badge-good">{goodCount} ✓</span>}
          {warnCount > 0 && <span className="badge badge-warn">{warnCount} !</span>}
          {badCount  > 0 && <span className="badge badge-bad">{badCount} ✗</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {suggestions.map((s, i) => <SuggestionItem key={i} text={s.text} type={s.type} index={i} />)}
      </div>
    </div>
  );
}

export default SuggestionsPanel;