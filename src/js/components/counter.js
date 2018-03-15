module.exports = () => {
    // Assigne un trigger à l'ensemble des boutons pour le menu off-canvas
    document.querySelectorAll("a.open-info").forEach((btn) => {
        btn.addEventListener("click", (el) => {
            el.preventDefault();

            btn.classList.toggle("clicked");
            document.querySelector(".info-bar").classList.toggle("opened");
        });
    });
}