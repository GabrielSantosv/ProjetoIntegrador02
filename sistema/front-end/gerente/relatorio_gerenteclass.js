// Função para carregar os relatórios dos alunos
async function carregarRelatoriosAlunos() {
    try {
        const response = await fetch('http://localhost:3000/relatorios-alunos');
        const alunos = await response.json();

        const tabelaBody = document.getElementById('tbody-relatorios');
        tabelaBody.innerHTML = '';

        // Ordenar alunos pela quantidade de horas (ordem decrescente)
        alunos.sort((a, b) => b.hora_semanal - a.hora_semanal);

        alunos.forEach(aluno => {
            // Obter a classificação com base nas horas semanais
            const classificacao = getClassificacao(aluno.hora_semanal);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.sobrenome}</td>
                <td>${classificacao}</td>
            `;
            tabelaBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar os relatórios dos alunos:', error);
        alert('Erro ao carregar os relatórios.');
    }
}

// Função para determinar a classificação com base nas horas
function getClassificacao(horas) {
    if (horas > 20) return 'Extremamente avançado';
    if (horas > 10) return 'Avançado';
    if (horas > 5) return 'Intermediário';
    return 'Iniciante';
}

// Carregar os dados ao abrir a página
document.addEventListener('DOMContentLoaded', carregarRelatoriosAlunos);
