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

// ============================================================
// Módulo: Produção Científica » Produção Acadêmica (mock data)
// ============================================================
let producaoAcademica = [
    {
        id: 1,
        titulo: 'Arquitetura de Computação de Borda para Analítica em Tempo Real em Redes de Distribuição Inteligentes',
        subtitulo: 'Uma abordagem baseada em aprendizado federado',
        tipo_nivel: 'Tese de Doutorado',
        autor: 'Ana Beatriz Souza',
        orientador: 'Prof. Dr. Carlos Menezes',
        projeto: 'P021 — Sistema de Medição Inteligente',
        ano: 2025
    },
    {
        id: 2,
        titulo: 'Detecção de Perdas não Técnicas em Redes de Baixa Tensão',
        subtitulo: 'Estudo de caso com dados reais de uma distribuidora nacional',
        tipo_nivel: 'Dissertação de Mestrado',
        autor: 'Rafael Lima',
        orientador: 'Profa. Dra. Helena Costa',
        projeto: 'P018 — Microrredes Urbanas',
        ano: 2024
    },
    {
        id: 3,
        titulo: 'Governança e Conformidade em Projetos Estratégicos de P&D ANEEL',
        subtitulo: '',
        tipo_nivel: 'Monografia',
        autor: 'Marina Duarte',
        orientador: 'Prof. Me. Paulo Rocha',
        projeto: 'P032 — Governança de P&D ANEEL',
        ano: 2023
    },
    {
        id: 4,
        titulo: 'Infraestrutura IoT para Telemedição em Áreas Rurais',
        subtitulo: 'Avaliação de desempenho de protocolos LPWAN',
        tipo_nivel: 'Dissertação de Mestrado',
        autor: 'João Pedro Alves',
        orientador: 'Prof. Dr. Carlos Menezes',
        projeto: 'P025 — Infraestrutura de Medição IoT',
        ano: 2025
    }
];
let proximoIdAcademico = producaoAcademica.length + 1;

// ============================================================
// Módulo: Produção Científica » Prêmios (mock data)
// ============================================================
let premios = [
    {
        id: 1,
        nome: 'Prêmio ANEEL de Excelência em P&D',
        trabalho: 'Sistema de Medição Inteligente — Projeto P021',
        natureza_area: 'Prêmio',
        integrantes: 'Equipe do projeto P021 (12 colaboradores)',
        instituicao: 'ANEEL — Agência Nacional de Energia Elétrica',
        projeto: 'P021 — Sistema de Medição Inteligente',
        conformidade_ib: 'Sim',
        data_concessao: '2024-11-18'
    },
    {
        id: 2,
        nome: 'Menção Honrosa — Congresso Brasileiro de Sistemas Elétricos',
        trabalho: 'Detecção de Perdas não Técnicas em Redes de Baixa Tensão',
        natureza_area: 'Menção Honrosa',
        integrantes: 'Ana Beatriz Souza; Rafael Lima',
        instituicao: 'CBSE — Congresso Brasileiro de Sistemas Elétricos',
        projeto: 'P018 — Microrredes Urbanas',
        conformidade_ib: 'Pendente',
        data_concessao: '2025-05-22'
    },
    {
        id: 3,
        nome: 'Homenagem Comemorativa aos 25 anos do INESC P&D Brasil',
        trabalho: '',
        natureza_area: 'Homenagem',
        integrantes: 'Fundadores e colaboradores veteranos',
        instituicao: 'INESC P&D Brasil — Instituto Nacional de Energia Elétrica',
        projeto: 'Institucional',
        conformidade_ib: 'Não',
        data_concessao: '2023-09-10'
    },
    {
        id: 4,
        nome: 'Prêmio Innovare de Tecnologia Aplicada',
        trabalho: 'Infraestrutura IoT para Telemedição em Áreas Rurais',
        natureza_area: 'Prêmio',
        integrantes: 'João Pedro Alves; Marina Duarte',
        instituicao: 'Confederação Nacional da Indústria (CNI)',
        projeto: 'P025 — Infraestrutura de Medição IoT',
        conformidade_ib: 'Sim',
        data_concessao: '2025-03-14'
    }
];
let proximoIdPremio = premios.length + 1;

