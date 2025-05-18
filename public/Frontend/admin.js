const apiBase = 'http://localhost:8000/api'; 

// Gestion des onglets du dashboard
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// Déconnexion 
document.getElementById('logoutBtn').addEventListener('click', () => {
  alert('Déconnexion non implémentée, à gérer côté backend / frontend');
});

// Gestion Résidences
const residenceForm = document.getElementById('residenceForm');
const residenceId = document.getElementById('residenceId');
const residenceNom = document.getElementById('residenceNom');
const residenceVille = document.getElementById('residenceVille');
const residenceCancel = document.getElementById('residenceCancel');
const residencesTableBody = document.querySelector('#residencesTable tbody');

async function fetchResidences() {
  const res = await fetch(`${apiBase}/residences`);
  const data = await res.json();
  residencesTableBody.innerHTML = '';
  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.nom}</td>
      <td>${r.ville}</td>
      <td>
        <button class="actions-btn edit-btn" data-id="${r.id}">Modifier</button>
        <button class="actions-btn delete-btn" data-id="${r.id}">Supprimer</button>
      </td>`;
    residencesTableBody.appendChild(tr);
  });
  // Ajouter gestion clics boutons modifier/supprimer
  document.querySelectorAll('#residencesTable .edit-btn').forEach(btn => {
    btn.onclick = () => loadResidenceToForm(btn.dataset.id);
  });
  document.querySelectorAll('#residencesTable .delete-btn').forEach(btn => {
    btn.onclick = () => deleteResidence(btn.dataset.id);
  });
}

async function loadResidenceToForm(id) {
  const res = await fetch(`${apiBase}/residences/${id}`);
  const r = await res.json();
  residenceId.value = r.id;
  residenceNom.value = r.nom;
  residenceVille.value = r.ville;
  residenceCancel.style.display = 'inline-block';
}

residenceCancel.onclick = () => {
  residenceId.value = '';
  residenceNom.value = '';
  residenceVille.value = '';
  residenceCancel.style.display = 'none';
};

residenceForm.onsubmit = async e => {
  e.preventDefault();
  const payload = {
    nom: residenceNom.value,
    ville: residenceVille.value,
  };
  let url = `${apiBase}/residences`;
  let method = 'POST';
  if (residenceId.value) {
    url += `/${residenceId.value}`;
    method = 'PUT';
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    fetchResidences();
    residenceCancel.onclick();
  } else {
    alert('Erreur lors de la sauvegarde');
  }
};

async function deleteResidence(id) {
  if (!confirm('Supprimer cette résidence ?')) return;
  const res = await fetch(`${apiBase}/residences/${id}`, { method: 'DELETE' });
  if (res.ok) fetchResidences();
  else alert('Erreur suppression');
}

// Charger au démarrage
fetchResidences();

// Gestion Appartements 
const appartementForm = document.getElementById('appartementForm');
const appartementId = document.getElementById('appartementId');
const appartementNom = document.getElementById('appartementNom');
const appartementResidence = document.getElementById('appartementResidence');
const appartementSuperficie = document.getElementById('appartementSuperficie');
const appartementNbChambres = document.getElementById('appartementNbChambres');
const appartementNbSdb = document.getElementById('appartementNbSdb');
const appartementCancel = document.getElementById('appartementCancel');
const appartementsTableBody = document.querySelector('#appartementsTable tbody');

async function fetchAppartements() {
  const res = await fetch(`${apiBase}/appartements`);
  const data = await res.json();
  appartementsTableBody.innerHTML = '';
  data.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.nom}</td>
      <td>${a.residence}</td>
      <td>${a.superficie}</td>
      <td>${a.nb_chambres}</td>
      <td>${a.nb_salles_bain}</td>
      <td>
        <button class="actions-btn edit-btn" data-id="${a.id}">Modifier</button>
        <button class="actions-btn delete-btn" data-id="${a.id}">Supprimer</button>
      </td>`;
    appartementsTableBody.appendChild(tr);
  });
  document.querySelectorAll('#appartementsTable .edit-btn').forEach(btn => {
    btn.onclick = () => loadAppartementToForm(btn.dataset.id);
  });
  document.querySelectorAll('#appartementsTable .delete-btn').forEach(btn => {
    btn.onclick = () => deleteAppartement(btn.dataset.id);
  });
}

