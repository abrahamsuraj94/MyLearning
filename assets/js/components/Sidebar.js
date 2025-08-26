 // ========================================
// Sidebar Component
// ========================================

class Sidebar {
    constructor() {
        this.element = null;
        this.dashboards = {};
        this.currentDashboard = null;
        this.isCollapsed = false;
        this.isInitialized = false;
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        console.log('🏗️ Initializing Sidebar component...');
        
        try {
            this.createElement();
            this.attachEventListeners();
            this.render();
            this.loadDashboards();
            
            this.isInitialized = true;
            console.log('✅ Sidebar component initialized');
            
            EventBus.emit('component:sidebar:ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize Sidebar:', error);
        }
    }
    
    createElement() {
        const sidebarContainer = Utils.querySelector('#app-sidebar');
        if (!sidebarContainer) {
            throw new Error('Sidebar container #app-sidebar not found');
        }
        
        this.element = sidebarContainer;
        this.element.className = 'app-sidebar';
        
        // Create overlay for mobile
        this.createOverlay();
    }
    
    createOverlay() {
        const overlay = Utils.createElement('div', 'sidebar-overlay');
        overlay.id = 'sidebar-overlay';
        overlay.addEventListener('click', () => {
            this.collapse();
        });
        document.body.appendChild(overlay);
    }
    
    attachEventListeners() {
        // Listen for header sidebar toggle
        EventBus.on('header:sidebar:toggle', () => {
            this.toggle();
        });
        
        // 🆕 Listen for dashboard events
        EventBus.on('dashboard:created', (dashboard) => {
            console.log('📊 Sidebar received dashboard:created event:', dashboard.name);
            this.addDashboard(dashboard);
        });
        
        EventBus.on('dashboard:deleted', (data) => {
            console.log('📊 Sidebar received dashboard:deleted event:', data.id);
            this.removeDashboard(data.id);
        });
        
        EventBus.on('dashboard:updated', (dashboard) => {
            console.log('📊 Sidebar received dashboard:updated event:', dashboard.name);
            this.updateDashboard(dashboard);
        });
        
        // 🆕 Listen for dashboard selection
        EventBus.on('dashboard:select', (dashboard) => {
            console.log('📊 Sidebar selecting dashboard:', dashboard.name);
            this.selectDashboard(dashboard.id);
        });
        
        // Window resize
        EventBus.on('window:resize', () => {
            this.handleResize();
        });
    }
    
    render() {
        this.element.innerHTML = `
            <div class="sidebar-header">
                <h2 class="sidebar-title">SAHAYAK DASHBOARD</h2>
                <button class="create-dashboard-btn" id="create-dashboard-btn">
                    <i class="fas fa-plus"></i>
                    Create Dashboard
                </button>
            </div>
            
            <div class="sidebar-search">
                <input type="text" class="search-input" id="dashboard-search" placeholder="Search Dashboards">
                <i class="fas fa-search search-icon"></i>
            </div>
            
            <div class="sidebar-content">
                <ul class="dashboard-list" id="dashboard-list">
                    <!-- Dashboards will be populated here -->
                </ul>
                
                <div class="empty-state" id="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <p>No dashboards yet.</p>
                    <p><a href="#" class="empty-state-action" id="empty-create-btn">Create your first dashboard</a> to get started.</p>
                </div>
            </div>
        `;
        
        this.attachClickHandlers();
    }
    
