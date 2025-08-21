// ==========================
// Seletores
// ==========================
const form = document.querySelector("form");
const input = document.getElementById("fileInput");
const dropzone = document.getElementById("drop-zone");
const text = document.getElementById("text");
const image = document.getElementById("photoImg");
const saveBtn = document.getElementById("updateBtn");
const btnDelete = document.getElementById("deleteBtn");
const confirmModal = document.getElementById("confirmModal");
const confirmDelete = document.getElementById("confirmDeleteBtn");
const cancelDelete = document.getElementById("cancelDeleteBtn");

// ==========================
// Estado
// ==========================
let newPicture = "";
const fotoPadrao = "./img/fotoPadrao.png";

// ==========================
// Helpers
// ==========================
const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

function updatePreviewImage(src) {
    if (image) image.src = src;
}

// ==========================
// Inicialização do perfil
// ==========================
window.addEventListener("DOMContentLoaded", async () => {
    const userNameInput = document.getElementById("nameChange");
    const userEmailInput = document.getElementById("emailChange");

    try {
        const res = await fetch(`http://localhost:3000/api/user/${getUserId()}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            credentials: "include",
        });

        if (!res.ok) { throw new Error("Erro ao carregar usuário") }

        const user = await res.json();
        newPicture = user.profilePic || fotoPadrao;
        updatePreviewImage(newPicture);

        if (userNameInput) userNameInput.value = user.userName || "";
        if (userEmailInput) userEmailInput.value = user.userEmail || "";
    } catch {
        updatePreviewImage(fotoPadrao);
    }
});


// ==========================
// Eventos de drag/drop
// ==========================
function onEnter() { if (form) form.classList.add("active"); }
function onLeave() { if (form) form.classList.remove("active"); }

if (form) {
    ["dragenter", "drop", "dragend", "dragleave"].forEach(event =>
        form.addEventListener(event, event === "dragenter" ? onEnter : onLeave)
    );
}

// ==========================
// Seleção de imagem
// ==========================
if (input) {
    input.addEventListener("change", () => {
        if (input.files.length === 0) return;

        const file = input.files[0];
        const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedFormats.includes(file.type)) {
            alert("Selecione um arquivo PNG, JPEG ou JPG");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            newPicture = e.target.result;
            localStorage.setItem("newPicture", newPicture)
            updatePreviewImage(newPicture);


            const oldImg = document.querySelector("#cover");
            if (oldImg && dropzone) dropzone.removeChild(oldImg);

            const img = document.createElement("img");
            img.id = "cover";
            img.src = newPicture;

            if (text) text.innerHTML = "";
            if (dropzone) dropzone.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// ==========================
// Remover foto de perfil
// ==========================
function removePicture() {
    newPicture = fotoPadrao;
    localStorage.setItem("newPicture", newPicture)
    updatePreviewImage(fotoPadrao);
}

// ==========================
// Atualizar informações do usuário
// ==========================
if (saveBtn) {
    saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const profilePic = localStorage.getItem("newPicture");
        const userName = document.querySelector("#nameChange")?.value;
        const userEmail = document.querySelector("#emailChange")?.value;

        try {
            const res = await fetch(`http://localhost:3000/api/user/${getUserId()}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                credentials: "include",
                body: JSON.stringify({
                    userName: userName,
                    userEmail: userEmail,
                    profilePic: profilePic
                })

            });

            if (!res.ok) throw new Error("Erro ao atualizar usuário");
            if (res.ok) {
                alert("Informações atualizadas com sucesso!");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
}

// ==========================
// Deletar usuário
// ==========================
if (btnDelete) btnDelete.addEventListener("click", () => confirmModal.style.display = "block");
if (cancelDelete) cancelDelete.addEventListener("click", () => confirmModal.style.display = "none");

if (confirmDelete) {
    confirmDelete.addEventListener("click", async () => {
        confirmModal.style.display = "none";

        try {
            const res = await fetch(`http://localhost:3000/api/user/${getUserId()}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                credentials: "include"
            });

            if (!res.ok) throw new Error("Erro ao deletar usuário");
            if (res.ok) {

                alert("Usuário deletado com sucesso!");
                window.location.href = "../index.html";
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao deletar usuário.");
        }
    });
}