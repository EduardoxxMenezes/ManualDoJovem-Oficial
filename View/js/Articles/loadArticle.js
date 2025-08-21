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
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  /**
   * Função para renderizar um comentário na tela, incluindo os botões de editar/excluir.
   * @param {object} comment - O objeto do comentário a ser renderizado.
   */
  function renderComment(comment) {
    // 1. Cria os containers principais
    const divContainer = document.createElement("div");
    divContainer.id = "divComments";
    const photoAndNameDiv = document.createElement("div");
    photoAndNameDiv.id = "photoNnameUserComment";
    const userCommentSection = document.createElement("section");
    userCommentSection.id = "userComment";
    userCommentSection.classList.add("description");

    // 2. Adiciona a foto e o nome do autor
    const photoSection = document.createElement("section");
    photoSection.id = "photoUserComment";
    const authorPic = document.createElement("img");
    authorPic.id = "authorPicComment";
    const commentProfilePic = comment.author.profilePic;
    if (commentProfilePic && (commentProfilePic.startsWith("data:") || commentProfilePic.startsWith("http"))) {
      authorPic.src = commentProfilePic;
    } else if (commentProfilePic) {
      authorPic.src = `data:image/jpeg;base64,${commentProfilePic}`;
    } else {
      authorPic.src = "./img/fotoPadrao.png";
    }
    authorPic.alt = "Foto do autor do comentário";
    photoSection.appendChild(authorPic);

    const nameSection = document.createElement("section");
    nameSection.id = "nameUserComment";
    nameSection.textContent = comment.author.userName;

    photoAndNameDiv.appendChild(photoSection);
    photoAndNameDiv.appendChild(nameSection);

    // 3. Adiciona o parágrafo do comentário
    const commentParagraph = document.createElement("p");
    commentParagraph.textContent = comment.commentContent;
    userCommentSection.appendChild(commentParagraph);

    divContainer.appendChild(photoAndNameDiv);
    divContainer.appendChild(userCommentSection);

    // 4. Adiciona botões de Editar e Excluir se o usuário for o autor
    if (String(userId) === String(comment.author.id)) {
      const buttonsDiv = document.createElement("div");
      buttonsDiv.style.textAlign = "right";
      buttonsDiv.style.marginTop = "10px";

      const editBtn = document.createElement("button");
      editBtn.className = "buttonTheme";
      editBtn.innerText = "Editar";
      editBtn.style.marginRight = "10px";

      let isEditing = false;

      editBtn.addEventListener("click", async () => {
        if (!isEditing) {
          isEditing = true;
          const input = document.createElement("input");
          input.type = "text";
          input.value = commentParagraph.textContent; // Usa a referência direta
          input.className = "form-control";
          input.id = `edit-input-${comment.id}`;
          userCommentSection.replaceChild(input, commentParagraph); // Substitui o parágrafo pelo input
          editBtn.innerText = "Salvar";
        } else {
          isEditing = false;
          const input = document.getElementById(`edit-input-${comment.id}`);
          const newContent = input.value;

          try {
            const res = await fetch(`http://localhost:3000/api/comments/${comment.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ commentContent: newContent }),
            });
            if (!res.ok) throw new Error("Erro ao atualizar comentário.");
            
            commentParagraph.textContent = newContent; // Atualiza a referência direta
            alert("Comentário atualizado com sucesso!");
          } catch (error) {
            console.error("ERRO AO EDITAR COMENTÁRIO:", error);
            alert("Erro ao editar comentário.");
          } finally {
            userCommentSection.replaceChild(commentParagraph, input); // Coloca o parágrafo de volta
            editBtn.innerText = "Editar";
          }
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "buttonTheme";
      deleteBtn.innerText = "Excluir";
      deleteBtn.addEventListener("click", async () => {
        if (confirm("Tem certeza que deseja excluir este comentário?")) {
          try {
            const res = await fetch(`http://localhost:3000/api/comments/${comment.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Erro ao deletar comentário.");
            alert("Comentário deletado com sucesso!");
            divContainer.remove();
          } catch (error) {
            console.error("ERRO AO DELETAR COMENTÁRIO:", error);
            alert("Erro ao deletar comentário.");
          }
        }
      });

      buttonsDiv.appendChild(editBtn);
      buttonsDiv.appendChild(deleteBtn);
      divContainer.appendChild(buttonsDiv);
    }

    commentArea.appendChild(divContainer);
  }

  // --- O RESTANTE DO CÓDIGO PERMANECE O MESMO ---

  // CARREGAR ARTIGO
  try {
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
    authorObj.innerText = article.autor.userName;
    titleObj.innerText = article.titleArticle;
    descriptionObj.innerText = article.descArticle;
    contentObj.innerText = article.contentArticle;
    const profilePic = article.autor.profilePic;

    if (profilePic && (profilePic.startsWith("data:") || profilePic.startsWith("http"))) {
      img.src = profilePic;
    } else if (profilePic) {
      img.src = "data:image/jpeg;base64," + profilePic;
    } else {
      img.src = "./img/fotoPadrao.png";
    }

    if (String(userId) === String(article.autor.id)) {
        // Lógica de editar/excluir artigo (sem alterações)
    }

    if (article.comments && Array.isArray(article.comments)) {
      commentArea.innerHTML = '';
      article.comments.forEach(renderComment);
    }

  } catch (err) {
    console.error(err);
    document.body.innerHTML = "<p style='color:red'>Erro ao carregar o artigo.</p>";
  }

  // ENVIO DE COMENTÁRIOS
  if (commentForm && commentButton && commentInput) {
    commentButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const commentContent = commentInput.value.trim();
        if (!commentContent) {
          alert("Por favor, escreva um comentário.");
          return;
        }
    
        try {
          const res = await fetch("http://localhost:3000/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              author: userId,
              commentContent: commentContent,
              article: articleId
            }),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Erro ao enviar comentário.");
          }
    
          const newComment = await res.json();
          renderComment(newComment.comentario);
          commentInput.value = "";
    
        } catch (error) {
          console.error("ERRO AO ENVIAR COMENTÁRIO:", error);
          alert(error.message);
        }
    });
  }
});