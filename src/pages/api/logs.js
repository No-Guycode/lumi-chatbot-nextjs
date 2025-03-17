import fs from 'fs';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'logs.json');
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
    if (req.method === 'GET') {
        const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')) : { logs: [] };
        return res.status(200).json(logs);
    }
    
    if (req.method === 'POST') {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });
        
        const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')) : { logs: [] };
        const timestamp = new Date().toISOString();
        logs.logs.push({ timestamp, message });
        
        // Keep logs for about a month (30 days)
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        logs.logs = logs.logs.filter(log => new Date(log.timestamp) >= monthAgo);
        
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
        return res.status(201).json({ message: "Log added" });
    }
    
    if (req.method === 'DELETE') {
        const { password } = req.body;
        if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });
        fs.writeFileSync(LOGS_FILE, JSON.stringify({ logs: [] }, null, 2));
        return res.status(200).json({ message: "Logs cleared" });
    }
    
    res.status(405).json({ error: "Method not allowed" });
}
