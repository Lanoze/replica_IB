-- Script para criação do banco de dados e tabela de usuários (Tela de Login)
-- Execute este script no Query Tool do seu pgAdmin

-- 1. Criação do Banco de Dados (Execute esta linha separadamente se necessário, pois alguns SGBDs não permitem criar database dentro de transações)
-- CREATE DATABASE replica_ib;

-- 2. Criação da tabela de usuários / autenticação
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inserção de um usuário padrão para teste e liberação da tela de login
-- Altere o email e senha conforme necessário para o seu sistema
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Administrador', 'admin@admin.com', '123456')
ON CONFLICT (email) DO NOTHING;

-- Mensagem de confirmação
SELECT 'Banco e tabela configurados com sucesso para a tela de login!' AS status;