async function loadAppartementToForm(id) {
  const res = await fetch(`${apiBase}/appartements/${id}`);
  const a = await res.json();
  appartementId.value = a.id;
  appartementNom.value = a.nom;
  appartementResidence.value = a.residence;
  appartementSuperficie.value = a.superficie;
  appartementNbChambres.value = a.nb_chambres;
  appartementNbSdb.value = a.nb_salles_bain;
  appartementCancel.style.display = 'inline-block';
}

appartementCancel.onclick = () => {
  appartementId.value = '';
  appartementNom.value = '';
  appartementResidence.value = '';
  appartementSuperficie.value = '';
  appartementNbChambres.value = '';
  appartementNbSdb.value = '';
  appartementCancel.style.display = 'none';
};

appartementForm.onsubmit = async e => {
  e.preventDefault();
  const payload = {
    nom: appartementNom.value,
    residence: appartementResidence.value,
    superficie: parseFloat(appartementSuperficie.value),
    nb_chambres: parseInt(appartementNbChambres.value),
    nb_salles_bain: parseInt(appartementNbSdb.value),
  };
  let url = `${apiBase}/appartements`;
  let method = 'POST';
  if (appartementId.value) {
    url += `/${appartementId.value}`;
    method = 'PUT';
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    fetchAppartements();
    appartementCancel.onclick();
  } else {
    alert('Erreur lors de la sauvegarde');
  }
};

async function deleteAppartement(id) {
  if (!confirm('Supprimer cet appartement ?')) return;
  const res = await fetch(`${apiBase}/appartements/${id}`, { method: 'DELETE' });
  if (res.ok) fetchAppartements();
  else alert('Erreur suppression');
}

fetchAppartements();

// Gestion Agents 
const agentsTableBody = document.querySelector('#agentsTable tbody');

async function fetchAgents() {
  const res = await fetch(`${apiBase}/agents`);
  const data = await res.json();
  agentsTableBody.innerHTML = '';
  data.forEach(agent => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${agent.id}</td>
      <td>${agent.nom}</td>
      <td>${agent.prenom}</td>
      <td>${agent.cin}</td>
      <td>${agent.email}</td>`;
    agentsTableBody.appendChild(tr);
  });
}

fetchAgents();

// Gestion Périodes 
const periodeForm = document.getElementById('periodeForm');
const periodeId = document.getElementById('periodeId');
const periodeVille = document.getElementById('periodeVille');
const periodeDebut = document.getElementById('periodeDebut');
const periodeFin = document.getElementById('periodeFin');
const periodeCancel = document.getElementById('periodeCancel');
const periodesTableBody = document.querySelector('#periodesTable tbody');

async function fetchPeriodes() {
  const apiBaseUrl = "http://localhost:8000/api";
}
//  function pour créer des éléments avec classes et texte 
function createElement(tag, classNames = [], text = "") {
  const el = document.createElement(tag);
  classNames.forEach(cls => el.classList.add(cls));
  if (text) el.textContent = text;
  return el;
}

// Chargement des données au chargement de la page 
window.addEventListener("DOMContentLoaded", () => {
  loadResidences();
  loadAppartements();
  loadAgents();
  loadPeriodes();
  loadPreReservations();
  loadPaiements();
});


// Gestion des Résidences
async function loadResidences() {
  const resContainer = document.getElementById("residences-list");
  resContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/residences`);
    const residences = await res.json();

    resContainer.innerHTML = "";
    residences.forEach(r => {
      const div = createElement("div", ["residence-item"]);
      div.textContent = `${r.nom_residence} - Ville: ${r.nom_ville}`;
      
      const editBtn = createElement("button", ["btn", "btn-edit"], "Modifier");
      editBtn.onclick = () => showResidenceForm(r);
      const delBtn = createElement("button", ["btn", "btn-delete"], "Supprimer");
      delBtn.onclick = () => deleteResidence(r.id);

      div.append(editBtn, delBtn);
      resContainer.appendChild(div);
    });

    // Ajouter bouton pour nouvelle résidence
    const addBtn = createElement("button", ["btn", "btn-add"], "Ajouter une résidence");
    addBtn.onclick = () => showResidenceForm(null);
    resContainer.appendChild(addBtn);
  } catch (error) {
    resContainer.textContent = "Erreur lors du chargement des résidences.";
    console.error(error);
  }
}

