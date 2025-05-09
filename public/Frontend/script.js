function fermerModal() {
  document.getElementById("modal").style.display = "none";
}

function handleModalClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    fermerModal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const authLinks = document.getElementById("auth-links");
  const logoutBtn = document.getElementById("logout-btn");

  if (token) {
    authLinks.style.display = "none";
    logoutBtn.style.display = "inline-block";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
  });
});

document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', handleModalClick);
});

// Lorsque l'utilisateur sélectionne une ville
document.getElementById("ville").addEventListener("change", function () {
  const ville = this.value;
  afficherPeriodeEtAppartements(ville);
});

// Fonction pour afficher les périodes et les appartements d'une ville
function afficherPeriodeEtAppartements(ville) {
  if (!ville) {
    document.getElementById("periode").innerText = "Sélectionnez une ville pour voir les périodes disponibles.";
    document.getElementById("appartements").innerHTML = "";
    return;
  }

  fetch(`http://localhost:8000/api/villes/${ville}/periode-et-appartements`)
    .then(response => response.json())
    .then(data => {
      // Afficher la période
      const periodeDisplay = document.getElementById("periode");
      if (data.periode) {
        const dateDebut = new Date(data.periode.date_debut);
        const dateFin = new Date(data.periode.date_fin);
        const maintenant = new Date();

        // Vérifier si la période est expirée
        if (dateFin < maintenant) {
          periodeDisplay.innerHTML = `<span style="color: gray;">Période expirée : du ${data.periode.date_debut} au ${data.periode.date_fin}</span>`;
        } else {
          periodeDisplay.innerText = `Disponible du ${data.periode.date_debut} au ${data.periode.date_fin}`;
        }
      } else {
        periodeDisplay.innerText = "Aucune période disponible pour cette ville.";
      }

      // Afficher les appartements de la ville
      const appartList = document.getElementById("appartements");
      appartList.innerHTML = "";

      if (data.appartements.length > 0) {
        data.appartements.forEach(app => {
          const div = document.createElement("div");
          div.classList.add("appartement-card");
          div.innerHTML = `
            <h3>${app.nom}</h3>
            <p>Capacité max : ${app.capacite_max} personnes</p>
            <p>${app.superficie} m²</p>
            <p>${app.nbr_chambre} chambre(s)</p>
            <p><strong>${app.prix} DH / nuit</strong></p>
            <button onclick="voirDetails('${encodeURIComponent(JSON.stringify(app))}')">Voir Détails</button>
          `;
          appartList.appendChild(div);
        });
      } else {
        appartList.innerHTML = "<p>Aucun appartement disponible pour cette ville.</p>";
      }
    })
    .catch(error => console.error("Erreur :", error));
}

// Fonction pour charger les appartements de manière générale
function fetchAppartements(ville = '') {
  const API_URL = 'http://localhost:8000/api/appartements';
  const IMAGE_BASE = 'http://localhost:8000/images/';

  const imageMap = {
    Rabat: "appart1.jpg",
    Fès: "appart2.jpg",
    Marrakech: "appart3.jpg",
    Casablanca: "appart4.jpg",
    Agadir: "appart5.jpg",
  };

  const url = ville ? `${API_URL}?nom_ville=${encodeURIComponent(ville)}` : API_URL;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("appartements");
      container.innerHTML = "";
      console.log("Réponse API : ", data);

      data.forEach(app => {
        const image = imageMap[app.nom_ville] || "default.jpg";
        const appData = encodeURIComponent(JSON.stringify(app));
        const card = `
          <div class="appartement-card">
            <img src="${IMAGE_BASE}${image}" alt="Appartement à ${app.nom_ville}">
            <h3>Appartement à ${app.nom_ville}</h3>
            <p>${app.superficie} m²</p>
            <p>${app.nbr_chambre} chambre(s)</p>
            <p>Étage ${app.etages}</p>
            <p><strong>${app.prix} DH / nuit</strong></p>
            <button onclick="voirDetails('${appData}')">Voir Détails</button>
          </div>
        `;
        container.innerHTML += card;
      });
    });
}

// Charger les appartements par défaut (sans filtre)
document.addEventListener("DOMContentLoaded", () => {
  fetchAppartements();
});