// ============================================================
// Módulo: Produção Científica » Produção Técnica e Tecnológica (mock data)
// ============================================================
let producaoTecnologica = [
    {
        id: 1,
        titulo: 'Sensor Inteligente de Corrente para Medição Distribuída',
        numero: 'PI 10 2025 001234-5 (INPI)',
        tipo: 'Patente',
        trl: 6,
        autores: 'Ana Beatriz Souza; Carlos Menezes; Equipe P021',
        instituicao: 'INESC P&D Brasil / INPI',
        projeto: 'P021 — Sistema de Medição Inteligente',
        conformidade_ib: 'Sim',
        ano: 2025
    },
    {
        id: 2,
        titulo: 'Plataforma GIB Analytics de Gestão de P&D',
        numero: 'Registro BR512025001234-0',
        tipo: 'Registro de Software',
        trl: 8,
        autores: 'Rafael Lima; Marina Duarte',
        instituicao: 'INESC P&D Brasil',
        projeto: 'P018 — Microrredes Urbanas',
        conformidade_ib: 'Pendente',
        ano: 2024
    },
    {
        id: 3,
        titulo: 'Protótipo de Estação de Recarga Residencial Compacta',
        numero: 'PROTO-P018-03',
        tipo: 'Protótipo',
        trl: 7,
        autores: 'João Pedro Alves; Helena Costa',
        instituicao: 'INESC P&D Brasil — Laboratório de Microrredes',
        projeto: 'P018 — Microrredes Urbanas',
        conformidade_ib: 'Não',
        ano: 2025
    },
    {
        id: 4,
        titulo: 'Kit de Telemedição Rural LPWAN',
        numero: 'PROD-P025-01',
        tipo: 'Produto Tecnológico',
        trl: 9,
        autores: 'Equipe do projeto P025',
        instituicao: 'INESC P&D Brasil',
        projeto: 'P025 — Infraestrutura de Medição IoT',
        conformidade_ib: 'Sim',
        ano: 2023
    }
];
let proximoIdTecnologico = producaoTecnologica.length + 1;

