 // ========================================
// Header Component
// ========================================

class Header {
    constructor() {
        this.element = null;
        this.currentDashboard = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        console.log('🏗️ Initializing Header component...');
        
        try {
            this.createElement();
            this.attachEventListeners();
            this.render();
            
            this.isInitialized = true;
            console.log('✅ Header component initialized');
            
            EventBus.emit('component:header:ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize Header:', error);
        }
    }
    
    createElement() {
        const headerContainer = Utils.querySelector('#app-header');
        if (!headerContainer) {
            throw new Error('Header container #app-header not found');
        }
        
        this.element = headerContainer;
        this.element.className = 'app-header';
    }
    
    attachEventListeners() {
        // Listen for app events
        EventBus.on('app:dashboard:changed', (dashboard) => {
            this.currentDashboard = dashboard;
            this.updateDashboardName();
        });
        
        EventBus.on('theme:changed', () => {
            this.updateDateTime();
        });
        // Add this to existing attachEventListeners method
        EventBus.on('header:dashboard:changed', (dashboard) => {
            this.setCurrentDashboard(dashboard);
        });
        // Add to existing attachEventListeners method in Header.js
        EventBus.on('window:resize', () => {
            this.handleResize();
        });
        // Update time every minute
        setInterval(() => {
            this.updateDateTime();
        }, 60000);
    }
    
    render() {
        this.element.innerHTML = `
            <div class="header-left">
                <button class="sidebar-toggle" id="sidebar-toggle" title="Toggle Sidebar">
                    <i class="fas fa-bars"></i>
                </button>
                
                <a href="#" class="header-logo">
                    <i class="fas fa-leaf"></i>
                    <span>FieldMonitor</span>
                </a>
                
                <div class="current-dashboard no-dashboard" id="current-dashboard-name">
                    No Dashboard Selected
                </div>
            </div>
            
            <div class="header-right">
                <div class="header-info" id="header-datetime">
                    ${Utils.formatDate()}
                </div>
                
                <div class="header-actions">
                    <button class="header-btn" id="import-btn" title="Import Dashboard">
                        <i class="fas fa-file-import"></i>
                    </button>
                    
                    <button class="header-btn" id="export-btn" title="Export Dashboard">
                        <i class="fas fa-file-export"></i>
                    </button>
                    
                    <button class="header-btn" id="grid-view-btn" title="Grid View">
                        <i class="fas fa-th"></i>
                    </button>
                    
                    <button class="header-btn" id="share-btn" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                    
                    <button class="header-btn" id="notifications-btn" title="Notifications">
                        <i class="fas fa-bell"></i>
                        <span class="status-dot" style="display: none;"></span>
                    </button>
                    
                    <button class="header-btn" id="settings-btn" title="Settings">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Attach click handlers
        this.attachClickHandlers();
        
        // Update initial state
        this.updateDateTime();
    }
    
    attachClickHandlers() {
        // Sidebar toggle
        const sidebarToggle = this.element.querySelector('#sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                EventBus.emit('header:sidebar:toggle');
            });
        }
        
        // Logo click
        const logo = this.element.querySelector('.header-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                EventBus.emit('header:logo:click');
            });
        }
        
        // Action buttons
        const buttons = {
            'import-btn': 'header:import:click',
            'export-btn': 'header:export:click',
            'grid-view-btn': 'header:grid-view:click',
            'share-btn': 'header:share:click',
            'notifications-btn': 'header:notifications:click',
            'settings-btn': 'header:settings:click'
        };
        
        Object.entries(buttons).forEach(([id, event]) => {
            const button = this.element.querySelector(`#${id}`);
            if (button) {
                button.addEventListener('click', () => {
                    EventBus.emit(event);
                    this.showButtonFeedback(button);
                });
            }
        });
    }
    
    updateDashboardName() {
        const nameElement = this.element.querySelector('#current-dashboard-name');
        if (!nameElement) return;
        
        if (this.currentDashboard) {
            nameElement.textContent = this.currentDashboard.name;
            nameElement.className = 'current-dashboard';
        } else {
            nameElement.textContent = 'No Dashboard Selected';
            nameElement.className = 'current-dashboard no-dashboard';
        }
    }
    
    updateDateTime() {
        const datetimeElement = this.element.querySelector('#header-datetime');
        if (datetimeElement) {
            datetimeElement.textContent = Utils.formatDate();
        }
    }
    handleResize() {
        // Auto-collapse sidebar on mobile
        if (window.innerWidth <= 768) {
            EventBus.emit('header:mobile:resize');
        }
    }
    
    showButtonFeedback(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    setNotificationStatus(hasNotifications) {
        const notificationBtn = this.element.querySelector('#notifications-btn');
        const statusDot = notificationBtn?.querySelector('.status-dot');
        
        if (statusDot) {
            statusDot.style.display = hasNotifications ? 'block' : 'none';
        }
    }
    
    // Public API
    setCurrentDashboard(dashboard) {
        this.currentDashboard = dashboard;
        this.updateDashboardName();
    }
    
    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
        }
        console.log('🧹 Header component destroyed');
    }
}

// Export for global use
window.HeaderComponent = Header;
