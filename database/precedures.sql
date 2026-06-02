-- ====================================================================
-- PROCEDURES PARA A TABELA ALUNO (CRUD COMPLETO)
-- ====================================================================

-- 1. CREATE (Inserir Aluno)
CREATE PROCEDURE SP_Inserir_Aluno
    @matricula VARCHAR(20),
    @nome VARCHAR(100),
    @email VARCHAR(100),
    @telefone VARCHAR(20)
AS
BEGIN
    INSERT INTO aluno (matricula, nome, email, telefone, status_bloqueio)
    VALUES (@matricula, @nome, @email, @telefone, 0);
END;
GO

-- 2. READ (Consultar Alunos)
-- Pode buscar todos ou filtrar por matrícula
CREATE PROCEDURE SP_Consultar_Aluno
    @matricula VARCHAR(20) = NULL
AS
BEGIN
    IF @matricula IS NULL
        SELECT id_aluno, matricula, nome, email, telefone, status_bloqueio 
        FROM aluno;
    ELSE
        SELECT id_aluno, matricula, nome, email, telefone, status_bloqueio 
        FROM aluno 
        WHERE matricula = @matricula;
END;
GO

-- 3. UPDATE (Atualizar dados do Aluno)
CREATE PROCEDURE SP_Atualizar_Aluno
    @id_aluno INT,
    @nome VARCHAR(100),
    @email VARCHAR(100),
    @telefone VARCHAR(20),
    @status_bloqueio BIT
AS
BEGIN
    UPDATE aluno
    SET nome = @nome,
        email = @email,
        telefone = @telefone,
        status_bloqueio = @status_bloqueio
    WHERE id_aluno = @id_aluno;
END;
GO

-- 4. DELETE (Excluir Aluno)
-- Nota de projeto: Em sistemas reais, evitamos deletar alunos se eles têm histórico. 
-- Mas aqui está a procedure para cumprir o requisito de exclusão.
CREATE PROCEDURE SP_Excluir_Aluno
    @id_aluno INT
AS
BEGIN
    DELETE FROM aluno WHERE id_aluno = @id_aluno;
END;
GO

-- ====================================================================
-- PROCEDURES PARA MOVIMENTAÇÃO (EMPRÉSTIMO)
-- ====================================================================

-- Procedure inteligente para Registrar Empréstimo
CREATE PROCEDURE SP_Registrar_Emprestimo
    @id_aluno INT,
    @id_exemplar INT,
    @id_funcionario INT,
    @dias_emprestimo INT = 7 -- Padrão de 7 dias, mas pode ser alterado
AS
BEGIN
    -- Calcula a data de devolução prevista automaticamente usando o SQL Server
    DECLARE @data_hoje DATE = GETDATE();
    DECLARE @data_prevista DATE = DATEADD(DAY, @dias_emprestimo, @data_hoje);

    INSERT INTO emprestimo (data_emprestimo, data_devolucao_prevista, id_aluno, id_exemplar, id_funcionario)
    VALUES (@data_hoje, @data_prevista, @id_aluno, @id_exemplar, @id_funcionario);
END;
GO

-- Procedure inteligente para Registrar Devolução (Com cálculo de multa)
CREATE PROCEDURE SP_Registrar_Devolucao
    @id_emprestimo INT,
    @valor_multa_diaria DECIMAL(10,2) = 2.50 -- Multa de R$ 2,50 por dia de atraso
AS
BEGIN
    DECLARE @data_hoje DATE = GETDATE();
    DECLARE @data_prevista DATE;
    DECLARE @dias_atraso INT;
    DECLARE @multa_total DECIMAL(10,2) = 0.00;

    -- Pega a data prevista que estava no banco
    SELECT @data_prevista = data_devolucao_prevista 
    FROM emprestimo 
    WHERE id_emprestimo = @id_emprestimo;

    -- Calcula se teve atraso (DATEDIFF retorna a diferença em dias)
    SET @dias_atraso = DATEDIFF(DAY, @data_prevista, @data_hoje);

    -- Se atrasou, calcula a multa
    IF @dias_atraso > 0
    BEGIN
        SET @multa_total = @dias_atraso * @valor_multa_diaria;
    END

    -- Atualiza o registro de empréstimo com a data real e a multa (se houver)
    UPDATE emprestimo
    SET data_devolucao_real = @data_hoje,
        valor_multa = @multa_total
    WHERE id_emprestimo = @id_emprestimo;
END;
GO