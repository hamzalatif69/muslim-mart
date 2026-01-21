// ====================
// PWA FUNCTIONALITY
// ====================

class PWAManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.deferredPrompt = null;
        this.initPWA();
    }

    // Initialize PWA
    async initPWA() {
        console.log('Initializing PWA...');
        this.registerServiceWorker();
        this.setupOnlineOfflineDetection();
        this.setupInstallPrompt();
        this.loadOfflineData();
    }

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js', {
                    scope: '/'
                });
                console.log('✓ Service Worker registered:', registration);
                this.setupServiceWorkerUpdates(registration);
                
                // Show success
                this.showPWAStatus('Service Worker Active');
            } catch (error) {
                console.error('✗ Service Worker registration failed:', error);
                // Try with relative path
                try {
                    const registration = await navigator.serviceWorker.register('service-worker.js', {
                        scope: './'
                    });
                    console.log('✓ Service Worker registered (relative path):', registration);
                    this.setupServiceWorkerUpdates(registration);
                } catch (err) {
                    console.error('✗ Service Worker registration failed (both paths):', err);
                }
            }
        } else {
            console.warn('Service Workers not supported');
        }
    }

    // Setup service worker updates
    setupServiceWorkerUpdates(registration) {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.notifyUpdate();
                }
            });
        });

        setInterval(() => {
            registration.update();
        }, 60000);
    }

    // Notify user about updates
    notifyUpdate() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
        updateNotification.innerHTML = `
            <span>New version available!</span>
            <button onclick="location.reload()" class="bg-white text-blue-500 px-3 py-1 rounded font-semibold hover:bg-gray-100">
                Update
            </button>
        `;
        document.body.appendChild(updateNotification);
    }

    // Setup online/offline detection
    setupOnlineOfflineDetection() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    // Handle going online
    handleOnline() {
        this.isOnline = true;
        this.showOnlineStatus(true);
        this.syncOfflineData();
        console.log('✓ Application is online');
    }

    // Handle going offline
    handleOffline() {
        this.isOnline = false;
        this.showOnlineStatus(false);
        console.log('⚠️ Application is offline');
    }

    // Show online/offline status
    showOnlineStatus(isOnline) {
        let statusBar = document.getElementById('pwa-status-bar');
        
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'pwa-status-bar';
            document.body.insertBefore(statusBar, document.body.firstChild);
        }

        if (isOnline) {
            statusBar.className = 'bg-green-500 text-white text-center py-2 text-sm font-semibold';
            statusBar.textContent = '✓ Online - All features available';
            setTimeout(() => {
                statusBar.style.display = 'none';
            }, 3000);
        } else {
            statusBar.className = 'bg-orange-500 text-white text-center py-2 text-sm font-semibold';
            statusBar.textContent = '⚠️ Offline - Using cached data';
            statusBar.style.display = 'block';
        }
    }

    // Show PWA status
    showPWAStatus(message) {
        console.log('PWA Status:', message);
    }

    // Setup install prompt
    setupInstallPrompt() {
        console.log('Setting up install prompt listeners...');
        
        // Listen for beforeinstallprompt (most reliable)
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('✓✓✓ beforeinstallprompt event FIRED! ✓✓✓');
            event.preventDefault();
            this.deferredPrompt = event;
            console.log('Deferred prompt stored, showing banner immediately');
            this.showInstallBanner();
        });

        // Listen for appinstalled
        window.addEventListener('appinstalled', () => {
            console.log('✓ App successfully installed!');
            this.deferredPrompt = null;
            sessionStorage.removeItem('pwa-install-shown');
        });

        // Check current state
        if (window.navigator.standalone === true) {
            console.log('✓ Already running as standalone PWA');
            return;
        }

        // Check display-mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✓ Running in standalone display mode');
            return;
        }

        console.log('App not installed yet, waiting for beforeinstallprompt...');
        console.log('Note: beforeinstallprompt only fires on HTTPS or localhost');
    }

    // Show install banner
    showInstallBanner() {
        if (!this.deferredPrompt) {
            console.log('⚠️ No deferred prompt available');
            return;
        }

        // Check if already shown
        const shown = sessionStorage.getItem('pwa-install-shown');
        if (shown === 'true') {
            console.log('Install banner already shown this session');
            return;
        }

        console.log('Creating install banner...');
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-2xl z-50 animate-bounce';
        banner.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <span class="text-3xl">🛍️</span>
                    <div>
                        <h3 class="font-bold text-lg">Install Muslim Mart</h3>
                        <p class="text-sm opacity-90">Get fast access on your device. Works offline too!</p>
                    </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                    <button id="pwa-install-yes" class="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                        Install Now
                    </button>
                    <button id="pwa-install-no" class="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-40 transition">
                        Not Now
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        console.log('✓ Install banner added to DOM');

        // Mark as shown
        sessionStorage.setItem('pwa-install-shown', 'true');

        // Event listeners
        document.getElementById('pwa-install-yes').addEventListener('click', async () => {
            console.log('User clicked "Install Now"');
            await this.installApp();
        });

        document.getElementById('pwa-install-no').addEventListener('click', () => {
            console.log('User clicked "Not Now"');
            banner.remove();
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (document.getElementById('pwa-install-banner')) {
                console.log('Auto-hiding install banner');
                banner.remove();
            }
        }, 10000);

        console.log('✓ Install banner displayed successfully');
    }

    // Install app
    async installApp() {
        if (!this.deferredPrompt) {
            console.log('No deferred prompt available for install');
            return;
        }

        console.log('User clicked install');
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('User installation choice:', outcome);
        this.deferredPrompt = null;

        // Remove install prompt
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    // Load offline data from cache
    loadOfflineData() {
        if (!this.isOnline) {
            this.loadDataFromCache();
        }
    }

    // Load data from cache storage
    async loadDataFromCache() {
        try {
            const cache = await caches.open('muslim-mart-v1');
            console.log('✓ Loaded from cache storage');
        } catch (error) {
            console.error('Error loading cache:', error);
        }
    }

    // Sync offline data
    syncOfflineData() {
        const offlineSalesJSON = localStorage.getItem('muslimmart_offline_sales');
        if (offlineSalesJSON) {
            try {
                const offlineSales = JSON.parse(offlineSalesJSON);
                if (offlineSales.length > 0) {
                    this.notifySyncProgress(offlineSales.length);
                }
            } catch (error) {
                console.error('Error syncing offline sales:', error);
            }
        }
    }

    // Notify sync progress
    notifySyncProgress(count) {
        const syncNotification = document.createElement('div');
        syncNotification.className = 'fixed top-20 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        syncNotification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="animate-spin">⟳</span>
                <span>Syncing ${count} offline transactions...</span>
            </div>
        `;
        document.body.appendChild(syncNotification);

        setTimeout(() => {
            syncNotification.remove();
        }, 5000);
    }

    // Get online status
    getStatus() {
        return {
            isOnline: this.isOnline,
            hasServiceWorker: 'serviceWorker' in navigator,
            isInstalled: window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches
        };
    }

    // Request notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Send notification
    async sendNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
                icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%2316a34a" width="192" height="192"/%3E%3Ctext x="50%" y="50%" font-size="60" fill="%23ffffff" text-anchor="middle" dy=".3em"%3E🛍️%3C/text%3E%3C/svg%3E',
                badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%2316a34a" width="192" height="192"/%3E%3Ctext x="50%" y="50%" font-size="60" fill="%23ffffff" text-anchor="middle" dy=".3em"%3E🛍️%3C/text%3E%3C/svg%3E',
                ...options
            });
        }
    }

    // Store offline transaction
    storeOfflineTransaction(type, data) {
        try {
            const key = `muslimmart_offline_${type}_${Date.now()}`;
            localStorage.setItem(key, JSON.stringify({
                type,
                data,
                timestamp: new Date().toISOString(),
                synced: false
            }));
            console.log('Offline transaction stored:', key);
        } catch (error) {
            console.error('Error storing offline transaction:', error);
        }
    }

    // Get all offline transactions
    getOfflineTransactions() {
        const transactions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('muslimmart_offline_')) {
                const transaction = JSON.parse(localStorage.getItem(key));
                if (!transaction.synced) {
                    transactions.push({ key, ...transaction });
                }
            }
        }
        return transactions;
    }

    // Mark transaction as synced
    markTransactionSynced(key) {
        const transaction = JSON.parse(localStorage.getItem(key));
        transaction.synced = true;
        localStorage.setItem(key, JSON.stringify(transaction));
    }
}

// Initialize PWA Manager globally
let pwaManager;
window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing PWA Manager on DOM load');
    pwaManager = new PWAManager();
});

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM already ready, initializing PWA Manager');
    pwaManager = new PWAManager();
}

// Handle service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_OFFLINE_SALES') {
            console.log('Offline sales synced:', event.data.data);
            if (pwaManager) {
                pwaManager.syncOfflineData();
            }
        }
    });
}

console.log('PWA script loaded');


    // Setup service worker updates
    setupServiceWorkerUpdates(registration) {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New version available
                    this.notifyUpdate();
                }
            });
        });

        // Check for updates periodically
        setInterval(() => {
            registration.update();
        }, 60000); // Check every minute
    }

    // Notify user about updates
    notifyUpdate() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
        updateNotification.innerHTML = `
            <span>New version available!</span>
            <button onclick="location.reload()" class="bg-white text-blue-500 px-3 py-1 rounded font-semibold hover:bg-gray-100">
                Update
            </button>
        `;
        document.body.appendChild(updateNotification);
    }

    // Setup online/offline detection
    setupOnlineOfflineDetection() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    // Handle going online
    handleOnline() {
        this.isOnline = true;
        this.showOnlineStatus(true);
        this.syncOfflineData();
        console.log('Application is online');
    }

    // Handle going offline
    handleOffline() {
        this.isOnline = false;
        this.showOnlineStatus(false);
        console.log('Application is offline');
    }

    // Show online/offline status
    showOnlineStatus(isOnline) {
        let statusBar = document.getElementById('pwa-status-bar');
        
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'pwa-status-bar';
            document.body.insertBefore(statusBar, document.body.firstChild);
        }

        if (isOnline) {
            statusBar.className = 'bg-green-500 text-white text-center py-2 text-sm font-semibold';
            statusBar.textContent = '✓ Online - All features available';
            setTimeout(() => {
                statusBar.style.display = 'none';
            }, 3000);
        } else {
            statusBar.className = 'bg-orange-500 text-white text-center py-2 text-sm font-semibold';
            statusBar.textContent = '⚠️ Offline - Using cached data, changes will sync when online';
            statusBar.style.display = 'block';
        }
    }

    // Setup install prompt
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('Application installed');
            this.deferredPrompt = null;
        });
    }

    // Show install prompt
    showInstallPrompt() {
        if (!this.deferredPrompt) return;

        const installPrompt = document.createElement('div');
        installPrompt.className = 'fixed bottom-4 left-4 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-xs';
        installPrompt.innerHTML = `
            <div class="flex items-center gap-2 mb-3">
                <span class="text-2xl">🛍️</span>
                <h3 class="font-bold">Install Muslim Mart</h3>
            </div>
            <p class="text-sm mb-3 opacity-90">Add Muslim Mart to your home screen for quick access</p>
            <div class="flex gap-2">
                <button onclick="pwaManager.installApp()" class="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 flex-1">
                    Install
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="bg-white bg-opacity-20 text-white px-4 py-2 rounded font-semibold hover:bg-opacity-30 flex-1">
                    Later
                </button>
            </div>
        `;
        
        // Only show once per session
        if (!sessionStorage.getItem('install-prompt-shown')) {
            document.body.appendChild(installPrompt);
            sessionStorage.setItem('install-prompt-shown', 'true');
        }
    }

    // Install app
    async installApp() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('User installation choice:', outcome);
        this.deferredPrompt = null;

        // Remove install prompt
        const prompt = document.querySelector('[onclick="pwaManager.installApp()"]');
        if (prompt) {
            prompt.closest('div').remove();
        }
    }

    // Load offline data from cache
    loadOfflineData() {
        if (!this.isOnline) {
            this.loadDataFromCache();
        }
    }

    // Load data from cache storage
    async loadDataFromCache() {
        try {
            const cache = await caches.open('muslim-mart-v1');
            // Data will be loaded from localStorage as fallback
            console.log('Loading from cache storage');
        } catch (error) {
            console.error('Error loading cache:', error);
        }
    }

    // Sync offline data
    syncOfflineData() {
        // Use localStorage for offline data
        const offlineSalesJSON = localStorage.getItem('muslimmart_offline_sales');
        if (offlineSalesJSON) {
            try {
                const offlineSales = JSON.parse(offlineSalesJSON);
                if (offlineSales.length > 0) {
                    this.notifySyncProgress(offlineSales.length);
                    // Data will be synced through normal application flow
                }
            } catch (error) {
                console.error('Error syncing offline sales:', error);
            }
        }
    }

    // Notify sync progress
    notifySyncProgress(count) {
        const syncNotification = document.createElement('div');
        syncNotification.className = 'fixed top-20 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        syncNotification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="animate-spin">⟳</span>
                <span>Syncing ${count} offline transactions...</span>
            </div>
        `;
        document.body.appendChild(syncNotification);

        setTimeout(() => {
            syncNotification.remove();
        }, 5000);
    }

    // Get online status
    getStatus() {
        return {
            isOnline: this.isOnline,
            hasServiceWorker: 'serviceWorker' in navigator,
            isInstalled: window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches
        };
    }

    // Request notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Send notification
    async sendNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
                icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%2316a34a" width="192" height="192"/%3E%3Ctext x="50%" y="50%" font-size="60" fill="%23ffffff" text-anchor="middle" dy=".3em"%3E🛍️%3C/text%3E%3C/svg%3E',
                badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%2316a34a" width="192" height="192"/%3E%3Ctext x="50%" y="50%" font-size="60" fill="%23ffffff" text-anchor="middle" dy=".3em"%3E🛍️%3C/text%3E%3C/svg%3E',
                ...options
            });
        }
    }

    // Store offline transaction
    storeOfflineTransaction(type, data) {
        try {
            const key = `muslimmart_offline_${type}_${Date.now()}`;
            localStorage.setItem(key, JSON.stringify({
                type,
                data,
                timestamp: new Date().toISOString(),
                synced: false
            }));
            console.log('Offline transaction stored:', key);
        } catch (error) {
            console.error('Error storing offline transaction:', error);
        }
    }

    // Get all offline transactions
    getOfflineTransactions() {
        const transactions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('muslimmart_offline_')) {
                const transaction = JSON.parse(localStorage.getItem(key));
                if (!transaction.synced) {
                    transactions.push({ key, ...transaction });
                }
            }
        }
        return transactions;
    }

    // Mark transaction as synced
    markTransactionSynced(key) {
        const transaction = JSON.parse(localStorage.getItem(key));
        transaction.synced = true;
        localStorage.setItem(key, JSON.stringify(transaction));
    }
}

// Initialize PWA Manager globally
let pwaManager;
window.addEventListener('DOMContentLoaded', () => {
    pwaManager = new PWAManager();
});

// Handle service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_OFFLINE_SALES') {
            console.log('Offline sales synced:', event.data.data);
            if (pwaManager) {
                pwaManager.syncOfflineData();
            }
        }
    });
}
