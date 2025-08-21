// ==========================
// Seletores
// ==========================
const inputPassword = document.getElementById('inputPassword');
const inputConfPassword = document.getElementById('inputConfPassword');
const submitBtn = document.getElementById('submitBtn');

// ==========================
// Helpers
// ==========================
function validatePasswords(password, confirmPassword) {
    if (!password || !confirmPassword) {
        alert("Preencha ambos os campos de senha.");
        return false;
    }
    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return false;
    }
    return true;
}

function getUserId() {
    return localStorage.getItem("userId");
}

async function updatePassword(userId, newPassword) {
    try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}/senha`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novaSenha: newPassword }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar senha.");
        alert("Senha alterada com sucesso!");
        inputPassword.value = "";
        inputConfPassword.value = "";
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

        const userId = getUserId();
        if (!userId) {
            alert("Usuário não identificado.");
            return;
        }

        await updatePassword(userId, password);
    });
}
