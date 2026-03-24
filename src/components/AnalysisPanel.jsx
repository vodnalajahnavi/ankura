import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function ProgressBar({ label, value }) {

  const safeValue = value || 0;

  const getColor = () => {
    if (safeValue >= 80) return "bg-green-600";
    if (safeValue >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="font-semibold">{safeValue}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${getColor()}`}
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
}

function AnalysisPanel({ results, loading }) {

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Analysis Panel</h2>

        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Analysis Panel</h2>
        <p>No analysis yet.</p>
      </div>
    );
  }

  const visual = results.visual || 0;
  const moisture = results.moisture || 0;
  const germination = results.germination || 0;
  const yieldPotential = results.yieldPotential || 0;

  const chartData = {
    labels: [
      "Quality",
      "Moisture",
      "Germination",
      "Yield"
    ],
    datasets: [
      {
        label: "Performance %",
        data: [
          visual,
          moisture,
          germination,
          yieldPotential
        ],
        backgroundColor: [
          "#16a34a",
          "#ef4444",
          "#eab308",
          "#3b82f6"
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

      <h1 style={{ color: "blue" }}>ANALYSIS PANEL V2</h1>
      <h2 className="text-lg font-semibold mb-4">Analysis Panel</h2>

      <div className="space-y-5 mb-6">
        <ProgressBar label="Visual Quality Score" value={visual} />
        <ProgressBar label="Moisture Level" value={moisture} />
        <ProgressBar label="Germination Probability" value={germination} />
        <ProgressBar label="Yield Potential" value={yieldPotential} />
      </div>

      <Bar data={chartData} options={chartOptions} />

    </div>
  );
}

export default AnalysisPanel;