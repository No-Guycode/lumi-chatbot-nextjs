import { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/globals.css";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [rateLimit, setRateLimit] = useState(5);
  const [usageData, setUsageData] = useState([10, 15, 8, 12, 20, 18, 25]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
        />
        <button onClick={handleLogin} className="admin-button">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Developer Dashboard</h1>
      <p>Manage API keys, rate limits, and logs.</p>
      
      <div className="admin-section">
        <label>Max Tokens</label>
        <input
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          className="admin-input"
        />
      </div>

      <div className="admin-section">
        <label>Rate Limit (requests per minute)</label>
        <input
          type="number"
          value={rateLimit}
          onChange={(e) => setRateLimit(e.target.value)}
          className="admin-input"
        />
      </div>
      
      <div className="admin-section">
        <h2>Usage Statistics</h2>
        <Line
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "API Usage",
                data: usageData,
                borderColor: "#007BFF",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

// Create a Next.js page for /admin
import AdminDashboard from "@/app/components/AdminDashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}
