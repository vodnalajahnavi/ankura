function ReportPanel({ results }) {

  if (!results) return null;

  return (
    <div className="mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-600">
          
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            🌾 Final Analysis Report
          </h2>

          <div className="grid grid-cols-2 gap-4 text-lg">
            <p><strong>Visual Quality:</strong> {results.visual}%</p>
            <p><strong>Moisture Level:</strong> {results.moisture}%</p>
            <p><strong>Germination Probability:</strong> {results.germination}%</p>
            <p><strong>Yield Potential:</strong> {results.yieldPotential}%</p>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
          >
            Export Report (Save as PDF)
          </button>

        </div>
      </div>
    </div>
  );
}

export default ReportPanel;