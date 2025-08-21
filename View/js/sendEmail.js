const sendBtn = document.getElementById("sendBtn");


sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("contactText").value.trim();

    if (!msg) {
        alert("Digite uma mensagem!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/send-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Mensagem enviada com sucesso!");
        } else {
            alert(data.error || "Erro ao enviar mensagem.");
        }
    } catch (err) {
        console.error(err);
        alert("Erro na requisição.");
    }
});
