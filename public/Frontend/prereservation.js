document.addEventListener("DOMContentLoaded", function() {
    // détails de l'appart, résidence, ville ...
    fetchReservationDetails();

    document.getElementById("pre-reservation-form").addEventListener("submit", function(event) {
        event.preventDefault();
        submitPreReservation();
    });
});

// Fonction pour récupérer les détails de pré-réservation (ville, appartement, etc.)
function fetchReservationDetails() {
    fetch("http://localhost:8000/api/pre-reservation/details")
        .then(response => response.json())
        .then(data => {
            document.getElementById("appartement-details").textContent = data.id_appart;
            document.getElementById("residence-details").textContent = data.id_resid;
            document.getElementById("ville-details").textContent = data.nom_ville;
            document.getElementById("date_debut_details").textContent = data.date_debut;
            document.getElementById("date_fin_details").textContent = data.date_fin;

             // Calculer le prix total automatiquement
            const dateDebut = new Date(data.date_debut);
            const dateFin = new Date(data.date_fin);
            const prixParNuit = data.prix;
            const nombreJours = Math.max(1, (dateFin - dateDebut) / (1000 * 60 * 60 * 24));// une journée complète en millisecondes.
            const prixTotal = prixParNuit * nombreJours;
            document.getElementById("prix-details").textContent = prixTotal + " MAD";
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails :", error);
        });
}

// Fonction pour soumettre la pré-réservation
function submitPreReservation() {
    const CIN = document.getElementById("CIN").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const id_appart = document.getElementById("appartement-details").textContent;
    const id_resid = document.getElementById("residence-details").textContent;
    const nom_ville = document.getElementById("ville-details").textContent;
    const date_debut = document.getElementById("date_debut_details").textContent;
    const date_fin = document.getElementById("date_fin_details").textContent;

    const reservationData = {
        CIN,
        nom,
        prenom,
        id_appart,
        id_resid,
        nom_ville,
        date_debut,
        date_fin
    };

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
        if (data.pre_reservation) {
            document.getElementById("confirmation-message").style.display = "block";
            document.getElementById("confirmation-message").textContent = "Pré-réservation envoyée avec succès. En attente de validation.";
        } else {
            alert("Erreur lors de la pré-réservation : " + (data.message || "Veuillez réessayer."));
        }
    })
    .catch(error => {
        console.error("Erreur lors de la pré-réservation :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
}
