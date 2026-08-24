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

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // ============================================================
    // Módulo: Produção Científica » Publicações
    // ============================================================
    if (pathname === '/gestaoibii/api/publicacoes' && req.method === 'GET') {
        try {
            const ano = parsedUrl.searchParams.get('ano');
            const status = parsedUrl.searchParams.get('status');
            let query = 'SELECT * FROM publicacoes WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (ano) {
                query += ` AND ano = $${paramIndex++}`;
                params.push(parseInt(ano, 10));
            }
            if (status) {
                query += ` AND LOWER(status) = LOWER($${paramIndex++})`;
                params.push(status);
            }
            query += ' ORDER BY id DESC';

            const result = await pool.query(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: 'Erro ao buscar publicações' }));
        }
        return;
    }

    if (pathname === '/gestaoibii/api/publicacoes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
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
                const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                const query = `
                    INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;
                const values = [
                    String(dados.titulo).trim(),
                    String(dados.natureza).trim(),
                    String(dados.status).trim(),
                    String(dados.veiculo).trim(),
                    String(dados.projeto).trim(),
                    String(dados.conformidade_ib).trim(),
                    anoFinal
                ];

                const result = await pool.query(query, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Produção Acadêmica
    // ============================================================
    if (pathname === '/gestaoibii/api/producao-academica' && req.method === 'GET') {
        try {
            const ano = parsedUrl.searchParams.get('ano');
            const tipo = parsedUrl.searchParams.get('tipo');
            let query = 'SELECT * FROM producao_academica WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (ano) {
                query += ` AND ano = $${paramIndex++}`;
                params.push(parseInt(ano, 10));
            }
            if (tipo) {
                query += ` AND LOWER(tipo_nivel) = LOWER($${paramIndex++})`;
                params.push(tipo);
            }
            query += ' ORDER BY id DESC';

            const result = await pool.query(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: 'Erro ao buscar produção acadêmica' }));
        }
        return;
    }

    if (pathname === '/gestaoibii/api/producao-academica' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['titulo', 'tipo_nivel', 'autor', 'orientador', 'projeto'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }
                const ano = parseInt(dados.ano, 10);
                const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                const query = `
                    INSERT INTO producao_academica (titulo, subtitulo, tipo_nivel, autor, orientador, projeto, ano)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;
                const values = [
                    String(dados.titulo).trim(),
                    dados.subtitulo ? String(dados.subtitulo).trim() : '',
                    String(dados.tipo_nivel).trim(),
                    String(dados.autor).trim(),
                    String(dados.orientador).trim(),
                    String(dados.projeto).trim(),
                    anoFinal
                ];

                const result = await pool.query(query, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Prêmios
    // ============================================================
    if (pathname === '/gestaoibii/api/premios' && req.method === 'GET') {
        try {
            const ano = parsedUrl.searchParams.get('ano');
            const natureza = parsedUrl.searchParams.get('natureza');
            let query = 'SELECT * FROM premios WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (ano) {
                query += ` AND EXTRACT(YEAR FROM data_concessao) = $${paramIndex++}`;
                params.push(parseInt(ano, 10));
            }
            if (natureza) {
                query += ` AND LOWER(natureza_area) = LOWER($${paramIndex++})`;
                params.push(natureza);
            }
            query += ' ORDER BY id DESC';

            const result = await pool.query(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: 'Erro ao buscar prêmios' }));
        }
        return;
    }

    if (pathname === '/gestaoibii/api/premios' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['nome', 'natureza_area', 'integrantes', 'instituicao', 'projeto', 'conformidade_ib', 'data_concessao'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }

                const query = `
                    INSERT INTO premios (nome, trabalho, natureza_area, integrantes, instituicao, projeto, conformidade_ib, data_concessao)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *;
                `;
                const values = [
                    String(dados.nome).trim(),
                    dados.trabalho ? String(dados.trabalho).trim() : '',
                    String(dados.natureza_area).trim(),
                    String(dados.integrantes).trim(),
                    String(dados.instituicao).trim(),
                    String(dados.projeto).trim(),
                    String(dados.conformidade_ib).trim(),
                    String(dados.data_concessao).trim()
                ];

                const result = await pool.query(query, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Produção Técnica e Tecnológica
    // ============================================================
    if (pathname === '/gestaoibii/api/producao-tecnologica' && req.method === 'GET') {
        try {
            const ano = parsedUrl.searchParams.get('ano');
            const tipo = parsedUrl.searchParams.get('tipo');
            let query = 'SELECT * FROM producao_tecnologica WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (ano) {
                query += ` AND ano = $${paramIndex++}`;
                params.push(parseInt(ano, 10));
            }
            if (tipo) {
                query += ` AND LOWER(tipo) = LOWER($${paramIndex++})`;
                params.push(tipo);
            }
            query += ' ORDER BY id DESC';

            const result = await pool.query(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: 'Erro ao buscar produção tecnológica' }));
        }
        return;
    }

    if (pathname === '/gestaoibii/api/producao-tecnologica' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['titulo', 'tipo', 'autores', 'instituicao', 'projeto', 'conformidade_ib'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }
                const ano = parseInt(dados.ano, 10);
                const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;
                const trl = parseInt(dados.trl, 10);
                const trlFinal = isNaN(trl) ? null : Math.min(9, Math.max(1, trl));

                const query = `
                    INSERT INTO producao_tecnologica (titulo, numero, tipo, trl, autores, instituicao, projeto, conformidade_ib, ano)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING *;
                `;
                const values = [
                    String(dados.titulo).trim(),
                    dados.numero ? String(dados.numero).trim() : '',
                    String(dados.tipo).trim(),
                    trlFinal,
                    String(dados.autores).trim(),
                    String(dados.instituicao).trim(),
                    String(dados.projeto).trim(),
                    String(dados.conformidade_ib).trim(),
                    anoFinal
                ];

                const result = await pool.query(query, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Outras Produções
    // ============================================================
    if (pathname === '/gestaoibii/api/producoes-outros' && req.method === 'GET') {
        try {
            const ano = parsedUrl.searchParams.get('ano');
            const natureza = parsedUrl.searchParams.get('natureza');
            let query = 'SELECT * FROM producoes_outros WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (ano) {
                query += ` AND ano = $${paramIndex++}`;
                params.push(parseInt(ano, 10));
            }
            if (natureza) {
                query += ` AND LOWER(natureza) = LOWER($${paramIndex++})`;
                params.push(natureza);
            }
            query += ' ORDER BY id DESC';

            const result = await pool.query(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: 'Erro ao buscar outras produções' }));
        }
        return;
    }

    if (pathname === '/gestaoibii/api/producoes-outros' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['titulo', 'natureza', 'autores', 'instituicao', 'projeto', 'conformidade_ib'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }
                const ano = parseInt(dados.ano, 10);
                const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                const query = `
                    INSERT INTO producoes_outros (titulo, descricao, natureza, autores, instituicao, projeto, conformidade_ib, ano)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *;
                `;
                const values = [
                    String(dados.titulo).trim(),
                    dados.descricao ? String(dados.descricao).trim() : '',
                    String(dados.natureza).trim(),
                    String(dados.autores).trim(),
                    String(dados.instituicao).trim(),
                    String(dados.projeto).trim(),
                    String(dados.conformidade_ib).trim(),
                    anoFinal
                ];

                const result = await pool.query(query, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
            }
        });
        return;
    }

    // Rotas amigáveis dos módulos da Produção Científica
    const caminhoNormalizado = pathname !== '/' && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;
    const mapaPaginas = {
        '/producao-cientifica': path.join(__dirname, 'modulos', 'publicacoes', 'index.html'),
        '/producao-cientifica/publicacoes': path.join(__dirname, 'modulos', 'publicacoes', 'index.html'),
        '/producao-cientifica/producao-academica': path.join(__dirname, 'modulos', 'producao-academica', 'index.html'),
        '/producao-cientifica/premios': path.join(__dirname, 'modulos', 'premios', 'index.html'),
        '/producao-cientifica/producao-tecnologica': path.join(__dirname, 'modulos', 'producao-tecnologica', 'index.html'),
        '/producao-cientifica/producoes-outros': path.join(__dirname, 'modulos', 'producoes-outros', 'index.html')
    };
    const paginaPath = mapaPaginas[caminhoNormalizado];
    if (paginaPath) {
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
