const { Pool } = require('pg');

async function inicializarBanco() {
    // 1. Conectar ao banco padrão 'postgres' para verificar/criar o banco 'replica_ib'
    const adminPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
    });

    try {
        const resDb = await adminPool.query("SELECT 1 FROM pg_database WHERE datname = 'replica_ib'");
        if (resDb.rows.length === 0) {
            console.log('📦 Banco de dados "replica_ib" não encontrado. Criando automaticamente...');
            await adminPool.query('CREATE DATABASE replica_ib;');
            console.log('✅ Banco de dados "replica_ib" criado com sucesso!');
        }else{
            console.log('O banco de dados já existia, ele será usado');
        }
    } catch (err) {
        console.error('⚠️ Aviso ao verificar/criar banco de dados:', err.message);
    } finally {
        await adminPool.end();
    }

    // 2. Conectar ao banco 'replica_ib' para verificar/criar tabelas e popular dados
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'replica_ib',
        password: 'postgres',
        port: 5432,
    });

    try {
        console.log('⚙️ Verificando e criando tabelas necessárias...');

        // Tabela Usuários
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                ativo BOOLEAN DEFAULT TRUE,
                role VARCHAR(50) DEFAULT 'admin',
                modules TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Inserir usuários padrão (Administrador, Lorenzo e Zé)
        await pool.query(`
            INSERT INTO usuarios (nome, email, senha, role, modules) 
            VALUES ('Administrador', 'admin@admin.com', '123456', 'admin', NULL)
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;
        `);
        await pool.query(`
            INSERT INTO usuarios (nome, email, senha, role, modules) 
            VALUES ('Arthur', 'arthur@inesc.br', 'arthur101', 'publi', '["dashboard","producao-cientifica", "ferramentas"]')
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, modules = EXCLUDED.modules;
        `);
        await pool.query(`
            INSERT INTO usuarios (nome, email, senha, role, modules) 
            VALUES ('Ze', 'Ze@.com', 'zeu', 'invasor', '["dashboard","diretoria","cadastro","patrimonio"]')
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, modules = EXCLUDED.modules;
        `);
        await pool.query(`
            INSERT INTO usuarios (nome, email, senha, role, modules) 
            VALUES ('Lorenzo', 'lorenzo@inesc.br', 'lorenzo101', 'publi', '["dashboard", "producao-cientifica"]')
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, modules = EXCLUDED.modules;
        `);
        await pool.query(`
            INSERT INTO usuarios (nome, email, senha, role, modules) 
            VALUES ('anônimo', 'anon@mail', 'an123', 'hacker', '[]')
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, modules = EXCLUDED.modules;
        `);
        

        // Tabela Publicações
        await pool.query(`
            CREATE TABLE IF NOT EXISTS publicacoes (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                natureza VARCHAR(100) NOT NULL,
                status VARCHAR(100) NOT NULL,
                veiculo TEXT NOT NULL,
                projeto TEXT NOT NULL,
                conformidade_ib VARCHAR(50) NOT NULL,
                ano INTEGER NOT NULL
            );
        `);

        // Tabela Produção Acadêmica
        await pool.query(`
            CREATE TABLE IF NOT EXISTS producao_academica (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                subtitulo TEXT,
                tipo_nivel VARCHAR(100) NOT NULL,
                autor TEXT NOT NULL,
                orientador TEXT NOT NULL,
                projeto TEXT NOT NULL,
                ano INTEGER NOT NULL
            );
        `);

        // Tabela Prêmios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS premios (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                trabalho TEXT,
                natureza_area VARCHAR(100) NOT NULL,
                integrantes TEXT NOT NULL,
                instituicao TEXT NOT NULL,
                projeto TEXT NOT NULL,
                conformidade_ib VARCHAR(50) NOT NULL,
                data_concessao DATE NOT NULL
            );
        `);

        // Tabela Produção Técnica e Tecnológica
        await pool.query(`
            CREATE TABLE IF NOT EXISTS producao_tecnologica (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                numero TEXT,
                tipo VARCHAR(100) NOT NULL,
                trl INTEGER,
                autores TEXT NOT NULL,
                instituicao TEXT NOT NULL,
                projeto TEXT NOT NULL,
                conformidade_ib VARCHAR(50) NOT NULL,
                ano INTEGER NOT NULL
            );
        `);

        // Tabela Outras Produções
        await pool.query(`
            CREATE TABLE IF NOT EXISTS producoes_outros (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                descricao TEXT,
                natureza VARCHAR(100) NOT NULL,
                autores TEXT NOT NULL,
                instituicao TEXT NOT NULL,
                projeto TEXT NOT NULL,
                conformidade_ib VARCHAR(50) NOT NULL,
                ano INTEGER NOT NULL
            );
        `);

        // Popular dados iniciais se as tabelas estiverem vazias
        const resPub = await pool.query('SELECT COUNT(*) FROM publicacoes');
        if (parseInt(resPub.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano) VALUES
                ('Smart Grid Analytics: Detecção de Perdas não Técnicas em Redes de Distribuição Usando Machine Learning', 'Journal', 'Publicado', 'IEEE Transactions on Smart Grid', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
                ('Otimização do Fluxo de Potência em Microrredes com Geração Solar Fotovoltaica e Armazenamento', 'Conferência', 'Aceito', 'IEEE PES Innovative Smart Grid Technologies (ISGT)', 'P018 — Microrredes Urbanas', 'Pendente', 2025),
                ('IoT aplicado à Telemedição: Revisão Sistemática e Perspectivas para o Setor Elétrico Brasileiro', 'Periódico', 'Em Revisão', 'Revista Controle & Automação', 'P025 — Infraestrutura de Medição IoT', 'Não', 2025),
                ('Metodologia de Avaliação de Conformidade ANEEL para Projetos de P&D com Base Patrimonial', 'Journal', 'Submetido', 'Journal of Control, Automation and Electrical Systems', 'P032 — Governança de P&D ANEEL', 'Pendente', 2023);
            `);
        }

        const resAcad = await pool.query('SELECT COUNT(*) FROM producao_academica');
        if (parseInt(resAcad.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO producao_academica (titulo, subtitulo, tipo_nivel, autor, orientador, projeto, ano) VALUES
                ('Arquitetura de Computação de Borda para Analítica em Tempo Real em Redes de Distribuição Inteligentes', 'Uma abordagem baseada em aprendizado federado', 'Tese de Doutorado', 'Ana Beatriz Souza', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2025),
                ('Detecção de Perdas não Técnicas em Redes de Baixa Tensão', 'Estudo de caso com dados reais de uma distribuidora nacional', 'Dissertação de Mestrado', 'Rafael Lima', 'Profa. Dra. Helena Costa', 'P018 — Microrredes Urbanas', 2024),
                ('Governança e Conformidade em Projetos Estratégicos de P&D ANEEL', '', 'Monografia', 'Marina Duarte', 'Prof. Me. Paulo Rocha', 'P032 — Governança de P&D ANEEL', 2023),
                ('Infraestrutura IoT para Telemedição em Áreas Rurais', 'Avaliação de desempenho de protocolos LPWAN', 'Dissertação de Mestrado', 'João Pedro Alves', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2025);
            `);
        }

        const resPrem = await pool.query('SELECT COUNT(*) FROM premios');
        if (parseInt(resPrem.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO premios (nome, trabalho, natureza_area, integrantes, instituicao, projeto, conformidade_ib, data_concessao) VALUES
                ('Prêmio ANEEL de Excelência em P&D', 'Sistema de Medição Inteligente — Projeto P021', 'Prêmio', 'Equipe do projeto P021 (12 colaboradores)', 'ANEEL — Agência Nacional de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Sim', '2024-11-18'),
                ('Menção Honrosa — Congresso Brasileiro de Sistemas Elétricos', 'Detecção de Perdas não Técnicas em Redes de Baixa Tensão', 'Menção Honrosa', 'Ana Beatriz Souza; Rafael Lima', 'CBSE — Congresso Brasileiro de Sistemas Elétricos', 'P018 — Microrredes Urbanas', 'Pendente', '2025-05-22'),
                ('Homenagem Comemorativa aos 25 anos do INESC P&D Brasil', '', 'Homenagem', 'Fundadores e colaboradores veteranos', 'INESC P&D Brasil — Instituto Nacional de Energia Elétrica', 'Institucional', 'Não', '2023-09-10'),
                ('Prêmio Innovare de Tecnologia Aplicada', 'Infraestrutura IoT para Telemedição em Áreas Rurais', 'Prêmio', 'João Pedro Alves; Marina Duarte', 'Confederação Nacional da Indústria (CNI)', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-03-14');
            `);
        }

        const resTec = await pool.query('SELECT COUNT(*) FROM producao_tecnologica');
        if (parseInt(resTec.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO producao_tecnologica (titulo, numero, tipo, trl, autores, instituicao, projeto, conformidade_ib, ano) VALUES
                ('Sensor Inteligente de Corrente para Medição Distribuída', 'PI 10 2025 001234-5 (INPI)', 'Patente', 6, 'Ana Beatriz Souza; Carlos Menezes; Equipe P021', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
                ('Plataforma GIB Analytics de Gestão de P&D', 'Registro BR512025001234-0', 'Registro de Software', 8, 'Rafael Lima; Marina Duarte', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
                ('Protótipo de Estação de Recarga Residencial Compacta', 'PROTO-P018-03', 'Protótipo', 7, 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Não', 2025),
                ('Kit de Telemedição Rural LPWAN', 'PROD-P025-01', 'Produto Tecnológico', 9, 'Equive do projeto P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023);
            `);
        }

        const resOut = await pool.query('SELECT COUNT(*) FROM producoes_outros');
        if (parseInt(resOut.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO producoes_outros (titulo, descricao, natureza, autores, instituicao, projeto, conformidade_ib, ano) VALUES
                ('Capacitação em Boas Práticas de Laboratório', 'Curso interno com certificação para 30 colaboradores', 'Capacitação', 'Equipe de Qualidade INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
                ('Método de Avaliação de Maturidade em P&D ANEEL', 'Metodologia proprietária de avaliação por estágios de maturidade', 'Método', 'Marina Duarte; Carlos Menezes', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2025),
                ('Framework GIB-Analytics v2', 'Biblioteca interna de análise de dados de medição inteligente', 'Framework', 'Rafael Lima', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
                ('Relatório Técnico: Viabilidade LPWAN em Áreas Rurais', 'Estudo comparativo LoRaWAN vs NB-IoT para telemedição', 'Relatório Técnico', 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil — Coordenação de Inovação', 'P025 — Infraestrutura de Medição IoT', 'Não', 2023),
                ('Acervo Fotográfico dos Projetos 2023–2025', '', 'Produção Diversa', 'Comunicação INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2025);
            `);
        }

        console.log('✅ Banco de dados e tabelas verificados/configurados com sucesso!');
    } catch (err) {
        console.error('❌ Erro ao configurar tabelas no banco de dados:', err.message);
    } finally {
        await pool.end();
    }
}

module.exports = { inicializarBanco };
