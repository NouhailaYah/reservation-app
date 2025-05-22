const API_BASE = 'http://localhost:8000/api';
const IMAGE_BASE = 'http://localhost:8000/images/';

const imageMap = {
  Rabat: "appart1.jpg",
  Fès: "appart2.jpg",
  Marrakech: "appart3.jpg",
  Casablanca: "appart4.jpg",
  Agadir: "appart5.jpg",
};

const imageGallery = {
  Rabat: ['chambreAppart1.jpg', 'chambre2Appart1.jpg', 'cuisineAppart1.jpg', 'salle_bainAppart1.jpg'],
  Fès: ['chambreAppart2.jpg', 'chambre2Appart2.jpg', 'cuisineAppart2.jpg', 'salle_bainAppart2.jpg'],
  Marrakech: ['chambreAppart3.jpg', 'chambre2Appart3.jpg', 'chambre3Appart3.jpg', 'cuisineAppart3.jpg'],
  Casablanca: [],
  Agadir: []
};

document.addEventListener("DOMContentLoaded", () => {
  fetchAppartements();
});

function afficherPeriodeEtAppartements(ville) {
  if (!ville) {
    document.getElementById("periodes").innerText = "Sélectionnez une ville pour voir les périodes disponibles.";
    document.getElementById("appartements").innerHTML = "";
    return;
  }

  fetch(`${API_BASE}/villes/${ville}/periode-et-appartements`)
    .then(res => res.json())
    .then(data => {
      afficherPeriodes(data.periode);
      afficherAppartements(data.appartements);
    })
    .catch(err => console.error("Erreur :", err));
}

let toutesLesPeriodes = []; // stocker les périodes initiales

// Charger toutes les villes
function chargerVilles() {
  fetch("http://localhost:8000/api/villes")
    .then((response) => response.json())
    .then((data) => {
      const selectVille = document.getElementById("ville");
      data.forEach((ville) => {
        const option = document.createElement("option");
        option.value = ville.nom_ville;
        option.textContent = ville.nom_ville;
        selectVille.appendChild(option);
      });
    })
    .catch((error) => console.error("Erreur de chargement des villes :", error));
}

// Charger toutes les périodes au départ
function chargerPeriodes() {
  fetch("http://localhost:8000/api/periodes")
    .then((response) => response.json())
    .then((data) => {
      toutesLesPeriodes = data;
      afficherPeriodes(data); 
    })
    .catch((error) => console.error("Erreur de chargement des périodes :", error));
}

// Afficher une liste de périodes
function afficherPeriodes(liste) {
  const selectPeriode = document.getElementById("periode");
  selectPeriode.innerHTML = '<option value="">Sélectionnez une période</option>';

  if (liste.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Aucune période disponible";
    option.disabled = true;
    selectPeriode.appendChild(option);
    return;
  }
  liste.forEach((periode) => {
    const option = document.createElement("option");
    option.value = `${periode.date_debut}|${periode.date_fin}`;
    option.textContent = `Du ${periode.date_debut} au ${periode.date_fin}`;
    selectPeriode.appendChild(option);
  });
}
// Filtrer les périodes par ville
function filtrerPeriodesParVille(ville) {
  if (!ville) {
    afficherPeriodes(toutesLesPeriodes); // aucune ville sélectionnée, afficher tout
  } else {
    const periodesFiltrees = toutesLesPeriodes.filter(
      (periode) => periode.nom_ville === ville
    );
    afficherPeriodes(periodesFiltrees);
  }
}
// Lancer le chargement initial
document.addEventListener("DOMContentLoaded", () => {
  chargerVilles();
  chargerPeriodes();

  document.getElementById("nom_ville").addEventListener("change", (event) => {
    const ville = event.target.value;
    filtrerPeriodesParVille(ville);
  });
});


function afficherAppartements(appartements) {
  const container = document.getElementById("appartements");
  container.innerHTML = "";

  if (!appartements || appartements.length === 0) {
    container.innerHTML = "<p>Aucun appartement disponible pour cette ville.</p>";
    return;
  }

  appartements.forEach(app => {
    const image = imageMap[app.nom_ville] || "default.jpg";
    const appData = encodeURIComponent(JSON.stringify(app));

    container.innerHTML += `
      <div class="appartement-card">
        <img src="${IMAGE_BASE}${image}" alt="Appartement à ${app.nom_ville}">
        <h3>Appartement à ${app.nom_ville}</h3>
        <p>${app.superficie} m²</p>
        <p>${app.nbr_chambre} chambre(s)</p>
        <p>Étage ${app.etages}</p>
        <p><strong>${app.prix} DH / nuit</strong></p>
        <button class="btn-voir-details" onclick="voirDetails('${appData}')">Voir Détails</button>
      </div>
    `;
  });
}

document.getElementById("rechercherBtn").addEventListener("click", () => {
    const ville = document.getElementById("ville").value;
    const periode = document.getElementById("periode").value;

    if (!ville || !periode) {
        alert("Veuillez sélectionner une ville et une période.");
        return;
    }
    const [dateDebut, dateFin] = periode.split("|");
    // Appeler l'API avec les filtres
    fetch(`http://localhost:8000/api/appartements?ville=${encodeURIComponent(ville)}&date_debut=${dateDebut}&date_fin=${dateFin}`)
    .then((response) => response.json())
    .then((data) => {
      const appartementsFiltres = data.filter(app => app.nom_ville === ville);
      afficherAppartements(appartementsFiltres);
    })
    .catch((error) => console.error("Erreur lors de la recherche :", error));
});


