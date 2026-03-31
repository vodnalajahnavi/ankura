const baseEnglish = {
  seedParams: "Seed Parameters",
  seedParamsSub: "Enter seed details for AI analysis",
  seedType: "Seed Type",
  seedAge: "Seed Age (months)",
  moisture: "Moisture Sensor Value (0–1023)",
  soilType: "Soil Type",
  season: "Season",
  seedImage: "Seed Image",
  analyzeBtn: "🔬  Analyze Seed",
  analyzing: "Analyzing Seed…",
  selectSeed: "Select seed type…",
  selectSoil: "Select soil type…",
  selectSeason: "Select season…",
  dropImage: "Drop image here or",
  browse: "browse",
  imageFormats: "Supports JPG, PNG, WEBP · Max 10MB",
  changeImage: "🔄 Change Image",
  clickChange: "Click to change image",
  analysisResults: "Analysis Results",
  waitingAnalysis: "Waiting for analysis",
  processing: "Processing your seed…",
  analyzingQuality: "Analyzing seed quality…",
  takeSeconds: "This may take a few seconds",
  noAnalysis: "No Analysis Yet",
  noAnalysisDesc: "Fill in the seed parameters and click",
  toSeeResults: "to see results here.",
  aiConfidence: "AI Confidence Score",
  visualQuality: "Visual Quality",
  moistureLabel: "Moisture",
  germination: "Germination",
  yieldPotential: "Yield Potential",
  moistureLevel: "Moisture Level",
  germinationRate: "Germination Rate",
  perfOverview: "Performance Overview",
  goodQuality: "Good Quality",
  poorQuality: "Needs Improvement",
  recommendations: "Recommendations",
  recSub: "AI-driven farming guidance",
  noRecYet: "No Recommendations Yet",
  noRecDesc: "Run the seed analysis to receive personalized farming recommendations.",
  insightsGenerated: "insights generated",
  dashboardTitle: "Seed Quality Analysis Dashboard",
  dashboardDesc: "Upload a seed image and enter parameters to receive AI-powered quality assessment & yield predictions.",
  model: "Model",
  engine: "Engine",
  status: "Status",
  analyzed: "Analyzed ✓",
  ready: "Ready",
  dashboard: "Dashboard",
  reports: "Reports",
  history: "History",
  footerText: "Smart Seed Intelligence for Better Yields · Powered by TensorFlow & React · © 2025",
  errUpload: "Please upload a seed image.",
  errMoisture: "Please enter moisture sensor value.",
  errAge: "Please enter seed age.",
  errUntrained: "Model not trained for this seed yet.",
  errBackend: "Could not connect to analysis server.",
  errServer: "Server error during analysis. Please try again.",
  errUnexpected: "An unexpected error occurred. Please try again.",
  aiPlatform: "AI-Powered Platform",
  allSeeds: "All Seeds",

  sug_good1: "Maintain current farming practices",
  sug_good2: "Moisture levels are optimal",
  sug_good3: "Proceed with sowing",
  sug_bad1: "Use certified or better quality seeds",
  sug_bad2: "Adjust moisture levels",
  sug_bad3: "Improve irrigation and soil nutrients",
  sug_bad4: "Improve storage conditions",

  seed_greengram: "Green Gram",
  seed_paddy: "Paddy",
  seed_soyabeans: "Soya Beans",
  seed_maize: "Maize",

  soil_alluvialsoil: "Alluvial Soil",
  soil_blacksoil: "Black Soil",
  soil_redsoil: "Red Soil",
  soil_lateritesoil: "Laterite Soil",
  soil_loamysoil: "Loamy Soil",

  season_kharif: "Kharif",
  season_rabi: "Rabi",
  season_summer: "Summer",

  aiAssessment: "AI-powered seed assessment",
  tensorFlowCNN: "TensorFlow CNN"
};

const translations = {
  English: { ...baseEnglish },
  Hindi: { ...baseEnglish, 
    dashboard: "डैशबोर्ड", 
    goodQuality: "अच्छी गुणवत्ता",
    poorQuality: "सुधार की आवश्यकता है",
    recommendations: "सिफारिशें",
    seedParams: "बीज पैरामीटर",
    seedType: "बीज का प्रकार",
    analysisResults: "विश्लेषण परिणाम"
  },
  Telugu: { ...baseEnglish, 
    dashboard: "డ్యాష్‌బోర్డ్",
    goodQuality: "మంచి నాణ్యత",
    poorQuality: "మెరుగుదల అవసరం",
    recommendations: "సిఫార్సులు",
    seedParams: "విత్తన పారామితులు"
  },
  Tamil: { ...baseEnglish,
    dashboard: "டாஷ்போர்டு",
    goodQuality: "நல்ல தரம்",
    poorQuality: "முன்னேற்றம் தேவை"
  },
  Kannada: { ...baseEnglish,
    goodQuality: "ಉತ್ತಮ ಗುಣಮಟ್ಟ",
    poorQuality: "ಸುಧಾರಣೆಯ ಅಗತ್ಯವಿದೆ"
  },
  Marathi: { ...baseEnglish,
    goodQuality: "चांगली गुणवत्ता",
    poorQuality: "सुधारणा आवश्यक"
  }
};

export function t(lang, key) {
  if (!key) return "";
  const languageSet = translations[lang] || translations["English"];
  
  if (languageSet && languageSet[key]) return languageSet[key];
  if (translations["English"] && translations["English"][key]) return translations["English"][key];
  if (baseEnglish[key]) return baseEnglish[key];
  
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Ensure translations is also exported if needed by LanguageContext or others
export { translations };