function voirDetails(appartementJson) {
  const app = JSON.parse(decodeURIComponent(appartementJson));
  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const description = document.getElementById("modal-description");
  const gallery = document.getElementById("modal-images");
  const IMAGE_BASE = 'http://localhost:8000/images/';
  const imageGallery = {
    Rabat: ['chambreAppart1.jpg', 'chambre2Appart1.jpg', 'cuisineAppart1.jpg', 'salle_bainAppart1.jpg'],
    Fès: ['chambreAppart2.jpg', 'chambre2Appart2.jpg', 'cuisineAppart2.jpg', 'salle_bainAppart2.jpg'],
    Marrakech: ['chambreAppart3.jpg', 'chambre2Appart3.jpg', 'chambre3Appart3.jpg', 'cuisineAppart3.jpg'],
    Casablanca: [],
    Agadir: []
  };

  title.textContent = `Appartement à ${app.nom_ville}`;
  description.innerHTML = `
    <p><strong>  Superficie :</strong> ${app.superficie} m²</p>
    <p><strong>  Chambres :</strong> ${app.nbr_chambre}</p>
    <p><strong>  Étage :</strong> ${app.etages}</p>
    <p><strong>  Salles de bain :</strong> ${app.nbr_salles_bain || '-'}</p>
    <p><strong>  Balcon :</strong> ${app.balcon ? "Oui" : "Non"}</p>
    <p><strong>  Climatisation :</strong> ${app.climatisation ? "Oui" : "Non"}</p>
    <p><strong>  Wi-Fi :</strong> ${app.wifi ? "Oui" : "Non"}</p>
    <p><strong>  Prix :</strong> ${app.prix} DH / nuit</p>
    <hr>
    <h3>Détails de la Résidence</h3>
    ${app.residence ? `
      <p><strong>  Numero_résid :</strong> ${app.residence.id_resid}</p>
      <p><strong>  Ville :</strong> ${app.residence.nom_ville}</p>
      <p><strong>  Syndic :</strong> ${app.residence.syndic ? "Oui" : "Non"}</p>
      <p><strong>  Piscine :</strong> ${app.residence.piscine ? "Oui" : "Non"}</p>
      <p><strong>  Salle de sport :</strong> ${app.residence.salle_sport ? "Oui" : "Non"}</p>
      <p><strong>  SPA :</strong> ${app.residence.spa ? "Oui" : "Non"}</p>
      <p><strong>  Parking :</strong> ${app.residence.parking ? "Oui" : "Non"}</p>
      <p><strong>  Ascenseur :</strong> ${app.residence.ascenseur ? "Oui" : "Non"}</p>
      <p><strong>  Service de blanchisserie :</strong> ${app.residence.service_de_blanchisserie ? "Oui" : "Non"}</p>
    ` : `<p>Aucune résidence associée.</p>`}
    <button onclick="reserver('${app.id}')">Réserver</button>
  `;

  gallery.innerHTML = "";

  const images = imageGallery[app.nom_ville] || [];
  if (images.length > 0) {
    images.forEach(img => {
      const imgEl = document.createElement("img");
      imgEl.src = IMAGE_BASE + img;
      imgEl.alt = `Image de ${app.nom_ville}`;
      imgEl.style.width = "100px";
      imgEl.style.margin = "5px";
      gallery.appendChild(imgEl);
    });
  } else {
    gallery.innerHTML = "<p>Aucune image disponible pour cet appartement.</p>";
  }

  modal.style.display = "flex";
}

function fermerDetails() {
  document.getElementById('modal').style.display = 'none';
}

function reserver(idAppart) {
  fetch(`http://localhost:8000/api/appartements/${idAppart}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("id_appart").value = data.id_appart;
      document.getElementById("id_resid").value = data.id_resid;
      document.getElementById("nom_ville").value = data.nom_ville;

      document.getElementById("modal").style.display = "none";
      document.getElementById("preReservationForm").style.display = "block";
    })
    .catch(err => alert("Erreur lors du chargement de l'appartement."));
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", e => {
      e.preventDefault();
      const ville = document.getElementById("ville").value;
      fetchAppartements(ville);
    });
  }

  fetchAppartements();
});

// Formulaire de pré-réservation
document.getElementById('preReservationForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch('http://localhost:8000/api/pre-reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      alert(res.message || 'Pré-réservation effectuée');
      localStorage.setItem('preReservationId', res.pre_reservation.id_pre_reser);
    })
    .catch(err => alert('Erreur : ' + err));
});


// Envoi du reçu
document.getElementById('uploadRecuForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const reservationId = localStorage.getItem('reservationId');
  if (!reservationId) {
    alert("Aucune réservation trouvée. Veuillez refaire le processus.");
    return;
  }

  const formData = new FormData();
  formData.append('recu_paiement', document.getElementById('recu_paiement').files[0]);

  fetch(`http://localhost:8000/api/reservations/${reservationId}/upload-recu`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(res => {
      alert(res.message || 'Reçu envoyé avec succès.');
    })
    .catch(err => {
      alert("Erreur lors de l'envoi du reçu : " + err.message);
    });
});

