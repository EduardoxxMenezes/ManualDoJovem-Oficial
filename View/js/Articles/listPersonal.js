// ==========================
// Utilitários
// ==========================
const container = document.querySelector("#articlesContainer");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");



// ==========================
// Estado
// ==========================
let allArticles = [];

// ==========================
// Carregar artigos
// ==========================
async function loadArticles() {
  try {
    const res = await fetch("http://localhost:3000/api/articles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erro ao carregar artigos");

    allArticles = await res.json();
    renderArticles(allArticles);
    console.log(allArticles)
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
    showError("Erro ao carregar os artigos.");
  }

}

// ==========================
// Renderização
// ==========================
function renderArticles(articles) {
  container.innerHTML = ""; 

  const filteredArticles = articles.filter(
    (article) => article.category == "pessoal"
  );
  console.log(filteredArticles, " ", filteredArticles.length)
  if (filteredArticles.length == 0) {
    container.innerHTML = `<p>Nenhum artigo pessoal encontrado.</p>`;
    return;
  }

  filteredArticles.forEach(renderArticleCard);
}

function renderArticleCard(article) {
  const card = document.createElement("button");
  card.classList.add("articleCard");

  card.innerHTML = `
    <h3>${article.titleArticle}</h3>
    <p>${article.descArticle}</p>
    <div class="author">Autor: ${article.autor?.userName ?? "Desconhecido"}</div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `./articles.html?id=${article.id}`;
  });

  container.appendChild(card);
}

// ==========================
// Exibir erros
// ==========================
function showError(message) {
  container.innerHTML = `<p style="color: red;">${message}</p>`;
}

// ==========================
// Inicialização
// ==========================
window.addEventListener("DOMContentLoaded", loadArticles);
