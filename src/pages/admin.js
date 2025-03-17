import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ rateLimit: 5, maxTokens: 100, model: "gpt-4" });
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        fetch("/api/logs")
            .then(res => res.json())
            .then(data => setLogs(data.logs));
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    const saveSettings = async () => {
        await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...settings, password }),
        });
    };

    const clearLogs = async () => {
        await fetch("/api/logs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
        setLogs([]);
    };

    if (!auth) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <input type="password" placeholder="Enter Admin Password" className="p-2 border rounded bg-gray-800" onChange={e => setPassword(e.target.value)} />
                <button className="mt-2 p-2 bg-blue-500 rounded" onClick={() => setAuth(true)}>Login</button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="mt-4">
                <h2 className="text-xl">Settings</h2>
                <label>Rate Limit: <input type="number" value={settings.rateLimit} onChange={e => setSettings({ ...settings, rateLimit: e.target.value })} className="ml-2 p-1 bg-gray-800 border border-gray-600 rounded" /></label>
                <label className="block mt-2">Max Tokens: <input type="number" value={settings.maxTokens} onChange={e => setSettings({ ...settings, maxTokens: e.target.value })} className="ml-2 p-1 bg-gray-800 border border-gray-600 rounded" /></label>
                <label className="block mt-2">Model: <input type="text" value={settings.model} onChange={e => setSettings({ ...settings, model: e.target.value })} className="ml-2 p-1 bg-gray-800 border border-gray-600 rounded" /></label>
                <button className="mt-2 p-2 bg-green-500 rounded" onClick={saveSettings}>Save</button>
            </div>
            <div className="mt-4">
                <h2 className="text-xl">Chat Logs</h2>
                <div className="h-64 overflow-y-auto bg-gray-800 p-2 border border-gray-600 rounded">
                    {logs.map((log, index) => <p key={index} className="border-b border-gray-700 p-1">[{log.timestamp}] {log.message}</p>)}
                </div>
                <button className="mt-2 p-2 bg-red-500 rounded" onClick={clearLogs}>Clear Logs</button>
            </div>
        </div>
    );
}
