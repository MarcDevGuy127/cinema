-- Criação do Banco de Dados
CREATE DATABASE cinema_db;
USE cinema_db;
-- ===========================
-- TABELA: Usuario
-- ===========================
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    role ENUM('admin', 'cliente') DEFAULT 'cliente'
);
-- ===========================
-- TABELA: Filme
-- ===========================
CREATE TABLE Filme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    sinopse TEXT,
    duracao INT, -- em minutos
    faixa_etaria VARCHAR(20),
    banner VARCHAR(255)
);
-- ===========================
-- TABELA: Sessao
-- ===========================
CREATE TABLE Sessao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    filme_id INT NOT NULL,
    FOREIGN KEY (filme_id) REFERENCES Filme(id)
        ON DELETE CASCADE
);
-- ===========================
-- TABELA: Assento
-- ===========================
CREATE TABLE Assento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    status ENUM('disponivel', 'ocupado') DEFAULT 'disponivel',
    sessao_id INT NOT NULL,
    FOREIGN KEY (sessao_id) REFERENCES Sessao(id)
        ON DELETE CASCADE
);
-- ===========================
-- TABELA: Ingresso
-- ===========================
CREATE TABLE Ingresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    sessao_id INT NOT NULL,
    assento_id INT NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
        ON DELETE CASCADE,
    FOREIGN KEY (sessao_id) REFERENCES Sessao(id)
        ON DELETE CASCADE,
    FOREIGN KEY (assento_id) REFERENCES Assento(id)
        ON DELETE CASCADE
);
-- ===========================
-- TABELA: Carrinho
-- ===========================
CREATE TABLE Carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
        ON DELETE CASCADE
);
-- ===========================
-- TABELA: CarrinhoItem
-- ===========================
CREATE TABLE CarrinhoItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id INT NOT NULL,
    ingresso_id INT NOT NULL,
    FOREIGN KEY (carrinho_id) REFERENCES Carrinho(id)
        ON DELETE CASCADE,
    FOREIGN KEY (ingresso_id) REFERENCES Ingresso(id)
        ON DELETE CASCADE
);