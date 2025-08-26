// ========================================
// Create Dashboard Modal Component (Simplified & Fixed)
// ========================================

class CreateDashboardModal {
    constructor() {
        this.modal = null;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        console.log('🏗️ Initializing CreateDashboardModal...');
        this.createModal();
        this.attachEventListeners();
        console.log('✅ CreateDashboardModal initialized');
    }
    
    createModal() {
        this.modal = new Modal('create-dashboard-modal', {
            size: 'medium',
            backdrop: true,
            keyboard: true
        });
        
        this.modal
            .setTitle('Create New Dashboard')
            .setBody(this.createForm())
            .setFooter(this.createFooter());
    }
    
    createForm() {
        return `
            <div class="form-container">
                <div class="form-group">
                    <label class="form-label required">Dashboard Name</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        id="dashboard-name" 
                        placeholder="Enter dashboard name"
                        maxlength="50"
                    >
                    <div class="form-error" id="name-error" style="display: none;"></div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" id="dashboard-category">
                            <option value="agriculture">🌱 Agriculture</option>
                            <option value="industrial">🏭 Industrial</option>
                            <option value="home">🏠 Home Automation</option>
                            <option value="environmental">🌍 Environmental</option>
                            <option value="custom" selected>⚙️ Custom</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Listing Order</label>
                        <input 
                            type="number" 
                            class="form-input" 
                            id="dashboard-order" 
                            placeholder="1"
                            min="1" 
                            max="100" 
                            value="${this.getNextOrder()}"
                        >
                        <div class="form-help">Order in dashboard list (1-100)</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea 
                        class="form-textarea" 
                        id="dashboard-description" 
                        placeholder="Describe what this dashboard will monitor..."
                        rows="3"
                        maxlength="200"
                    ></textarea>
                    <div class="form-help">
                        <span id="description-count">0</span>/200 characters
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Template</label>
                    <select class="form-select" id="dashboard-template">
                        <option value="blank">📄 Blank Dashboard</option>
                        <option value="agriculture">🌾 Agriculture Template</option>
                        <option value="iot-sensors">📡 IoT Sensors Template</option>
                        <option value="environmental">🌡️ Environmental Monitoring</option>
                    </select>
                    <div class="form-help">Choose a starting template or start blank</div>
                </div>
            </div>
        `;
    }
    
    createFooter() {
        return `
            <button type="button" class="btn btn-secondary" id="cancel-btn">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" id="create-btn">
                <i class="fas fa-plus"></i>
                Create Dashboard
            </button>
        `;
    }
    
    attachEventListeners() {
        EventBus.on('dashboard:create:click', () => {
            this.show();
        });
        
        EventBus.on('modal:shown', (data) => {
            if (data.id === 'create-dashboard-modal') {
                this.attachFormEvents();
            }
        });
        
        EventBus.on('modal:hidden', (data) => {
            if (data.id === 'create-dashboard-modal') {
                this.resetForm();
            }
        });
    }
    
