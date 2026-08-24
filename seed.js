const pool = require('./db');

async function seed() {
    try {
        console.log('🌱 Iniciando seed com 20 registros por tabela...\n');

        // ============================================================
        // PUBLICAÇÕES (20 registros)
        // ============================================================
        console.log('📚 Inserindo publicações...');
        await pool.query(`DELETE FROM publicacoes`);
        await pool.query(`
            INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano) VALUES
            ('Smart Grid Analytics: Detecção de Perdas não Técnicas em Redes de Distribuição Usando Machine Learning', 'Journal', 'Publicado', 'IEEE Transactions on Smart Grid', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Otimização do Fluxo de Potência em Microrredes com Geração Solar Fotovoltaica e Armazenamento', 'Conferência', 'Aceito', 'IEEE PES Innovative Smart Grid Technologies (ISGT)', 'P018 — Microrredes Urbanas', 'Pendente', 2025),
            ('IoT aplicado à Telemedição: Revisão Sistemática e Perspectivas para o Setor Elétrico Brasileiro', 'Periódico', 'Em Revisão', 'Revista Controle & Automação', 'P025 — Infraestrutura de Medição IoT', 'Não', 2025),
            ('Metodologia de Avaliação de Conformidade ANEEL para Projetos de P&D com Base Patrimonial', 'Journal', 'Submetido', 'Journal of Control, Automation and Electrical Systems', 'P032 — Governança de P&D ANEEL', 'Pendente', 2023),
            ('Análise Comparativa de Protocolos de Comunicação para Redes de Distribuição Inteligentes', 'Journal', 'Publicado', 'IEEE Internet of Things Journal', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Modelo Preditivo de Falhas em Transformadores de Distribuição Baseado em Aprendizado Profundo', 'Conferência', 'Publicado', 'Proceedings of IEEE PES General Meeting', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Segmentação de Consumidores para Identificação de Perdas Não Técnicas com Redes Neurais', 'Periódico', 'Publicado', 'Revista Brasileira de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Gateway LoRaWAN para Telemedição em Áreas de Baixa Cobertura Celular', 'Conferência', 'Aceito', 'SBSE — Simpósio Brasileiro de Sistemas Elétricos', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Governança de Dados em Projetos de P&D Financiados pela ANEEL: Um Framework Proposto', 'Journal', 'Publicado', 'Energy Policy', 'P032 — Governança de P&D ANEEL', 'Sim', 2023),
            ('Energia Solar Distribuída em Microgrids Residenciais: Um Estudo de Viabilidade Técnico-Econômica', 'Periódico', 'Em Revisão', 'Renewable and Sustainable Energy Reviews', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Edge Computing para Análise de Qualidade de Energia em Tempo Real', 'Conferência', 'Publicado', 'IEEE International Conference on Edge Computing', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            (' Blockchain para Rastreabilidade de Certificados de Energia Renovável', 'Journal', 'Submetido', 'Applied Energy', 'P032 — Governança de P&D ANEEL', 'Pendente', 2025),
            ('Técnicas de federated Learning para Detecção de Anomalias em Medidores Inteligentes', 'Journal', 'Publicado', 'IEEE Transactions on Industrial Informatics', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Avaliação do Desempenho de Baterias LFP em Microrredes com Alto Penhor Solar', 'Conferência', 'Aceito', 'IEEE Energy Conversion Congress and Exposition', 'P018 — Microrredes Urbanas', 'Pendente', 2025),
            ('NB-IoT versus LoRaWAN para Telemedição Rural: Uma Análise Comparativa de Custo-Benefício', 'Periódico', 'Publicado', 'Sensors', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Dashboard Analítico para Monitoramento de Conformidade ANEEL em Projetos de P&D', 'Conferência', 'Publicado', 'Conferência Internacional de Gestão de Tecnologia', 'P032 — Governança de P&D ANEEL', 'Pendente', 2024),
            ('Redes Neurais Convolucionais para Classificação de Perfis de Consumo em BAIRROS Inteligentes', 'Journal', 'Publicado', 'Neural Computing and Applications', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Sistema de Proteção Coordernado para Microrredes com Geração Distribuída e Armazenamento', 'Conferência', 'Publicado', 'IEEE PES ISGT Latin America', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Protocolo MQTT Seguro para Redes de Medição Inteligente em Ambientes de Névoa de Computação', 'Journal', 'Em Revisão', 'Computer Networks', 'P025 — Infraestrutura de Medição IoT', 'Não', 2025),
            ('Indicadores de Maturidade em P&D para Projetos Regulatórios: Proposta de Modelo de Avaliação', 'Periódico', 'Publicado', 'R&D Management', 'P032 — Governança de P&D ANEEL', 'Sim', 2023);
        `);
        console.log('   ✅ 20 publicações inseridas');

        // ============================================================
        // PRODUÇÃO ACADÊMICA (20 registros)
        // ============================================================
        console.log('🎓 Inserindo produções acadêmicas...');
        await pool.query(`DELETE FROM producao_academica`);
        await pool.query(`
            INSERT INTO producao_academica (titulo, subtitulo, tipo_nivel, autor, orientador, projeto, ano) VALUES
            ('Arquitetura de Computação de Borda para Analítica em Tempo Real em Redes de Distribuição Inteligentes', 'Uma abordagem baseada em aprendizado federado', 'Tese de Doutorado', 'Ana Beatriz Souza', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2025),
            ('Detecção de Perdas não Técnicas em Redes de Baixa Tensão', 'Estudo de caso com dados reais de uma distribuidora nacional', 'Dissertação de Mestrado', 'Rafael Lima', 'Profa. Dra. Helena Costa', 'P018 — Microrredes Urbanas', 2024),
            ('Governança e Conformidade em Projetos Estratégicos de P&D ANEEL', '', 'Monografia', 'Marina Duarte', 'Prof. Me. Paulo Rocha', 'P032 — Governança de P&D ANEEL', 2023),
            ('Infraestrutura IoT para Telemedição em Áreas Rurais', 'Avaliação de desempenho de protocolos LPWAN', 'Dissertação de Mestrado', 'João Pedro Alves', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2025),
            ('Otimização de Sistemas de Armazenamento de Energia em Microrredes com Geração Fotovoltaica', 'Modelo de otimização multiobjetivo considerando custo e confiabilidade', 'Tese de Doutorado', 'Fernanda Oliveira', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2024),
            ('Machine Learning Aplicado à Previsão de Demanda em Redes de Distribuição Inteligentes', 'Comparação de algoritmos de aprendizado supervisionado', 'Dissertação de Mestrado', 'Lucas Mendes', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2023),
            ('Framework de Governança de Dados para Projetos de P&D Regulatórios no Setor Elétrico', '', 'Tese de Doutorado', 'Carlos Eduardo Silva', 'Prof. Dr. Antonio Ferreira', 'P032 — Governança de P&D ANEEL', 2025),
            ('Protocolo de Comunicação LPWAN para Redes de Medição Inteligente em Contextos Urbanos Densos', 'Avaliação de desempenho LoRaWAN vs Sigfox', 'Dissertação de Mestrado', 'Beatriz Santos', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2024),
            ('Simulação de Microrredes com Integracao de Veículos Elétricos e Geração Distribuída', '', 'Monografia', 'Pedro Henrique Costa', 'Prof. Me. Paulo Rocha', 'P018 — Microrredes Urbanas', 2023),
            ('Análise de Impacto da Geração Distribuída na Qualidade de Energia de Redes de Baixa Tensão', 'Estudo baseado em medições de campo', 'Tese de Doutorado', 'Mariana Almeida', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2025),
            ('Sistema de Alerta Precoce para Perdas Não Técnicas Baseado em Análise Estatística Multivariada', '', 'Dissertação de Mestrado', 'Thiago Rodrigues', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2024),
            ('Mapeamento de Boas Práticas de Gestão de Projetos de P&D no Setor Energético Brasileiro', '', 'Monografia', 'Camila Ferreira', 'Prof. Me. Paulo Rocha', 'P032 — Governança de P&D ANEEL', 2023),
            ('Avaliação de Maturidade Tecnológica de Soluções de Telemedição para o Setor Elétrico', '', 'Dissertação de Mestrado', 'Ricardo Fernandes', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2025),
            ('Integração de Sistemas de Armazenamento em Microrredes Ilhadas: Análise de Resiliência', '', 'Tese de Doutorado', 'Juliana Pereira', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2024),
            ('Detecção de Fraudes em Medidores de Energia Utilizando Técnicas de Aprendizado Não Supervisionado', '', 'Dissertação de Mestrado', 'Gabriel Martins', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2023),
            ('Modelo de Certificação de Conformidade ANEEL para Produtos de Medição Inteligente', '', 'Tese de Doutorado', 'Isabela Nascimento', 'Prof. Dr. Antonio Ferreira', 'P032 — Governança de P&D ANEEL', 2025),
            ('Deploy de Redes Mesh para Telemedição em Edifícios Comerciais de Alto Consumo', 'Avaliação de cobertura e latência', 'Monografia', 'Felipe Araújo', 'Prof. Me. Paulo Rocha', 'P025 — Infraestrutura de Medição IoT', 2024),
            ('Controle Inteligente de cargas não essenciais em Microrredes Residenciais com Geração Solar', '', 'Dissertação de Mestrado', 'Ana Carolina Ribeiro', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2023),
            ('Plataforma Analítica Baseada em Nuvem para Monitoramento de Projetos de P&D ANEEL', '', 'Tese de Doutorado', 'Daniel Nogueira', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2025),
            ('Estudo de Caso: Implementação de Telemedicina Rural via LPWAN em Comunidades Isoladas do Norte', '', 'Dissertação de Mestrado', 'Renata Campos', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2024);
        `);
        console.log('   ✅ 20 produções acadêmicas inseridas');

        // ============================================================
        // PRÊMIOS (20 registros)
        // ============================================================
        console.log('🏆 Inserindo prêmios...');
        await pool.query(`DELETE FROM premios`);
        await pool.query(`
            INSERT INTO premios (nome, trabalho, natureza_area, integrantes, instituicao, projeto, conformidade_ib, data_concessao) VALUES
            ('Prêmio ANEEL de Excelência em P&D', 'Sistema de Medição Inteligente — Projeto P021', 'Prêmio', 'Equipe do projeto P021 (12 colaboradores)', 'ANEEL — Agência Nacional de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Sim', '2024-11-18'),
            ('Menção Honrosa — Congresso Brasileiro de Sistemas Elétricos', 'Detecção de Perdas não Técnicas em Redes de Baixa Tensão', 'Menção Honrosa', 'Ana Beatriz Souza; Rafael Lima', 'CBSE — Congresso Brasileiro de Sistemas Elétricos', 'P018 — Microrredes Urbanas', 'Pendente', '2025-05-22'),
            ('Homenagem Comemorativa aos 25 anos do INESC P&D Brasil', '', 'Homenagem', 'Fundadores e colaboradores veteranos', 'INESC P&D Brasil — Instituto Nacional de Energia Elétrica', 'Institucional', 'Não', '2023-09-10'),
            ('Prêmio Innovare de Tecnologia Aplicada', 'Infraestrutura IoT para Telemedição em Áreas Rurais', 'Prêmio', 'João Pedro Alves; Marina Duarte', 'Confederação Nacional da Indústria (CNI)', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-03-14'),
            ('Best Paper Award — IEEE ISGT Latin America 2024', 'Otimização do Fluxo de Potência em Microrredes com Armazenamento', 'Prêmio', 'Fernanda Oliveira; Ricardo Santos', 'IEEE PES', 'P018 — Microrredes Urbanas', 'Sim', '2024-10-05'),
            ('1º Lugar — Hackathon de Energia Inteligente', 'Protótipo de Dashboard de Monitoramento em Tempo Real', 'Competição', 'Rafael Lima; Lucas Mendes', 'FIAP / Itaú', 'P021 — Sistema de Medição Inteligente', 'Não', '2023-06-20'),
            ('Prêmio Melhor Dissertação — SBSE 2024', 'Protocolo de Comunicação LPWAN para Medição Inteligente', 'Prêmio', 'Beatriz Santos', 'SBSE — Simpósio Brasileiro de Sistemas Elétricos', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2024-09-12'),
            ('Menção Honrosa — ENIE 2023', 'Framework de Governança de Dados para P&D Regulatório', 'Menção Honrosa', 'Carlos Eduardo Silva; Antonio Ferreira', 'ENIE — Encontro Nacional de Inovação e Energia', 'P032 — Governança de P&D ANEEL', 'Pendente', '2023-11-28'),
            ('Prêmio Celpe de Inovação', 'Kit de Telemedição Rural LPWAN de Baixo Custo', 'Prêmio', 'João Pedro Alves; Helena Costa', 'CELPE — Companhia Energética de Pernambuco', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-01-15'),
            ('2º Lugar — Concurso de Ideias INESC P&D Brasil', 'Método de Avaliação de Maturidade em P&D ANEEL', 'Competição', 'Marina Duarte; Camila Ferreira', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Não', '2023-08-05'),
            ('Prêmio Anpeti de Sustentabilidade', 'Estudo de Viabilidade de Solar Distribuída em Microrredes Residenciais', 'Prêmio', 'Pedro Henrique Costa; Mariana Almeida', 'ANPETI — Associação Nacional de Pesquisa e Ensino em Transportes', 'P018 — Microrredes Urbanas', 'Sim', '2024-04-22'),
            ('Certificado de Reconhecimento — ERP, Smart Energy', 'Plataforma GIB Analytics de Gestão de P&D', 'Certificação', 'Rafael Lima; Marina Duarte', 'ERP Smart Energy Conference', 'P018 — Microrredes Urbanas', 'Pendente', '2024-07-10'),
            ('Prêmio Young Researcher Award — IEEE IoT Forum 2025', 'Detecção de Fraudes em Medidores com Aprendizado Não Supervisionado', 'Prêmio', 'Gabriel Martins', 'IEEE Internet of Things Forum', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-06-18'),
            ('Menção Honrosa — 10ª Mostra de P&D ANEEL', 'Dashboard Analítico para Monitoramento de Conformidade ANEEL', 'Menção Honrosa', 'Daniel Nogueira; Isabela Nascimento', 'Mostra de P&D ANEEL', 'P032 — Governança de P&D ANEEL', 'Pendente', '2024-12-01'),
            ('Prêmio Melhor Poster — CBSE 2025', 'Edge Computing para Análise de Qualidade de Energia', 'Prêmio', 'Ana Beatriz Souza; Lucas Mendes', 'CBSE — Congresso Brasileiro de Sistemas Elétricos', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-05-20'),
            ('Prêmio FIQCam de Inovação Tecnológica', 'Sensor Inteligente de Corrente para Medição Distribuída', 'Prêmio', 'Ana Beatriz Souza; Carlos Menezes', 'FIQCam — Fórum Internacional de Qualidade e Cam', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-02-28'),
            ('Certificação PEI — Programa de Estágio em Inovação', 'Framework GIB-Analytics v2 para Análise de Dados de Medição', 'Certificação', 'Rafael Lima; Thiago Rodrigues', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Não', '2023-12-15'),
            ('Prêmio Ondas do Brasil — Edição 2024', 'Solução LPWAN para Telemedicina Rural em Comunidades Isoladas', 'Prêmio', 'Renata Campos; João Pedro Alves', 'Ondas do Brasil — Festival de Inovação', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2024-11-05'),
            ('1º Lugar — Desafio ANEEL de Dados Abertos', 'Análise de Padrões de Consumo com Redes Neurais Convolucionais', 'Competição', 'Ana Beatriz Souza; Gabriel Martins', 'ANEEL — Agência Nacional de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Sim', '2023-10-12'),
            ('Prêmio Reconhecimento ao Impacto Social', 'Telemedição Rural para Comunidades Isoladas do Norte do Brasil', 'Homenagem', 'Renata Campos; Beatriz Santos; João Pedro Alves', 'Ministério de Ciência e Tecnologia', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-04-08');
        `);
        console.log('   ✅ 20 prêmios inseridos');

        // ============================================================
        // PRODUÇÃO TECNOLÓGICA (20 registros)
        // ============================================================
        console.log('⚙️ Inserindo produções tecnológicas...');
        await pool.query(`DELETE FROM producao_tecnologica`);
        await pool.query(`
            INSERT INTO producao_tecnologica (titulo, numero, tipo, trl, autores, instituicao, projeto, conformidade_ib, ano) VALUES
            ('Sensor Inteligente de Corrente para Medição Distribuída', 'PI 10 2025 001234-5 (INPI)', 'Patente', 6, 'Ana Beatriz Souza; Carlos Menezes; Equipe P021', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Plataforma GIB Analytics de Gestão de P&D', 'Registro BR512025001234-0', 'Registro de Software', 8, 'Rafael Lima; Marina Duarte', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Protótipo de Estação de Recarga Residencial Compacta', 'PROTO-P018-03', 'Protótipo', 7, 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Kit de Telemedição Rural LPWAN', 'PROD-P025-01', 'Produto Tecnológico', 9, 'Equipe do projeto P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023),
            ('Gateway LoRaWAN Multi-Canal para Redes de Medição Inteligente', 'PI 10 2024 009876-1 (INPI)', 'Patente', 7, 'Beatriz Santos; Carlos Menezes', 'INESC P&D Brasil / INPI', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Módulo de Comunicação NB-IoT para Medidores de Energia', 'PROTO-P021-07', 'Protótipo', 6, 'Ana Beatriz Souza; Lucas Mendes', 'INESC P&D Brasil — Laboratório de IoT', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Software de Monitoramento de Qualidade de Energia em Tempo Real', 'Registro BR512024005678-1', 'Registro de Software', 8, 'Thiago Rodrigues; Rafael Lima', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Bateria de Armazenamento Doméstica LFP 5kWh', 'PROTO-P018-11', 'Protótipo', 5, 'Fernanda Oliveira; Pedro Henrique Costa', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Plataforma de Análise de Dados de P&D Baseada em Blockchain', 'Registro BR512025009999-2', 'Registro de Software', 7, 'Carlos Eduardo Silva; Camila Ferreira', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Pendente', 2025),
            ('Inversor Solar Híbrido de Baixa Potência para Microrredes', 'PI 10 2023 005432-9 (INPI)', 'Patente', 6, 'Ricardo Santos; Mariana Almeida', 'INESC P&D Brasil / INPI', 'P018 — Microrredes Urbanas', 'Sim', 2023),
            ('Kit de Sensoriamento de Qualidade de Energia para Redes de Baixa Tensão', 'PROD-P021-04', 'Produto Tecnológico', 8, 'Equipe do projeto P021', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Roteador Inteligente para Redes Mesh de Telemedicina Rural', 'PROTO-P025-09', 'Protótipo', 6, 'Renata Campos; João Pedro Alves', 'INESC P&D Brasil — Laboratório de IoT', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Aplicativo Móvel para Monitoramento de Microrredes Residenciais', 'Registro BR512023007777-3', 'Registro de Software', 9, 'Juliana Pereira; Pedro Henrique Costa', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2023),
            ('Transformador de Distribuição com Sensor Integrado de Temperatura', 'PI 10 2024 003333-7 (INPI)', 'Patente', 5, 'Gabriel Martins; Ana Beatriz Souza', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Sistema de Backup Energético Solar para Postes de Iluminação Pública', 'PROD-P018-08', 'Produto Tecnológico', 7, 'Equipe do projeto P018', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2025),
            ('Firmware de Baixo Consumo para Medidores Inteligentes com Protocolo LoRa', 'Registro BR512025002222-5', 'Registro de Software', 8, 'Beatriz Santos; Daniel Nogueira', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Dispositivo de Controle Remoto de Cargas para Microrredes', 'PROTO-P018-15', 'Protótipo', 6, 'Fernanda Oliveira; Ana Carolina Ribeiro', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Plataforma Cloud para Análise Preditiva de Falhas em Redes de Distribuição', 'Registro BR512024004444-6', 'Registro de Software', 7, 'Thiago Rodrigues; Lucas Mendes', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Repetidor de Sinal LoRaWAN para Áreas de Baixa Cobertura', 'PROD-P025-06', 'Produto Tecnológico', 8, 'Equipe do projeto P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Medidor de Energia Inteligente com Blockchain Integrado para Certificação de Energia Verde', 'PI 10 2025 008888-4 (INPI)', 'Patente', 4, 'Isabela Nascimento; Carlos Eduardo Silva', 'INESC P&D Brasil / INPI', 'P032 — Governança de P&D ANEEL', 'Não', 2025);
        `);
        console.log('   ✅ 20 produções tecnológicas inseridas');

        // ============================================================
        // PRODUÇÕES OUTROS (20 registros)
        // ============================================================
        console.log('📋 Inserindo outras produções...');
        await pool.query(`DELETE FROM producoes_outros`);
        await pool.query(`
            INSERT INTO producoes_outros (titulo, descricao, natureza, autores, instituicao, projeto, conformidade_ib, ano) VALUES
            ('Capacitação em Boas Práticas de Laboratório', 'Curso interno com certificação para 30 colaboradores', 'Capacitação', 'Equipe de Qualidade INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Método de Avaliação de Maturidade em P&D ANEEL', 'Metodologia proprietária de avaliação por estágios de maturidade', 'Método', 'Marina Duarte; Carlos Menezes', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2025),
            ('Framework GIB-Analytics v2', 'Biblioteca interna de análise de dados de medição inteligente', 'Framework', 'Rafael Lima', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Relatório Técnico: Viabilidade LPWAN em Áreas Rurais', 'Estudo comparativo LoRaWAN vs NB-IoT para telemedição', 'Relatório Técnico', 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil — Coordenação de Inovação', 'P025 — Infraestrutura de Medição IoT', 'Não', 2023),
            ('Acervo Fotográfico dos Projetos 2023–2025', '', 'Produção Diversa', 'Comunicação INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2025),
            ('Workshop de Inteligência Artificial para o Setor Elétrico', 'Evento com 150 participantes e 12 palestrantes internacionais', 'Evento', 'Coordenação de Projetos INESC', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Plano de Negócios — Spin-off de Telemedicina Rural', 'Estudo de viabilidade econômica para constituição de empresa', 'Relatório Técnico', 'Renata Campos; João Pedro Alves; Camila Ferreira', 'INESC P&D Brasil — Escritório de Inovação', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Protocolo Interno de Qualidade para Projetos de P&D', 'Documentação do sistema de gestão da qualidade ISO 9001 aplicado a P&D', 'Documento Técnico', 'Equipe de Qualidade INESC', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2023),
            ('Treinamento em Segurança da Informação para Equipes de P&D', 'Capacitação obrigatória com carga horária de 40 horas', 'Capacitação', 'Departamento de TI INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Catálogo de Soluções Tecnológicas INESC P&D Brasil 2024', 'Compilação das principais soluções desenvolvidas pela instituição', 'Publicação Institucional', 'Redação INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Workshop Internacional de Microrredes Inteligentes', 'Evento com transmissão online para 500 participantes', 'Evento', 'Fernanda Oliveira; Ricardo Santos', 'INESC P&D Brasil / IEEE PES', 'P018 — Microrredes Urbanas', 'Sim', 2025),
            ('Relatório de Sustentabilidade INESC P&D Brasil 2023', 'Relatório anual com indicadores ambientais, sociais e de governança', 'Relatório Técnico', 'Departamento de Sustentabilidade INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2023),
            ('Manual de Instalação — Kit de Telemedição Rural LPWAN', 'Guia técnico para instalação e configuração do kit', 'Documento Técnico', 'João Pedro Alves; Beatriz Santos', 'INESC P&D Brasil — Engenharia', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Curso Online — Introdução a Redes de Distribuição Inteligentes', 'Curso EAD com certificado, 800 matrículas no primeiro semestre', 'Capacitação', 'Ana Beatriz Souza; Lucas Mendes', 'INESC P&D Brasil / Universidade Aberta', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Guia de Boas Práticas para Submissão de Projetos ANEEL', 'Manual com diretrizes para elaboração de propostas de P&D regulatório', 'Publicação Institucional', 'Marina Duarte; Isabela Nascimento', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2024),
            ('Workshop de Prototipagem Rápida com Arduino e Raspberry Pi', 'Oficina prática com 40 participantes do programa de iniciação científica', 'Evento', 'Thiago Rodrigues; Gabriel Martins', 'INESC P&D Brasil — Laboratório', 'P021 — Sistema de Medição Inteligente', 'Não', 2023),
            ('Relatório Técnico: Análise de Impacto Ambiental de Projetos de Microrredes', 'Estudo de conformidade com legislação ambiental vigente', 'Relatório Técnico', 'Pedro Henrique Costa; Mariana Almeida', 'INESC P&D Brasil — Meio Ambiente', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Programa de Mentoria para Jovens Pesquisadores do Setor Elétrico', 'Programa com 20 mentores e 60 mentorados ao longo de 12 meses', 'Programa', 'Coordenação Acadêmica INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2025),
            ('Cartilha de Segurança para Instalações de Medição Inteligente', 'Material educativo para equipes de campo em distribuidoras', 'Publicação Institucional', 'Ana Beatriz Souza; Carlos Menezes', 'INESC P&D Brasil — Segurança do Trabalho', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Apresentação Institucional — Feira de Tecnologia ANEEL 2024', 'Stand interativo com demonstração ao vivo de protótipos', 'Evento', 'Equipe Comercial INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024);
        `);
        console.log('   ✅ 20 outras produções inseridas');

        console.log('\n🎉 Seed concluído com sucesso! 100 registros inseridos no total (20 por tabela).');
    } catch (err) {
        console.error('❌ Erro ao executar seed:', err.message);
    } finally {
        await pool.end();
    }
}

seed();
