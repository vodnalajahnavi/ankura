import { useState } from "react";

import Navbar from "../components/Navbar";
import InputPanel from "../components/InputPanel";
import AnalysisPanel from "../components/AnalysisPanel";
import SuggestionsPanel from "../components/SuggestionsPanel";
import ReportPanel from "../components/ReportPanel";

function Dashboard() {

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (

    <div className="min-h-screen bg-gray-100">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN DASHBOARD AREA */}
      <div className="p-6">

        {/* DASHBOARD TITLE */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Ankura Seed Quality Analysis Dashboard
        </h1>

        {/* MAIN 3 PANEL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT PANEL — INPUT */}
          <div className="col-span-1">
            <InputPanel
              setResults={setResults}
              setLoading={setLoading}
            />
          </div>

          {/* CENTER PANEL — ANALYSIS */}
          <div className="col-span-1">
            <AnalysisPanel
              results={results}
              loading={loading}
            />
          </div>

          {/* RIGHT PANEL — SUGGESTIONS */}
          <div className="col-span-1">
            <SuggestionsPanel
              results={results}
            />
          </div>

        </div>

        {/* REPORT PANEL */}
        <div className="mt-8">
          <ReportPanel
            results={results}
          />
        </div>

      </div>

    </div>

  );
}

export default Dashboard;