import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
    if (req.method === 'GET') {
        const settings = fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) : {};
        return res.status(200).json(settings);
    }

    if (req.method === 'POST') {
        const { password, rateLimit, maxTokens, modelOptions } = req.body;
        if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

        const newSettings = { rateLimit, maxTokens, modelOptions };
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));

        return res.status(200).json({ message: "Settings updated" });
    }

    res.status(405).json({ error: "Method not allowed" });
}
