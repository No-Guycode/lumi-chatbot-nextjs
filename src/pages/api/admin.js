// api/admin.js (Unified Admin API for logs & settings)
import fs from 'fs';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'logs.json');
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Get logs and settings together
        const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')) : { logs: [] };
        const settings = fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) : {};
        return res.status(200).json({ logs, settings });
    }
    
    if (req.method === 'POST') {
        const { password, action, message, rateLimit, maxTokens, modelOptions } = req.body;
        if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });
        
        if (action === "add_log") {
            if (!message) return res.status(400).json({ error: "Message is required" });
            const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')) : { logs: [] };
            logs.logs.push({ timestamp: new Date().toISOString(), message });
            
            // Keep logs for about a month (30 days)
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            logs.logs = logs.logs.filter(log => new Date(log.timestamp) >= monthAgo);
            
            fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
            return res.status(201).json({ message: "Log added" });
        }
        
        if (action === "clear_logs") {
            fs.writeFileSync(LOGS_FILE, JSON.stringify({ logs: [] }, null, 2));
            return res.status(200).json({ message: "Logs cleared" });
        }
        
        if (action === "update_settings") {
            const newSettings = { rateLimit, maxTokens, modelOptions };
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
            return res.status(200).json({ message: "Settings updated" });
        }
        
        return res.status(400).json({ error: "Invalid action" });
    }
    
    res.status(405).json({ error: "Method not allowed" });
}