    attachFormEvents() {
        const nameInput = document.getElementById('dashboard-name');
        const descriptionInput = document.getElementById('dashboard-description');
        const cancelBtn = document.getElementById('cancel-btn');
        const createBtn = document.getElementById('create-btn');
        
        // Cancel button
        if (cancelBtn) {
            cancelBtn.onclick = () => this.hide();
        }
        
        // Create button
        if (createBtn) {
            createBtn.onclick = () => this.handleSubmit();
        }
        
        // Enable/disable create button based on name input
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.updateCreateButton();
            });
            
            // Auto-focus and select
            setTimeout(() => {
                nameInput.focus();
                nameInput.select();
            }, 100);
        }
        
        // Character counter
        if (descriptionInput) {
            descriptionInput.addEventListener('input', () => {
                this.updateCharacterCount();
            });
        }
        
        // Initial button state
        this.updateCreateButton();
    }
    
    updateCreateButton() {
        const createBtn = document.getElementById('create-btn');
        const nameInput = document.getElementById('dashboard-name');
        
        if (createBtn && nameInput) {
            const name = nameInput.value.trim();
            const isValid = name.length >= 2;
            
            createBtn.disabled = !isValid;
            createBtn.style.opacity = isValid ? '1' : '0.5';
            createBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        }
    }
    
    updateCharacterCount() {
        const descriptionInput = document.getElementById('dashboard-description');
        const countElement = document.getElementById('description-count');
        
        if (descriptionInput && countElement) {
            const count = descriptionInput.value.length;
            countElement.textContent = count;
            countElement.style.color = count > 180 ? 'var(--warning-color)' : 'var(--text-secondary)';
        }
    }
    
    getNextOrder() {
        if (!window.dashboardService) return 1;
        return window.dashboardService.getNextOrder();
    }
    
    handleSubmit() {
        console.log('📝 Creating dashboard...');
        
        try {
            // Get form data
            const formData = this.getFormData();
            
            // Basic validation
            if (!formData.name || formData.name.length < 2) {
                this.showError('Dashboard name must be at least 2 characters');
                return;
            }
            
            // Check for duplicate names
            if (this.isDuplicateName(formData.name)) {
                this.showError('A dashboard with this name already exists');
                return;
            }
            
            // Show loading
            this.setLoading(true);
            
            // Create dashboard
            setTimeout(() => {
                try {
                    const dashboard = window.dashboardService.create(formData);
                    this.handleSuccess(dashboard);
                } catch (error) {
                    this.showError(error.message || 'Failed to create dashboard');
                } finally {
                    this.setLoading(false);
                }
            }, 300);
            
        } catch (error) {
            console.error('❌ Submission error:', error);
            this.showError('An unexpected error occurred');
        }
    }
    
    getFormData() {
        return {
            name: document.getElementById('dashboard-name').value.trim(),
            description: document.getElementById('dashboard-description').value.trim(),
            category: document.getElementById('dashboard-category').value,
            order: parseInt(document.getElementById('dashboard-order').value) || 1,
            template: document.getElementById('dashboard-template').value
        };
    }
    
    isDuplicateName(name) {
        if (!window.dashboardService) return false;
        const existing = window.dashboardService.getAll();
        return existing.some(dashboard => 
            dashboard.name.toLowerCase() === name.toLowerCase()
        );
    }
    
    handleSuccess(dashboard) {
        console.log('✅ Dashboard created successfully:', dashboard.name);
        
        // Hide modal
        this.hide();
        
        // Show success notification
        this.showNotification(`Dashboard "${dashboard.name}" created successfully!`, 'success');
        
        // Auto-select the new dashboard
        setTimeout(() => {
            EventBus.emit('dashboard:select', dashboard);
        }, 500);
    }
    
    setLoading(isLoading) {
        const createBtn = document.getElementById('create-btn');
        
        if (createBtn) {
            createBtn.disabled = isLoading;
            createBtn.innerHTML = isLoading 
                ? '<span class="loading"></span> Creating...'
                : '<i class="fas fa-plus"></i> Create Dashboard';
        }
    }
    
    showError(message) {
        const errorElement = document.getElementById('name-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = 'var(--danger-color)';
        }
        
        // Also show as notification
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = Utils.createElement('div', `notification ${type}`);
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : 'danger'}-color);
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
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    resetForm() {
        // Clear all inputs
        const inputs = ['dashboard-name', 'dashboard-description', 'dashboard-order'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        
        // Reset dropdowns
        const category = document.getElementById('dashboard-category');
        if (category) category.value = 'custom';
        
        const template = document.getElementById('dashboard-template');
        if (template) template.value = 'blank';
        
        // Reset order to next available
        const orderInput = document.getElementById('dashboard-order');
        if (orderInput) {
            orderInput.value = this.getNextOrder();
        }
        
        // Clear errors
        const errorElement = document.getElementById('name-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Reset character count
        this.updateCharacterCount();
    }
    
    show() {
        this.resetForm();
        this.modal.show();
        this.isVisible = true;
        console.log('📝 Create Dashboard modal opened');
    }
    
    hide() {
        this.modal.hide();
        this.isVisible = false;
        console.log('📝 Create Dashboard modal closed');
    }
    
    destroy() {
        if (this.modal) {
            this.modal.destroy();
        }
    }
}

window.CreateDashboardModal = CreateDashboardModal;
