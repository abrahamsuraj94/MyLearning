// ========================================
// Edit Dashboard Modal Component
// ========================================

class EditDashboardModal {
    constructor() {
        this.modal = null;
        this.currentDashboard = null;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        console.log('🏗️ Initializing EditDashboardModal...');
        this.createModal();
        this.attachEventListeners();
        console.log('✅ EditDashboardModal initialized');
    }
    
    createModal() {
        this.modal = new Modal('edit-dashboard-modal', {
            size: 'medium',
            backdrop: true,
            keyboard: true
        });
        
        this.modal
            .setTitle('Edit Dashboard')
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
                        id="edit-dashboard-name" 
                        placeholder="Enter dashboard name"
                        maxlength="50"
                    >
                    <div class="form-error" id="edit-name-error" style="display: none;"></div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" id="edit-dashboard-category">
                            <option value="agriculture">🌱 Agriculture</option>
                            <option value="industrial">🏭 Industrial</option>
                            <option value="home">🏠 Home Automation</option>
                            <option value="environmental">🌍 Environmental</option>
                            <option value="custom">⚙️ Custom</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Listing Order</label>
                        <input 
                            type="number" 
                            class="form-input" 
                            id="edit-dashboard-order" 
                            placeholder="1"
                            min="1" 
                            max="100"
                        >
                        <div class="form-help">Order in dashboard list (1-100)</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea 
                        class="form-textarea" 
                        id="edit-dashboard-description" 
                        placeholder="Describe what this dashboard monitors..."
                        rows="3"
                        maxlength="200"
                    ></textarea>
                    <div class="form-help">
                        <span id="edit-description-count">0</span>/200 characters
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Dashboard Status</label>
                    <select class="form-select" id="edit-dashboard-status">
                        <option value="active">✅ Active</option>
                        <option value="draft">📝 Draft</option>
                        <option value="archived">📦 Archived</option>
                    </select>
                    <div class="form-help">Set dashboard visibility and usage status</div>
                </div>
                
                <div class="dashboard-info-section">
                    <h4 style="margin-bottom: 10px; color: var(--text-primary);">Dashboard Information</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Created:</span>
                            <span class="info-value" id="edit-created-date">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Last Modified:</span>
                            <span class="info-value" id="edit-modified-date">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Widgets:</span>
                            <span class="info-value" id="edit-widget-count">0</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Dashboard ID:</span>
                            <span class="info-value" id="edit-dashboard-id">-</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createFooter() {
        return `
            <button type="button" class="btn btn-secondary" id="edit-cancel-btn">
                Cancel
            </button>
            <button type="button" class="btn btn-danger" id="delete-dashboard-btn" style="margin-right: auto;">
                <i class="fas fa-trash"></i>
                Delete Dashboard
            </button>
            <button type="button" class="btn btn-primary" id="save-changes-btn">
                <i class="fas fa-save"></i>
                Save Changes
            </button>
        `;
    }
    
    attachEventListeners() {
        // Listen for edit dashboard requests
        EventBus.on('dashboard:edit:request', (dashboard) => {
            this.show(dashboard);
        });
        
        EventBus.on('modal:shown', (data) => {
            if (data.id === 'edit-dashboard-modal') {
                this.attachFormEvents();
            }
        });
        
        EventBus.on('modal:hidden', (data) => {
            if (data.id === 'edit-dashboard-modal') {
                this.currentDashboard = null;
            }
        });
    }
    
    attachFormEvents() {
    const nameInput = document.getElementById('edit-dashboard-name');
    const descriptionInput = document.getElementById('edit-dashboard-description');
    const categorySelect = document.getElementById('edit-dashboard-category');
    const orderInput = document.getElementById('edit-dashboard-order');
    const statusSelect = document.getElementById('edit-dashboard-status');
    const cancelBtn = document.getElementById('edit-cancel-btn');
    const saveBtn = document.getElementById('save-changes-btn');
    const deleteBtn = document.getElementById('delete-dashboard-btn');
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.onclick = () => this.hide();
    }
    
    // Save button
    if (saveBtn) {
        saveBtn.onclick = () => this.handleSave();
    }
    
    // Delete button
    if (deleteBtn) {
        deleteBtn.onclick = () => this.handleDelete();
    }
    
    // Real-time change detection for all form fields
    const formFields = [nameInput, descriptionInput, categorySelect, orderInput, statusSelect];
    
    formFields.forEach(field => {
        if (field) {
            const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
            field.addEventListener(eventType, () => {
                this.updateSaveButton();
            });
        }
    });
    
    // Character counter for description
    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
            this.updateCharacterCount();
        });
    }
    
    // Auto-focus and select name input
    setTimeout(() => {
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }, 100);
    
    // Initial button state
    this.updateSaveButton();
    }
    
    updateSaveButton() {
    const saveBtn = document.getElementById('save-changes-btn');
    const nameInput = document.getElementById('edit-dashboard-name');
    
    if (saveBtn && nameInput) {
        const name = nameInput.value.trim();
        const isValid = name.length >= 2;
        const hasChanges = this.hasChanges();
        
        saveBtn.disabled = !isValid || !hasChanges;
        
        if (!isValid) {
            saveBtn.style.opacity = '0.5';
            saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Invalid Name';
        } else if (!hasChanges) {
            saveBtn.style.opacity = '0.7';
            saveBtn.innerHTML = '<i class="fas fa-check"></i> No Changes';
        } else {
            saveBtn.style.opacity = '1';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    }
    }
    
    hasChanges() {
        if (!this.currentDashboard) return false;
        
        const formData = this.getFormData();
        
        // Convert order to numbers for proper comparison
        const currentOrder = parseInt(this.currentDashboard.order) || 1;
        const formOrder = parseInt(formData.order) || 1;
        
        return (
            formData.name !== this.currentDashboard.name ||
            formData.description !== (this.currentDashboard.description || '') ||
            formData.category !== this.currentDashboard.category ||
            formOrder !== currentOrder ||
            formData.status !== (this.currentDashboard.status || 'active')
        );
    }
    
    updateCharacterCount() {
        const descriptionInput = document.getElementById('edit-dashboard-description');
        const countElement = document.getElementById('edit-description-count');
        
        if (descriptionInput && countElement) {
            const count = descriptionInput.value.length;
            countElement.textContent = count;
            countElement.style.color = count > 180 ? 'var(--warning-color)' : 'var(--text-secondary)';
            
            // Check for changes
            this.updateSaveButton();
        }
    }
    
    populateForm(dashboard) {
        // Populate basic fields
        document.getElementById('edit-dashboard-name').value = dashboard.name || '';
        document.getElementById('edit-dashboard-description').value = dashboard.description || '';
        document.getElementById('edit-dashboard-category').value = dashboard.category || 'custom';
        document.getElementById('edit-dashboard-order').value = dashboard.order || 1;
        document.getElementById('edit-dashboard-status').value = dashboard.status || 'active';
        
        // Populate info section
        document.getElementById('edit-created-date').textContent = 
            new Date(dashboard.createdAt).toLocaleDateString();
        document.getElementById('edit-modified-date').textContent = 
            new Date(dashboard.lastModified).toLocaleDateString();
        document.getElementById('edit-widget-count').textContent = 
            (dashboard.widgets || []).length;
        document.getElementById('edit-dashboard-id').textContent = dashboard.id;
        
        // Update character count
        this.updateCharacterCount();
    }
    
    getFormData() {
        return {
            name: document.getElementById('edit-dashboard-name').value.trim(),
            description: document.getElementById('edit-dashboard-description').value.trim(),
            category: document.getElementById('edit-dashboard-category').value,
            order: parseInt(document.getElementById('edit-dashboard-order').value) || 1,
            status: document.getElementById('edit-dashboard-status').value || 'active'
        };
    }
    
    isDuplicateName(name) {
        if (!window.dashboardService || !this.currentDashboard) return false;
        
        const existing = window.dashboardService.getAll();
        return existing.some(dashboard => 
            dashboard.id !== this.currentDashboard.id &&
            dashboard.name.toLowerCase() === name.toLowerCase()
        );
    }
    
    handleSave() {
        console.log('💾 Saving dashboard changes...');
        
        try {
            // Get form data
            const formData = this.getFormData();
            
            // Basic validation
            if (!formData.name || formData.name.length < 2) {
                this.showError('Dashboard name must be at least 2 characters');
                return;
            }
            
            // Check for duplicate names (excluding current dashboard)
            if (this.isDuplicateName(formData.name)) {
                this.showError('A dashboard with this name already exists');
                return;
            }
            
            // Show loading
            this.setLoading(true);
            
            // Update dashboard
            setTimeout(() => {
                try {
                    const updatedDashboard = window.dashboardService.update(this.currentDashboard.id, formData);
                    this.handleSuccess(updatedDashboard);
                } catch (error) {
                    this.showError(error.message || 'Failed to update dashboard');
                } finally {
                    this.setLoading(false);
                }
            }, 300);
            
        } catch (error) {
            console.error('❌ Save error:', error);
            this.showError('An unexpected error occurred');
        }
    }
    
    handleDelete() {
        if (!this.currentDashboard) return;
        
        const confirmMessage = `Are you sure you want to delete "${this.currentDashboard.name}"?\n\nThis action cannot be undone and will remove all widgets and data.`;
        
        if (confirm(confirmMessage)) {
            try {
                window.dashboardService.delete(this.currentDashboard.id);
                this.hide();
                this.showNotification(`Dashboard "${this.currentDashboard.name}" deleted successfully`, 'success');
            } catch (error) {
                this.showError(error.message || 'Failed to delete dashboard');
            }
        }
    }
    
    handleSuccess(dashboard) {
        console.log('✅ Dashboard updated successfully:', dashboard.name);
        
        // Hide modal
        this.hide();
        
        // Show success notification
        this.showNotification(`Dashboard "${dashboard.name}" updated successfully!`, 'success');
        
        // If this is the current dashboard, refresh it
        if (window.dashboardService.getCurrent()?.id === dashboard.id) {
            EventBus.emit('dashboard:select', dashboard);
        }
    }
    
    setLoading(isLoading) {
        const saveBtn = document.getElementById('save-changes-btn');
        const deleteBtn = document.getElementById('delete-dashboard-btn');
        
        if (saveBtn) {
            saveBtn.disabled = isLoading;
            saveBtn.innerHTML = isLoading 
                ? '<span class="loading"></span> Saving...'
                : '<i class="fas fa-save"></i> Save Changes';
        }
        
        if (deleteBtn) {
            deleteBtn.disabled = isLoading;
        }
    }
    
    showError(message) {
        const errorElement = document.getElementById('edit-name-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = 'var(--danger-color)';
        }
        
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
    
    show(dashboard) {
        this.currentDashboard = dashboard;
        
        // Populate form with dashboard data
        this.populateForm(dashboard);
        
        // Show modal
        this.modal.show();
        this.isVisible = true;
        
        console.log('📝 Edit Dashboard modal opened for:', dashboard.name);
    }
    
    hide() {
        this.modal.hide();
        this.isVisible = false;
        this.currentDashboard = null;
        
        console.log('📝 Edit Dashboard modal closed');
    }
    
    destroy() {
        if (this.modal) {
            this.modal.destroy();
        }
    }
}

window.EditDashboardModal = EditDashboardModal;
