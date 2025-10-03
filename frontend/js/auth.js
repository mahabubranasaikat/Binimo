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
        document.getElementById('messages').addEventListener('click', async () => {
            const modal = new bootstrap.Modal(document.getElementById('messagesModal'));
            modal.show();
            // Load messages
            try {
                const response = await fetch('/api/messages', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const messages = await response.json();
                    const messagesList = document.getElementById('messages-list');
                    messagesList.innerHTML = messages.length > 0 ? messages.map(msg => `<div class="border-bottom py-2"><strong>${msg.sender_name}:</strong> ${msg.message} <small class="text-muted">${new Date(msg.timestamp).toLocaleString()}</small></div>`).join('') : '<p>No messages yet.</p>';
                } else {
                    document.getElementById('messages-list').innerHTML = '<p>Error loading messages.</p>';
                }
            } catch (error) {
                console.error('Error loading messages:', error);
                document.getElementById('messages-list').innerHTML = '<p>Network error.</p>';
            }
        });
        document.getElementById('my-ads').addEventListener('click', async () => {
            const modal = new bootstrap.Modal(document.getElementById('myAdsModal'));
            modal.show();
            // Load user's ads
            try {
                const response = await fetch('/api/products/user/me', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const products = await response.json();
                    const myAdsList = document.getElementById('my-ads-list');
                    myAdsList.innerHTML = products.length > 0 ? products.map(product => `<div class="border-bottom py-2"><strong>${product.title}</strong> - $${product.price} <span class="badge bg-${product.status === 'approved' ? 'success' : 'warning'}">${product.status}</span></div>`).join('') : '<p>No ads posted yet.</p>';
                } else {
                    document.getElementById('my-ads-list').innerHTML = '<p>Error loading ads.</p>';
                }
            } catch (error) {
                console.error('Error loading ads:', error);
                document.getElementById('my-ads-list').innerHTML = '<p>Network error.</p>';
            }
        });
        if (currentUser.role === 'admin') {
            document.getElementById('admin-dashboard').addEventListener('click', async () => {
                const modal = new bootstrap.Modal(document.getElementById('adminModal'));
                modal.show();
                // Load admin content
                try {
                    const [productsRes, reportsRes] = await Promise.all([
                        fetch('/api/products?status=pending', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
                        fetch('/api/admin/reports', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                    ]);
                    const products = productsRes.ok ? await productsRes.json() : [];
                    const reports = reportsRes.ok ? await reportsRes.json() : [];
                    const adminContent = document.getElementById('admin-content');
                    adminContent.innerHTML = `
                        <h6>Pending Products</h6>
                        ${products.map(p => `<div class="d-flex justify-content-between align-items-center border-bottom py-2"><span>${p.title} by ${p.user_id}</span><div><button class="btn btn-sm btn-success me-1" onclick="approveProduct(${p.id})">Approve</button><button class="btn btn-sm btn-danger" onclick="rejectProduct(${p.id})">Reject</button></div></div>`).join('')}
                        <h6 class="mt-3">Reports</h6>
                        ${reports.map(r => `<div class="border-bottom py-2">${r.reason} <button class="btn btn-sm btn-primary" onclick="handleReport(${r.id})">Handle</button></div>`).join('')}
                    `;
                } catch (error) {
                    console.error('Error loading admin content:', error);
                    document.getElementById('admin-content').innerHTML = '<p>Error loading content.</p>';
                }
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
            // Clear form
            document.getElementById('signup-form').reset();
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

// Admin functions
async function approveProduct(id) {
    try {
        const response = await fetch(`/api/admin/products/${id}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            alert('Product approved');
            // Refresh modal
            document.getElementById('admin-dashboard').click();
        } else {
            alert('Error approving product');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function rejectProduct(id) {
    try {
        const response = await fetch(`/api/admin/products/${id}/reject`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            alert('Product rejected');
            document.getElementById('admin-dashboard').click();
        } else {
            alert('Error rejecting product');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleReport(id) {
    try {
        const response = await fetch(`/api/admin/reports/${id}/handle`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            alert('Report handled');
            document.getElementById('admin-dashboard').click();
        } else {
            alert('Error handling report');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize auth status on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);