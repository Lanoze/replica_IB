const pool = require('./db');

const publicacoes = [
    ['Avaliação de Estabilidade de Tensão em Redes com Alta Penetração Fotovoltaica', 'Journal', 'Publicado', 'Electric Power Systems Research', 'P012 — Integração de Geração Distribuída', 'Sim', 2023],
    ['Detecção de Anomalias em Transformadores de Distribuição Usando Séries Temporais', 'Journal', 'Publicado', 'International Journal of Electrical Power & Energy Systems', 'P007 — Diagnóstico de Ativos de Rede', 'Sim', 2024],
    ['Arquitetura de Comunicação para Redes Elétricas Inteligentes Baseada em 5G', 'Conferência', 'Publicado', 'IEEE PES Innovative Smart Grid Technologies Latin America (ISGT-LA)', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023],
    ['Gestão de Demanda Residencial por Preço Dinâmico: Um Estudo Experimental', 'Journal', 'Em Revisão', 'Applied Energy', 'P029 — Eficiência Energética Urbana', 'Pendente', 2025],
    ['Algoritmos de Restauração de Serviço em Redes de Distribuição Auto-Curáveis', 'Conferência', 'Aceito', 'Congresso Brasileiro de Automática (CBA)', 'P018 — Microrredes Urbanas', 'Sim', 2024],
    ['Cibersegurança em Infraestruturas Críticas de Energia: Revisão Sistemática', 'Periódico', 'Submetido', 'Revista de Tecnologia da Informação e Comunicação', 'P032 — Governança de P&D ANEEL', 'Não', 2025],
    ['Estimativa de Estado em Redes de Distribuição com Medições Defasadas', 'Journal', 'Publicado', 'IEEE Transactions on Power Delivery', 'P021 — Sistema de Medição Inteligente', 'Sim', 2022],
    ['Armazenamento em Bateria para Suporte de Frequência em Microrredes Isoladas', 'Conferência', 'Publicado', 'Simpósio Brasileiro de Sistemas Elétricos (SBSE)', 'P018 — Microrredes Urbanas', 'Pendente', 2023],
    ['Veículos Elétricos como Recurso de Rede: Modelagem e Impactos no Planejamento', 'Journal', 'Aceito', 'Sustainable Energy, Grids and Networks', 'P036 — Mobilidade Elétrica Conectada', 'Não', 2025],
    ['Qualidade da Energia em Redes com Geração Solar Rooftop: Resultados de Campo', 'Conferência', 'Publicado', 'Conferência Brasileira sobre Qualidade da Energia Elétrica (CBQEE)', 'P012 — Integração de Geração Distribuída', 'Sim', 2022],
    ['Aprendizado Federado para Previsão de Carga Sem Compartilhamento de Dados Sensíveis', 'Journal', 'Em Revisão', 'IEEE Transactions on Smart Grid', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2025],
    ['Telemedição por LPWAN em Áreas Rurais: Avaliação Comparativa LoRaWAN e NB-IoT', 'Periódico', 'Publicado', 'Revista Controle & Automação', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024],
    ['Otimização do Despacho Econômico Ambiental em Microrredes Híbridas', 'Journal', 'Submetido', 'Renewable Energy', 'P018 — Microrredes Urbanas', 'Pendente', 2025],
    ['Gêmeos Digitais para Monitoramento de Subestações de Distribuição', 'Conferência', 'Publicado', 'IEEE International Conference on Digital Twin', 'P007 — Diagnóstico de Ativos de Rede', 'Sim', 2024],
    ['Regulação Tarifária e Incentivos à Inovação: Lições do Programa de P&D ANEEL', 'Periódico', 'Publicado', 'Revista de Economia e Regulação da Infraestrutura', 'P032 — Governança de P&D ANEEL', 'Sim', 2022],
    ['Detecção de Fraudes em Medidores Inteligentes Usando Aprendizado Não Supervisionado', 'Journal', 'Publicado', 'Measurement', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023],
    ['Integração de Hidrelétricas Pequeno Porte com Sistemas de Armazenamento Comunitário', 'Conferência', 'Aceito', 'Latin American Conference on Distributed Generation and Renewable Energy', 'P040 — Comunidades Energéticas', 'Não', 2025],
    ['Análise de Confiabilidade de Redes de Distribuição com Geração Descentralizada', 'Journal', 'Em Revisão', 'IET Generation, Transmission & Distribution', 'P012 — Integração de Geração Distribuída', 'Pendente', 2024],
    ['Plataforma Open Source para Simulação de Redes de Distribuição Inteligentes', 'Conferência', 'Publicado', 'Python in Science Conference (SciPy Brasil)', 'Institucional', 'Sim', 2023],
    ['Interoperabilidade de Protocolos em Redes de Medição Avançada (AMI)', 'Periódico', 'Submetido', 'Journal of Network and Computer Applications', 'P025 — Infraestrutura de Medição IoT', 'Pendente', 2025]
];

