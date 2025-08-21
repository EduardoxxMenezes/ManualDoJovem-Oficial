// ==========================
// Configuração inicial
// ==========================
let token = localStorage.getItem("token");
const localStorageUser = localStorage.getItem("userId");

const getElement = (id) => document.getElementById(id);

// ==========================
// Renderizar comentário com botão de editar
// ==========================
function renderComment(comment) {
  const commentArea = getElement("whiteSpace");

  const div = document.createElement("div");
  div.classList.add("commentBox");

  // elemento de conteúdo
  const contentP = document.createElement("p");
  contentP.innerText = comment.commentContent;

  // autor
  const authorP = document.createElement("p");
  authorP.innerHTML = `<strong>${comment.autor.userName}</strong>`;

  div.appendChild(authorP);
  div.appendChild(contentP);


  if (comment.autor.id == localStorageUser) {
    const editBtn = document.createElement("button");
    editBtn.innerText = "Editar";
    editBtn.classList.add("editButton");

    let editMode = false;

    editBtn.addEventListener("click", async () => {
      if (!editMode) {
        editMode = true;
        editBtn.innerText = "Salvar";

        const input = document.createElement("input");
        input.type = "text";
        input.value = comment.commentContent;
        input.id = `editComment-${comment.id}`;

        div.replaceChild(input, contentP); // troca <p> pelo <input>
      } else {
        // Salvar edição
        editMode = false;
        editBtn.innerText = "Editar";

        const input = getElement(`editComment-${comment.id}`);
        const newContent = input.value;

        await updateComment(comment.id, newContent);

        comment.commentContent = newContent; // atualiza local
        contentP.innerText = newContent;

        div.replaceChild(contentP, input); // volta para <p>
      }
    });

    div.appendChild(editBtn);
  }

  commentArea.appendChild(div);
}

// ==========================
// Função para atualizar comentário
// ==========================
async function updateComment(commentId, newContent) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ commentContent: newContent }),
    });

    if (!res.ok) throw new Error("Erro ao atualizar comentário.");

    alert("Comentário atualizado com sucesso!");
  } catch (error) {
    console.error("ERRO AO EDITAR COMENTÁRIO:", error);
    alert("Erro ao editar comentário.");
  }
}