import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState({ rateLimit: 5, maxTokens: 1000 });

  async function handleLogin() {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setIsAuthenticated(true);
  }

  async function fetchSettings() {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data);
  }

  async function updateSettings() {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <label>
        Rate Limit:
        <input type="number" value={settings.rateLimit} onChange={(e) => setSettings({ ...settings, rateLimit: e.target.value })} />
      </label>
      <label>
        Max Tokens:
        <input type="number" value={settings.maxTokens} onChange={(e) => setSettings({ ...settings, maxTokens: e.target.value })} />
      </label>
      <button onClick={updateSettings}>Save Settings</button>
    </div>
  );
}