    attachClickHandlers() {
        // Create dashboard button
        const createBtn = this.element.querySelector('#create-dashboard-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                EventBus.emit('dashboard:create:click');
            });
        }

        // Empty state create button
        const emptyCreateBtn = this.element.querySelector('#empty-create-btn');
        if (emptyCreateBtn) {
            emptyCreateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                EventBus.emit('dashboard:create:click');
            });
        }
        
        // Search input
        const searchInput = this.element.querySelector('#dashboard-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterDashboards();
            });
        }
    }
    
    loadDashboards() {
        // Load dashboards from DashboardService instead of localStorage directly
        if (window.dashboardService) {
            const dashboards = window.dashboardService.getAll();
            this.dashboards = {};
            
            // Convert array to object keyed by ID
            dashboards.forEach(dashboard => {
                this.dashboards[dashboard.id] = dashboard;
            });
            
            this.renderDashboards();
            console.log('📊 Loaded dashboards from service:', Object.keys(this.dashboards).length);
        } else {
            console.warn('⚠️ DashboardService not available');
        }
    }
    
    renderDashboards() {
        const dashboardList = this.element.querySelector('#dashboard-list');
        const emptyState = this.element.querySelector('#empty-state');
        
        if (!dashboardList || !emptyState) return;
        
        const dashboardArray = Object.values(this.dashboards);
        
        if (dashboardArray.length === 0) {
            dashboardList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Sort dashboards by order
        dashboardArray.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        dashboardList.innerHTML = dashboardArray.map(dashboard => 
            this.createDashboardHTML(dashboard)
        ).join('');
        
        this.attachDashboardEventListeners();
    }
    
//     createDashboardHTML(dashboard) {
//     const isActive = this.currentDashboard?.id === dashboard.id;
//     const widgetCount = dashboard.widgets ? dashboard.widgets.length : 0;
//     const createdDate = new Date(dashboard.createdAt);
//     const isToday = this.isToday(createdDate);
//     const dateText = isToday ? 'Today' : this.formatShortDate(createdDate);
    
//     // Get category emoji and color
//     const categoryInfo = this.getCategoryInfo(dashboard.category);
    
//     return `
//         <li class="dashboard-item ${isActive ? 'active' : ''}" data-dashboard-id="${dashboard.id}">
//             <div class="dashboard-item-main">
//                 <div class="dashboard-item-header">
//                     <div class="dashboard-name-section">
//                         <h4 class="dashboard-name" title="${Utils.escapeHtml(dashboard.name)}">
//                             ${Utils.escapeHtml(dashboard.name)}
//                         </h4>
//                         <div class="dashboard-category">
//                             <span class="category-indicator" style="background-color: ${categoryInfo.color}"></span>
//                             ${categoryInfo.emoji} ${categoryInfo.label}
//                         </div>
//                     </div>
//                     <div class="dashboard-status">
//                         <span class="order-badge">#${dashboard.order || 1}</span>
//                     </div>
//                 </div>
                
//                 <div class="dashboard-meta">
//                     <div class="meta-item">
//                         <i class="fas fa-cube"></i>
//                         <span>${widgetCount}</span>
//                     </div>
//                     <div class="meta-item">
//                         <i class="fas fa-calendar-alt"></i>
//                         <span>${dateText}</span>
//                     </div>
//                     ${dashboard.description ? `
//                         <div class="meta-item description" title="${Utils.escapeHtml(dashboard.description)}">
//                             <i class="fas fa-align-left"></i>
//                             <span>${Utils.escapeHtml(dashboard.description.substring(0, 30))}${dashboard.description.length > 30 ? '...' : ''}</span>
//                         </div>
//                     ` : ''}
//                 </div>
//             </div>
            
//             <div class="dashboard-item-actions">
//                 <button class="dashboard-item-btn" data-action="edit" title="Edit Dashboard">
//                     <i class="fas fa-edit"></i>
//                 </button>
//                 <button class="dashboard-item-btn" data-action="duplicate" title="Duplicate">
//                     <i class="fas fa-copy"></i>
//                 </button>
//                 <button class="dashboard-item-btn" data-action="export" title="Export">
//                     <i class="fas fa-download"></i>
//                 </button>
//                 <button class="dashboard-item-btn danger" data-action="delete" title="Delete">
//                     <i class="fas fa-trash"></i>
//                 </button>
//             </div>
            
//             ${isActive ? '<div class="active-indicator"></div>' : ''}
//         </li>
//     `;
// }
createDashboardHTML(dashboard) {
    const isActive = this.currentDashboard?.id === dashboard.id;
    const displayName = dashboard.name || 'Unnamed Dashboard';
    
    return `
        <li class="dashboard-item ${isActive ? 'active' : ''}" data-dashboard-id="${dashboard.id}">
            <div class="dashboard-item-top">
                <div class="dashboard-item-actions">
                    <button class="dashboard-item-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="dashboard-item-btn" data-action="duplicate" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="dashboard-item-btn" data-action="export" title="Export">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="dashboard-item-btn danger" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <button class="dashboard-info-btn" data-action="info" title="Dashboard Info">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
            
            <div class="dashboard-item-bottom">
                <div class="dashboard-name" title="${Utils.escapeHtml(displayName)}">
                    ${Utils.escapeHtml(displayName)}
                </div>
            </div>
        </li>
    `;
}
    
    attachDashboardEventListeners() {
        const dashboardItems = this.element.querySelectorAll('.dashboard-item');
        
        dashboardItems.forEach(item => {
            const dashboardId = item.getAttribute('data-dashboard-id');
            
            // Click to select dashboard (but not when clicking action buttons)
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.dashboard-item-right')) {
                    this.selectDashboard(dashboardId);
                }
            });
            
            // Action buttons (including info button)
            const actionBtns = item.querySelectorAll('[data-action]');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    this.handleDashboardAction(action, dashboardId);
                });
            });
        });
    }
        
    selectDashboard(dashboardId) {
        const dashboard = this.dashboards[dashboardId];
        if (!dashboard) return;
        
        // Update DashboardService current dashboard
        if (window.dashboardService) {
            window.dashboardService.setCurrent(dashboardId);
        }
        
        this.currentDashboard = dashboard;
        this.updateActiveState();
        
        // Notify other components
        EventBus.emit('sidebar:dashboard:selected', dashboard);
        console.log('📊 Dashboard selected:', dashboard.name);
    }
    
    updateActiveState() {
        const items = this.element.querySelectorAll('.dashboard-item');
        items.forEach(item => {
            const dashboardId = item.getAttribute('data-dashboard-id');
            item.classList.toggle('active', dashboardId === this.currentDashboard?.id);
        });
    }
    
    handleDashboardAction(action, dashboardId) {
        const dashboard = this.dashboards[dashboardId];
        if (!dashboard) return;
        
        switch (action) {
            case 'info':
                this.showDashboardInfo(dashboard);
                break;
                
            case 'edit':
                EventBus.emit('dashboard:edit:request', dashboard);
                break;
                
            case 'duplicate':
                this.duplicateDashboard(dashboard);
                break;
                
            case 'export':
                this.exportDashboard(dashboard);
                break;
                
            case 'delete':
                this.deleteDashboard(dashboard);
                break;
        }
    }
    
    filterDashboards() {
        const items = this.element.querySelectorAll('.dashboard-item');
        
        items.forEach(item => {
            const name = item.querySelector('.dashboard-item-name').textContent.toLowerCase();
            const isVisible = name.includes(this.searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }
    
    addDashboard(dashboard) {
        this.dashboards[dashboard.id] = dashboard;
        this.saveDashboards();
        this.renderDashboards();
        
        console.log('➕ Dashboard added:', dashboard.name);
    }
    
    removeDashboard(dashboardId) {
        delete this.dashboards[dashboardId];
        this.saveDashboards();
        this.renderDashboards();
        
        if (this.currentDashboard?.id === dashboardId) {
            this.currentDashboard = null;
        }
        
        console.log('➖ Dashboard removed:', dashboardId);
    }
    
    updateDashboard(dashboard) {
        this.dashboards[dashboard.id] = dashboard;
        this.saveDashboards();
        this.renderDashboards();
        
        console.log('🔄 Dashboard updated:', dashboard.name);
    }
    
    saveDashboards() {
        Utils.setLocalStorage(AppConfig.storageKeys.dashboards, this.dashboards);
    }
    
    toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.handleMobileToggle();
}
    
    collapse() {
        this.isCollapsed = true;
        this.element.classList.add('collapsed');
        
        // Handle mobile overlay
        const overlay = Utils.querySelector('#sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
        
        EventBus.emit('sidebar:collapsed');
    }
    
    expand() {
        this.isCollapsed = false;
        this.element.classList.remove('collapsed');
        
        // Handle mobile overlay
        if (window.innerWidth <= 768) {
            const overlay = Utils.querySelector('#sidebar-overlay');
            if (overlay) {
                overlay.classList.add('visible');
            }
        }
        
        EventBus.emit('sidebar:expanded');
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            // Desktop - remove overlay
            const overlay = Utils.querySelector('#sidebar-overlay');
            if (overlay) {
                overlay.classList.remove('visible');
            }
        } else {
            // Mobile - add overlay if sidebar is open
            if (!this.isCollapsed) {
                const overlay = Utils.querySelector('#sidebar-overlay');
                if (overlay) {
                    overlay.classList.add('visible');
                }
            }
        }
    }
    
    // Public API
    getCurrentDashboard() {
        return this.currentDashboard;
    }
    
    getDashboards() {
        return { ...this.dashboards };
    }
    
    setCurrentDashboard(dashboard) {
        this.currentDashboard = dashboard;
        this.updateActiveState();
    }
    
    refreshDashboards() {
        this.loadDashboards();
    }
    
    destroy() {
        const overlay = Utils.querySelector('#sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        if (this.element) {
            this.element.innerHTML = '';
        }
        
        console.log('🧹 Sidebar component destroyed');
    }
    // 🆕 Add this new method to handle real-time updates
    refreshFromService() {
        if (window.dashboardService) {
            const dashboards = window.dashboardService.getAll();
            this.dashboards = {};
            
            dashboards.forEach(dashboard => {
                this.dashboards[dashboard.id] = dashboard;
            });
            
            this.renderDashboards();
            console.log('🔄 Sidebar refreshed from service');
        }
    }
    // Add these methods to your Sidebar.js class

deleteDashboard(dashboard) {
    const confirmMessage = `Are you sure you want to delete "${dashboard.name}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        try {
            // Use DashboardService to delete
            window.dashboardService.delete(dashboard.id);
            
            // Show success notification
            this.showNotification(`Dashboard "${dashboard.name}" deleted successfully`, 'success');
            
            console.log('✅ Dashboard deleted:', dashboard.name);
            
        } catch (error) {
            console.error('❌ Failed to delete dashboard:', error);
            this.showNotification('Failed to delete dashboard: ' + error.message, 'error');
        }
    }
}

duplicateDashboard(dashboard) {
    try {
        const duplicate = window.dashboardService.duplicate(dashboard.id);
        this.showNotification(`Dashboard duplicated as "${duplicate.name}"`, 'success');
        
        // Auto-select the duplicate
        setTimeout(() => {
            this.selectDashboard(duplicate.id);
        }, 500);
        
    } catch (error) {
        console.error('❌ Failed to duplicate dashboard:', error);
        this.showNotification('Failed to duplicate dashboard: ' + error.message, 'error');
    }
}

exportDashboard(dashboard) {
    try {
        const exportData = window.dashboardService.export(dashboard.id);
        
        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dashboard.name.replace(/\s+/g, '-').toLowerCase()}-dashboard.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Dashboard "${dashboard.name}" exported successfully`, 'success');
        
    } catch (error) {
        console.error('❌ Failed to export dashboard:', error);
        this.showNotification('Failed to export dashboard: ' + error.message, 'error');
    }
}

