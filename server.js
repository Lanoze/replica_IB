const http = require('http');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const { Pool } = pg;

// Configuração atualizada com a senha correta 'postgres'
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'replica_ib',
    password: 'postgres',
    port: 5432,
});

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Endpoint de Login
    if (req.url === '/gestaoibii/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);
                const result = await pool.query(
                    'SELECT * FROM usuarios WHERE email = $1 AND senha = $2 AND ativo = true',
                    [username, password]
                );

                if (result.rows.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Usuário ou senha inválidos' }));
                    return;
                }

                const user = result.rows[0];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: user.id,
                    username: user.email,
                    role: 'admin'
                }));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro interno no servidor' }));
            }
        });
        return;
    }

    // Endpoint /me
    if (req.url === '/gestaoibii/api/auth/me' && req.method === 'GET') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ detail: 'Não autenticado' }));
        return;
    }

    // Servir arquivos estáticos
    let reqPath = req.url.split('?')[0];
    let filePath = path.join(__dirname, reqPath === '/' ? 'pagina.html' : reqPath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Servidor rodando com sucesso!`);
    console.log(`Acesse no navegador: http://localhost:${PORT}/pagina.html`);
    console.log(`====================================================`);
});
