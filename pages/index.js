import { useState } from "react";
import { Bar } from "react-chartjs-2";

export default function Home() {
  const [article, setArticle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeBias = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: article }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing bias:", error);
      setResult({ error: "Failed to analyze. Try again." });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", textAlign: "center" }}>
      <h1>📰 AI Political Bias Analyzer</h1>
      <textarea
        value={article}
        onChange={(e) => setArticle(e.target.value)}
        placeholder="Paste a news article here..."
        rows="6"
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button
        onClick={analyzeBias}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Bias"}
      </button>

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p><strong>Bias Score:</strong> {result.bias_score}</p>
              <p><strong>Fact-Check Result:</strong> {result.fact_check}</p>
              <Bar
                data={{
                  labels: ["Bias Score"],
                  datasets: [
                    {
                      label: "Bias Level",
                      data: [result.bias_score],
                      backgroundColor: result.bias_score > 5 ? "red" : "blue",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
