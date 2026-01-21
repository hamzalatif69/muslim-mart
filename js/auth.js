// ====================
// AUTHENTICATION & SESSION MANAGEMENT
// ====================

class AuthManager {
    constructor() {
        this.currentUserKey = 'muslimmart_currentUser';
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('muslimmart_users') || '[]');
        const user = users.find(u => u.email === email && u.password === btoa(password));
        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'login.html';
    }

    getCurrentUserShop() {
        const user = this.getCurrentUser();
        return user ? user.shopName : 'Muslim Mart';
    }
}

// Redirect to login if not authenticated (with delay for LocalStorage sync)
function checkAuth() {
    const authManager = new AuthManager();
    setTimeout(() => {
        if (!authManager.isLoggedIn()) {
            window.location.href = 'auth.html';
        }
    }, 100);
}

// Initialize auth check on page load
window.addEventListener('load', checkAuth);
