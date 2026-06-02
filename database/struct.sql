-- =======================================================
-- 1. TABELAS DE CADASTROS BASE (Sem chaves estrangeiras)
-- =======================================================

CREATE TABLE area_conhecimento (
    id_area INT IDENTITY(1,1) PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE editora (
    id_editora INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE autor (
    id_autor INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE funcionario (
    id_funcionario INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

CREATE TABLE aluno (
    id_aluno INT IDENTITY(1,1) PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    status_bloqueio BIT DEFAULT 0
);

-- =======================================================
-- 2. TABELAS DO ACERVO (Com chaves estrangeiras)
-- =======================================================

CREATE TABLE livro (
    id_livro INT IDENTITY(1,1) PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    ano_publicacao INT,
    id_editora INT,
    id_area INT,
    FOREIGN KEY (id_editora) REFERENCES editora(id_editora),
    FOREIGN KEY (id_area) REFERENCES area_conhecimento(id_area)
);

-- Tabela intermediária para resolver o relacionamento N:M entre Livro e Autor
CREATE TABLE livro_autor (
    id_livro INT,
    id_autor INT,
    PRIMARY KEY (id_livro, id_autor),
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro),
    FOREIGN KEY (id_autor) REFERENCES autor(id_autor)
);

CREATE TABLE exemplar (
    id_exemplar INT IDENTITY(1,1) PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    condicao VARCHAR(50) DEFAULT 'Novo',
    id_livro INT NOT NULL,
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro)
);

-- =======================================================
-- 3. TABELAS DE MOVIMENTAÇÃO E EVENTOS
-- =======================================================

CREATE TABLE emprestimo (
    id_emprestimo INT IDENTITY(1,1) PRIMARY KEY,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE, -- Fica nulo até o livro ser devolvido
    valor_multa DECIMAL(10, 2) DEFAULT 0.00,
    id_aluno INT NOT NULL,
    id_exemplar INT NOT NULL,
    id_funcionario INT NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno),
    FOREIGN KEY (id_exemplar) REFERENCES exemplar(id_exemplar),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario)
);

CREATE TABLE reserva (
    id_reserva INT IDENTITY(1,1) PRIMARY KEY,
    data_reserva DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Aguardando',
    id_aluno INT NOT NULL,
    id_livro INT NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno),
    FOREIGN KEY (id_livro) REFERENCES livro(id_livro)
);