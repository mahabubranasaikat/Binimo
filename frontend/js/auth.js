// Authentication logic
let currentUser = null;

function showAuthForm() {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
}

function showAuthenticatedView() {
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');
    const postAdBtn = document.getElementById('post-ad');

    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    postAdBtn.disabled = false;

    // Close auth modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    if (modal) modal.hide();
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and show authenticated view
        showAuthenticatedView();
    }
}

document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm();
});

document.getElementById('signup').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm();
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            showAuthenticatedView();
            alert('Login successful!');
        } else {
            const error = await response.json();
            alert(error.message || 'Login failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Sign up successful! Please login.');
            // Switch to login tab
            const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
            loginTab.show();
        } else {
            const error = await response.json();
            alert(error.message || 'Sign up failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Initialize auth status on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);