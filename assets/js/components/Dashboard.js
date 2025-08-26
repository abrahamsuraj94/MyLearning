 // ========================================
// Dashboard Component
// ========================================

class Dashboard {
    constructor() {
        this.element = null;
        this.currentDashboard = null;
        this.isEditMode = false;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        console.log('🏗️ Initializing Dashboard component...');
        
        try {
            this.createElement();
            this.attachEventListeners();
            this.render();
            
            this.isInitialized = true;
            console.log('✅ Dashboard component initialized');
            
            EventBus.emit('component:dashboard:ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize Dashboard:', error);
        }
    }
    
    createElement() {
        const mainContainer = Utils.querySelector('#app-main');
        if (!mainContainer) {
            throw new Error('Main container #app-main not found');
        }
        
        this.element = mainContainer;
        this.element.className = 'app-main';
    }
    
    attachEventListeners() {
        // Listen for sidebar events
        EventBus.on('sidebar:collapsed', () => {
            this.element.classList.add('expanded');
        });
        
        EventBus.on('sidebar:expanded', () => {
            this.element.classList.remove('expanded');
        });
        
        EventBus.on('sidebar:dashboard:selected', (dashboard) => {
            this.loadDashboard(dashboard);
        });
        
        // 🆕 Listen for dashboard selection from modal
        EventBus.on('dashboard:select', (dashboard) => {
            this.loadDashboard(dashboard);
        });
        
        // Listen for dashboard events
        EventBus.on('dashboard:mode:changed', (mode) => {
            this.setEditMode(mode === 'edit');
        });
    }
    
    // render() {
    //     this.element.innerHTML = `
    //         <div class="dashboard-container">
    //             <div class="dashboard-header">
    //                 <h1 class="dashboard-title no-dashboard" id="dashboard-title">
    //                     Welcome to FieldMonitor
    //                 </h1>
                    
    //                 <div class="dashboard-actions" id="dashboard-actions">
    //                     <div class="mode-toggle">
    //                         <button class="mode-btn active" id="view-mode-btn">VIEW</button>
    //                         <button class="mode-btn" id="edit-mode-btn">EDIT</button>
    //                     </div>
                        
    //                     <button class="action-btn primary" id="add-widget-btn" style="display: none;">
    //                         <i class="fas fa-plus"></i>
    //                         Add Widget
    //                     </button>
                        
    //                     <button class="action-btn" id="save-btn" style="display: none;">
    //                         <i class="fas fa-save"></i>
    //                         Save
    //                     </button>
                        
    //                     <button class="action-btn" id="settings-btn" style="display: none;">
    //                         <i class="fas fa-cog"></i>
    //                         Settings
    //                     </button>
                        
    //                     <button class="action-btn danger" id="delete-btn" style="display: none;">
    //                         <i class="fas fa-trash"></i>
    //                         Delete
    //                     </button>
    //                 </div>
    //             </div>
                
    //             <div class="dashboard-content" id="dashboard-content">
    //                 ${this.renderEmptyState()}
    //             </div>
    //         </div>
    //     `;
        