const premios = [
    ['Prêmio FINEP de Inovação Tecnológica — Categoria Instituição de P&D', 'Plataforma GIB Analytics de Gestão de P&D', 'Prêmio', 'Equipe de Engenharia de Software (8 colaboradores)', 'FINEP — Financiadora de Estudos e Projetos', 'Institucional', 'Sim', '2024-09-12'],
    ['Melhor Artigo — Sessão de Smart Grids', 'Detecção de Perdas não Técnicas com Machine Learning', 'Prêmio Técnico', 'Ana Beatriz Souza; Rafael Lima', 'IEEE PES ISGT Latin America', 'P021 — Sistema de Medição Inteligente', 'Sim', '2023-10-05'],
    ['Certificado de Mérito Científico', 'Contribuições à Estimativa de Estado em Redes de Distribuição', 'Mérito Acadêmico', 'Prof. Dr. Carlos Menezes', 'Sociedade Brasileira de Automática (SBA)', 'P021 — Sistema de Medição Inteligente', 'Sim', '2023-07-28'],
    ['Menção Honrosa — Categoria Iniciação Científica', 'Monitoramento de Qualidade de Energia com Baixo Custo', 'Menção Honrosa', 'Beatriz Camargo; Orientador: Prof. Dr. Carlos Menezes', 'Congresso Brasileiro de Iniciação Científica em Engenharia Elétrica', 'P012 — Integração de Geração Distribuída', 'Pendente', '2024-11-30'],
    ['Prêmio ABRADEE de Excelência Operacional', 'Programa de Redução de Perdas não Técnicas', 'Prêmio', 'Equipe do projeto P021 (12 colaboradores)', 'ABRADEE — Associação Brasileira de Distribuidores de Energia Elétrica', 'P021 — Sistema de Medição Inteligente', 'Sim', '2023-08-22'],
    ['Homenagem aos 30 Anos do SBSE', 'Trajetória institucional em sistemas elétricos', 'Homenagem', 'Fundadores e pesquisadores veteranos', 'Simpósio Brasileiro de Sistemas Elétricos', 'Institucional', 'Não', '2024-04-17'],
    ['Prêmio Jovem Pesquisador', 'Aprendizado Federado aplicado à previsão de carga', 'Prêmio Técnico', 'Marina Duarte', 'Congresso Brasileiro de Automática (CBA)', 'P021 — Sistema de Medição Inteligente', 'Pendente', '2024-09-09'],
    ['Selo de Reconhecimento em Cibersegurança Industrial', 'Framework de proteção para infraestruturas de energia', 'Reconhecimento', 'Equipe de Segurança da Informação', 'Centro de Estudos em Cibersegurança CTIC', 'P032 — Governança de P&D ANEEL', 'Não', '2025-03-19'],
    ['Prêmio Nacional de Energia — Categoria Inovação', 'Kit de Telemedição Rural LPWAN', 'Prêmio', 'João Pedro Alves; Helena Costa; Equipe P025', 'Ministério de Minas e Energia / EPE', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2022-11-24'],
    ['Menção Honrosa — Maratona de Dados do Setor Elétrico', 'Modelo de detecção de fraudes em medição', 'Menção Honrosa', 'Rafael Lima; Beatriz Camargo', 'ONS — Operador Nacional do Sistema Elétrico', 'P021 — Sistema de Medição Inteligente', 'Pendente', '2023-06-14'],
    ['Certificado de Aprovação em Programa Estratégico de P&D', 'Projeto P029 — Eficiência Energética Urbana', 'Certificação', 'Coordenação do Projeto P029', 'ANEEL — Agência Nacional de Energia Elétrica', 'P029 — Eficiência Energética Urbana', 'Sim', '2022-12-15'],
    ['Prêmio de Inovação Aberta', 'Parceria universidade-empresa em microrredes', 'Prêmio', 'Helena Costa; Prof. Dr. Carlos Menezes', 'ANPEI — Associação Nacional de Pesquisa e Desenvolvimento das Empresas Inovadoras', 'P018 — Microrredes Urbanas', 'Sim', '2024-10-02'],
    ['Troféu Qualidade em Engenharia Elétrica', 'Contribuições metodológicas em qualidade de energia', 'Reconhecimento', 'Equipe de Qualidade de Energia', 'Clube de Engenharia Elétrica', 'P012 — Integração de Geração Distribuída', 'Não', '2023-05-26'],
    ['Destaque Social em Energia', 'Eletrificação sustentável de comunidades isoladas', 'Prêmio Social', 'Equipe do Projeto P040 (15 colaboradores)', 'Instituto Acende Brasil', 'P040 — Comunidades Energéticas', 'Pendente', '2025-02-11'],
    ['Prêmio Mulheres na Engenharia de Potência', 'Liderança feminina em projetos de P&D', 'Reconhecimento', 'Profa. Dra. Helena Costa', 'IEEE PES Women in Power — Capítulo Brasil', 'Institucional', 'Sim', '2024-03-08'],
    ['Menção Honrosa — Feira Brasileira de Ciências e Engenharia', 'Protótipo didático de microrrede educacional', 'Menção Honrosa', 'João Pedro Alves; Marina Duarte', 'FEBRACE — Fundação Latrobe', 'P018 — Microrredes Urbanas', 'Não', '2023-03-21'],
    ['Prêmio de Melhor Demo ao Vivo', 'Demonstrador de estação de recarga residencial', 'Prêmio Técnico', 'João Pedro Alves; Equipe do Laboratório de Microrredes', 'Salão de Instrumentação e Automação (FIEE)', 'P036 — Mobilidade Elétrica Conectada', 'Pendente', '2025-04-29'],
    ['Reconhecimento Editorial', 'Artigo mais citado de 2022 na área de telemedição', 'Mérito Acadêmico', 'Rafael Lima; João Pedro Alves', 'Revista Controle & Automação', 'P025 — Infraestrutura de Medição IoT', 'Sim', '2024-01-16'],
    ['Selo Institucional de Transparência em P&D ANEEL', 'Prestação de contas exemplar dos projetos PD-032', 'Certificação', 'Diretoria Administrativa e Financeira', 'ANEEL — Agência Nacional de Energia Elétrica', 'P032 — Governança de P&D ANEEL', 'Sim', '2023-12-04'],
    ['Prêmio Startup & Energia do Futuro', 'Spin-off de analytics para distribuidoras', 'Prêmio', 'Marina Duarte; Rafael Lima; Beatriz Camargo', 'Confederação Nacional da Indústria (CNI)', 'Institucional', 'Pendente', '2025-06-20']
];

const producao_academica = [
    ['Planejamento Expansão de Redes de Distribuição sob Incerteza de Geração Distribuída', 'Abordagem estocástica multiobjetivo', 'Tese de Doutorado', 'Fernanda Nogueira', 'Prof. Dr. Roberto Alencar', 'P012 — Integração de Geração Distribuída', 2025],
    ['Gêmeos Digitais Aplicados a Transformadores de Potência', '', 'Dissertação de Mestrado', 'Lucas Ferreira', 'Profa. Dra. Helena Costa', 'P007 — Diagnóstico de Ativos de Rede', 2024],
    ['Cibersegurança de Sistemas SCADA em Distribuidoras de Energia', 'Modelo de avaliação baseado em MITRE ATT&CK', 'Tese de Doutorado', 'Pedro Santoro', 'Prof. Me. André Kowalski', 'P032 — Governança de P&D ANEEL', 2025],
    ['Previsão de Curto Prazo de Geração Solar com Redes Neurais Convolucionais', 'Estudo de caso no semiárido nordestino', 'Dissertação de Mestrado', 'Camila Restrepo', 'Prof. Dr. Carlos Menezes', 'P012 — Integração de Geração Distribuída', 2023],
    ['Microrredes CC para Edificações Comerciais', 'Dimensionamento econômico-energético', 'Monografia', 'Thiago Barbosa', 'Profa. Dra. Helena Costa', 'P018 — Microrredes Urbanas', 2023],
    ['Blockchain para Contratos de Comunidades Energéticas', '', 'Trabalho de Conclusão de Curso', 'Isabela Monteiro', 'Prof. Dr. Roberto Alencar', 'P040 — Comunidades Energéticas', 2024],
    ['Detecção de Descargas Parciais com Sensores piezoelétricos de baixo custo', 'Validação laboratorial', 'Dissertação de Mestrado', 'Gustavo Pinheiro', 'Prof. Dr. Eduardo Salles', 'P007 — Diagnóstico de Ativos de Rede', 2022],
    ['Otimização do Dimensionamento de Bancos de Bateria em Microrredes', 'Análise de ciclo de vida', 'Tese de Doutorado', 'Patrícia Mendonça', 'Prof. Dr. Carlos Menezes', 'P018 — Microrredes Urbanas', 2025],
    ['Impacto de Carregadores Rápidos de VE na Qualidade da Energia Urbana', '', 'Dissertação de Mestrado', 'Diego Fontoura', 'Profa. Dra. Helena Costa', 'P036 — Mobilidade Elétrica Conectada', 2024],
    ['Plataforma de Big Data para Telemetria de Medidores Inteligentes', 'Arquitetura lambda com Kafka e TimescaleDB', 'Monografia', 'Renata Okamoto', 'Prof. Me. Paulo Rocha', 'P021 — Sistema de Medição Inteligente', 2022],
    ['Controle Cooperativo de Inversores Fotovoltaicos para Suporte de Tensão', '', 'Tese de Doutorado', 'Henrique Vasconcelos', 'Prof. Dr. Roberto Alencar', 'P012 — Integração de Geração Distribuída', 2024],
    ['Segmentação de Consumidores para Programas de Eficiência Energética', 'Clusterização com dados de medidores inteligentes', 'Dissertação de Mestrado', 'Larissa Coelho', 'Prof. Dr. Carlos Menezes', 'P029 — Eficiência Energética Urbana', 2025],
    ['Rede Privada 5G para Automação de Distribuição', 'Estudo de viabilidade técnica-econômica', 'Monografia', 'Vitor Hugo Ramos', 'Prof. Me. André Kowalski', 'P025 — Infraestrutura de Medição IoT', 2024],
    ['Manutenção Preditiva de Chaves Seccionadoras com Visão Computacional', '', 'Trabalho de Conclusão de Curso', 'Bruna Teixeira', 'Prof. Dr. Eduardo Salles', 'P007 — Diagnóstico de Ativos de Rede', 2023],
    ['Mercados Locais de Energia entre Vizinhos (Peer-to-Peer Trading)', 'Simulação com tarifas dinâmicas', 'Tese de Doutorado', 'Rodrigo Bittencourt', 'Profa. Dra. Helena Costa', 'P040 — Comunidades Energéticas', 2025],
    ['Aprendizado por Reforço para Gerenciamento Energético de Microrredes', '', 'Dissertação de Mestrado', 'Sabrina Vieira', 'Prof. Dr. Carlos Menezes', 'P018 — Microrredes Urbanas', 2024],
    ['Padronização de APIs para Interoperabilidade AMI', 'Proposta baseada em DLMS/COSEM e MQTT', 'Monografia', 'Caio Andrade', 'Prof. Me. Paulo Rocha', 'P025 — Infraestrutura de Medição IoT', 2023],
    ['Análise de Falhas Intermitentes em Redes Aéreas Compactas', 'Correlação com dados meteorológicos', 'Dissertação de Mestrado', 'Amanda Duarte', 'Prof. Dr. Eduardo Salles', 'P007 — Diagnóstico de Ativos de Rede', 2022],
    ['Iniciação Científica — Levantamento de Perdas Técnicas em Alimentadores Urbanos', '', 'Iniciação Científica (PIBIC)', 'Beatriz Camargo', 'Prof. Dr. Carlos Menezes', 'P021 — Sistema de Medição Inteligente', 2024],
    ['Governança de Dados em Programas Regulados de P&D', 'Conformidade LGPD em projetos do setor elétrico', 'Tese de Doutorado', 'Marina Duarte', 'Prof. Me. André Kowalski', 'P032 — Governança de P&D ANEEL', 2023]
];

const producao_tecnologica = [
    ['Medidor Inteligente de Baixo Custo para Áreas Remotas', 'BR 10 2023 002456-1 (INPI)', 'Patente', 6, 'João Pedro Alves; Equipe P025', 'INESC P&D Brasil / INPI', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023],
    ['Sistema Embarcado de Análise de Descargas Parciais', 'BR 20 2022 001890-7 (INPI)', 'Patente', 5, 'Gustavo Pinheiro; Eduardo Salles', 'INESC P&D Brasil / INPI', 'P007 — Diagnóstico de Ativos de Rede', 'Sim', 2022],
    ['Suite de Gestão de Projetos Regulados P&D ANEEL', 'Registro BR53 2024 000512-9', 'Registro de Software', 8, 'Marina Duarte; Rafael Lima', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2024],
    ['Demonstrador de Microrrede Educacional em Escala', 'DEMO-P018-EDU-01', 'Demonstrador', 7, 'Equipe do Laboratório de Microrredes', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Não', 2023],
    ['Controlador Universal de Inversores Solares', 'PROTO-P012-INV-04', 'Protótipo', 6, 'Henrique Vasconcelos; Patrícia Mendonça', 'INESC P&D Brasil — Centro de Geração Distribuída', 'P012 — Integração de Geração Distribuída', 'Pendente', 2024],
    ['Plataforma Cloud de Analytics de Medição (AMI Analytics)', 'Registro BR51 2023 000789-2', 'Registro de Software', 9, 'Rafael Lima; Renata Okamoto', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023],
    ['Carregador Veicular Bidirecional V2G Residencial', 'BR 10 2024 003341-0 (INPI)', 'Patente', 4, 'Diego Fontoura; Helena Costa', 'INESC P&D Brasil / INPI', 'P036 — Mobilidade Elétrica Conectada', 'Pendente', 2024],
    ['Gateway Multi-Protocolo LoRaWAN-NB-IoT-RF Mesh', 'PROD-P025-GTW-02', 'Produto Tecnológico', 8, 'João Pedro Alves; Caio Andrade', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024],
    ['Sensor Óptico de Temperatura para Barramentos de Média Tensão', 'BR 20 2021 000455-3 (INPI)', 'Patente', 7, 'Eduardo Salles; Gustavo Pinheiro', 'INESC P&D Brasil / INPI', 'P007 — Diagnóstico de Ativos de Rede', 'Sim', 2021],
    ['App de Gestão de Consumo para Unidades Residenciais', 'Registro BR51 2022 001234-8', 'Registro de Software', 8, 'Larissa Coelho; Beatriz Camargo', 'INESC P&D Brasil', 'P029 — Eficiência Energética Urbana', 'Sim', 2022],
    ['Container Energético Móvel com Solar e Armazenamento', 'PROTO-P040-MOB-01', 'Protótipo', 6, 'Equipe do Projeto P040', 'INESC P&D Brasil — Coordenação de Inovação', 'P040 — Comunidades Energéticas', 'Pendente', 2025],
    ['Motor de Otimização de Despacho para Microrredes (MicroOpt)', 'Registro BR51 2024 000901-5', 'Registro de Software', 7, 'Sabrina Vieira; Rafael Lima', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2024],
    ['Drone de Inspeção Termográfica de Linhas de Distribuição', 'PROTO-P007-UAV-03', 'Protótipo', 6, 'Bruna Teixeira; Gustavo Pinheiro', 'INESC P&D Brasil — Laboratório de Ativos', 'P007 — Diagnóstico de Ativos de Rede', 'Não', 2024],
    ['Biblioteca Python de Simulação de Redes Inteligentes (GridPy)', 'Registro BR51 2022 000567-1', 'Registro de Software', 8, 'Comunidade open source INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2022],
    ['Sistema de Iluminação Pública Autônomo Solar-LED', 'PI 10 2023 001678-9 (INPI)', 'Patente', 9, 'Equipe de Eficiência Energética', 'INESC P&D Brasil / INPI', 'P029 — Eficiência Energética Urbana', 'Sim', 2023],
    ['Estação Meteorológica Integrada para Previsão de Geração Solar', 'PROD-P012-MET-01', 'Produto Tecnológico', 8, 'Camila Restrepo; Henrique Vasconcelos', 'INESC P&D Brasil — Centro de Geração Distribuída', 'P012 — Integração de Geração Distribuída', 'Sim', 2023],
    ['Módulo Didático de Qualidade de Energia para Laboratórios', 'KIT-P007-QEE-01', 'Produto Tecnológico', 9, 'Beatriz Camargo; Eduardo Salles', 'INESC P&D Brasil', 'P007 — Diagnóstico de Ativos de Rede', 'Sim', 2022],
    ['Plataforma de Marketplace de Energia entre Vizinhos', 'PROTO-P040-P2P-02', 'Demonstrador', 5, 'Rodrigo Bittencourt; Isabela Monteiro', 'INESC P&D Brasil — Coordenação de Inovação', 'P040 — Comunidades Energéticas', 'Pendente', 2025],
    ['Dispositivo de Desconexão Inteligente para Medidores', 'BR 10 2025 000233-6 (INPI)', 'Patente', 5, 'Equipe P021', 'INESC P&D Brasil / INPI', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2025],
    ['Ferramenta de Auditoria Automatizada de Conformidade ANEEL', 'Registro BR53 2025 000145-4', 'Registro de Software', 7, 'Marina Duarte; Thiago Barbosa', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2025]
];

const producoes_outros = [
    ['Workshop de Medição Inteligente para Distribuidoras', 'Evento técnico com 120 participantes de 14 concessionárias', 'Workshop', 'Equipe P021', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Sim', 2023],
    ['Cartilha de Uso Consciente de Energia Residencial', 'Material educativo distribuído em 5 mil exemplares', 'Produção Diversa', 'Equipe de Eficiência Energética; Comunicação INESC', 'INESC P&D Brasil', 'P029 — Eficiência Energética Urbana', 'Sim', 2022],
    ['Norma Interna de Cibersegurança para Dispositivos de Rede', 'Diretrizes alinhadas à IEC 62443', 'Norma Técnica', 'Equipe de Segurança da Informação', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2024],
    ['Curso de Formação em Microrredes para Técnicos', 'Turma certificada com 45 técnicos de campo', 'Capacitação', 'Helena Costa; João Pedro Alves', 'INESC P&D Brasil — Laboratório de Microrredes', 'P018 — Microrredes Urbanas', 'Sim', 2024],
    ['Manual de Instalação do Gateway LPWAN', 'Documentação técnica completa do produto GTW-02', 'Manual', 'Caio Andrade', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2024],
    ['Metodologia de Priorização de Manutenções de Ativos', 'Matriz risco-custo validada em duas distribuidoras parceiras', 'Método', 'Gustavo Pinheiro; Bruna Teixeira', 'INESC P&D Brasil', 'P007 — Diagnóstico de Ativos de Rede', 'Pendente', 2025],
    ['Relatório Anual de P&D 2023', 'Consolidado de resultados dos projetos regulados', 'Relatório Técnico', 'Diretoria Técnica', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2023],
    ['API Pública de Consulta de Indicadores de Geração Distribuída', 'Portal de dados abertos do setor', 'Software', 'Renata Okamoto; Rafael Lima', 'INESC P&D Brasil', 'P012 — Integração de Geração Distribuída', 'Sim', 2024],
    ['Podcast Técnico Conexão Elétrica — 1ª Temporada', '10 episódios sobre inovação no setor elétrico', 'Produção Diversa', 'Comunicação INESC; convidados externos', 'INESC P&D Brasil', 'Institucional', 'Não', 2023],
    ['Treinamento em LGPD para Equipes de P&D', 'Programa de conformidade com certificação interna', 'Capacitação', 'Marina Duarte', 'INESC P&D Brasil', 'P032 — Governança de P&D ANEEL', 'Sim', 2024],
    ['Guia de Boas Práticas para Comunidades Energéticas', 'Referência normativa para cooperativas de energia', 'Cartilha', 'Rodrigo Bittencourt; Isabela Monteiro', 'INESC P&D Brasil', 'P040 — Comunidades Energéticas', 'Pendente', 2025],
    ['Protocolo de Ensaios de Interoperabilidade AMI', 'Procedimento padrão adotado em laboratório credenciado', 'Norma Técnica', 'Equipe P025', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2023],
    ['Feira de Ciências Itinerante Energia do Futuro', 'Atendimento a 3 mil estudantes da rede pública', 'Produção Diversa', 'Voluntários INESC; Bruna Teixeira', 'INESC P&D Brasil', 'Institucional', 'Não', 2024],
    ['Framework de Testes Automatizados para Controladores de Rede', 'Biblioteca interna de homologação de firmware', 'Framework', 'Sabrina Vieira; Vitor Hugo Ramos', 'INESC P&D Brasil', 'P018 — Microrredes Urbanas', 'Sim', 2024],
    ['Diagnóstico de Perdas Comerciais — Estudo Multirregional', 'Análise de 2,3 milhões de unidades consumidoras', 'Relatório Técnico', 'Equipe P021; consultores associados', 'INESC P&D Brasil', 'P021 — Sistema de Medição Inteligente', 'Pendente', 2025],
    ['Programa de Mentoria Jovens Talentos em Energia', 'Ciclo anual de mentoria para 25 estudantes', 'Capacitação', 'Profa. Dra. Helena Costa; equipe de RH técnico', 'INESC P&D Brasil', 'Institucional', 'Sim', 2023],
    ['Checklist de Aceitação de Medidores Inteligentes', 'Instrumento operacional para recebimento tecnológico', 'Método', 'João Pedro Alves', 'INESC P&D Brasil', 'P025 — Infraestrutura de Medição IoT', 'Sim', 2022],
    ['Exposição Interativa sobre Mobilidade Elétrica', 'Instalação permanente em parque tecnológico parceiro', 'Produção Diversa', 'Diego Fontoura; Comunicação INESC', 'INESC P&D Brasil', 'P036 — Mobilidade Elétrica Conectada', 'Pendente', 2025],
    ['Índice de Maturidade Digital de Distribuidoras (IMDD)', 'Indicador anual aplicado a 20 empresas do setor', 'Método', 'Marina Duarte; Carlos Menezes', 'INESC P&D Brasil', 'Institucional', 'Sim', 2024],
    ['Acervo Digital de Memória Institucional 1990–2020', 'Digitalização de 12 mil documentos históricos', 'Produção Diversa', 'Coordenação documental INESC', 'INESC P&D Brasil', 'Institucional', 'Sim', 2022]
];

async function main() {
    let total = 0;

    for (const p of publicacoes) {
        await pool.query(
            'INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            p
        );
        total++;
    }

    for (const p of premios) {
        await pool.query(
            'INSERT INTO premios (nome, trabalho, natureza_area, integrantes, instituicao, projeto, conformidade_ib, data_concessao) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
            p
        );
        total++;
    }

    for (const p of producao_academica) {
        await pool.query(
            'INSERT INTO producao_academica (titulo, subtitulo, tipo_nivel, autor, orientador, projeto, ano) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            p
        );
        total++;
    }

    for (const p of producao_tecnologica) {
        await pool.query(
            'INSERT INTO producao_tecnologica (titulo, numero, tipo, trl, autores, instituicao, projeto, conformidade_ib, ano) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            p
        );
        total++;
    }

    for (const p of producoes_outros) {
        await pool.query(
            'INSERT INTO producoes_outros (titulo, descricao, natureza, autores, instituicao, projeto, conformidade_ib, ano) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
            p
        );
        total++;
    }

    console.log(`✅ Seed concluído: ${total} registros inseridos`);
    await pool.end();
}

main().catch(e => { console.error('❌ Erro no seed:', e.message); process.exit(1); });
