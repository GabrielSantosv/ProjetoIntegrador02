// Função para carregar os relatórios dos alunos
async function carregarRelatoriosAlunos() {
    try {
        const response = await fetch('http://localhost:3000/relatorios-alunos');
        const alunos = await response.json();

        const tabelaBody = document.getElementById('tbody-relatorios');
        tabelaBody.innerHTML = ''; // Limpa a tabela

        alunos.forEach(aluno => {
            const row = document.createElement('tr');

            // Formatar as horas de entrada e saída
            const entradaFormatada = aluno.entrada ? new Date(aluno.entrada).toLocaleString() : 'Não registrada';
            const saidaFormatada = aluno.saida ? new Date(aluno.saida).toLocaleString() : 'Não registrada';

            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.sobrenome}</td>
                <td>${entradaFormatada}</td>
                <td>${saidaFormatada}</td>
            `;
            tabelaBody.appendChild(row);
        });

        // Log para debug
        console.log('Dados recebidos:', alunos);

    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        alert('Erro ao carregar os relatórios.');
    }
}

// Carregar os dados ao abrir a página
document.addEventListener('DOMContentLoaded', carregarRelatoriosAlunos);