document.addEventListener("DOMContentLoaded", function() {
    // Récupérer les détails de l'appartement, de la résidence et de la ville
    fetchReservationDetails();

    // Gestion de la soumission du formulaire
    document.getElementById("pre-reservation-form").addEventListener("submit", function(event) {
        event.preventDefault();
        submitPreReservation();
    });
});

// Fonction pour récupérer les détails de la pré-réservation (ville, appartement, etc.)
function fetchReservationDetails() {
    // Remplacez cette URL par votre API de récupération des détails
    fetch("http://localhost:8000/api/pre-reservation/details")
        .then(response => response.json())
        .then(data => {
            document.getElementById("appartement-details").textContent = data.id_appart;
            document.getElementById("residence-details").textContent = data.id_resid;
            document.getElementById("ville-details").textContent = data.nom_ville;
            document.getElementById("date_debut_details").textContent = data.date_debut;
            document.getElementById("date_fin_details").textContent = data.date_fin;
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails :", error);
        });
}

// Fonction pour soumettre la pré-réservation
function submitPreReservation() {
    const cin = document.getElementById("cin").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const id_appart = document.getElementById("appartement-details").textContent;
    const id_resid = document.getElementById("residence-details").textContent;
    const nom_ville = document.getElementById("ville-details").textContent;
    const date_debut = document.getElementById("date_debut_details").textContent;
    const date_fin = document.getElementById("date_fin_details").textContent;
    const status = "En attente";

    const reservationData = {
        cin,
        nom,
        prenom,
        id_appart,
        id_resid,
        nom_ville,
        date_debut,
        date_fin,
        status
    };

    // Envoi de la pré-réservation à l'API Laravel
    fetch("http://localhost:8000/api/pre-reservation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Pré-réservation enregistrée avec succès.");
            window.location.href = "index.html"; // Rediriger si nécessaire
        } else {
            alert("Erreur lors de la pré-réservation : " + (data.message || "Veuillez réessayer."));
        }
    })
    .catch(error => {
        console.error("Erreur lors de la pré-réservation :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
}
