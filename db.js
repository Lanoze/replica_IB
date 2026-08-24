const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function carregarEnv() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) return;
    const linhas = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const linha of linhas) {
        const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in process.env)) {
            process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    }
}

carregarEnv();

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não configurada. Defina a connection string do Neon no arquivo .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
