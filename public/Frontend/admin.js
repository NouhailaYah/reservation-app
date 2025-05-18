document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadAllData();
  setupFormSubmissions();
  setupLogout();
});

// Navigation entre onglets
function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });
}

// Chargement global
function loadAllData() {
  loadResidences();
  loadAppartements();
  loadAgents();
  loadPeriodes();
  loadPreReservations();
  loadReservations();
}

// Résidences
function loadResidences() {
  fetch("http://localhost:8000/api/residences")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("residencesTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((r) => {
        table.innerHTML +=`
        <tr><td>${r.id_resid}</td>
        <td>${r.nom_ville}</td>
        <td>${r.syndic ? 'oui' : 'non'}</td>
        <td>${r.salle_sport ? 'oui' : 'non'}</td>
        <td>${r.piscine ? 'oui' : 'non'}</td>
        <td>${r.spa ? 'oui' : 'non'}</td>
        <td>${r.parc_aquatique ? 'oui' : 'non'}</td>
        <td>${r.parking ? 'oui' : 'non'}</td>
        <td>${r.ascenseur ? 'oui' : 'non'}</td>
        <td>${r.service_de_blanchisserie ? 'oui' : 'non'}</td>
        </tr>`;
      });
      document.getElementById("residencesTable").appendChild(table);
    });
}

// Appartements
function loadAppartements() {
  fetch("http://localhost:8000/api/appartements")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("appartementsTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((a) => {
        table.innerHTML += `
          <tr>
            <td>${a.id_resid}</td><td>${a.nom_ville}</td>
            <td>${a.superficie}</td><td>${a.etages}</td><td>${a.nbr_chambre}</td>
            <td>${a.nbr_salles}</td><td>${a.nbr_salles_bain}</td><td>${a.prix}</td>
            <td>${a.balcon ? 'oui' : 'non'}</td>
            <td>${a.climatisation ? 'oui' : 'non'}</td>
            <td>${a.wifi ? 'oui' : 'non'} </td>
            <td><button class="delete-appartement" data-id="${a.id}">Supprimer</button></td>
          </tr>`;
      });
      document.getElementById("appartementsTable").appendChild(table);
    });
}
document.querySelectorAll(".delete-appartement").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    if (confirm("Voulez-vous vraiment supprimer cet appartement ?")) {
      fetch(`http://localhost:8000/api/appartements/${id}`, {
        method: "DELETE",
      }).then(() => {
        loadAppartements();
        alert("Appartement supprimé !");
      });
    }
  });
});


// Agents
function loadAgents() {
  fetch("http://localhost:8000/api/agents")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("agentsTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((agent) => {
        table.innerHTML += `
          <tr>
            <td>${agent.id_agent}</td><td>${agent.nom}</td><td>${agent.prenom}</td>
            <td>${agent.CIN}</td><td>${agent.matricule}</td>
            <td>${agent.fonction}</td><td>${agent.grade}</td>
            <td>${agent.service}</td><td>${agent.login}</td>
          </tr>`;
      });
      document.getElementById("agentsTable").appendChild(table);
    });
}

// Périodes
function loadPeriodes() {
  fetch("http://localhost:8000/api/periodes")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("periodesTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((p) => {
        table.innerHTML += `
          <tr>
            <td>${p.ville}</td><td>${p.date_debut}</td><td>${p.date_fin}</td>
            <td><button data-id="${p.id}" class="delete-periode">Supprimer</button></td>
          </tr>`;
      });
      document.getElementById("periodesTable").appendChild(table);
    });
}

// Pré-réservations
function loadPreReservations() {
  fetch("http://localhost:8000/api/prereservations")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("prereservationsTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((p) => {
        table.innerHTML += `
          <tr>
            <td>${p.id_pre_reser}</td><td>${p.CIN}</td><td>${p.nom}</td><td>${p.prenom}</td>
            <td>${p.id_appart}</td><td>${p.id_resid}</td><td>${p.nom_ville}</td><td>${p.prix}</td>
            <td>${p.date_debut}</td><td>${p.date_fin}</td>
            <td>${p.statut}</td>
            <td>
              <button class="valider-pre" data-id="${p.id}">Valide </button>
              <button class="refuser-pre" data-id="${p.id}">Refuse </button>
            </td>
          </tr>`;
      });
      document.getElementById("prereservationsTable").appendChild(table);
    });
}

// Réservations
function loadReservations() {
  fetch("http://localhost:8000/api/reservations")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("reservationsTable").querySelector("tbody") || document.createElement("tbody");
      table.innerHTML = "";
      data.forEach((r) => {
        table.innerHTML += `
          <tr>
            <td>${r.id}</td><td>${r.id_pre_reser}</td>
            <td><a href="${r.recu_paiement}" target="_blank">Voir reçu</a></td>
            <td>
              <button class="valider-paiement" data-id="${r.id}">valide✅</button>
              <button class="refuser-paiement" data-id="${r.id}">refuse❌</button>
            </td>
          </tr>`;
      });
      document.getElementById("reservationsTable").appendChild(table);
    });
}

// Formulaires (enregistrer résidence, période, appartement)
function setupFormSubmissions() {
  document.getElementById("residenceform").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      ville: document.getElementById("periodeVille").value,
      syndic: document.getElementById("syndic").checked,
      salle_sport: document.getElementById("salle_sport").checked,
      piscine: document.getElementById("piscine").checked,
      spa: document.getElementById("spa").checked,
      parc_aquatique: document.getElementById("parc_aquatique").checked,
      parking: document.getElementById("parking").checked,
      ascenseur: document.getElementById("ascenseur").checked,
      service_de_blanchisserie: document.getElementById("service_de_blanchisserie").checked
    };
    fetch("http://localhost:8000/api/residences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then(() => {
        loadResidences();
        alert("Résidence ajoutée !");
        e.target.reset();
      });
  });

  document.getElementById("periodeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      ville: document.getElementById("periodeVille").value,
      date_debut: document.getElementById("periodeDebut").value,
      date_fin: document.getElementById("periodeFin").value
    };
    fetch("http://localhost:8000/api/periodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then(() => {
        loadPeriodes();
        alert("Période enregistrée !");
        e.target.reset();
      });
  });
}

// Déconnexion
function setupLogout() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/logout", { method: "POST" })
      .then(() => window.location.href = "/login_admin.html");
  });
}