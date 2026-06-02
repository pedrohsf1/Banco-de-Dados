-- =========================================================
-- 1. AREA_CONHECIMENTO
-- =========================================================

CREATE PROCEDURE SP_Inserir_Area
    @descricao VARCHAR(100)
AS
BEGIN
    INSERT INTO area_conhecimento (descricao)
    VALUES (@descricao);
END;
GO

CREATE PROCEDURE SP_Consultar_Area
    @id_area INT = NULL
AS
BEGIN
    IF @id_area IS NULL
        SELECT id_area, descricao FROM area_conhecimento ORDER BY descricao;
    ELSE
        SELECT id_area, descricao FROM area_conhecimento WHERE id_area = @id_area;
END;
GO

CREATE PROCEDURE SP_Atualizar_Area
    @id_area INT,
    @descricao VARCHAR(100)
AS
BEGIN
    UPDATE area_conhecimento
    SET descricao = @descricao
    WHERE id_area = @id_area;
END;
GO

CREATE PROCEDURE SP_Excluir_Area
    @id_area INT
AS
BEGIN
    DELETE FROM area_conhecimento WHERE id_area = @id_area;
END;
GO


-- =========================================================
-- 2. EDITORA
-- =========================================================

CREATE PROCEDURE SP_Inserir_Editora
    @nome VARCHAR(100)
AS
BEGIN
    INSERT INTO editora (nome)
    VALUES (@nome);
END;
GO

CREATE PROCEDURE SP_Consultar_Editora
    @id_editora INT = NULL
AS
BEGIN
    IF @id_editora IS NULL
        SELECT id_editora, nome FROM editora ORDER BY nome;
    ELSE
        SELECT id_editora, nome FROM editora WHERE id_editora = @id_editora;
END;
GO

CREATE PROCEDURE SP_Atualizar_Editora
    @id_editora INT,
    @nome VARCHAR(100)
AS
BEGIN
    UPDATE editora
    SET nome = @nome
    WHERE id_editora = @id_editora;
END;
GO

CREATE PROCEDURE SP_Excluir_Editora
    @id_editora INT
AS
BEGIN
    DELETE FROM editora WHERE id_editora = @id_editora;
END;
GO


-- =========================================================
-- 3. AUTOR
-- =========================================================

CREATE PROCEDURE SP_Inserir_Autor
    @nome VARCHAR(100)
AS
BEGIN
    INSERT INTO autor (nome)
    VALUES (@nome);
END;
GO

CREATE PROCEDURE SP_Consultar_Autor
    @id_autor INT = NULL
AS
BEGIN
    IF @id_autor IS NULL
        SELECT id_autor, nome FROM autor ORDER BY nome;
    ELSE
        SELECT id_autor, nome FROM autor WHERE id_autor = @id_autor;
END;
GO

CREATE PROCEDURE SP_Atualizar_Autor
    @id_autor INT,
    @nome VARCHAR(100)
AS
BEGIN
    UPDATE autor
    SET nome = @nome
    WHERE id_autor = @id_autor;
END;
GO

CREATE PROCEDURE SP_Excluir_Autor
    @id_autor INT
AS
BEGIN
    DELETE FROM autor WHERE id_autor = @id_autor;
END;
GO


-- =========================================================
-- 4. FUNCIONARIO
-- =========================================================

CREATE PROCEDURE SP_Consultar_Funcionario
AS
BEGIN
    SELECT id_funcionario, nome, cargo
    FROM funcionario
    ORDER BY nome;
END;
GO


-- =========================================================
-- 5. LIVRO (COM AUTORES)
-- =========================================================

CREATE PROCEDURE SP_Inserir_Livro
    @isbn VARCHAR(20),
    @titulo VARCHAR(200),
    @ano_publicacao INT = NULL,
    @id_editora INT = NULL,
    @id_area INT = NULL,
    @autores_ids VARCHAR(MAX) = NULL
AS
BEGIN
    DECLARE @id_livro INT;

    INSERT INTO livro (isbn, titulo, ano_publicacao, id_editora, id_area)
    VALUES (@isbn, @titulo, @ano_publicacao, @id_editora, @id_area);

    SET @id_livro = SCOPE_IDENTITY();

    IF @autores_ids IS NOT NULL AND @autores_ids <> ''
    BEGIN
        INSERT INTO livro_autor (id_livro, id_autor)
        SELECT @id_livro, TRY_CAST(value AS INT)
        FROM STRING_SPLIT(@autores_ids, ',')
        WHERE TRY_CAST(value AS INT) IS NOT NULL;
    END;

    SELECT @id_livro AS id_livro;
