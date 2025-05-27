// Função para validar o formato do CPF
function validarFormatoCPF(cpf) {
    const apenasNumeros = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    return apenasNumeros.length === 11 && /^\d+$/.test(apenasNumeros); // Verifica se tem 11 dígitos numéricos
}

// Captura o evento de submissão do formulário de login
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const cpf = document.getElementById('cpf').value.trim(); // Remove espaços em branco

    // Valida o formato do CPF no frontend antes de enviar ao backend
    if (!validarFormatoCPF(cpf)) {
        alert('CPF inválido. Insira um CPF com 11 dígitos numéricos.');
        return;
    }

    try {
        // Envia o CPF para o backend no corpo da requisição
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf }) // Envia o CPF como JSON
        });

        const data = await response.json(); // Processa a resposta do servidor

        if (response.ok) {
            // Login bem-sucedido
            localStorage.setItem('userCpf', cpf); // Armazena o CPF no localStorage
            alert(data.message); // Exibe a mensagem do backend
            window.location.href = './relatorio.html'; // Redireciona para a página de relatórios
        } else {
            // Exibe mensagens de erro do backend
            alert(data.message || 'Erro ao realizar login. Tente novamente.');
        }
    } catch (error) {
        // Lida com erros de conexão ou problemas no servidor
        console.error('Erro ao tentar realizar o login:', error);
        alert('Erro de conexão com o servidor. Tente novamente.');
    }
});
