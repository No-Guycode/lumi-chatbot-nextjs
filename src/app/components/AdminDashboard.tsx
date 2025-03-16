import { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

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
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded mt-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Developer Dashboard</h1>
      <p className="mt-2">Manage API keys, rate limits, and logs.</p>
      
      <div className="mt-4">
        <label className="block">Max Tokens</label>
        <input
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mt-4">
        <label className="block">Rate Limit (requests per minute)</label>
        <input
          type="number"
          value={rateLimit}
          onChange={(e) => setRateLimit(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold">Usage Statistics</h2>
        <Line
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "API Usage",
                data: usageData,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
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
