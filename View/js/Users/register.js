// ==========================
// Seletores
// ==========================
const registerForm = document.querySelector("#infos");
const confirmButton = document.querySelector("#confirmButtonRegister");

// ==========================
// Helpers
// ==========================
function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        alert("A senha e a confirmação de senha devem ser iguais!");
        return false;
    }
    return true;
}

async function getRandomProfilePic() {
    try {
        const res = await fetch("https://randomuser.me/api/");
        if (!res.ok) throw new Error("Erro ao obter foto de perfil");
        const data = await res.json();
        return data.results[0].picture.large;
    } catch (error) {
        console.error(error);
        return null; // Retorna null se houver erro, pode usar foto padrão
    }
}

async function registerUser({ name, email, password, profilePic }) {
    try {
        const res = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password, profilePic })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Erro ao cadastrar");
        alert("CADASTRO REALIZADO COM SUCESSO!");
    } catch (error) {
        console.error(error);
        alert("Erro na requisição: " + error.message);
    }
}

// ==========================
// Evento
// ==========================
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const confPassword = document.querySelector("#confPass").value;

        if (!validatePasswords(password, confPassword)) return;

        const profilePic = await getRandomProfilePic();

        await registerUser({ name, email, password, profilePic });
    });
}
