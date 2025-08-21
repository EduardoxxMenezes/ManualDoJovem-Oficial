  window.addEventListener("DOMContentLoaded", async () => {
    let token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar usuário");

        const user = await res.json();

        document.getElementById("displayName").textContent = user.userName || "Não informado";
        document.getElementById("displayEmail").textContent = user.userEmail || "Não informado";
        document.getElementById("profilePhoto").src = user.profilePic || "./img/fotoPadrao.png";
        document.getElementById("photoImg").src = user.profilePic || "./img/fotoPadrao.png";
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar informações do usuário.");
      }
    });