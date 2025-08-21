document.addEventListener("DOMContentLoaded", () => {

    const profileBtn = document.getElementById("photoBtn");
    const infoDiv = document.getElementById("infoDiv");

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            infoDiv.classList.toggle("hidden");
        });
    }
});
