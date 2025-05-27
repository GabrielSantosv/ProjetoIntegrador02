document.getElementById('cadastro-aluno').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const data_nasc = document.getElementById("data_nasc").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const genero = document.getElementById("genero").value;
    const peso = document.getElementById("peso").value;
    const altura = document.getElementById("altura").value;

    // Objeto com os dados a serem enviados
    const data = {
        nome: nome,
        sobrenome: sobrenome,
        data_nasc: data_nasc,
        cpf: cpf,
        email: email,
        telefone: telefone,
        genero: genero,
        peso: peso,
        altura: altura,
    };

    // Log para verificar os dados antes de enviar
    console.log('Dados do aluno:', data);

    try {
        // Envia os dados para o backend via POST
        const response = await fetch('http://localhost:3000/cadastrar-aluno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),  // Envia os dados em formato JSON
        });

        // Recebe a resposta do servidor
        const result = await response.json();
        console.log(result);

        // Verifica o sucesso do cadastro
        if (result.success) {
            alert('Cadastro realizado com sucesso!');
            // Redireciona para a página de listagem de alunos ou outra página, se necessário
            // window.location.href = '/listagem-alunos'; // Descomente para redirecionar
        } else {
            alert(result.message || 'Erro ao cadastrar aluno.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar aluno.');
    }
});
