// ==========================
// Seletores
// ==========================
const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#emailLogin");
const passwordInput = document.querySelector("#senhaLogin");

// ==========================
// Helpers
// ==========================
function validateLogin(email, password) {
    if (!email || !password) {
        alert("INSIRA UM EMAIL E UMA SENHA!");
        return false;
    }
    return true;
}

function saveUserData(user, token) {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("token", token);
}

// ==========================
// Login
// ==========================
async function handleLogin(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validateLogin(email, password)) return;

    try {
        const res = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erro ao fazer login");
            return;
        }

        saveUserData(data.user, data.token);
        alert("LOGIN REALIZADO COM SUCESSO!");
        window.location.href = "./View/home.html";

    } catch (error) {
        alert("Erro na requisição: " + error.message);
    }
}

// ==========================
// Evento
// ==========================
if (loginForm) loginForm.addEventListener("submit", handleLogin);
