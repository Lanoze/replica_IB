const { Pool } = require('pg');

// Em serverless (Vercel), DATABASE_URL vem das env vars do dashboard
// Localmente, pode vir do .env
if (!process.env.DATABASE_URL) {
    try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const linhas = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
            for (const linha of linhas) {
                const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
                if (m && !(m[1] in process.env)) {
                    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
                }
            }
        }
    } catch {}
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não configurada');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