function fetchAppartements(ville = '') {
  const url = ville ? `${API_BASE}/appartements?nom_ville=${encodeURIComponent(ville)}` : `${API_BASE}/appartements`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      afficherAppartements(data);
    })
    .catch(err => console.error("Erreur lors du chargement des appartements :", err));
}

function voirDetails(appartementJson) {
  const app = JSON.parse(decodeURIComponent(appartementJson));
  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const description = document.getElementById("modal-description");
  const imagesContainer = document.getElementById("modal-images");

  title.textContent = `Appartement à ${app.nom_ville}`;

  fetch(`http://127.0.0.1:8000/api/periodes/${app.nom_ville}`)
    .then(response => response.json())
    .then(data => {
      let periodesHtml = "<h3>Périodes disponibles</h3>";
      if (data.length > 0) {
        periodesHtml += `<select id="periode-select">`;
        data.forEach(p => {
          periodesHtml += `<option value="${p.id}">Du ${p.date_debut} au ${p.date_fin}</option>`;
        });
        periodesHtml += `</select>`;
      } else {
        periodesHtml += "<p>Aucune période disponible pour cet appartement.</p>";
      }

  description.innerHTML = `
    <div class="carte-description">
    <p><strong>Ville:</strong> ${app.nom_ville}</p>
    <p><strong>Superficie :</strong> ${app.superficie} m²</p>
    <p><strong>Chambres :</strong> ${app.nbr_chambre}</p>
    <p><strong>Étage :</strong> ${app.etages}</p>
    <p><strong>Salles de bain :</strong> ${app.nbr_salles_bain || '-'}</p>
    <p><strong>Balcon :</strong> ${app.balcon ? "Oui" : "Non"}</p>
    <p><strong>Climatisation :</strong> ${app.climatisation ? "Oui" : "Non"}</p>
    <p><strong>Wi-Fi :</strong> ${app.wifi ? "Oui" : "Non"}</p>
    <p><strong>Prix :</strong> ${app.prix} DH / nuit</p>
    <hr>
    <h3>Détails de la Résidence</h3>
    ${app.residence ? `
        <p><strong>Numéro Résid. :</strong> ${app.residence.id_resid}</p>
        <p><strong>Ville :</strong> ${app.residence.nom_ville}</p>
        <p><strong>Syndic :</strong> ${app.residence.syndic ? "Oui" : "Non"}</p>
        <p><strong>Piscine :</strong> ${app.residence.piscine ? "Oui" : "Non"}</p>
        <p><strong>Salle de sport :</strong> ${app.residence.salle_sport ? "Oui" : "Non"}</p>
        <p><strong>SPA :</strong> ${app.residence.spa ? "Oui" : "Non"}</p>
        <p><strong>Parking :</strong> ${app.residence.parking ? "Oui" : "Non"}</p>
        <p><strong>Blanchisserie :</strong> ${app.residence.service_de_blanchisserie ? "Oui" : "Non"}</p>
        <p><strong>Ascenseur :</strong> ${app.residence.ascenseur ? "Oui" : "Non"}</p>
        ` : `<p>Aucune résidence associée.</p>`}
    ${periodesHtml} 
        <br><button class="btn-reserver" onclick='reserver(${JSON.stringify(app)})'>Réserver</button>
    `;

  // Images
    imagesContainer.innerHTML = "";
    const images = imageGallery[app.nom_ville] || [];
    if (images && images.length > 0) {
    images.forEach(img => {
      const imgEl = document.createElement("img");
      imgEl.src = IMAGE_BASE + img;
      imgEl.alt = `Image de ${app.nom_ville}`;
      imgEl.classList.add("modal-image");
      imgEl.style.width = "100px";
      imgEl.style.margin = "5px";
      imagesContainer.appendChild(imgEl);
    });
  } else {
    imagesContainer.innerHTML = "<p>Aucune image disponible pour cet appartement.</p>";
  }

  modal.style.display = "flex";
  })
  .catch(err => {
      console.error("Erreur lors de la récupération des périodes :", err);
  });
}
function reserver(appartement) {
  const token = localStorage.getItem("agent_token");
  if (!token) {
    alert("Vous devez être connecté pour réserver.");
    window.location.href = "login.html";
    return;
  }

  localStorage.setItem("selected_appartement", appartement);
  window.location.href ="prereservation.html";
}

function afficherDetailsAppartement(appartement) {
  // affichage autres infos
  const periodeContainer = document.getElementById('modal-periode');
  periodeContainer.innerHTML = '';

  if (appartement.residence && appartement.residence.ville && appartement.residence.ville.periodes) {
    appartement.residence.ville.periodes.forEach(periode => {
      const p = document.createElement('p');
      p.textContent = `Période: du ${periode.date_debut} au ${periode.date_fin}`;
      periodeContainer.appendChild(p);
    });
  } else {
    periodeContainer.textContent = 'Aucune période disponible';
  }
}


function fermerDetails() {
  document.getElementById('modal').style.display = 'none';
}

function reserver(appartementJson) {
  const token = localStorage.getItem("agent_token");
  if (!token) {
    alert("Vous devez être connecté pour réserver.");
    window.location.href = "login.html";
    return;
  }
  
  localStorage.setItem("selected_appartement", appartementJson);
  window.location.href = "prereservation.html";
  
}


