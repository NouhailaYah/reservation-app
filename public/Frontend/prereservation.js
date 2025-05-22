document.addEventListener("DOMContentLoaded", function() {
    fetchReservationDetails();
    fetchAgents();
    fetchAppartements();
    fetchResidences();

    document.getElementById("pre-reservation-form").addEventListener("submit", function(event) {
        event.preventDefault();
        submitPreReservation();
    });
});

// Fonction pour récupérer les détails de pré-réservation (ville, appartement, etc.)
function fetchReservationDetails() {
  const storedAppartement = localStorage.getItem("selected_appartement");
  if (!storedAppartement) {
    console.error("Aucun appartement sélectionné.");
    return;
  }
  const data = JSON.parse(storedAppartement);
  // Remplir les champs du formulaire
  document.getElementById("id_appart").value = data.id_appart;
  document.getElementById("id_resid").value = data.id_resid;
  document.getElementById("nom_ville").value = data.nom_ville;

  const periodeSelect = document.getElementById("periode");
  const valeurPeriode = `${data.date_debut}|${data.date_fin}`;

   const interval = setInterval(() => {
    const options = Array.from(periodeSelect.options);
    const found = options.find(option => option.value === valeurPeriode);
    if (found) {
      periodeSelect.value = valeurPeriode;
      clearInterval(interval); 
     // Calcul du prix ici, une fois la période bien sélectionnée
      const [dateDebut, dateFin] = valeurPeriode.split("|");
      const date_Debut = new Date(dateDebut);
      const date_Fin = new Date(dateFin);

      if (!isNaN(date_Debut) && !isNaN(date_Fin)) {
        const nombreJours = Math.max(1, (date_Fin - date_Debut) / (1000 * 60 * 60 * 24));
        const prixTotal = data.prix * nombreJours;
        document.getElementById("prix").textContent = prixTotal + " MAD";
      } else {
        document.getElementById("prix").textContent = "Erreur période";
      }
    }
  });
}

function fetchAgents() {
    const token = localStorage.getItem("agent_token");
    if (!token) {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:8000/api/agent/me", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("CIN").value = data.CIN;
            document.getElementById("nom").value = data.nom;
            document.getElementById("prenom").value = data.prenom;
        })
        .catch(error => {
            console.error("Erreur lors du chargement des infos agent :", error);
        });
}

function submitPreReservation() {
    const CIN = document.getElementById("CIN").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const id_appart = document.getElementById("id_appart").value;
    const id_resid = document.getElementById("id_resid").value;
    const nom_ville = document.getElementById("nom_ville").value;
    const [date_debut, date_fin] = document.getElementById("periode").value.split("|");

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
            "Authorization": "Bearer " + localStorage.getItem("agent_token")
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
