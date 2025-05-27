// Função para carregar os relatórios dos alunos
async function carregarRelatoriosAlunos() {
    try {
        const userCpf = localStorage.getItem('userCpf');
        if (!userCpf) {
            window.location.href = './login.html';
            return;
        }

        // A URL agora inclui o CPF do usuário, que será usado para buscar os dados do aluno
        const response = await fetch(`http://localhost:3000/relatorios-alunos/${userCpf}`);
        const aluno = await response.json();  // Supondo que o backend retorne os dados do aluno diretamente

        const tabelaBody = document.getElementById('tbody-relatorios');
        tabelaBody.innerHTML = ''; // Limpa a tabela

        if (aluno) { // Caso o aluno seja encontrado
            const row = document.createElement('tr');
            // Verifica se as horas estão presentes e formata a classificação
            const horasFormatadas = aluno.hora_semanais ? 
                                    aluno.hora_semanais.toFixed(2) + ' horas' : 
                                    '0.00 horas';

            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.sobrenome}</td>
                <td>${horasFormatadas}</td>
                <td>${aluno.classificacao || 'Sem classificação'}</td>
            `;
            tabelaBody.appendChild(row);
        } else {
            tabelaBody.innerHTML = '<tr><td colspan="4">Nenhum dado encontrado</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar o relatório:', error);
        alert('Erro ao carregar o relatório.');
    }
}

// Carregar os dados ao abrir a página
document.addEventListener('DOMContentLoaded', carregarRelatoriosAlunos);
