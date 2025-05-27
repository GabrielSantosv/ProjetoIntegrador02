Passo 1: Subindo o Banco de Dados =
Instalar o MySQL: Caso ainda não tenha o MySQL instalado, siga as instruções de instalação para seu sistema operacional.

Criar o Banco de Dados:

Abra o terminal do MySQL:




mysql -u root -p
Digite a senha do root (ou o usuário de sua escolha) quando solicitado.
Crie o banco de dados:



CREATE DATABASE nome_do_banco;
USE nome_do_banco;
Criar as Tabelas:

Execute o script SQL para criar as tabelas necessárias no banco de dados (a tabela para aluno, sessao, etc.):



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
    cpf_aluno VARCHAR(11),                  
    entrada_hora DATETIME,                  
    saida_hora DATETIME,                    
    PRIMARY KEY (cpf_aluno, entrada_hora),  
    FOREIGN KEY (cpf_aluno) REFERENCES aluno(cpf) ON DELETE CASCADE 
);
Verificar as Tabelas Criadas:

Para garantir que tudo foi criado corretamente:



SHOW TABLES;
Passo 2: Subindo o Backend (API)
Abrir o Backend no VSCode:

Abra o VSCode e carregue a pasta onde o backend está localizado.
Instalar as Dependências:

No terminal do VSCode, navegue até a pasta do backend e instale as dependências do projeto:




cd /caminho/para/seu/backend
npm install

Configuração do Banco de Dados:

Certifique-se de que o arquivo de configuração do banco de dados (geralmente config.js ou similar) está configurado corretamente com as credenciais do banco que você acabou de criar



const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Seu usuário do MySQL
  password: 'senha', // Sua senha do MySQL
  database: 'nome_do_banco' // O banco de dados que você criou
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado ao banco de dados!');
});
Subir o Backend:

Agora, no terminal, dentro da pasta do backend, execute o comando para subir a API:





npm start


A API deverá estar rodando em http://localhost:3000. Verifique se a API está funcionando acessando a URL no navegador ou utilizando ferramentas como o Postman.

Passo 3: Subindo o Frontend (Interface do Usuário)
Abrir o Frontend no VSCode:

Abra a pasta onde o frontend está localizado no VSCode.
Instalar as Dependências:

No terminal do VSCode, navegue até a pasta do frontend e instale as dependências do projeto:




cd /caminho/para/seu/frontend
npm install
Configuração do Frontend:

Verifique se a URL da API está configurada corretamente no frontend. No código, a URL das requisições pode ser algo como



const response = await fetch('http://localhost:3000/relatorios-alunos');
Subir o Frontend:

Execute o comando para rodar o servidor de desenvolvimento do frontend:





npm start
O frontend deve agora estar disponível em http://localhost:3000 ou em outra porta configurada. Verifique se a interface está carregando corretamente.

Passo 4: Testar a Aplicação
Cadastrar um Aluno:

Acesse a página de cadastro de aluno (cadastro.html), preencha os dados e submeta o formulário. Verifique se o aluno é adicionado ao banco de dados.
Registrar Entrada/Saída:

Acesse a página de catraca (catraca.html), registre entradas e saídas para os alunos. Verifique se os dados são salvos corretamente na tabela sessao no banco de dados.
Visualizar Relatório:

Acesse a página de relatórios (relatorio.html), onde você pode visualizar as informações dos alunos, como nome, horas semanais e classificação.
Dicas de Solução de Problemas
Erro de Conexão com o Banco:

Verifique se o MySQL está rodando corretamente com o comando:




mysqladmin -u root -p status
Certifique-se de que as credenciais no arquivo de configuração do backend estão corretas.
Erro no Backend:

Verifique se o backend está corretamente configurado e rodando no terminal. Se aparecer algum erro, confira o log no terminal onde o servidor backend está rodando.
Erros no Frontend:

Se o frontend não carregar ou exibir erros, confira o console do navegador (F12 > Console) para detalhes sobre os problemas e verifique se as URLs de requisição à API estão corretas.
Finalizando
Com esses passos, você deverá ter tanto o banco de dados, quanto o backend e o frontend rodando localmente em sua máquina de desenvolvimento. Agora você pode testar todas as funcionalidades e continuar o desenvolvimento da sua aplicação!






