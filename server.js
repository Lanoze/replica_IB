const http = require('http');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const { Pool } = pg;
const { inicializarBanco } = require('./db-setup');

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

                //Usuário não admin sem módulo definido só tem acesso ao dashboard
                if (user.role !== 'admin' && userModules.length === 0) {
                    userModules = ['dashboard'];
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

    if (req.url === '/gestaoibii/api/auth/me' && req.method === 'GET') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ detail: 'Não autenticado' }));
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Helper para extrair ID de rotas como /api/tabela/123
    const matchIdRoute = (basePath) => {
        if (pathname.startsWith(basePath + '/')) {
            const idStr = pathname.slice(basePath.length + 1);
            const id = parseInt(idStr, 10);
            return isNaN(id) ? null : id;
        }
        return null;
    };

    // ============================================================
    // Módulo: Produção Científica » Publicações
    // ============================================================
    const pubId = matchIdRoute('/gestaoibii/api/publicacoes');
    if (pathname === '/gestaoibii/api/publicacoes' || (pubId !== null && pathname === `/gestaoibii/api/publicacoes/${pubId}`)) {
        if (req.method === 'GET') {
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao buscar publicações' }));
            }
            return;
        }

        if (req.method === 'POST') {
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
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
                }
            });
            return;
        }

        if (req.method === 'PUT' && pubId !== null) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const dados = JSON.parse(body);
                    const ano = parseInt(dados.ano, 10);
                    const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                    const query = `
                        UPDATE publicacoes
                        SET titulo = $1, natureza = $2, status = $3, veiculo = $4, projeto = $5, conformidade_ib = $6, ano = $7
                        WHERE id = $8
                        RETURNING *;
                    `;
                    const values = [
                        String(dados.titulo).trim(),
                        String(dados.natureza).trim(),
                        String(dados.status).trim(),
                        String(dados.veiculo).trim(),
                        String(dados.projeto).trim(),
                        String(dados.conformidade_ib).trim(),
                        anoFinal,
                        pubId
                    ];

                    const result = await pool.query(query, values);
                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ detail: 'Publicação não encontrada' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Erro ao atualizar publicação' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE' && pubId !== null) {
            try {
                const result = await pool.query('DELETE FROM publicacoes WHERE id = $1 RETURNING *;', [pubId]);
                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Publicação não encontrada' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao deletar publicação' }));
            }
            return;
        }
    }

    // ============================================================
    // Módulo: Produção Científica » Produção Acadêmica
    // ============================================================
    const acadId = matchIdRoute('/gestaoibii/api/producao-academica');
    if (pathname === '/gestaoibii/api/producao-academica' || (acadId !== null && pathname === `/gestaoibii/api/producao-academica/${acadId}`)) {
        if (req.method === 'GET') {
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao buscar produção acadêmica' }));
            }
            return;
        }

        if (req.method === 'POST') {
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
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
                }
            });
            return;
        }

        if (req.method === 'PUT' && acadId !== null) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const dados = JSON.parse(body);
                    const ano = parseInt(dados.ano, 10);
                    const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                    const query = `
                        UPDATE producao_academica
                        SET titulo = $1, subtitulo = $2, tipo_nivel = $3, autor = $4, orientador = $5, projeto = $6, ano = $7
                        WHERE id = $8
                        RETURNING *;
                    `;
                    const values = [
                        String(dados.titulo).trim(),
                        dados.subtitulo ? String(dados.subtitulo).trim() : '',
                        String(dados.tipo_nivel).trim(),
                        String(dados.autor).trim(),
                        String(dados.orientador).trim(),
                        String(dados.projeto).trim(),
                        anoFinal,
                        acadId
                    ];

                    const result = await pool.query(query, values);
                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ detail: 'Trabalho acadêmico não encontrado' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Erro ao atualizar produção acadêmica' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE' && acadId !== null) {
            try {
                const result = await pool.query('DELETE FROM producao_academica WHERE id = $1 RETURNING *;', [acadId]);
                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Trabalho acadêmico não encontrado' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao deletar produção acadêmica' }));
            }
            return;
        }
    }

    // ============================================================
    // Módulo: Produção Científica » Prêmios
    // ============================================================
    const premioId = matchIdRoute('/gestaoibii/api/premios');
    if (pathname === '/gestaoibii/api/premios' || (premioId !== null && pathname === `/gestaoibii/api/premios/${premioId}`)) {
        if (req.method === 'GET') {
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao buscar prêmios' }));
            }
            return;
        }

        if (req.method === 'POST') {
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
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
                }
            });
            return;
        }

        if (req.method === 'PUT' && premioId !== null) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const dados = JSON.parse(body);
                    const query = `
                        UPDATE premios
                        SET nome = $1, trabalho = $2, natureza_area = $3, integrantes = $4, instituicao = $5, projeto = $6, conformidade_ib = $7, data_concessao = $8
                        WHERE id = $9
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
                        String(dados.data_concessao).trim(),
                        premioId
                    ];

                    const result = await pool.query(query, values);
                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ detail: 'Prêmio não encontrado' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Erro ao atualizar prêmio' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE' && premioId !== null) {
            try {
                const result = await pool.query('DELETE FROM premios WHERE id = $1 RETURNING *;', [premioId]);
                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Prêmio não encontrado' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao deletar prêmio' }));
            }
            return;
        }
    }

    // ============================================================
    // Módulo: Produção Científica » Produção Técnica e Tecnológica
    // ============================================================
    const tecId = matchIdRoute('/gestaoibii/api/producao-tecnologica');
    if (pathname === '/gestaoibii/api/producao-tecnologica' || (tecId !== null && pathname === `/gestaoibii/api/producao-tecnologica/${tecId}`)) {
        if (req.method === 'GET') {
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao buscar produção tecnológica' }));
            }
            return;
        }

        if (req.method === 'POST') {
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
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
                }
            });
            return;
        }

        if (req.method === 'PUT' && tecId !== null) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const dados = JSON.parse(body);
                    const ano = parseInt(dados.ano, 10);
                    const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;
                    const trl = parseInt(dados.trl, 10);
                    const trlFinal = isNaN(trl) ? null : Math.min(9, Math.max(1, trl));

                    const query = `
                        UPDATE producao_tecnologica
                        SET titulo = $1, numero = $2, tipo = $3, trl = $4, autores = $5, instituicao = $6, projeto = $7, conformidade_ib = $8, ano = $9
                        WHERE id = $10
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
                        anoFinal,
                        tecId
                    ];

                    const result = await pool.query(query, values);
                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ detail: 'Produção tecnológica não encontrada' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Erro ao atualizar produção tecnológica' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE' && tecId !== null) {
            try {
                const result = await pool.query('DELETE FROM producao_tecnologica WHERE id = $1 RETURNING *;', [tecId]);
                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Produção tecnológica não encontrada' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao deletar produção tecnológica' }));
            }
            return;
        }
    }

    // ============================================================
    // Módulo: Produção Científica » Outras Produções
    // ============================================================
    const outroId = matchIdRoute('/gestaoibii/api/producoes-outros');
    if (pathname === '/gestaoibii/api/producoes-outros' || (outroId !== null && pathname === `/gestaoibii/api/producoes-outros/${outroId}`)) {
        if (req.method === 'GET') {
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao buscar outras produções' }));
            }
            return;
        }

        if (req.method === 'POST') {
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
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Corpo da requisição inválido ou erro no banco' }));
                }
            });
            return;
        }

        if (req.method === 'PUT' && outroId !== null) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const dados = JSON.parse(body);
                    const ano = parseInt(dados.ano, 10);
                    const anoFinal = isNaN(ano) ? new Date().getFullYear() : ano;

                    const query = `
                        UPDATE producoes_outros
                        SET titulo = $1, descricao = $2, natureza = $3, autores = $4, instituicao = $5, projeto = $6, conformidade_ib = $7, ano = $8
                        WHERE id = $9
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
                        anoFinal,
                        outroId
                    ];

                    const result = await pool.query(query, values);
                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ detail: 'Outra produção não encontrada' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Erro ao atualizar outra produção' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE' && outroId !== null) {
            try {
                const result = await pool.query('DELETE FROM producoes_outros WHERE id = $1 RETURNING *;', [outroId]);
                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: 'Outra produção não encontrada' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Erro ao deletar outra produção' }));
            }
            return;
        }
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

// Inicializa o banco automaticamente antes de subir o servidor
inicializarBanco().then(() => {
    server.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`Servidor rodando com sucesso!`);
        console.log(`Acesse no navegador: http://localhost:${PORT}/pagina.html`);
        console.log(`====================================================`);
    });
});