    //     this.attachClickHandlers();
    // }
    render() {
    this.element.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1 class="dashboard-title no-dashboard" id="dashboard-title">
                    Welcome to FieldMonitor
                </h1>
                
                <div class="dashboard-actions" id="dashboard-actions">
                    <div class="mode-toggle">
                        <button class="mode-btn active" id="view-mode-btn">VIEW</button>
                        <button class="mode-btn" id="edit-mode-btn">EDIT</button>
                    </div>
                    
                    <button class="action-btn primary" id="add-widget-btn" style="display: none;">
                        <i class="fas fa-plus"></i>
                        Add Widget
                    </button>
                    
                    <button class="action-btn" id="save-btn" style="display: none;">
                        <i class="fas fa-save"></i>
                        Save
                    </button>
                    
                    <button class="action-btn" id="settings-btn" style="display: none;">
                        <i class="fas fa-cog"></i>
                        Settings
                    </button>
                    
                    <button class="action-btn danger" id="delete-btn" style="display: none;">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
            
            <div class="dashboard-content" id="dashboard-content">
                <!-- Grid will be inserted here by GridManager -->
                <!-- Empty states will be shown/hidden as needed -->
                ${this.renderEmptyState()}
            </div>
        </div>
    `;
    
    this.attachClickHandlers();
}
    
    renderEmptyState() {
        return `
            <div class="empty-dashboard" id="empty-dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <h3>Get Started with Your Dashboard</h3>
                <p>Select an existing dashboard from the sidebar or create a new one to start monitoring your IoT devices.</p>
                <button class="action-btn primary" id="empty-create-btn">
                    <i class="fas fa-plus"></i>
                    Create Your First Dashboard
                </button>
            </div>
        `;
    }
    
    renderEmptyState() {
        return `
            <div class="empty-dashboard" id="empty-dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <h3>Get Started with Your Dashboard</h3>
                <p>Select an existing dashboard from the sidebar or create a new one to start monitoring your IoT devices.</p>
                <button class="action-btn primary" id="empty-create-btn">
                    <i class="fas fa-plus"></i>
                    Create Your First Dashboard
                </button>
            </div>
        `;
    }
    
    renderEmptyDashboard() {
        return `
            <div class="empty-dashboard" id="empty-dashboard">
                <i class="fas fa-cube"></i>
                <h3>Dashboard is Empty</h3>
                <p>This dashboard doesn't have any widgets yet. Switch to EDIT mode and add some widgets to get started.</p>
                <button class="action-btn primary" id="empty-add-widget-btn">
                    <i class="fas fa-plus"></i>
                    Add Your First Widget
                </button>
            </div>
        `;
    }
    
    attachClickHandlers() {
        // Mode toggle buttons
        const viewModeBtn = this.element.querySelector('#view-mode-btn');
        const editModeBtn = this.element.querySelector('#edit-mode-btn');
        
        if (viewModeBtn) {
            viewModeBtn.addEventListener('click', () => {
                this.setEditMode(false);
            });
        }
        
        if (editModeBtn) {
            editModeBtn.addEventListener('click', () => {
                this.setEditMode(true);
            });
        }
        
        // Action buttons
        const actionButtons = {
            'add-widget-btn': 'dashboard:add-widget:click',
            'save-btn': 'dashboard:save:click',
            'settings-btn': 'dashboard:settings:click',
            'delete-btn': 'dashboard:delete:click',
            'empty-create-btn': 'dashboard:create:click',
            'empty-add-widget-btn': 'dashboard:add-widget:click'
        };
        
        Object.entries(actionButtons).forEach(([id, event]) => {
            const button = this.element.querySelector(`#${id}`);
            if (button) {
                button.addEventListener('click', () => {
                    EventBus.emit(event);
                });
            }
        });
    }
    
    loadDashboard(dashboard) {
    this.currentDashboard = dashboard;
    this.updateDashboardHeader();
    this.updateDashboardContent();
    this.updateActionButtons();
    
    // Update header with current dashboard
    EventBus.emit('header:dashboard:changed', dashboard);
    
    console.log('📊 Dashboard loaded:', dashboard.name);
}
    
    updateDashboardHeader() {
    const titleElement = this.element.querySelector('#dashboard-title');
    if (!titleElement) return;
    
    if (this.currentDashboard) {
        titleElement.textContent = this.currentDashboard.name;
        titleElement.className = 'dashboard-title';
        
        // Show dashboard metadata
        const actionsElement = this.element.querySelector('#dashboard-actions');
        if (actionsElement) {
            // Add dashboard info if it doesn't exist
            let infoElement = actionsElement.querySelector('.dashboard-info');
            if (!infoElement) {
                infoElement = Utils.createElement('div', 'dashboard-info');
                actionsElement.insertBefore(infoElement, actionsElement.firstChild);
            }
            
            const widgetCount = this.currentDashboard.widgets?.length || 0;
            const lastModified = new Date(this.currentDashboard.lastModified).toLocaleDateString();
            
            infoElement.innerHTML = `
                <span class="dashboard-meta">
                    <i class="fas fa-cube"></i> ${widgetCount} widgets
                </span>
                <span class="dashboard-meta">
                    <i class="fas fa-calendar"></i> Modified ${lastModified}
                </span>
            `;
        }
    } else {
        titleElement.textContent = 'No Dashboard Selected';
        titleElement.className = 'dashboard-title no-dashboard';
        
        // Remove dashboard info
        const infoElement = this.element.querySelector('.dashboard-info');
        if (infoElement) {
            infoElement.remove();
        }
    }
}
    
    // updateDashboardContent() {
    //     const contentElement = this.element.querySelector('#dashboard-content');
    //     if (!contentElement) return;
        
    //     if (!this.currentDashboard) {
    //         contentElement.innerHTML = this.renderNoDashboard();
    //     } else if (!this.currentDashboard.widgets || this.currentDashboard.widgets.length === 0) {
    //         contentElement.innerHTML = this.renderEmptyDashboard();
    //     } else {
    //         contentElement.innerHTML = this.renderDashboardWidgets();
    //     }
        
    //     // Re-attach event listeners for new buttons
    //     this.attachClickHandlers();
    // }
    // Add this method to Dashboard class
