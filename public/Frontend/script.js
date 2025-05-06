function fermerModal() {
  document.getElementById("modal").style.display = "none";
}

function handleModalClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    fermerModal();
  }
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', handleModalClick);
});

function fetchAppartements(ville = '') {
  const API_URL = 'http://localhost:8000/api/appartements';
  const IMAGE_BASE ='http://localhost:8000/images/'; 

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
    <p><strong>Superficie :</strong> ${app.superficie} m²</p>
    <p><strong>Chambres :</strong> ${app.nbr_chambre}</p>
    <p><strong>Étage :</strong> ${app.etages}</p>
    <p><strong>Salles de bain :</strong> ${app.nbr_salles_bain || '-'}</p>
    <p><strong>Balcon :</strong> ${app.balcon ? "Oui" : "Non"}</p>
    <p><strong>Climatisation :</strong> ${app.climatisation ? "Oui" : "Non"}</p>
    <p><strong>Wi-Fi :</strong> ${app.wifi ? "Oui" : "Non"}</p>
    <p><strong>Prix :</strong> ${app.prix} DH / nuit</p>
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
document.getElementById("formPreReservation")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("status", "en_attente");

  fetch("http://localhost:8000/api/pre-reservations", {
    method: "POST",
    body: formData
  })
    .then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data.message)))
    .then(data => {
      alert("Pré-réservation enregistrée !");
      document.getElementById("reservationSection").style.display = "block";
      document.getElementById("uploadRecuForm").dataset.id = data.id_pre_reser;
    })
    .catch(err => alert(err));
});

// Envoi du reçu
document.getElementById("uploadRecuForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = this.dataset.id;
  const formData = new FormData(this);

  fetch(`http://localhost:8000/api/reservations/upload-recu/${id}`, {
    method: "POST",
    body: formData
  })
    .then(res => res.ok ? res.json() : Promise.reject("Erreur lors de l'envoi du reçu."))
    .then(() => alert("Reçu envoyé avec succès !"))
    .catch(err => alert(err));
});
