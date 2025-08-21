document.addEventListener('DOMContentLoaded', () => {
    const emailSection = document.getElementById('emailSection');
    const codeSection = document.getElementById('codeSection');
    const emailInput = document.getElementById('emailInput');
    const sendCodeButton = document.getElementById('sendCodeButton');
    const codeForm = document.getElementById('codeForm');

    // Adiciona um evento ao botão para enviar o código de redefinição
    sendCodeButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email) {
            alert('Por favor, insira o seu e-mail.');
            return;
        }

        try {
            // Faz a requisição para a API enviar o código
            const response = await fetch('http://localhost:3000/api/send-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Esconde a secção do e-mail e mostra a secção para inserir o código
                emailSection.style.display = 'none';
                codeSection.style.display = 'block';
            } else {
                alert(data.message || 'Erro ao enviar o código.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao tentar enviar o código.');
        }
    });

    // Adiciona um evento ao formulário para verificar o código inserido
    codeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Junta os valores de todos os campos de input do código
        const code = Array.from(codeForm.querySelectorAll('.field')).map(input => input.value).join('');
        const email = emailInput.value.trim();

        try {
            // Faz a requisição para a API verificar o código
            const response = await fetch('http://localhost:3000/api/verify-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                // Se o código estiver correto, redireciona para a página de nova senha
                window.location.href = `./newPassword.html?email=${encodeURIComponent(email)}`;
            } else {
                alert(data.message || 'Código inválido.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao verificar o código.');
        }
    });
});