// ==========================
// Configuração inicial
// ==========================
const localStorageUser = localStorage.getItem("userId");

const getElement = (id) => document.getElementById(id);

// ==========================
// Renderizar comentário com botão de deletar
// ==========================
function renderComment(comment) {
  const commentArea = getElement("whiteSpace");

  const div = document.createElement("div");
  div.classList.add("commentBox");

  // conteúdo base do comentário
  div.innerHTML = `
    <p><strong>${comment.autor.userName}</strong></p>
    <p>${comment.commentContent}</p>
  `;

  // Se o usuário logado for o autor → mostra botão de deletar
  if (comment.autor.id == localStorageUser) {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Deletar";
    deleteBtn.classList.add("deleteButton");

    deleteBtn.addEventListener("click", async () => {
      if (confirm("Tem certeza que deseja deletar este comentário?")) {
        await deleteComment(comment.id, div);
      }
    });

    div.appendChild(deleteBtn);
  }

  commentArea.appendChild(div);
}

// ==========================
// Função para deletar comentário
// ==========================
async function deleteComment(commentId, commentDiv) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erro ao deletar comentário.");

    alert("Comentário deletado com sucesso!");
    commentDiv.remove(); // remove da tela sem recarregar
  } catch (error) {
    console.error("ERRO AO DELETAR COMENTÁRIO:", error);
    alert("Erro ao deletar comentário.");
  }
}