function showResidenceForm(residence) {
  const formContainer = document.getElementById("residence-form-container");
  formContainer.innerHTML = "";

  const form = createElement("form");
  form.id = "residence-form";

  const nomInput = createElement("input");
  nomInput.type = "text";
  nomInput.placeholder = "Nom de la résidence";
  nomInput.value = residence ? residence.nom_residence : "";
  nomInput.required = true;
  form.appendChild(nomInput);

  const villeInput = createElement("input");
  villeInput.type = "text";
  villeInput.placeholder = "Nom de la ville";
  villeInput.value = residence ? residence.nom_ville : "";
  villeInput.required = true;
  form.appendChild(villeInput);

  const submitBtn = createElement("button", ["btn", "btn-submit"], residence ? "Modifier" : "Ajouter");
  submitBtn.type = "submit";
  form.appendChild(submitBtn);

  const cancelBtn = createElement("button", ["btn", "btn-cancel"], "Annuler");
  cancelBtn.type = "button";
  cancelBtn.onclick = () => {
    formContainer.innerHTML = "";
  };
  form.appendChild(cancelBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nom_residence: nomInput.value.trim(),
      nom_ville: villeInput.value.trim()
    };

    try {
      let url = `${apiBaseUrl}/residences`;
      let method = "POST";

      if (residence) {
        url += `/${residence.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      formContainer.innerHTML = "";
      loadResidences();
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  formContainer.appendChild(form);
}

async function deleteResidence(id) {
  if (!confirm("Confirmer la suppression de cette résidence ?")) return;
  try {
    const res = await fetch(`${apiBaseUrl}/residences/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression");
    loadResidences();
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}


// Gestion des Appartements
async function loadAppartements() {
  const aptContainer = document.getElementById("appartements-list");
  aptContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/appartements`);
    const appartements = await res.json();

    aptContainer.innerHTML = "";
    appartements.forEach(a => {
      const div = createElement("div", ["appartement-item"]);
      div.textContent = `${a.nom_appartement} - Résidence: ${a.nom_residence} - Ville: ${a.nom_ville}`;

      const editBtn = createElement("button", ["btn", "btn-edit"], "Modifier");
      editBtn.onclick = () => showAppartementForm(a);
      const delBtn = createElement("button", ["btn", "btn-delete"], "Supprimer");
      delBtn.onclick = () => deleteAppartement(a.id);

      div.append(editBtn, delBtn);
      aptContainer.appendChild(div);
    });

    const addBtn = createElement("button", ["btn", "btn-add"], "Ajouter un appartement");
    addBtn.onclick = () => showAppartementForm(null);
    aptContainer.appendChild(addBtn);
  } catch (error) {
    aptContainer.textContent = "Erreur lors du chargement des appartements.";
    console.error(error);
  }
}

function showAppartementForm(appartement) {
  const formContainer = document.getElementById("appartement-form-container");
  formContainer.innerHTML = "";

  const form = createElement("form");
  form.id = "appartement-form";

  const nomInput = createElement("input");
  nomInput.type = "text";
  nomInput.placeholder = "Nom de l'appartement";
  nomInput.value = appartement ? appartement.nom_appartement : "";
  nomInput.required = true;
  form.appendChild(nomInput);

  const residenceInput = createElement("input");
  residenceInput.type = "text";
  residenceInput.placeholder = "Nom de la résidence";
  residenceInput.value = appartement ? appartement.nom_residence : "";
  residenceInput.required = true;
  form.appendChild(residenceInput);

  const villeInput = createElement("input");
  villeInput.type = "text";
  villeInput.placeholder = "Nom de la ville";
  villeInput.value = appartement ? appartement.nom_ville : "";
  villeInput.required = true;
  form.appendChild(villeInput);



  const submitBtn = createElement("button", ["btn", "btn-submit"], appartement ? "Modifier" : "Ajouter");
  submitBtn.type = "submit";
  form.appendChild(submitBtn);

  const cancelBtn = createElement("button", ["btn", "btn-cancel"], "Annuler");
  cancelBtn.type = "button";
  cancelBtn.onclick = () => formContainer.innerHTML = "";
  form.appendChild(cancelBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nom_appartement: nomInput.value.trim(),
      nom_residence: residenceInput.value.trim(),
      nom_ville: villeInput.value.trim(),
    };

    try {
      let url = `${apiBaseUrl}/appartements`;
      let method = "POST";

      if (appartement) {
        url += `/${appartement.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      formContainer.innerHTML = "";
      loadAppartements();
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  formContainer.appendChild(form);
}

async function deleteAppartement(id) {
  if (!confirm("Confirmer la suppression de cet appartement ?")) return;
  try {
    const res = await fetch(`${apiBaseUrl}/appartements/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression");
    loadAppartements();
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}


// Gestion des Agents
async function loadAgents() {
  const agentsContainer = document.getElementById("agents-list");
  agentsContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/agents`);
    const agents = await res.json();

    agentsContainer.innerHTML = "";
    agents.forEach(agent => {
      const div = createElement("div", ["agent-item"]);
      div.textContent = `CIN: ${agent.cin} - Nom: ${agent.nom} ${agent.prenom} - Login: ${agent.login} - Ville: ${agent.nom_ville}`;
      agentsContainer.appendChild(div);
    });
  } catch (error) {
    agentsContainer.textContent = "Erreur lors du chargement des agents.";
    console.error(error);
  }
}


// Gestion des Périodes
async function loadPeriodes() {
  const periodesContainer = document.getElementById("periodes-list");
  periodesContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/periodes`);
    const periodes = await res.json();

    periodesContainer.innerHTML = "";
    periodes.forEach(p => {
      const div = createElement("div", ["periode-item"]);
      div.textContent = `Ville: ${p.nom_ville} - Du ${p.date_debut} au ${p.date_fin}`;

      const editBtn = createElement("button", ["btn", "btn-edit"], "Modifier");
      editBtn.onclick = () => showPeriodeForm(p);
      const delBtn = createElement("button", ["btn", "btn-delete"], "Supprimer");
      delBtn.onclick = () => deletePeriode(p.id);

      div.append(editBtn, delBtn);
      periodesContainer.appendChild(div);
    });

    const addBtn = createElement("button", ["btn", "btn-add"], "Ajouter une période");
    addBtn.onclick = () => showPeriodeForm(null);
    periodesContainer.appendChild(addBtn);
  } catch (error) {
    periodesContainer.textContent = "Erreur lors du chargement des périodes.";
    console.error(error);
  }
}

function showPeriodeForm(periode) {
  const formContainer = document.getElementById("periode-form-container");
  formContainer.innerHTML = "";

  const form = createElement("form");
  form.id = "periode-form";

  const villeInput = createElement("input");
  villeInput.type = "text";
  villeInput.placeholder = "Nom de la ville";
  villeInput.value = periode ? periode.nom_ville : "";
  villeInput.required = true;
  form.appendChild(villeInput);

  const debutInput = createElement("input");
  debutInput.type = "date";
  debutInput.value = periode ? periode.date_debut : "";
  debutInput.required = true;
  form.appendChild(debutInput);

  const finInput = createElement("input");
  finInput.type = "date";
  finInput.value = periode ? periode.date_fin : "";
  finInput.required = true;
  form.appendChild(finInput);

  const submitBtn = createElement("button", ["btn", "btn-submit"], periode ? "Modifier" : "Ajouter");
  submitBtn.type = "submit";
  form.appendChild(submitBtn);

  const cancelBtn = createElement("button", ["btn", "btn-cancel"], "Annuler");
  cancelBtn.type = "button";
  cancelBtn.onclick = () => formContainer.innerHTML = "";
  form.appendChild(cancelBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nom_ville: villeInput.value.trim(),
      date_debut: debutInput.value,
      date_fin: finInput.value
    };

    try {
      let url = `${apiBaseUrl}/periodes`;
      let method = "POST";

      if (periode) {
        url += `/${periode.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      formContainer.innerHTML = "";
      loadPeriodes();
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  formContainer.appendChild(form);
}

async function deletePeriode(id) {
  if (!confirm("Confirmer la suppression de cette période ?")) return;
  try {
    const res = await fetch(`${apiBaseUrl}/periodes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression");
    loadPeriodes();
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}


// Gestion des Pré-réservations
async function loadPreReservations() {
  const preResContainer = document.getElementById("prereservations-list");
  preResContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/pre_reservations`);
    const preReservations = await res.json();

    preResContainer.innerHTML = "";
    preReservations.forEach(pr => {
      const div = createElement("div", ["prereservation-item"]);
      div.textContent = `Agent: ${pr.nom_agent} - Appartement: ${pr.nom_appartement} - Du ${pr.date_debut} au ${pr.date_fin} - Statut: ${pr.statut}`;

      if (pr.statut === "en attente") {
        const acceptBtn = createElement("button", ["btn", "btn-accept"], "Accepter");
        acceptBtn.onclick = () => updatePreReservationStatus(pr.id, "acceptée");

        const refuseBtn = createElement("button", ["btn", "btn-refuse"], "Refuser");
        refuseBtn.onclick = () => updatePreReservationStatus(pr.id, "refusée");

        div.append(acceptBtn, refuseBtn);
      }

      preResContainer.appendChild(div);
    });
  } catch (error) {
    preResContainer.textContent = "Erreur lors du chargement des pré-réservations.";
    console.error(error);
  }
}

async function updatePreReservationStatus(id, status) {
  if (!confirm(`Confirmer le changement de statut à "${status}" ?`)) return;
  try {
    const res = await fetch(`${apiBaseUrl}/pre_reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: status })
    });
    if (!res.ok) throw new Error("Erreur mise à jour");
    loadPreReservations();
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}


// Gestion des Paiements
async function loadPaiements() {
  const paiementsContainer = document.getElementById("paiements-list");
  paiementsContainer.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${apiBaseUrl}/paiements`);
    const paiements = await res.json();

    paiementsContainer.innerHTML = "";
    paiements.forEach(p => {
      const div = createElement("div", ["paiement-item"]);
      div.innerHTML = `
        <div>Agent: ${p.nom_agent} - Montant: ${p.montant} - Statut: ${p.statut}</div>
        <div>Reçu: <a href="${p.lien_recu}" target="_blank">Voir reçu</a></div>
      `;

      if (p.statut === "en attente") {
        const acceptBtn = createElement("button", ["btn", "btn-accept"], "Accepter");
        acceptBtn.onclick = () => updatePaiementStatus(p.id, "accepté");

        const refuseBtn = createElement("button", ["btn", "btn-refuse"], "Refuser");
        refuseBtn.onclick = () => updatePaiementStatus(p.id, "refusé");

        div.append(acceptBtn, refuseBtn);
      }

      paiementsContainer.appendChild(div);
    });
  } catch (error) {
    paiementsContainer.textContent = "Erreur lors du chargement des paiements.";
    console.error(error);
  }
}

async function updatePaiementStatus(id, status) {
  if (!confirm(`Confirmer le changement de statut à "${status}" ?`)) return;
  try {
    const res = await fetch(`${apiBaseUrl}/paiements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: status })
    });
    if (!res.ok) throw new Error("Erreur mise à jour");
    loadPaiements();
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}

