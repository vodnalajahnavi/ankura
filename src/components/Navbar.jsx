import { useLanguage } from "../LanguageContext";

const LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Marathi"];

function Navbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(226,232,240,0.8)",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem",
        height: "70px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "1rem"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexShrink: 0 }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "12px", overflow: "hidden",
            border: "2px solid #dcfce7", background: "#f0fdf4",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(22,163,74,0.15)", flexShrink: 0
          }}>
            <img src="/logo.jpg" alt="Ankura Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = "🌱";
                e.target.parentElement.style.fontSize = "1.4rem";
              }} />
          </div>
          <div>
            <div style={{
              fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #15803d 0%, #16a34a 40%, #0891b2 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.1, fontFamily: "'Poppins', 'Inter', sans-serif"
            }}>ANKURA</div>
            <div style={{
              fontSize: "0.68rem", color: "#64748b", fontWeight: 500,
              letterSpacing: "0.015em", marginTop: "2px",
              display: "flex", alignItems: "center", gap: "0.3rem"
            }}>
              <span style={{
                display: "inline-block", width: "6px", height: "6px",
                borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #0891b2)", flexShrink: 0
              }} />
              Smart Seed Intelligence for Better Yields
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          <button style={{
            padding: "0.45rem 1rem",
            borderRadius: "9px",
            border: "1px solid #bbf7d0",
            background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            color: "#15803d",
            fontWeight: 600,
            fontSize: "0.85rem"
          }}>
            {t("dashboard")}
          </button>
        </nav>

        {/* Language + User */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "0.65rem", top: "50%",
              transform: "translateY(-50%)", fontSize: "0.85rem"
            }}>🌐</span>

            <select
              value={lang}
              onChange={(e) => {
                const selected = e.target.value;
                setLang(selected);

                const map = {
                  English: "en",
                  Hindi: "hi",
                  Telugu: "te",
                  Tamil: "ta",
                  Kannada: "kn",
                  Marathi: "mr"
                };

                if (window.changeLanguage) {
                  window.changeLanguage(map[selected]);
                }
              }}
              style={{
                paddingLeft: "2.1rem",
                paddingRight: "0.85rem",
                paddingTop: "0.45rem",
                paddingBottom: "0.45rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "9px",
                fontSize: "0.8rem",
                background: "#f8fafc",
                cursor: "pointer"
              }}
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg, #16a34a, #0891b2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700
          }}>
            A
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;