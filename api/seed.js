const pool = require('../db');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'POST') {
        return res.status(405).json({ detail: 'Use POST' });
    }

    const results = [];

    try {
        // PUBLICAÇÕES
        await pool.query('DELETE FROM publicacoes');
        await pool.query(`INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano) VALUES
            ('Smart Grid Analytics: Detecção de Perdas não Técnicas em Redes de Distribuição Usando Machine Learning', 'Journal', 'Publicado', 'IEEE Transactions on Smart Grid', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Otimização do Fluxo de Potência em Microrredes com Geração Solar Fotovoltaica e Armazenamento', 'Conferência', 'Aceito', 'IEEE PES ISGT', 'P018 — Microrredes Urbanas', 'Pendente', 2025),
            ('IoT aplicado à Telemedição: Revisão Sistemática e Perspectivas para o Setor Elétrico Brasileiro', 'Periódico', 'Em Revisão', 'Revista Controle & Automação', 'P025 — Infraestrutura de Medição IoT', 'Não', 2025),
            ('Metodologia de Avaliação de Conformidade ANEEL para Projetos de P&D com Base Patrimonial', 'Journal', 'Submetido', 'Journal of Control, Automation and Electrical Systems', 'P032 — Governança de P&D ANEEL', 'Pendente', 2023),
            ('Análise Comparativa de Protocolos de Comunicação para Redes de Distribuição Inteligentes', 'Journal', 'Publicado', 'IEEE Internet of Things Journal', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Modelo Preditivo de Falhas em Transformadores de Distribuição Baseado em Aprendizado Profundo', 'Conferência', 'Publicado', 'Proceedings of IEEE PES General Meeting', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Segmentação de Consumidores para Identificação de Perdas Não Técnicas com Redes Neurais', 'Periódico', 'Publicado', 'Revista Brasileira de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Gateway LoRaWAN para Telemedição em Áreas de Baixa Cobertura Celular', 'Conferência', 'Aceito', 'SBSE', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Governança de Dados em Projetos de P&D Financiados pela ANEEL', 'Journal', 'Publicado', 'Energy Policy', 'P032 — Governança de P&D ANEEL', 'Sim', 2023),
            ('Energia Solar Distribuída em Microgrids Residenciais: Estudo de Viabilidade', 'Periódico', 'Em Revisão', 'Renewable and Sustainable Energy Reviews', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Edge Computing para Análise de Qualidade de Energia em Tempo Real', 'Conferência', 'Publicado', 'IEEE International Conference on Edge Computing', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Blockchain para Rastreabilidade de Certificados de Energia Renovável', 'Journal', 'Submetido', 'Applied Energy', 'P032 — Governança de P&D ANEEL', 'Pendente', 2025),
            ('Técnicas de Federated Learning para Detecção de Anomalias em Medidores Inteligentes', 'Journal', 'Publicado', 'IEEE Transactions on Industrial Informatics', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Avaliação do Desempenho de Baterias LFP em Microrredes com Alto Penhor Solar', 'Conferência', 'Aceito', 'IEEE ECCE', 'P018 — Microrredes Urbanas', 'Pendente', 2025),
            ('NB-IoT versus LoRaWAN para Telemedição Rural: Análise Comparativa', 'Periódico', 'Publicado', 'Sensors', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Dashboard Analítico para Monitoramento de Conformidade ANEEL', 'Conferência', 'Publicado', 'Conferência Internacional de Gestão de Tecnologia', 'P032 — Governança de P&D ANEEL', 'Pendente', 2024),
            ('Redes Neurais Convolucionais para Classificação de Perfis de Consumo', 'Journal', 'Publicado', 'Neural Computing and Applications', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Sistema de Proteção Coordenado para Microrredes com Geração Distribuída', 'Conferência', 'Publicado', 'IEEE PES ISGT Latin America', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Protocolo MQTT Seguro para Redes de Medição Inteligente em Névoa de Computação', 'Journal', 'Em Revisão', 'Computer Networks', 'P025 — Infraestrutura de Medição IoT', 'Não', 2025),
            ('Indicadores de Maturidade em P&D para Projetos Regulatórios', 'Periódico', 'Publicado', 'R&D Management', 'P032 — Governança de P&D ANEEL', 'Sim', 2023)`);
        results.push('publicacoes: OK');

        // PRODUÇÃO ACADÊMICA
        await pool.query('DELETE FROM producao_academica');
        await pool.query(`INSERT INTO producao_academica (titulo, subtitulo, tipo_nivel, autor, orientador, projeto, ano) VALUES
            ('Arquitetura de Computação de Borda para Analítica em Tempo Real', 'Abordagem baseada em aprendizado federado', 'Tese de Doutorado', 'Ana Beatriz Souza', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2025),
            ('Detecção de Perdas não Técnicas em Redes de Baixa Tensão', 'Estudo de caso com dados reais', 'Dissertação de Mestrado', 'Rafael Lima', 'Profa. Dra. Helena Costa', 'P018 — Microrredes Urbanas', 2024),
            ('Governança e Conformidade em Projetos Estratégicos de P&D ANEEL', '', 'Monografia', 'Marina Duarte', 'Prof. Me. Paulo Rocha', 'P032 — Governança de P&D ANEEL', 2023),
            ('Infraestrutura IoT para Telemedição em Áreas Rurais', 'Avaliação de protocolos LPWAN', 'Dissertação de Mestrado', 'João Pedro Alves', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2025),
            ('Otimização de Sistemas de Armazenamento em Microrredes Fotovoltaicas', 'Modelo multiobjetivo', 'Tese de Doutorado', 'Fernanda Oliveira', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2024),
            ('Machine Learning para Previsão de Demanda em Redes Inteligentes', 'Comparação de algoritmos', 'Dissertação de Mestrado', 'Lucas Mendes', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2023),
            ('Framework de Governança de Dados para P&D Regulatórios', '', 'Tese de Doutorado', 'Carlos Eduardo Silva', 'Prof. Dr. Antonio Ferreira', 'P032 — Governança de P&D ANEEL', 2025),
            ('Protocolo LPWAN para Medição Inteligente em Contextos Urbanos', 'LoRaWAN vs Sigfox', 'Dissertação de Mestrado', 'Beatriz Santos', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2024),
            ('Simulação de Microrredes com Veículos Elétricos e Geração Distribuída', '', 'Monografia', 'Pedro Henrique Costa', 'Prof. Me. Paulo Rocha', 'P018 — Microrredes Urbanas', 2023),
            ('Análise de Impacto da Geração Distribuída na Qualidade de Energia', 'Estudo de campo', 'Tese de Doutorado', 'Mariana Almeida', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2025),
            ('Sistema de Alerta Precoce para Perdas Não Técnicas', 'Análise estatística multivariada', 'Dissertação de Mestrado', 'Thiago Rodrigues', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2024),
            ('Mapeamento de Boas Práticas de Gestão de P&D no Setor Energético', '', 'Monografia', 'Camila Ferreira', 'Prof. Me. Paulo Rocha', 'P032 — Governança de P&D ANEEL', 2023),
            ('Avaliação de Maturidade Tecnológica de Soluções de Telemedição', '', 'Dissertação de Mestrado', 'Ricardo Fernandes', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2025),
            ('Integração de Armazenamento em Microrredes Ilhadas: Análise de Resiliência', '', 'Tese de Doutorado', 'Juliana Pereira', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2024),
            ('Detecção de Fraudes em Medidores com Aprendizado Não Supervisionado', '', 'Dissertação de Mestrado', 'Gabriel Martins', 'Profa. Dra. Helena Costa', 'P021 — Sistema de Medição Inteligente', 2023),
            ('Modelo de Certificação de Conformidade ANEEL para Medição Inteligente', '', 'Tese de Doutorado', 'Isabela Nascimento', 'Prof. Dr. Antonio Ferreira', 'P032 — Governança de P&D ANEEL', 2025),
            ('Redes Mesh para Telemedição em Edifícios Comerciais', 'Cobertura e latência', 'Monografia', 'Felipe Araújo', 'Prof. Me. Paulo Rocha', 'P025 — Infraestrutura de Medição IoT', 2024),
            ('Controle Inteligente de Cargas em Microrredes com Geração Solar', '', 'Dissertação de Mestrado', 'Ana Carolina Ribeiro', 'Prof. Dr. Ricardo Santos', 'P018 — Microrredes Urbanas', 2023),
            ('Plataforma Analítica em Nuvem para Monitoramento de P&D ANEEL', '', 'Tese de Doutorado', 'Daniel Nogueira', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2025),
            ('Telemedicina Rural via LPWAN em Comunidades Isoladas do Norte', '', 'Dissertação de Mestrado', 'Renata Campos', 'Prof. Dr. Carlos Menezes', 'P025 — Infraestrutura de Medição IoT', 2024)`);
        results.push('producao_academica: OK');

        // PRÊMIOS
        await pool.query('DELETE FROM premios');
        await pool.query(`INSERT INTO premios (nome, trabalho, natureza_area, integrantes, instituicao, projeto, conformidade_ib, data_concessao) VALUES
            ('Prêmio ANEEL de Excelência em P&D', 'Sistema de Medição Inteligente — P021', 'Prêmio', 'Equipe P021 (12 colaboradores)', 'ANEEL', 'P021 — Sistema de Medição Inteligente', 'Sim', '2024-11-18'),
            ('Menção Honrosa — CBSE', 'Detecção de Perdas Não Técnicas', 'Menção Honrosa', 'Ana Beatriz Souza; Rafael Lima', 'CBSE', 'P018 — Microrredes Urbanas', 'Pendente', '2025-05-22'),
            ('Homenagem 25 anos INESC P&D Brasil', '', 'Homenagem', 'Fundadores e veteranos', 'INESC P&D Brasil', 'Institucional', 'Não', '2023-09-10'),
            ('Prêmio Innovare de Tecnologia Aplicada', 'Infraestrutura IoT Rural', 'Prêmio', 'João Pedro Alves; Marina Duarte', 'CNI', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-03-14'),
            ('Best Paper — IEEE ISGT LATAM 2024', 'Otimização de Fluxo em Microrredes', 'Prêmio', 'Fernanda Oliveira; Ricardo Santos', 'IEEE PES', 'P018 — Microrredes Urbanas', 'Sim', '2024-10-05'),
            ('1º Lugar — Hackathon Energia Inteligente', 'Dashboard em Tempo Real', 'Competição', 'Rafael Lima; Lucas Mendes', 'FIAP / Itaú', 'P021 — Sistema de Medição Inteligente', 'Não', '2023-06-20'),
            ('Melhor Dissertação — SBSE 2024', 'Protocolo LPWAN para Medição', 'Prêmio', 'Beatriz Santos', 'SBSE', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2024-09-12'),
            ('Menção Honrosa — ENIE 2023', 'Framework de Governança de Dados', 'Menção Honrosa', 'Carlos Eduardo Silva; Antonio Ferreira', 'ENIE', 'P032 — Governança de P&D ANEEL', 'Pendente', '2023-11-28'),
            ('Prêmio Celpe de Inovação', 'Kit Telemedição Rural LPWAN', 'Prêmio', 'João Pedro Alves; Helena Costa', 'CELPE', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-01-15'),
            ('2º Lugar — Concurso Ideias INESC', 'Método de Maturidade em P&D', 'Competição', 'Marina Duarte; Camila Ferreira', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Não', '2023-08-05'),
            ('Prêmio Anpeti de Sustentabilidade', 'Solar Distribuída em Microrredes', 'Prêmio', 'Pedro Henrique Costa; Mariana Almeida', 'ANPETI', 'P018 — Microrredes Urbanas', 'Sim', '2024-04-22'),
            ('Certificado Reconhecimento — ERP Smart Energy', 'Plataforma GIB Analytics', 'Certificação', 'Rafael Lima; Marina Duarte', 'ERP Smart Energy', 'P018 — Microrredes Urbanas', 'Pendente', '2024-07-10'),
            ('Young Researcher Award — IEEE IoT Forum', 'Detecção de Fraudes em Medidores', 'Prêmio', 'Gabriel Martins', 'IEEE IoT Forum', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-06-18'),
            ('Menção Honrosa — 10ª Mostra P&D ANEEL', 'Dashboard de Conformidade', 'Menção Honrosa', 'Daniel Nogueira; Isabela Nascimento', 'Mostra P&D ANEEL', 'P032 — Governança de P&D ANEEL', 'Pendente', '2024-12-01'),
            ('Melhor Poster — CBSE 2025', 'Edge Computing para Qualidade de Energia', 'Prêmio', 'Ana Beatriz Souza; Lucas Mendes', 'CBSE', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-05-20'),
            ('Prêmio FIQCam Inovação Tecnológica', 'Sensor Inteligente de Corrente', 'Prêmio', 'Ana Beatriz Souza; Carlos Menezes', 'FIQCam', 'P021 — Sistema de Medição Inteligente', 'Sim', '2025-02-28'),
            ('Certificação PEI — Programa Estágio Inovação', 'Framework GIB-Analytics v2', 'Certificação', 'Rafael Lima; Thiago Rodrigues', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Não', '2023-12-15'),
            ('Prêmio Ondas do Brasil 2024', 'LPWAN para Telemedicina Rural', 'Prêmio', 'Renata Campos; João Pedro Alves', 'Ondas do Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2024-11-05'),
            ('1º Lugar — Desafio ANEEL Dados Abertos', 'Redes Neurais para Padrões de Consumo', 'Competição', 'Ana Beatriz Souza; Gabriel Martins', 'ANEEL', 'P021 — Sistema de Medição Inteligente', 'Sim', '2023-10-12'),
            ('Prêmio Reconhecimento Impacto Social', 'Telemedição Rural Norte do Brasil', 'Homenagem', 'Renata Campos; Beatriz Santos; João Pedro Alves', 'MCT', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2025-04-08')`);
        results.push('premios: OK');

        // PRODUÇÃO TECNOLÓGICA
        await pool.query('DELETE FROM producao_tecnologica');
        await pool.query(`INSERT INTO producao_tecnologica (titulo, numero, tipo, trl, autores, instituicao, projeto, conformidade_ib, ano) VALUES
            ('Sensor Inteligente de Corrente para Medição Distribuída', 'PI 10 2025 001234-5', 'Patente', 6, 'Ana Beatriz Souza; Carlos Menezes', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Plataforma GIB Analytics de Gestão de P&D', 'BR512025001234-0', 'Registro de Software', 8, 'Rafael Lima; Marina Duarte', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Protótipo Estação de Recarga Residencial', 'PROTO-P018-03', 'Protótipo', 7, 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Kit de Telemedição Rural LPWAN', 'PROD-P025-01', 'Produto Tecnológico', 9, 'Equipe P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023),
            ('Gateway LoRaWAN Multi-Canal', 'PI 10 2024 009876-1', 'Patente', 7, 'Beatriz Santos; Carlos Menezes', 'INESC P&D Brasil / INPI', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Módulo Comunicação NB-IoT para Medidores', 'PROTO-P021-07', 'Protótipo', 6, 'Ana Beatriz Souza; Lucas Mendes', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Software Monitoramento Qualidade de Energia', 'BR512024005678-1', 'Registro de Software', 8, 'Thiago Rodrigues; Rafael Lima', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Bateria Armazenamento Doméstica LFP 5kWh', 'PROTO-P018-11', 'Protótipo', 5, 'Fernanda Oliveira; Pedro Henrique Costa', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Não', 2025),
            ('Plataforma Análise P&D Baseada em Blockchain', 'BR512025009999-2', 'Registro de Software', 7, 'Carlos Eduardo Silva; Camila Ferreira', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Pendente', 2025),
            ('Inversor Solar Híbrido para Microrredes', 'PI 10 2023 005432-9', 'Patente', 6, 'Ricardo Santos; Mariana Almeida', 'INESC P&D Brasil / INPI', 'P018 — Microrredes Urbanas', 'Sim', 2023),
            ('Kit Sensoriamento Qualidade de Energia', 'PROD-P021-04', 'Produto Tecnológico', 8, 'Equipe P021', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Roteador Inteligente Redes Mesh Rural', 'PROTO-P025-09', 'Protótipo', 6, 'Renata Campos; João Pedro Alves', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('App Móvel Monitoramento Microrredes', 'BR512023007777-3', 'Registro de Software', 9, 'Juliana Pereira; Pedro Henrique Costa', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2023),
            ('Transformador Distribuição com Sensor', 'PI 10 2024 003333-7', 'Patente', 5, 'Gabriel Martins; Ana Beatriz Souza', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2024),
            ('Backup Energético Solar para Postes', 'PROD-P018-08', 'Produto Tecnológico', 7, 'Equipe P018', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2025),
            ('Firmware Baixo Consumo Medidores LoRa', 'BR512025002222-5', 'Registro de Software', 8, 'Beatriz Santos; Daniel Nogueira', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Dispositivo Controle Remoto de Cargas', 'PROTO-P018-15', 'Protótipo', 6, 'Fernanda Oliveira; Ana Carolina Ribeiro', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Plataforma Cloud Análise Preditiva de Falhas', 'BR512024004444-6', 'Registro de Software', 7, 'Thiago Rodrigues; Lucas Mendes', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Repetidor LoRaWAN Baixa Cobertura', 'PROD-P025-06', 'Produto Tecnológico', 8, 'Equipe P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Medidor Energia Inteligente com Blockchain', 'PI 10 2025 008888-4', 'Patente', 4, 'Isabela Nascimento; Carlos Eduardo Silva', 'INESC P&D Brasil / INPI', 'P032 — Governança de P&D ANEEL', 'Não', 2025)`);
        results.push('producao_tecnologica: OK');

        // PRODUÇÕES OUTROS
        await pool.query('DELETE FROM producoes_outros');
        await pool.query(`INSERT INTO producoes_outros (titulo, descricao, natureza, autores, instituicao, projeto, conformidade_ib, ano) VALUES
            ('Capacitação em Boas Práticas de Laboratório', 'Curso com certificação para 30 colaboradores', 'Capacitação', 'Equipe Qualidade INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Método de Avaliação de Maturidade em P&D ANEEL', 'Metodologia por estágios de maturidade', 'Método', 'Marina Duarte; Carlos Menezes', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2025),
            ('Framework GIB-Analytics v2', 'Biblioteca de análise de dados de medição', 'Framework', 'Rafael Lima', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Pendente', 2024),
            ('Relatório Técnico: Viabilidade LPWAN Rural', 'Comparativo LoRaWAN vs NB-IoT', 'Relatório Técnico', 'João Pedro Alves; Helena Costa', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Não', 2023),
            ('Acervo Fotográfico Projetos 2023-2025', '', 'Produção Diversa', 'Comunicação INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2025),
            ('Workshop IA para Setor Elétrico', '150 participantes, 12 palestrantes', 'Evento', 'Coordenação de Projetos', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2024),
            ('Plano de Negócios Spin-off Telemedicina Rural', 'Viabilidade econômica', 'Relatório Técnico', 'Renata Campos; João Pedro Alves', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2025),
            ('Protocolo Interno Qualidade para P&D', 'ISO 9001 aplicado a P&D', 'Documento Técnico', 'Equipe Qualidade INESC', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2023),
            ('Treinamento Segurança da Informação', '40 horas obrigatórias', 'Capacitação', 'Dept. TI INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Catálogo Soluções Tecnológicas 2024', 'Principais soluções da instituição', 'Publicação Institucional', 'Redação INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024),
            ('Workshop Internacional Microrredes', '500 participantes online', 'Evento', 'Fernanda Oliveira; Ricardo Santos', 'INESC P&D Brasil / IEEE PES', 'P018 — Microrredes Urbanas', 'Sim', 2025),
            ('Relatório Sustentabilidade 2023', 'Indicadores ESG anuais', 'Relatório Técnico', 'Dept. Sustentabilidade INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2023),
            ('Manual Instalação Kit Telemedição Rural', 'Guia técnico LPWAN', 'Documento Técnico', 'João Pedro Alves; Beatriz Santos', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024),
            ('Curso Online Redes de Distribuição', 'EAD com 800 matrículas', 'Capacitação', 'Ana Beatriz Souza; Lucas Mendes', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2025),
            ('Guia Boas Práticas Projetos ANEEL', 'Diretrizes para propostas P&D', 'Publicação Institucional', 'Marina Duarte; Isabela Nascimento', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2024),
            ('Workshop Prototipagem Arduino/RPi', '40 participantes de iniciação científica', 'Evento', 'Thiago Rodrigues; Gabriel Martins', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Não', 2023),
            ('Relatório Impacto Ambiental Microrredes', 'Conformidade legislação ambiental', 'Relatório Técnico', 'Pedro Henrique Costa; Mariana Almeida', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2024),
            ('Programa Mentoria Jovens Pesquisadores', '20 mentores, 60 mentorados, 12 meses', 'Programa', 'Coordenação Acadêmica INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2025),
            ('Cartilha Segurança Medição Inteligente', 'Material para equipes de campo', 'Publicação Institucional', 'Ana Beatriz Souza; Carlos Menezes', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023),
            ('Apresentação Feira Tecnologia ANEEL 2024', 'Stand com demonstração de protótipos', 'Evento', 'Equipe Comercial INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024)`);
        results.push('producoes_outros: OK');

        return res.status(200).json({ success: true, results });
    } catch (err) {
        return res.status(500).json({ error: err.message, results });
    }
};