showNotification(message, type = 'info') {
    // Create notification element
    const notification = Utils.createElement('div', `notification ${type}`);
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'accent-green'}-color);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 2001;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add this method to Sidebar.js
handleMobileToggle() {
    const overlay = document.querySelector('#sidebar-overlay');
    
    if (window.innerWidth <= 768) {
        // Mobile behavior
        if (this.isCollapsed) {
            this.element.classList.add('open');
            this.element.classList.remove('collapsed');
            if (overlay) overlay.classList.add('visible');
        } else {
            this.element.classList.remove('open');
            this.element.classList.add('collapsed');
            if (overlay) overlay.classList.remove('visible');
        }
    } else {
        // Desktop behavior
        this.element.classList.toggle('collapsed', this.isCollapsed);
        if (overlay) overlay.classList.remove('visible');
    }
}
// Add these methods to your Sidebar.js class

getCategoryInfo(category) {
    const categories = {
        agriculture: { emoji: '🌱', label: 'Agriculture', color: '#22c55e' },
        industrial: { emoji: '🏭', label: 'Industrial', color: '#3b82f6' },
        home: { emoji: '🏠', label: 'Home', color: '#f59e0b' },
        environmental: { emoji: '🌍', label: 'Environmental', color: '#10b981' },
        custom: { emoji: '⚙️', label: 'Custom', color: '#6b7280' }
    };
    
    return categories[category] || categories.custom;
    
}

