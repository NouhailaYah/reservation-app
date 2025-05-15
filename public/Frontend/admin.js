const API_BASE_URL = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('admin_token');

function logout() {
    localStorage.removeItem('admin_token');
    window.location.href = 'login_admin.html';
}

// Navigation entre les sections
function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAppartements();
    fetchResidences();
    fetchAgents();
    fetchPreReservations();
    fetchPaiements();
    chargerPeriodes();
});

// GESTION DES APPARTEMENTS
async function fetchAppartements() {
    const response = await fetch(`${API_BASE_URL}/appartements`, { headers: { 'Authorization': `Bearer ${token}` }});
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
            <button onclick="editAppartement(${app.id})">Modifier</button>
            <button onclick="deleteAppartement(${app.id})">Supprimer</button>
        `;
        container.appendChild(div);
    });
}

// GESTION DES PAIEMENTS
async function fetchPaiements() {
    const response = await fetch(`${API_BASE_URL}/paiements`, { headers: { 'Authorization': `Bearer ${token}` }});
    const paiements = await response.json();
    const container = document.getElementById('paiements-list');
    container.innerHTML = '';

    paiements.forEach(payment => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>Agent: ${payment.agent.nom} ${payment.agent.prenom}</p>
            <p>Montant: ${payment.montant} DH</p>
            <a href="${payment.recu_url}" target="_blank">Voir le reçu</a>
            <button onclick="validerPaiement(${payment.id})">Valider</button>
            <button onclick="refuserPaiement(${payment.id})">Refuser</button>
        `;
        container.appendChild(div);
    });
}

// Valider ou Refuser Paiement
async function validerPaiement(id) {
    await fetch(`${API_BASE_URL}/paiements/${id}/valider`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPaiements();
}

async function refuserPaiement(id) {
    await fetch(`${API_BASE_URL}/paiements/${id}/refuser`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPaiements();
}

// GESTION DES PRE-RESERVATIONS
async function fetchPreReservations() {
    const response = await fetch(`${API_BASE_URL}/pre-reservations`, { headers: { 'Authorization': `Bearer ${token}` }});
    const reservations = await response.json();
    const container = document.getElementById('reservations-list');
    container.innerHTML = '';

    reservations.forEach(res => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>Agent: ${res.agent.nom} ${res.agent.prenom}</p>
            <p>Appartement: ${res.appartement.nom}</p>
            <button onclick="accepterPreReservation(${res.id})">Accepter</button>
            <button onclick="refuserPreReservation(${res.id})">Refuser</button>
        `;
        container.appendChild(div);
    });
}

// Accepter ou Refuser Pré-réservation
async function accepterPreReservation(id) {
    await fetch(`${API_BASE_URL}/pre-reservations/${id}/accepter`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPreReservations();
}

async function refuserPreReservation(id) {
    await fetch(`${API_BASE_URL}/pre-reservations/${id}/refuser`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPreReservations();
}
