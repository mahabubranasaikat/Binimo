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
    const userName = document.getElementById('user-name');
    const userMenuItems = document.getElementById('user-menu-items');

    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    postAdBtn.disabled = false;

    if (currentUser) {
        userName.textContent = currentUser.username;
        userMenuItems.innerHTML = `
            <li><a class="dropdown-item" href="#" id="messages">Messages</a></li>
            <li><a class="dropdown-item" href="#" id="my-ads">My Ads</a></li>
            ${currentUser.role === 'admin' ? '<li><a class="dropdown-item" href="#" id="admin-dashboard">Admin Dashboard</a></li>' : ''}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="logout">Logout</a></li>
        `;

        // Add event listeners for new menu items
        document.getElementById('messages').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('messagesModal'));
            modal.show();
            // Load messages
        });
        document.getElementById('my-ads').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('myAdsModal'));
            modal.show();
            // Load user's ads
        });
        if (currentUser.role === 'admin') {
            document.getElementById('admin-dashboard').addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('adminModal'));
                modal.show();
                // Load admin content
            });
        }
        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
            location.reload();
        });
    }

    // Close auth modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    if (modal) modal.hide();
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        currentUser = JSON.parse(user);
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
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showAuthenticatedView();
            alert('Login successful!');
        } else {
            const error = await response.json();
            alert(error.message || 'Login failed. Please check your credentials.');
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
            alert(error.message || 'Sign up failed. Please try again.');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Initialize auth status on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);