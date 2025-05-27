-- Tabela de alunos
CREATE TABLE alunos (
    Cpf VARCHAR2(11) PRIMARY KEY,
    Nome VARCHAR2(50) NOT NULL,
    Sobrenome VARCHAR2(50) NOT NULL,
    Data_nasc DATE NOT NULL,
    Email VARCHAR2(100) UNIQUE,
    Telefone VARCHAR2(15) NOT NULL,
    peso NUMBER(5),
    altura DECIMAL(5,2),
    Genero CHAR(1),
    horas_totais FLOAT DEFAULT 0,
    hora_semanal FLOAT DEFAULT 0
);

-- Tabela de sessões (registro de entradas e saídas)
CREATE TABLE sessao (
    id INT AUTO_INCREMENT PRIMARY KEY,     
    cpf_aluno VARCHAR(11),                  
    entrada DATETIME,                       
    saida DATETIME,                         
    FOREIGN KEY (cpf_aluno) REFERENCES aluno(cpf) ON DELETE CASCADE  
);

-- Tabela temporária para controlar entradas e saídas (pode ser apagada a cada ciclo de cálculo)
CREATE TABLE temp_sessoes (
    cpf_aluno VARCHAR(11),                  -- CPF do aluno
    entrada_hora DATETIME,                  -- Hora de entrada
    saida_hora DATETIME,                    -- Hora de saída
    PRIMARY KEY (cpf_aluno, entrada_hora),  -- Chave primária composta
    FOREIGN KEY (cpf_aluno) REFERENCES aluno(cpf) ON DELETE CASCADE -- Relaciona com a tabela aluno
);


 


DELIMITER $$

CREATE TRIGGER trg_atualizar_horas_totais
AFTER UPDATE ON sessao
FOR EACH ROW
BEGIN
    -- Verifica se a saída não é nula
    IF NEW.saida IS NOT NULL THEN
        DECLARE v_duracao DECIMAL(10, 2);
        
        -- Calcula a duração da sessão em horas
        SET v_duracao = TIMESTAMPDIFF(SECOND, NEW.entrada, NEW.saida) / 3600;
        
        -- Atualiza o total de horas do aluno
        UPDATE aluno
        SET horas_totais = COALESCE(horas_totais, 0) + v_duracao
        WHERE cpf = NEW.cpf_aluno;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_calcular_horas_semanais
AFTER INSERT OR UPDATE ON sessao
FOR EACH ROW
BEGIN
    DECLARE v_horas_semanais DECIMAL(10, 2);
    
    -- Calcula as horas semanais para o aluno com base nas sessões da última semana
    SELECT COALESCE(SUM(TIMESTAMPDIFF(SECOND, s.entrada, s.saida)) / 3600, 0)
    INTO v_horas_semanais
    FROM sessao s
    WHERE s.cpf_aluno = NEW.cpf_aluno
      AND s.entrada IS NOT NULL
      AND s.saida IS NOT NULL
      AND s.entrada >= CURDATE() - INTERVAL 7 DAY;  -- Últimos 7 dias
    
    -- Atualiza a tabela aluno com as horas semanais calculadas
    UPDATE aluno
    SET hora_semanal = v_horas_semanais
    WHERE cpf = NEW.cpf_aluno;
END$$

DELIMITER ;