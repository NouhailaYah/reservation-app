document.getElementById('admin-login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('admin_token', data.token);
            window.location.href = 'admin.html';
        } else {
            document.getElementById('error-message').innerText = data.message || 'Connexion échouée';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'Erreur de connexion.';
        document.getElementById('error-message').style.display = 'block';
    }
});