END;
GO


CREATE PROCEDURE SP_Consultar_Livro
    @filtro VARCHAR(200) = NULL
AS
BEGIN
    SELECT
        l.id_livro,
        l.isbn,
        l.titulo,
        l.ano_publicacao,
        l.id_editora,
        e.nome AS nome_editora,
        l.id_area,
        a.descricao AS descricao_area,
        STRING_AGG(au.nome, ', ') AS autores
    FROM livro l
    LEFT JOIN editora e ON e.id_editora = l.id_editora
    LEFT JOIN area_conhecimento a ON a.id_area = l.id_area
    LEFT JOIN livro_autor la ON la.id_livro = l.id_livro
    LEFT JOIN autor au ON au.id_autor = la.id_autor
    WHERE
        @filtro IS NULL
        OR l.titulo LIKE '%' + @filtro + '%'
        OR l.isbn LIKE '%' + @filtro + '%'
    GROUP BY
        l.id_livro, l.isbn, l.titulo,
        l.ano_publicacao, l.id_editora,
        e.nome, l.id_area, a.descricao
    ORDER BY l.titulo;
END;
GO


CREATE PROCEDURE SP_Atualizar_Livro
    @id_livro INT,
    @isbn VARCHAR(20),
    @titulo VARCHAR(200),
    @ano_publicacao INT = NULL,
    @id_editora INT = NULL,
    @id_area INT = NULL,
    @autores_ids VARCHAR(MAX) = NULL
AS
BEGIN
    UPDATE livro
    SET isbn = @isbn,
        titulo = @titulo,
        ano_publicacao = @ano_publicacao,
        id_editora = @id_editora,
        id_area = @id_area
    WHERE id_livro = @id_livro;

    DELETE FROM livro_autor WHERE id_livro = @id_livro;

    IF @autores_ids IS NOT NULL AND @autores_ids <> ''
    BEGIN
        INSERT INTO livro_autor (id_livro, id_autor)
        SELECT @id_livro, TRY_CAST(value AS INT)
        FROM STRING_SPLIT(@autores_ids, ',')
        WHERE TRY_CAST(value AS INT) IS NOT NULL;
    END;
END;
GO


CREATE PROCEDURE SP_Excluir_Livro
    @id_livro INT
AS
BEGIN
    DELETE FROM livro_autor WHERE id_livro = @id_livro;
    DELETE FROM livro WHERE id_livro = @id_livro;
END;
GO


-- =========================================================
-- 6. EXEMPLAR
-- =========================================================

CREATE PROCEDURE SP_Consultar_Exemplar
    @filtro VARCHAR(200) = NULL
AS
BEGIN
    SELECT
        ex.id_exemplar,
        ex.codigo_barras,
        ex.condicao,
        l.id_livro,
        l.titulo AS titulo_livro,
        l.isbn,
        CASE
            WHEN emp.id_emprestimo IS NOT NULL THEN 'Emprestado'
            ELSE 'Disponível'
        END AS status
    FROM exemplar ex
    INNER JOIN livro l ON l.id_livro = ex.id_livro
    LEFT JOIN emprestimo emp ON emp.id_exemplar = ex.id_exemplar AND emp.data_devolucao_real IS NULL
    WHERE
        @filtro IS NULL
        OR l.titulo LIKE '%' + @filtro + '%'
        OR l.isbn LIKE '%' + @filtro + '%'
        OR ex.codigo_barras LIKE '%' + @filtro + '%'
    ORDER BY l.titulo;
END;
GO


-- =========================================================
-- 7. EMPRESTIMOS
-- =========================================================

CREATE PROCEDURE SP_Consultar_Emprestimos_Ativos
AS
BEGIN
    SELECT
        e.id_emprestimo,
        e.data_emprestimo,
        e.data_devolucao_prevista,
        a.id_aluno,
        a.nome AS nome_aluno,
        a.matricula,
        l.titulo AS titulo_livro
    FROM emprestimo e
    INNER JOIN aluno a ON a.id_aluno = e.id_aluno
    INNER JOIN exemplar ex ON ex.id_exemplar = e.id_exemplar
    INNER JOIN livro l ON l.id_livro = ex.id_livro
    WHERE e.data_devolucao_real IS NULL;
END;
GO


