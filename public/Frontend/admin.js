const API_BASE_URL = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('admin_token');

function logout() {
    localStorage.removeItem('admin_token');
    window.location.href = 'login.html';
}

document.getElementById('logout-button').addEventListener('click', logout);

// Navigation entre les sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('appartements-btn').addEventListener('click', () => showSection('appartements-section'));
document.getElementById('agents-btn').addEventListener('click', () => showSection('agents-section'));
document.getElementById('pre-reservations-btn').addEventListener('click', () => showSection('pre-reservations-section'));

//GESTION DES APPARTEMENTS
async function fetchAppartements() {
    const response = await fetch(`${API_BASE_URL}/appartements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const appartements = await response.json();
    const container = document.getElementById('appartements-list');
    container.innerHTML = '';

    appartements.forEach(app => {
        const div = document.createElement('div');
        div.className = 'appartement-card';
        div.innerHTML = `
            <h3>${app.nom || 'Appartement'}</h3>
            <p>${app.superficie ? app.superficie + ' m²' : 'Superficie non définie'}</p>
            <p>${app.nbr_chambre ? app.nbr_chambre + ' chambre(s)' : 'Nombre de chambres non défini'}</p>
            <p>${app.etages ? 'Étage ' + app.etages : 'Étage non défini'}</p>
            <p>${app.prix ? app.prix + ' DH / nuit' : 'Prix non défini'}</p>
            <button onclick="editAppartement(${app.id})">Modifier</button>
            <button onclick="deleteAppartement(${app.id})">Supprimer</button>
        `;
        container.appendChild(div);
    });
}

// Supprimer un appartement
async function deleteAppartement(id) {
    if (!confirm('Supprimer cet appartement ?')) return;

    await fetch(`${API_BASE_URL}/appartements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    fetchAppartements();
}

// Ajouter une résidence
async function addResidence(data) {
    await fetch(`${API_BASE_URL}/residences`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`},
        body: JSON.stringify(data)
    });
    fetchResidences();
}

// Charger les périodes
async function chargerPeriodes() {
    const response = await fetch(`${API_BASE_URL}/periodes`, {headers: {'Authorization': `Bearer ${token}`}});
    const periodes = await response.json();
    const listePeriodes = document.getElementById('listePeriodes');
    listePeriodes.innerHTML = '';

    periodes.forEach(periode => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${periode.nom_ville} : Du ${periode.date_debut} au ${periode.date_fin}</p>`;
        listePeriodes.appendChild(div);
    });
}

// Ajouter une période
async function addPeriode(ville, dateDebut, dateFin) {
    await fetch(`${API_BASE_URL}/periodes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({nom_ville: ville, date_debut: dateDebut, date_fin: dateFin})
    });
    chargerPeriodes();
}

// Soumission formulaire période
document.getElementById('periodeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ville = document.getElementById('nom_ville_periode').value;
    const dateDebut = document.getElementById('date_debut').value;
    const dateFin = document.getElementById('date_fin').value;
    addPeriode(ville, dateDebut, dateFin);
});

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    fetchAppartements();
    chargerPeriodes();
});  



