// ==========================
// Seletores
// ==========================
const criarBtn = document.querySelector("#createArticleBtn");

const inputTitle = document.querySelector("#title");
const inputDescription = document.querySelector("#description");
const inputContent = document.querySelector("#content");
const selectCategory = document.querySelector("#category");

const titlePreview = document.querySelector("#titlePreview");
const descriptionPreview = document.querySelector("#descriptionPreview");
const contentPreview = document.querySelector("#contentPreview");

// ==========================
// Helpers
// ==========================
const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

function updatePreview(input, preview, defaultText) {
  if (preview) preview.textContent = input.value || defaultText;
}

function validateFields(title, description, content, category) {
  if (!title || !description || !content) {
    alert("Por favor, preencha todos os campos!");
    return false;
  }
  if (!category) {
    alert("Por favor, selecione uma categoria!");
    return false;
  }
  return true;
}

// ==========================
// Atualização dos previews
// ==========================
inputTitle.addEventListener("input", () => updatePreview(inputTitle, titlePreview, "Título do Artigo"));
inputDescription.addEventListener("input", () => updatePreview(inputDescription, descriptionPreview, "Descrição aparecerá aqui."));
inputContent.addEventListener("input", () => updatePreview(inputContent, contentPreview, "O conteúdo do artigo será exibido aqui."));

// ==========================
// Criação do artigo
// ==========================
async function createArticle(e) {
  e.preventDefault();

  const title = inputTitle.value.trim();
  const description = inputDescription.value.trim();
  const content = inputContent.value.trim();
  const category = selectCategory.value;

  if (!validateFields(title, description, content, category)) return;

  const token = getToken();

  try {
    const res = await fetch("http://localhost:3000/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        content,
        author: getUserId(),
        category,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Erro ao publicar artigo");
    }

    const createdArticle = await res.json();
    localStorage.setItem("lastArticle", JSON.stringify(createdArticle));

    alert("Artigo publicado com sucesso!");
    redirectByCategory(category);

  } catch (error) {
    alert("Erro na requisição: " + error.message);
  }
}

// ==========================
// Redirecionamento
// ==========================
function redirectByCategory(category) {
  const routes = {
    professional: "./professional-screen.html",
    financial: "./financial-screen.html",
    personal: "./personal-screen.html",
  };
  window.location.href = routes[category] || "./home.html";
}

// ==========================
// Evento
// ==========================
criarBtn.addEventListener("click", createArticle);
