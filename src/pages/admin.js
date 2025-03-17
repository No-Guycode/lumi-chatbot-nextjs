import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ rateLimit: '', maxTokens: '', modelOptions: '' });
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/admin')
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs.logs);
                setSettings(data.settings);
            })
            .catch(err => setError('Failed to load data'));
    }, []);

    const handleSaveSettings = async () => {
        setLoading(true);
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password,
                action: 'update_settings',
                rateLimit: settings.rateLimit,
                maxTokens: settings.maxTokens,
                modelOptions: settings.modelOptions,
            })
        });
        setLoading(false);
        if (!res.ok) setError('Failed to save settings');
    };

    const handleClearLogs = async () => {
        setLoading(true);
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, action: 'clear_logs' })
        });
        setLoading(false);
        if (res.ok) setLogs([]);
        else setError('Failed to clear logs');
    };

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl mb-4">Admin Dashboard</h1>
            <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-4 p-2 text-black" />
            <div className="mb-4">
                <label>Rate Limit: </label>
                <input type="number" value={settings.rateLimit} onChange={e => setSettings({ ...settings, rateLimit: e.target.value })} className="p-2 text-black" />
            </div>
            <div className="mb-4">
                <label>Max Tokens: </label>
                <input type="number" value={settings.maxTokens} onChange={e => setSettings({ ...settings, maxTokens: e.target.value })} className="p-2 text-black" />
            </div>
            <div className="mb-4">
                <label>Model Options: </label>
                <input type="text" value={settings.modelOptions} onChange={e => setSettings({ ...settings, modelOptions: e.target.value })} className="p-2 text-black" />
            </div>
            <button onClick={handleSaveSettings} className="bg-blue-500 p-2 rounded">Save</button>
            <button onClick={handleClearLogs} className="bg-red-500 p-2 rounded ml-2">Clear Logs</button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-xl mt-6">Logs</h2>
            <div className="overflow-y-auto h-60 border p-2">
                {logs.map((log, index) => <p key={index}>{log.timestamp}: {log.message}</p>)}
            </div>
        </div>
    );
}