// ============================================================
// Módulo: Produção Científica » Outras Produções (mock data)
// ============================================================
let producoesOutros = [
    {
        id: 1,
        titulo: 'Capacitação em Boas Práticas de Laboratório',
        descricao: 'Curso interno com certificação para 30 colaboradores',
        natureza: 'Capacitação',
        autores: 'Equipe de Qualidade INESC',
        instituicao: 'INESC P&D Brasil',
        projeto: 'Institucional',
        conformidade_ib: 'Sim',
        ano: 2024
    },
    {
        id: 2,
        titulo: 'Método de Avaliação de Maturidade em P&D ANEEL',
        descricao: 'Metodologia proprietária de avaliação por estágios de maturidade',
        natureza: 'Método',
        autores: 'Marina Duarte; Carlos Menezes',
        instituicao: 'INESC P&D Brasil',
        projeto: 'P032 — Governança de P&D ANEEL',
        conformidade_ib: 'Sim',
        ano: 2025
    },
    {
        id: 3,
        titulo: 'Framework GIB-Analytics v2',
        descricao: 'Biblioteca interna de análise de dados de medição inteligente',
        natureza: 'Framework',
        autores: 'Rafael Lima',
        instituicao: 'INESC P&D Brasil',
        projeto: 'P018 — Microrredes Urbanas',
        conformidade_ib: 'Pendente',
        ano: 2024
    },
    {
        id: 4,
        titulo: 'Relatório Técnico: Viabilidade LPWAN em Áreas Rurais',
        descricao: 'Estudo comparativo LoRaWAN vs NB-IoT para telemedição',
        natureza: 'Relatório Técnico',
        autores: 'João Pedro Alves; Helena Costa',
        instituicao: 'INESC P&D Brasil — Coordenação de Inovação',
        projeto: 'P025 — Infraestrutura de Medição IoT',
        conformidade_ib: 'Não',
        ano: 2023
    },
    {
        id: 5,
        titulo: 'Acervo Fotográfico dos Projetos 2023–2025',
        descricao: '',
        natureza: 'Produção Diversa',
        autores: 'Comunicação INESC',
        instituicao: 'INESC P&D Brasil',
        projeto: 'Institucional',
        conformidade_ib: 'Sim',
        ano: 2025
    }
];
let proximoIdOutros = producoesOutros.length + 1;

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

    // ============================================================
    // Módulo: Produção Científica » Produção Acadêmica
    // ============================================================

    // GET /gestaoibii/api/producao-academica — listagem (filtros opcionais: ?ano=&tipo=)
    if (pathname === '/gestaoibii/api/producao-academica' && req.method === 'GET') {
        let lista = producaoAcademica;
        const ano = parsedUrl.searchParams.get('ano');
        const tipo = parsedUrl.searchParams.get('tipo');
        if (ano) lista = lista.filter(t => String(t.ano) === ano);
        if (tipo) lista = lista.filter(t => t.tipo_nivel.toLowerCase() === tipo.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lista));
        return;
    }

    // POST /gestaoibii/api/producao-academica — cadastro de novo trabalho acadêmico
    if (pathname === '/gestaoibii/api/producao-academica' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
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
                const novo = {
                    id: proximoIdAcademico++,
                    titulo: String(dados.titulo).trim(),
                    subtitulo: dados.subtitulo ? String(dados.subtitulo).trim() : '',
                    tipo_nivel: String(dados.tipo_nivel).trim(),
                    autor: String(dados.autor).trim(),
                    orientador: String(dados.orientador).trim(),
                    projeto: String(dados.projeto).trim(),
                    ano: isNaN(ano) ? new Date().getFullYear() : ano
                };
                producaoAcademica.push(novo);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(novo));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Prêmios
    // ============================================================

    // GET /gestaoibii/api/premios — listagem (filtros opcionais: ?ano=&natureza=)
    if (pathname === '/gestaoibii/api/premios' && req.method === 'GET') {
        let lista = premios;
        const ano = parsedUrl.searchParams.get('ano');
        const natureza = parsedUrl.searchParams.get('natureza');
        if (ano) lista = lista.filter(p => String(p.data_concessao).substring(0, 4) === ano);
        if (natureza) lista = lista.filter(p => p.natureza_area.toLowerCase() === natureza.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lista));
        return;
    }

    // POST /gestaoibii/api/premios — cadastro de novo prêmio/homenagem
    if (pathname === '/gestaoibii/api/premios' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const dados = JSON.parse(body);
                const camposObrigatorios = ['nome', 'natureza_area', 'integrantes', 'instituicao', 'projeto', 'conformidade_ib', 'data_concessao'];
                const faltando = camposObrigatorios.filter(c => !dados[c] || !String(dados[c]).trim());
                if (faltando.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ detail: `Campos obrigatórios ausentes: ${faltando.join(', ')}` }));
                    return;
                }
                const novo = {
                    id: proximoIdPremio++,
                    nome: String(dados.nome).trim(),
                    trabalho: dados.trabalho ? String(dados.trabalho).trim() : '',
                    natureza_area: String(dados.natureza_area).trim(),
                    integrantes: String(dados.integrantes).trim(),
                    instituicao: String(dados.instituicao).trim(),
                    projeto: String(dados.projeto).trim(),
                    conformidade_ib: String(dados.conformidade_ib).trim(),
                    data_concessao: String(dados.data_concessao).trim()
                };
                premios.push(novo);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(novo));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Produção Técnica e Tecnológica
    // ============================================================

    // GET /gestaoibii/api/producao-tecnologica — listagem (filtros opcionais: ?ano=&tipo=)
    if (pathname === '/gestaoibii/api/producao-tecnologica' && req.method === 'GET') {
        let lista = producaoTecnologica;
        const ano = parsedUrl.searchParams.get('ano');
        const tipo = parsedUrl.searchParams.get('tipo');
        if (ano) lista = lista.filter(p => String(p.ano) === ano);
        if (tipo) lista = lista.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lista));
        return;
    }

    // POST /gestaoibii/api/producao-tecnologica — cadastro de nova produção técnica/tecnológica
    if (pathname === '/gestaoibii/api/producao-tecnologica' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
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
                const trl = parseInt(dados.trl, 10);
                const novo = {
                    id: proximoIdTecnologico++,
                    titulo: String(dados.titulo).trim(),
                    numero: dados.numero ? String(dados.numero).trim() : '',
                    tipo: String(dados.tipo).trim(),
                    trl: isNaN(trl) ? null : Math.min(9, Math.max(1, trl)),
                    autores: String(dados.autores).trim(),
                    instituicao: String(dados.instituicao).trim(),
                    projeto: String(dados.projeto).trim(),
                    conformidade_ib: String(dados.conformidade_ib).trim(),
                    ano: isNaN(ano) ? new Date().getFullYear() : ano
                };
                producaoTecnologica.push(novo);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(novo));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido' }));
            }
        });
        return;
    }

    // ============================================================
    // Módulo: Produção Científica » Outras Produções
    // ============================================================

    // GET /gestaoibii/api/producoes-outros — listagem (filtros opcionais: ?ano=&natureza=)
    if (pathname === '/gestaoibii/api/producoes-outros' && req.method === 'GET') {
        let lista = producoesOutros;
        const ano = parsedUrl.searchParams.get('ano');
        const natureza = parsedUrl.searchParams.get('natureza');
        if (ano) lista = lista.filter(p => String(p.ano) === ano);
        if (natureza) lista = lista.filter(p => p.natureza.toLowerCase() === natureza.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lista));
        return;
    }

    // POST /gestaoibii/api/producoes-outros — cadastro de nova produção diversa
    if (pathname === '/gestaoibii/api/producoes-outros' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
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
                const novo = {
                    id: proximoIdOutros++,
                    titulo: String(dados.titulo).trim(),
                    descricao: dados.descricao ? String(dados.descricao).trim() : '',
                    natureza: String(dados.natureza).trim(),
                    autores: String(dados.autores).trim(),
                    instituicao: String(dados.instituicao).trim(),
                    projeto: String(dados.projeto).trim(),
                    conformidade_ib: String(dados.conformidade_ib).trim(),
                    ano: isNaN(ano) ? new Date().getFullYear() : ano
                };
                producoesOutros.push(novo);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(novo));
            } catch (err) {
                console.error(err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ detail: 'Corpo da requisição inválido' }));
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
