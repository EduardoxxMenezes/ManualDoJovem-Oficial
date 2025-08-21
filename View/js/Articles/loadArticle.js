let editMode = false;

window.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  if (!articleId) {
    document.body.innerHTML = "<p>Artigo não especificado.</p>";
    return;
  }

  // ELEMENTOS
const titleObj = document.getElementById("title");
const descriptionObj = document.getElementById("descriptionText");
const contentObj = document.getElementById("contentText");
const authorObj = document.getElementById("authorName");
  const articleDiv = document.getElementById("articleDiv");
  const commentForm = document.getElementById("commentsSection");
  const commentInput = document.getElementById("addComment");
  const commentButton = document.getElementById("sendComment");
  const commentArea = document.getElementById("CommentArea");
  const img = document.getElementById("authorPic");

  // CARREGAR ARTIGO
  try {
     const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
    const res = await fetch(`http://localhost:3000/api/articles/${articleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    });

    if (!res.ok) throw new Error("Erro ao carregar artigo");

    const article = await res.json();

    // PREENCHER DOM
    authorObj.innerText = article.autor.userName;
    titleObj.innerText = article.titleArticle;
    descriptionObj.innerText = article.descArticle;
    contentObj.innerText = article.contentArticle;

    // FOTO
    const profilePic = article.autor.profilePic;
    if (profilePic.startsWith("data:") || profilePic.startsWith("http")) {
      img.src = profilePic;
    } else {
      img.src = "data:image/jpeg;base64," + profilePic;
    }

    // BOTÕES EDITAR / DELETAR
    if (String(userId) === String(article.autor.id)) {
      // EDITAR
      const editBtn = document.createElement("button");
      editBtn.className = "buttonTheme";
      editBtn.id = "EditButton";
      editBtn.innerText = "Editar Artigo";
      articleDiv.appendChild(editBtn);

      editBtn.addEventListener("click", async () => {
        if (!editMode) {
          editMode = true;
          titleObj.innerHTML = `<input id="titleInput" value="${article.titleArticle}" class="form-control">`;
          descriptionObj.innerHTML = `<input id="descriptionInput" value="${article.descArticle}" class="form-control">`;
          contentObj.innerHTML = `<textarea id="contentInput" class="form-control">${article.contentArticle}</textarea>`;
          editBtn.innerText = "Salvar";
        } else {
          // SALVAR
          editMode = false;
          const title = document.getElementById("titleInput").value;
          const description = document.getElementById("descriptionInput").value;
          const content = document.getElementById("contentInput").value;

          try {
             const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
            const updateRes = await fetch(`http://localhost:3000/api/articles/${articleId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: "include",
              body: JSON.stringify({
                titleArticle: title,
                descArticle: description,
                contentArticle: content
              })
            });

            if (!updateRes.ok) throw new Error("Erro ao atualizar artigo");
            alert("Artigo atualizado com sucesso!");
          } catch (err) {
            console.error(err);
            alert("Erro ao atualizar artigo.");
          }

          article.titleArticle = title;
          article.descArticle = description;
          article.contentArticle = content;

          titleObj.innerText = article.titleArticle;
          descriptionObj.innerText = article.descArticle;
          contentObj.innerText = article.contentArticle;
          editBtn.innerText = "Editar Artigo";
        }
      });

      // DELETAR
      const removeBtn = document.createElement("button");
      removeBtn.className = "buttonTheme";
      removeBtn.id = "removeButton";
      removeBtn.innerText = "Deletar Artigo";
      articleDiv.appendChild(removeBtn);

      removeBtn.addEventListener("click", async () => {
        try {
           const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
          const deleteRes = await fetch(`http://localhost:3000/api/articles/${articleId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: "include"
          });

          if (!deleteRes.ok) throw new Error("Erro ao deletar artigo");
          alert("Artigo deletado com sucesso!");
          window.location.href = "./home.html";
        } catch (err) {
          console.error(err);
          alert("Erro ao deletar artigo: " + err.message);
        }
      });
    }

    // CARREGAR COMENTÁRIOS EXISTENTES
    if (article.comments && Array.isArray(article.comments)) {
      article.comments.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("commentBox");
        const name = c.autor?.userName || c.autor || "Usuário desconhecido";
        div.innerHTML = `<p><strong>${name}</strong></p><p>${c.commentContent}</p>`;
        commentArea.appendChild(div);
      });
    }

  } catch (err) {
    console.error(err);
    document.body.innerHTML = "<p style='color:red'>Erro ao carregar o artigo.</p>";
  }

  // ENVIO DE COMENTÁRIOS
if (commentForm && commentButton && commentInput) {
    commentButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const content = commentInput.value.trim();
        if (!content) {
            return alert("Digite um comentário antes de enviar.");
        }

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const res = await fetch("http://localhost:3000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    author: userId,
                    commentContent: content,
                    article: articleId
                })
            });

            if (!res.ok) {
                // Tenta ler a mensagem de erro do servidor
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao criar comentário");
            }

            const responseData = await res.json();
            const newComment = responseData.comentario; // Corrigido para acessar o objeto aninhado

            // --- Início da nova estrutura HTML ---
            
            // 1. Cria o container principal do comentário
            const divContainer = document.createElement("div");
            divContainer.id = "divComments"; // ID do container principal

            // 2. Cria a seção para foto e nome
            const photoAndNameDiv = document.createElement("div");
            photoAndNameDiv.id = "photoNnameUserComment";

            // 3. Adiciona a foto do autor
            const photoSection = document.createElement("section");
            photoSection.id = "photoUserComment";
            const authorPic = document.createElement("img");
            authorPic.id = "authorPicComment";
            authorPic.src = newComment.author?.profilePic || "./img/fotoPadrao.png"; // Usa a foto do autor ou uma padrão
            authorPic.alt = "Foto do autor do comentário";
            photoSection.appendChild(authorPic);

            // 4. Adiciona o nome do autor
            const nameSection = document.createElement("section");
            nameSection.id = "nameUserComment";
            nameSection.textContent = newComment.author?.userName || "Usuário Desconhecido"; // Corrigido para newComment.author.userName

            // Monta a seção de foto e nome
            photoAndNameDiv.appendChild(photoSection);
            photoAndNameDiv.appendChild(nameSection);

            // 5. Cria a seção para o conteúdo do comentário
            const userCommentSection = document.createElement("section");
            userCommentSection.id = "userComment";
            userCommentSection.classList.add("description");
            const commentParagraph = document.createElement("p");
            commentParagraph.id = "userCommentP";
            commentParagraph.textContent = newComment.commentContent;
            userCommentSection.appendChild(commentParagraph);

            // 6. Monta o container final do comentário
            divContainer.appendChild(photoAndNameDiv);
            divContainer.appendChild(userCommentSection);

            // Adiciona o novo comentário formatado à área de comentários
            commentArea.appendChild(divContainer);

            // --- Fim da nova estrutura HTML ---

            commentInput.value = ""; // Limpa o campo de texto

        } catch (err) {
            console.error(err);
            alert("Erro ao criar comentário: " + err.message);
        }
    });
    try{
      const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const res = await fetch("http://localhost:3000/api/comments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include"
            });
    }
    catch(error){
      alert( "Erro ao carregar comentários: "+ error);
    }
}


});
