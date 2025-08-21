// console.log("Comments.js carregado ✅");

// // Pega infos direto do localStorage
// const token = localStorage.getItem("token");
// const userId = localStorage.getItem("userId");

// async function createComment(articleId, autorId, commentContent) {
//   console.log("Criando comentário...", { articleId, autorId, commentContent });

//   try {
//     const res = await fetch("http://localhost:3000/api/comments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         article: articleId,
//         autor: autorId,
//         commentContent: commentContent,
//       }),
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       throw new Error(errorData.message || "Erro ao criar comentário.");
//     }

//     const newComment = await res.json();
//     console.log("Comentário criado com sucesso:", newComment);
//     renderNewComment(newComment);
//   } catch (error) {
//     console.error("Erro ao criar comentário:", error);
//     alert("Não foi possível criar o comentário: " + error.message);
//   }
// }

// function renderNewComment(comment) {
//   const commentArea = document.getElementById("whiteSpace");
//   if (!commentArea) return;

//   const div = document.createElement("div");
//   div.classList.add("commentBox");

//   const autorName = comment?.autor?.userName || comment?.autor || "Usuário desconhecido";

//   div.innerHTML = `
//     <p><strong>${autorName}</strong></p>
//     <p>${comment.commentContent}</p>
//   `;

//   commentArea.appendChild(div);
// }

// function initCommentForm() {
//   const commentForm = document.getElementById("commentsSection");
//   const sendButton = document.getElementById("sendComment");

//   if (!commentForm || !sendButton) {
//     console.error("Formulário ou botão não encontrado!");
//     return;
//   }

//   console.log("Formulário encontrado, listener ativo!");

//   sendButton.addEventListener("click", async (e) => {
//     e.preventDefault();

//     const commentInput = document.getElementById("addComment");
//     const commentContent = commentInput.value.trim();
//     if (!commentContent) return alert("Digite um comentário antes de enviar.");

//     const urlParams = new URLSearchParams(window.location.search);
//     const articleId = urlParams.get("id");
//     if (!articleId) return alert("Artigo não encontrado.");

//     await createComment(articleId, userId, commentContent);

//     commentInput.value = "";
//   });
// }

// window.addEventListener("DOMContentLoaded", initCommentForm);
