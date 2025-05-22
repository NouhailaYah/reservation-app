function fermerModal() {
    document.getElementById("modal").style.display = "none";
}
function handleModalClick(event) {
    if (event.target.classList.contains('modal-overlay')) {
        fermerModal();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("agent_token");
    const userName = localStorage.getItem("agent_nom");
    const userWelcomeDiv = document.getElementById("user-welcome");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutLink = document.getElementById("logoutLink");

    if (token && userName) {
        userWelcomeDiv.textContent = `Bienvenue, ${userName}.`;
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        logoutLink.style.display = "inline";
    } else {
        userWelcomeDiv.textContent = "";
        loginLink.style.display = "inline";
        registerLink.style.display = "inline";
        logoutLink.style.display = "none";
    }

    logoutLink.addEventListener("click", function () {
        localStorage.removeItem("agent_token");
        localStorage.removeItem("agent_nom");
        window.location.href = "index.html";
    });

    logoutLink.addEventListener("click", function() {
    localStorage.removeItem("agent_token");
    localStorage.removeItem("agent_nom");
    window.location.href = "index.html";
    });
});

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', handleModalClick);
});