// Simplified info display
showDashboardInfo(dashboard) {
    const widgetCount = dashboard.widgets ? dashboard.widgets.length : 0;
    const createdDate = new Date(dashboard.createdAt).toLocaleDateString();
    const modifiedDate = new Date(dashboard.lastModified).toLocaleDateString();
    const categoryInfo = this.getCategoryInfo(dashboard.category);
    
    // Create nice info popup
    const infoPopup = Utils.createElement('div', 'dashboard-info-popup');
    infoPopup.innerHTML = `
        <div class="info-popup-content">
            <div class="info-header">
                <h3>${Utils.escapeHtml(dashboard.name)}</h3>
                <button class="info-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="info-body">
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span class="info-value">${categoryInfo.emoji} ${categoryInfo.label}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Widgets:</span>
                    <span class="info-value">${widgetCount}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Created:</span>
                    <span class="info-value">${createdDate}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Modified:</span>
                    <span class="info-value">${modifiedDate}</span>
                </div>
                
                ${dashboard.description ? `
                    <div class="info-description">
                        <span class="info-label">Description:</span>
                        <p>${Utils.escapeHtml(dashboard.description)}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Style the popup
    infoPopup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(infoPopup);
    
    // Close handlers
    const closeBtn = infoPopup.querySelector('.info-close');
    closeBtn.onclick = () => infoPopup.remove();
    
    infoPopup.onclick = (e) => {
        if (e.target === infoPopup) infoPopup.remove();
    };
    
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            infoPopup.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

formatShortDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
// Add this method to show dashboard info
showDashboardInfo(dashboard) {
    const widgetCount = dashboard.widgets ? dashboard.widgets.length : 0;
    const createdDate = new Date(dashboard.createdAt).toLocaleDateString();
    const modifiedDate = new Date(dashboard.lastModified).toLocaleDateString();
    const categoryInfo = this.getCategoryInfo(dashboard.category);
    
    const infoContent = `
        <div style="padding: var(--space-md);">
            <h3 style="margin-bottom: var(--space-md); color: var(--text-primary);">
                ${Utils.escapeHtml(dashboard.name)}
            </h3>
            
            <div style="display: grid; gap: var(--space-md);">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Category:</span>
                    <span style="color: var(--text-primary);">${categoryInfo.emoji} ${categoryInfo.label}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Widgets:</span>
                    <span style="color: var(--text-primary);">${widgetCount}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Order:</span>
                    <span style="color: var(--text-primary);">#${dashboard.order || 1}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Created:</span>
                    <span style="color: var(--text-primary);">${createdDate}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Modified:</span>
                    <span style="color: var(--text-primary);">${modifiedDate}</span>
                </div>
                
                ${dashboard.description ? `
                    <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary); font-size: var(--font-size-xs);">Description:</span>
                        <p style="margin-top: var(--space-xs); color: var(--text-primary); line-height: 1.4;">
                            ${Utils.escapeHtml(dashboard.description)}
                        </p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Create simple info modal
    const infoModal = Utils.createElement('div', 'notification');
    infoModal.innerHTML = infoContent;
    infoModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 2000;
        min-width: 300px;
        max-width: 400px;
        animation: fadeIn 0.3s ease;
    `;
    
    // Add backdrop
    const backdrop = Utils.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1999;
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(infoModal);
    
    // Close on backdrop click
    backdrop.onclick = () => {
        backdrop.remove();
        infoModal.remove();
    };
    
    // Close on escape key
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            backdrop.remove();
            infoModal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (backdrop.parentNode) backdrop.remove();
        if (infoModal.parentNode) infoModal.remove();
    }, 5000);
}
}

// Export for global use
window.SidebarComponent = Sidebar;
