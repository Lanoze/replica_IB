const http = require('http');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const { Pool } = pg;

// Configuração do Banco de Dados PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'replica_ib',
    password: 'postgres',
    port: 5432,
});

// ============================================================
// Módulo: Produção Científica » Publicações (mock data)
// ============================================================
let publicacoes = [
    {
        id: 1,
        titulo: 'Smart Grid Analytics: Detecção de Perdas não Técnicas em Redes de Distribuição Usando Machine Learning',
        natureza: 'Journal',
        status: 'Publicado',
        veiculo: 'IEEE Transactions on Smart Grid',
        projeto: 'P021 — Sistema de Medição Inteligente',
        conformidade_ib: 'Sim',
        ano: 2024
    },
    {
        id: 2,
        titulo: 'Otimização do Fluxo de Potência em Microrredes com Geração Solar Fotovoltaica e Armazenamento',
        natureza: 'Conferência',
        status: 'Aceito',
        veiculo: 'IEEE PES Innovative Smart Grid Technologies (ISGT)',
        projeto: 'P018 — Microrredes Urbanas',
        conformidade_ib: 'Pendente',
        ano: 2025
    },
    {
        id: 3,
        titulo: 'IoT aplicado à Telemedição: Revisão Sistemática e Perspectivas para o Setor Elétrico Brasileiro',
        natureza: 'Periódico',
        status: 'Em Revisão',
        veiculo: 'Revista Controle & Automação',
        projeto: 'P025 — Infraestrutura de Medição IoT',
        conformidade_ib: 'Não',
        ano: 2025
    },
    {
        id: 4,
        titulo: 'Metodologia de Avaliação de Conformidade ANEEL para Projetos de P&D com Base Patrimonial',
        natureza: 'Journal',
        status: 'Submetido',
        veiculo: 'Journal of Control, Automation and Electrical Systems',
        projeto: 'P032 — Governança de P&D ANEEL',
        conformidade_ib: 'Pendente',
        ano: 2023
    }
];
let proximoIdPublicacao = publicacoes.length + 1;

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
                    'SELECT * FROM usuarios WHERE nome = $1 AND senha = $2 AND ativo = true',
                    [username, password]
                );

                if (result.rows.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Usuário ou senha inválidos' }));
                    return;
                }

                const user = result.rows[0];
                let userModules = [];
                try {
                    userModules = user.modules ? JSON.parse(user.modules) : [];
                } catch {
                    userModules = [];
                }

                // Se for publi e não tiver módulos definidos, atribui padrão (dashboard e producao-cientifica)
                if (user.role === 'publi' && userModules.length === 0) {
                    userModules = ['dashboard', 'producao-cientifica'];
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: user.id,
                    username: user.nome,
                    nome_completo: user.nome,
                    role: user.role || 'admin',
                    can_edit_db: user.role === 'admin',
                    modules: user.role === 'admin' ? [] : userModules
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

    // ============================================================
    // Módulo: Produção Científica » Publicações
    // ============================================================
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // GET /gestaoibii/api/publicacoes — listagem (filtros opcionais: ?ano=&status=)
    if (pathname === '/gestaoibii/api/publicacoes' && req.method === 'GET') {
        let lista = publicacoes;
        const ano = parsedUrl.searchParams.get('ano');
        const status = parsedUrl.searchParams.get('status');
        if (ano) lista = lista.filter(p => String(p.ano) === ano);
        if (status) lista = lista.filter(p => p.status.toLowerCase() === status.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lista));
        return;
    }

    // POST /gestaoibii/api/publicacoes — cadastro de nova publicação
    if (pathname === '/gestaoibii/api/publicacoes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['titulo', 'natureza', 'status', 'veiculo', 'projeto', 'conformidade_ib'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }
                const ano = parseInt(dados.ano, 10);
                const nova = {
                    id: proximoIdPublicacao++,
                    titulo: String(dados.titulo).trim(),
                    natureza: String(dados.natureza).trim(),
                    status: String(dados.status).trim(),
                    veiculo: String(dados.veiculo).trim(),
                    projeto: String(dados.projeto).trim(),
                    conformidade_ib: String(dados.conformidade_ib).trim(),
                    ano: isNaN(ano) ? new Date().getFullYear() : ano
                };
                publicacoes.push(nova);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(nova));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido' }));
            }
        });
        return;
    }

    // Rota amigável do módulo: /producao-cientifica e /producao-cientifica/publicacoes
    if (pathname === '/producao-cientifica' || pathname === '/producao-cientifica/' || pathname === '/producao-cientifica/publicacoes') {
        const paginaPath = path.join(__dirname, 'modulos', 'publicacoes', 'index.html');
        fs.readFile(paginaPath, (error, content) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
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