CREATE PROCEDURE SP_Consultar_Historico_Emprestimos
    @filtro VARCHAR(200) = NULL,
    @status VARCHAR(20) = NULL
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);

    SET @sql = N'
        SELECT
            e.id_emprestimo,
            e.data_emprestimo,
            e.data_devolucao_prevista,
            e.data_devolucao_real,
            e.valor_multa,
            a.id_aluno,
            a.nome AS nome_aluno,
            a.matricula,
            l.titulo AS titulo_livro,
            f.nome AS nome_funcionario
        FROM emprestimo e
        INNER JOIN aluno a ON a.id_aluno = e.id_aluno
        INNER JOIN exemplar ex ON ex.id_exemplar = e.id_exemplar
        INNER JOIN livro l ON l.id_livro = ex.id_livro
        INNER JOIN funcionario f ON f.id_funcionario = e.id_funcionario
        WHERE 1=1';

    IF @filtro IS NOT NULL AND @filtro <> ''
        SET @sql += '
        AND (
            a.nome LIKE ''%'' + @filtro + ''%''
            OR l.titulo LIKE ''%'' + @filtro + ''%''
            OR a.matricula LIKE ''%'' + @filtro + ''%''
        )';

    IF @status = 'devolvidos'
        SET @sql += ' AND e.data_devolucao_real IS NOT NULL';
    ELSE IF @status = 'ativos'
        SET @sql += ' AND e.data_devolucao_real IS NULL';

    IF @status = 'devolvidos'
        SET @sql += ' ORDER BY e.data_devolucao_real DESC';
    ELSE
        SET @sql += ' ORDER BY e.id_emprestimo DESC';

    EXEC sp_executesql @sql, N'@filtro VARCHAR(200)', @filtro = @filtro;
END;
GO


-- =========================================================
-- 8. TRIGGERS
-- =========================================================

CREATE TRIGGER TR_Editora_Delete
ON editora
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM livro WHERE id_editora IN (SELECT id_editora FROM deleted))
        THROW 50001, 'Não é possível excluir editora com livros vinculados.', 1;

    DELETE e
    FROM editora e
    INNER JOIN deleted d ON d.id_editora = e.id_editora;
END;
GO


CREATE TRIGGER TR_Area_Delete
ON area_conhecimento
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM livro WHERE id_area IN (SELECT id_area FROM deleted))
        THROW 50001, 'Não é possível excluir área com livros vinculados.', 1;

    DELETE a
    FROM area_conhecimento a
    INNER JOIN deleted d ON d.id_area = a.id_area;
END;
GO


CREATE TRIGGER TR_Autor_Delete
ON autor
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM livro_autor WHERE id_autor IN (SELECT id_autor FROM deleted))
        THROW 50001, 'Não é possível excluir autor com livros vinculados.', 1;

    DELETE a
    FROM autor a
    INNER JOIN deleted d ON d.id_autor = a.id_autor;
END;
GO


CREATE TRIGGER TR_Livro_Delete
ON livro
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM exemplar WHERE id_livro IN (SELECT id_livro FROM deleted))
        THROW 50001, 'Não é possível excluir livro com exemplares vinculados.', 1;

    IF EXISTS (SELECT 1 FROM reserva WHERE id_livro IN (SELECT id_livro FROM deleted))
        THROW 50001, 'Não é possível excluir livro com reservas vinculadas.', 1;

    DELETE la
    FROM livro_autor la
    INNER JOIN deleted d ON d.id_livro = la.id_livro;

    DELETE l
    FROM livro l
    INNER JOIN deleted d ON d.id_livro = l.id_livro;
END;
GO


CREATE TRIGGER TR_Aluno_Delete
ON aluno
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM emprestimo WHERE id_aluno IN (SELECT id_aluno FROM deleted))
        THROW 50001, 'Não é possível excluir aluno com empréstimos.', 1;

    IF EXISTS (SELECT 1 FROM reserva WHERE id_aluno IN (SELECT id_aluno FROM deleted))
        THROW 50001, 'Não é possível excluir aluno com reservas.', 1;

    DELETE a
    FROM aluno a
    INNER JOIN deleted d ON d.id_aluno = a.id_aluno;
END;
GO


CREATE TRIGGER TR_Exemplar_Delete
ON exemplar
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM emprestimo
        WHERE id_exemplar IN (SELECT id_exemplar FROM deleted)
        AND data_devolucao_real IS NULL
    )
        THROW 50001, 'Não é possível excluir exemplar com empréstimo ativo.', 1;

    DELETE ex
    FROM exemplar ex
    INNER JOIN deleted d ON d.id_exemplar = ex.id_exemplar;
END;
GO