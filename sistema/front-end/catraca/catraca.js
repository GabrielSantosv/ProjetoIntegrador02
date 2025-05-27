// Função para validar o formato do CPF
function validarFormatoCPF(cpf) {
    const apenasNumeros = cpf.replace(/\D/g, '');
    return apenasNumeros.length === 11 && /^\d+$/.test(apenasNumeros);
}

// Função para processar entrada
async function submitEntrada() {
    const cpf = document.getElementById('cpf').value.trim();

    // Valida o formato do CPF
    if (!validarFormatoCPF(cpf)) {
        alert('CPF inválido. Insira um CPF com 11 dígitos numéricos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastro-catraca', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                cpf: cpf,
                tipo: 'E'  // 'E' para entrada
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Entrada registrada com sucesso!');
            window.location.href = 'catraca.html'; // Volta para a página principal
        } else {
            alert(data.message || 'Erro ao registrar entrada. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao tentar registrar entrada:', error);
        alert('Erro de conexão com o servidor. Tente novamente.');
    }
}

// Função para processar saída
async function submitSaida() {
    const cpf = document.getElementById('cpf').value.trim();

    // Valida o formato do CPF
    if (!validarFormatoCPF(cpf)) {
        alert('CPF inválido. Insira um CPF com 11 dígitos numéricos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastro-catraca', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                cpf: cpf,
                tipo: 'S'  // 'S' para saída
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Saída registrada com sucesso!');
            window.location.href = 'catraca.html'; // Volta para a página principal
        } else {
            alert(data.message || 'Erro ao registrar saída. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao tentar registrar saída:', error);
        alert('Erro de conexão com o servidor. Tente novamente.');
    }
}