hideEmptyStates() {
    const emptyStates = this.element.querySelectorAll('.empty-dashboard');
    emptyStates.forEach(function(el) {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
    });
    console.log('✅ Empty states hidden by Dashboard');
}
    updateDashboardContent() {
    const contentElement = this.element.querySelector('#dashboard-content');
    if (!contentElement) return;
    
    // Get existing empty state element
    let emptyElement = contentElement.querySelector('.empty-dashboard');
    
if (this.currentDashboard && this.currentDashboard.widgets && this.currentDashboard.widgets.length > 0) {
        // Dashboard has widgets - hide empty state
        this.hideEmptyStates(); // ✨ ADD THIS LINE
        EventBus.emit('dashboard:loaded', this.currentDashboard);
    } else if (!this.currentDashboard.widgets || this.currentDashboard.widgets.length === 0) {
        // Dashboard selected but empty - show "add widgets" state
        if (emptyElement) {
            emptyElement.outerHTML = this.renderEmptyDashboard();
        } else {
            contentElement.insertAdjacentHTML('beforeend', this.renderEmptyDashboard());
        }
        // Let GridManager know dashboard is loaded but empty
        EventBus.emit('dashboard:loaded', this.currentDashboard);
    } else {
        // Dashboard has widgets - hide empty state and let GridManager show widgets
        if (emptyElement) {
            emptyElement.style.display = 'none';
        }
        // Let GridManager handle loading widgets
        EventBus.emit('dashboard:loaded', this.currentDashboard);
    }
    
    // Re-attach event listeners for new buttons
    this.attachClickHandlers();
}
    
    renderDashboardWidgets() {
        return `
            <div class="dashboard-widgets" id="dashboard-widgets">
                <div class="loading-state">
                    <div class="loading"></div>
                    <p>Loading widgets...</p>
                </div>
            </div>
        `;
    }
    
    updateActionButtons() {
        const hasDashboard = !!this.currentDashboard;
        
        // Show/hide buttons based on dashboard state
        const buttonStates = {
            'add-widget-btn': hasDashboard && this.isEditMode,
            'save-btn': hasDashboard && this.isEditMode,
            'settings-btn': hasDashboard,
            'delete-btn': hasDashboard
        };
        
        Object.entries(buttonStates).forEach(([id, show]) => {
            const button = this.element.querySelector(`#${id}`);
            if (button) {
                button.style.display = show ? 'flex' : 'none';
            }
        });
    }
    
    setEditMode(isEdit) {
        this.isEditMode = isEdit;
        
        // Update mode buttons
        const viewBtn = this.element.querySelector('#view-mode-btn');
        const editBtn = this.element.querySelector('#edit-mode-btn');
        
        if (viewBtn && editBtn) {
            viewBtn.classList.toggle('active', !isEdit);
            editBtn.classList.toggle('active', isEdit);
        }
        
        this.updateActionButtons();
        
        EventBus.emit('dashboard:mode:changed', isEdit ? 'edit' : 'view');
        console.log(`🔧 Dashboard mode: ${isEdit ? 'EDIT' : 'VIEW'}`);
    }
    
    showNotification(message, type = 'info') {
        // Create temporary notification
        const notification = Utils.createElement('div', `notification ${type}`);
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 6px;
            border-left: 4px solid var(--accent-green);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Public API
    getCurrentDashboard() {
        return this.currentDashboard;
    }
    
    getEditMode() {
        return this.isEditMode;
    }
    
    clearDashboard() {
        this.currentDashboard = null;
        this.updateDashboardHeader();
        this.updateDashboardContent();
        this.updateActionButtons();
    }
    
    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
        }
        console.log('🧹 Dashboard component destroyed');
    }
}

// Export for global use
window.DashboardComponent = Dashboard;
