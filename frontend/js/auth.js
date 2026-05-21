class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        return this.user?.role === 'ROLE_ADMIN';
    }

    getToken() {
        return this.token;
    }

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateUI();
    }

    updateUI() {
        const authLinks = document.getElementById('authLinks');
        if (!authLinks) return;

        if (this.isAuthenticated()) {
            const displayName = this.user?.username || 'User';
            authLinks.innerHTML = `
                ${this.isAdmin() ? '<a href="#admin" class="nav-link">Dashboard</a>' : ''}
                <a href="#" class="nav-link" onclick="authManager.logout(event)">
                    <i class="fas fa-sign-out-alt"></i> Logout (${displayName})
                </a>
            `;
        } else {
            authLinks.innerHTML = `<a href="#login" class="nav-link btn-login">Login</a>`;
        }
    }

    logout(e) {
        if (e) e.preventDefault();
        this.clearAuth();
        window.location.hash = '#home';
        showAlert('Logged out successfully', 'success');
    }
}

const authManager = new AuthManager();