// ==========================
// Utilitários
// ==========================
const container = document.querySelector("#articlesContainer");


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
        "Authorization": `Bearer ${getToken()}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erro ao carregar artigos");

    allArticles = await res.json();
    renderArticles(allArticles);
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
    showError("Erro ao carregar os artigos.");
  }
}

// ==========================
// Renderização
// ==========================
function renderArticles(articles) {
  container.innerHTML = ""; // limpa o container antes de renderizar

  const filteredArticles = articles.filter(
    (article) => article.category === "profissional"
  );

  if (filteredArticles.length === 0) {
    container.innerHTML = `<p>Nenhum artigo profissional encontrado.</p>`;
    return;
  }

  if(filteredArticles.length < 3){
    
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
