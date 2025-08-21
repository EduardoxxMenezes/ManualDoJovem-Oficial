// ==========================
// Seletores
// ==========================
const inputPassword = document.getElementById('inputPassword');
const inputConfPassword = document.getElementById('inputConfPassword');
const submitBtn = document.getElementById('submitBtn');

// ==========================
// Obter e-mail da URL
// ==========================
// Pega os parâmetros da URL para encontrar o e-mail do utilizador
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');

// ==========================
// Helpers
// ==========================
function validatePasswords(password, confirmPassword) {
    if (!password || !confirmPassword) {
        alert("Preencha ambos os campos de senha.");
        return false;
    }
    if (password.length < 8) {
        alert("A senha deve ter no mínimo 8 caracteres.");
        return false;
    }
    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return false;
    }
    return true;
}

async function updatePassword(email, newPassword) {
    try {
        // Envia a requisição para a API para redefinir a senha
        const res = await fetch(`http://localhost:3000/api/user/reset-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, newPassword: newPassword }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Erro ao atualizar senha.");
        }
        
        alert("Senha alterada com sucesso!");
        inputPassword.value = "";
        inputConfPassword.value = "";
        
        // Redireciona o utilizador para a página de login após a alteração bem-sucedida
        window.location.href = "../../index.html"; 
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// ==========================
// Evento
// ==========================
if (submitBtn) {
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const password = inputPassword.value.trim();
        const confirmPassword = inputConfPassword.value.trim();

        if (!validatePasswords(password, confirmPassword)) return;

        if (!userEmail) {
            alert("Email do utilizador não encontrado. Por favor, reinicie o processo de redefinição de senha.");
            return;
        }

        await updatePassword(userEmail, password);
    });
}