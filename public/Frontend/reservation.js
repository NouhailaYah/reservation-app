document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const feedback = document.getElementById('feedback');

  const urlParams = new URLSearchParams(window.location.search);
  const idPreReser = urlParams.get('id_pre_reser') || '';
  document.getElementById('id_pre_reser').value = idPreReser;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';

    const fileInput = document.getElementById('recu_paiement');
    if (fileInput.files.length === 0) {
      feedback.textContent = "Veuillez sélectionner un fichier pour le reçu de paiement.";
      return;
    }

    const formData = new FormData();
    formData.append('id_pre_reser', idPreReser);
    formData.append('recu_paiement', fileInput.files[0]);

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        body: formData,
        // Pas besoin de headers 'Content-Type', fetch le gère avec FormData
      });

      if (!response.ok) {
        const errData = await response.json();
        feedback.textContent = errData.message || 'Erreur lors de la réservation.';
        return;
      }

      const data = await response.json();
      feedback.style.color = 'green';
      feedback.textContent = 'Réservation enregistrée avec succès !';

    } catch (error) {
      feedback.textContent = 'Erreur réseau, veuillez réessayer.';
      console.error(error);
    }
  });
});
