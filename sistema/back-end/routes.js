import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

// Função de validação dos dados do aluno
function validateStudentData(data) {
    const { cpf, nome, sobrenome, data_nasc, email, telefone, genero, peso, altura } = data;
    const errors = [];

    if (!cpf) errors.push('CPF é obrigatório');
    if (!nome) errors.push('Nome é obrigatório');
    if (!sobrenome) errors.push('Sobrenome é obrigatório');
    if (!data_nasc) errors.push('Data de nascimento é obrigatória');
    if (!email) errors.push('Email é obrigatório');
    if (!telefone) errors.push('Telefone é obrigatório');
    if (peso && isNaN(peso)) errors.push('Peso deve ser um número');
    if (altura && isNaN(altura)) errors.push('Altura deve ser um número');

    return errors.length > 0 ? errors : null;
}

// Função de validação do login (verifica se o CPF existe)
function validateLoginData(cpf) {
    const errors = [];

    if (!cpf) errors.push('CPF é obrigatório');

    return errors.length > 0 ? errors : null;
}

// Função para cadastrar aluno
async function registerStudent(studentData, res) {
    let connection;
    try {
        connection = await mysql.createPool({
            host: 'localhost', // Endereço do servidor MySQL
            user: 'root',      // Nome de usuário do MySQL
            password: 'sua-senha', // Senha do MySQL
            database: 'seu-banco-de-dados', // Nome do banco de dados
            waitForConnections: true, // Esperar por conexões se estiverem ocupadas
            connectionLimit: 10,     // Limite de conexões simultâneas
            queueLimit: 0            // Sem limite na fila de conexões
        });

        // Verificando se o CPF ou email já estão cadastrados
        const [existingStudent] = await connection.execute(
            `SELECT COUNT(*) AS count FROM aluno WHERE cpf = ? OR email = ?`,
            [studentData.cpf, studentData.email]
        );

        if (existingStudent[0].count > 0) {
            return res.status(400).json({ success: false, message: 'CPF ou email já cadastrado' });
        }

        // Inserindo o novo aluno no banco de dados
        await connection.execute(
            `INSERT INTO aluno (cpf, nome, sobrenome, data_nasc, email, telefone, genero, peso, altura) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ 
                studentData.cpf, 
                studentData.nome, 
                studentData.sobrenome, 
                studentData.data_nasc, 
                studentData.email, 
                studentData.telefone, 
                studentData.genero,
                studentData.peso,
                studentData.altura
            ]
        );

        res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso' });
    } catch (err) {
        console.error('Erro ao cadastrar aluno:', err);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno: ' + err.message });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar a conexão:', err);
            }
        }
    }
}

// Rota de cadastro
router.post('/cadastrar-aluno', async (req, res) => {
    const studentData = req.body;
    const validationErrors = validateStudentData(studentData);
    
    if (validationErrors) {
        return res.status(400).json({ success: false, message: 'Dados inválidos: ' + validationErrors.join(', ') });
    }

    await registerStudent(studentData, res);
});

// Função para validar o formato do CPF no backend
function validarFormatoCPF(cpf) {
    const apenasNumeros = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    return apenasNumeros.length === 11 && /^\d+$/.test(apenasNumeros); // Verifica se tem 11 dígitos numéricos
}

// Função para verificar o CPF no banco de dados
async function loginStudent(cpf, res) {
    let connection;
    try {
        connection = await mysql.createPool({
            host: 'localhost', // Endereço do servidor MySQL
            user: 'root',      // Nome de usuário do MySQL
            password: 'sua-senha', // Senha do MySQL
            database: 'seu-banco-de-dados', // Nome do banco de dados
            waitForConnections: true, // Esperar por conexões se estiverem ocupadas
            connectionLimit: 10,     // Limite de conexões simultâneas
            queueLimit: 0            // Sem limite na fila de conexões
        });

        // Remove caracteres não numéricos do CPF
        const cpfFormatado = cpf.replace(/\D/g, '');

        // Consulta o banco para verificar se o CPF existe
        const [result] = await connection.execute(
            `SELECT COUNT(*) AS count FROM aluno WHERE cpf = ?`,
            [cpfFormatado]
        );

        if (result[0].count === 0) { // Se o CPF não for encontrado
            return res.status(404).json({ success: false, message: 'CPF não encontrado no banco de dados.' });
        }

        // Se o CPF for encontrado, retorna sucesso
        res.status(200).json({ success: true, message: 'Login bem-sucedido' });
    } catch (err) {
        console.error('Erro ao verificar o CPF no banco:', err);
        res.status(500).json({ success: false, message: 'Erro ao realizar login. Tente novamente.' });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar a conexão com o banco:', err);
            }
        }
    }
}

// Rota de login
router.post('/login', async (req, res) => {
    const { cpf } = req.body;

    // Valida o formato do CPF no backend antes de consultar o banco
    if (!cpf || !validarFormatoCPF(cpf)) {
        return res.status(400).json({ success: false, message: 'CPF inválido. Insira um CPF com 11 dígitos numéricos.' });
    }

    // Verifica no banco de dados se o CPF está cadastrado
    await loginStudent(cpf, res);
});


// RELATÓRIO DE ALUNO
router.get('/relatorios-alunos/:cpf', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'sua-senha',
            database: 'seu-banco-de-dados',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const cpf = req.params.cpf;

        // Consulta para buscar informações do aluno
        const query = `
            SELECT 
                nome,
                sobrenome,
                cpf,
                IFNULL(ROUND(hora_semanal, 2), 0) AS hora_semanal,
                CASE 
                    WHEN IFNULL(hora_semanal, 0) > 20 THEN 'Extremamente avançado'
                    WHEN IFNULL(hora_semanal, 0) > 10 THEN 'Avançado'
                    WHEN IFNULL(hora_semanal, 0) > 5 THEN 'Intermediário'
                    ELSE 'Iniciante'
                END AS classificacao
            FROM 
                aluno
            WHERE 
                cpf = ?
        `;

        const [result] = await connection.execute(query, [cpf]);

        // Se não houver resultado, retornar erro
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado.'
            });
        }

        const aluno = result[0];
        res.json({
            nome: aluno.nome,
            sobrenome: aluno.sobrenome,
            cpf: aluno.cpf,
            hora_semanal: aluno.hora_semanal.toFixed(2),
            classificacao: aluno.classificacao
        });
    } catch (err) {
        console.error('Erro ao consultar o aluno:', err);
        res.status(500).json({ error: 'Erro ao consultar o aluno.' });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar a conexão:', err);
            }
        }
    }
});

// RELATÓRIO GERENTE
router.get('/relatorios-alunos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'sua-senha',
            database: 'seu-banco-de-dados',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const query = `
            SELECT 
                nome,
                sobrenome,
                cpf,
                IFNULL(ROUND(horas_totais, 2), 0) AS horas_totais
            FROM 
                aluno
            ORDER BY 
                horas_totais DESC
        `;

        const [result] = await connection.execute(query);

        const alunos = result.map(row => {
            const horas = parseFloat(row.horas_totais) || 0;

            let nivel;
            if (horas > 20) {
                nivel = 'Extremamente Avançado';
            } else if (horas > 10) {
                nivel = 'Avançado';
            } else if (horas > 5) {
                nivel = 'Intermediário';
            } else {
                nivel = 'Iniciante';
            }

            return {
                nome: row.nome,
                sobrenome: row.sobrenome,
                cpf: row.cpf,
                horas_totais: horas.toFixed(2),
                nivel: nivel
            };
        });

        res.json(alunos);
    } catch (err) {
        console.error('Erro ao consultar alunos:', err);
        res.status(500).json({ error: 'Erro ao consultar alunos.' });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar conexão:', err);
            }
        }
    }
});

// CADASTRO CATRACA
router.post('/cadastro-catraca', async (req, res) => {
    const { cpf, tipo } = req.body; // 'tipo' é 'E' para entrada ou 'S' para saída
    let connection;

    try {
        connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'sua-senha',
            database: 'seu-banco-de-dados',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Verificar se o aluno existe
        const [alunoResult] = await connection.execute(
            `SELECT COUNT(*) AS count FROM aluno WHERE cpf = ?`,
            [cpf]
        );

        if (alunoResult[0].count === 0) {
            return res.status(404).json({
                success: false,
                message: 'CPF não encontrado no banco de dados.'
            });
        }

        if (tipo === 'E') {
            // Registrar entrada
            await connection.execute(
                `INSERT INTO sessao (cpf_aluno, entrada) 
                 VALUES (?, NOW())`,
                [cpf]
            );

            res.status(200).json({
                success: true,
                message: 'Entrada registrada com sucesso!'
            });

        } else if (tipo === 'S') {
            // Registrar saída
            const [result] = await connection.execute(
                `UPDATE sessao
                 SET saida = NOW()
                 WHERE cpf_aluno = ? AND saida IS NULL`,
                [cpf]
            );

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma entrada encontrada para registrar a saída.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Saída registrada com sucesso!'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Tipo inválido. Use "E" para entrada ou "S" para saída.'
            });
        }

    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor.'
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar a conexão:', err);
            }
        }
    }
});



export default router;