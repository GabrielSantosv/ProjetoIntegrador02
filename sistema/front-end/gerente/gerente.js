document.addEventListener('DOMContentLoaded', function() {

    // 1. Exibir uma mensagem de boas-vindas
    function exibirMensagemBoasVindas() {
        const nomeGerente = "ADMIN"; // Aqui você pode personalizar ou pegar o nome do gerente via sistema
        const boasVindasElement = document.getElementById('boas-vindas'); // Um elemento na página para exibir a mensagem
        if (boasVindasElement) {
            boasVindasElement.innerHTML = `Bem-vindo ao Painel do Gerente, ${nomeGerente}!`;
        } else {
            alert(`Bem-vindo ao Painel do Gerente, ${nomeGerente}!`);
        }
    }

    exibirMensagemBoasVindas();

    // 2. Confirmar saída
    const btnSair = document.querySelector('a[href="#"]'); // O link de "Sair"
    if (btnSair) {
        btnSair.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de navegação
            const sairConfirmado = confirm("Você tem certeza que deseja sair?");
            if (sairConfirmado) {
                // Redireciona para a página de login ou outra página de saída
                window.location.href = 'login.html'; // ou qualquer página de logout
            }
        });
    }

    // 3. Ação de navegação com mensagens ou ações específicas
    const linksGerente = document.querySelectorAll('.opcoes-gerente a');
    linksGerente.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previne a navegação imediata
            const acao = link.getAttribute('href');
            switch (acao) {
                case "relatorio_aluno.html":
                    alert("Carregando relatório de alunos...");
                    break;
            }
            // Após a mensagem de alerta, podemos redirecionar o usuário
            setTimeout(() => {
                window.location.href = acao; // Navega para a página desejada
            }, 1000); // 1 segundo após o alerta
        });
    });

    // 4. Função para carregar os relatórios dos alunos
    async function carregarRelatoriosAlunos() {
        try {
            const response = await fetch('http://localhost:3000/relatorios-alunos');
            const alunos = await response.json();

            const tabelaBody = document.getElementById('tbody-relatorios');
            tabelaBody.innerHTML = ''; // Limpa a tabela

            // Ordenar alunos pela quantidade de horas (ordem decrescente)
            alunos.sort((a, b) => b.hora_semanal - a.hora_semanal);

            alunos.forEach(aluno => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>${aluno.sobrenome}</td>
                    <td>${aluno.classificacao}</td>
                `;
                tabelaBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar os relatórios dos alunos:', error);
            alert('Erro ao carregar os relatórios.');
        }
    }

    // Carregar os dados ao abrir a página
    carregarRelatoriosAlunos();

});
