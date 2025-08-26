 // ========================================
// Dashboard Service - CRUD Operations
// ========================================

class DashboardService {
    constructor() {
        this.storageKey = AppConfig.storageKeys.dashboards;
        this.currentDashboardKey = AppConfig.storageKeys.currentDashboard;
        this.dashboards = {};
        this.currentDashboard = null;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        console.log('📊 DashboardService initialized with', Object.keys(this.dashboards).length, 'dashboards');
    }
    
    // Load dashboards from localStorage
    loadFromStorage() {
        try {
            const saved = Utils.getLocalStorage(this.storageKey, {});
            this.dashboards = saved;
            
            const currentId = Utils.getLocalStorage(this.currentDashboardKey, null);
            if (currentId && this.dashboards[currentId]) {
                this.currentDashboard = this.dashboards[currentId];
            }
            
        } catch (error) {
            console.error('Failed to load dashboards:', error);
            this.dashboards = {};
        }
    }
    
    // Save dashboards to localStorage
    saveToStorage() {
        try {
            Utils.setLocalStorage(this.storageKey, this.dashboards);
            if (this.currentDashboard) {
                Utils.setLocalStorage(this.currentDashboardKey, this.currentDashboard.id);
            }
            return true;
        } catch (error) {
            console.error('Failed to save dashboards:', error);
            return false;
        }
    }
    
    // Create a new dashboard
    create(dashboardData) {
        try {
            // Validate required fields
            if (!dashboardData.name || !dashboardData.name.trim()) {
                throw new Error('Dashboard name is required');
            }
            
            // Generate unique ID
            const id = this.generateId(dashboardData.name);
            
            // Create dashboard object
            const dashboard = {
                id,
                name: dashboardData.name.trim(),
                description: dashboardData.description || '',
                category: dashboardData.category || 'custom',
                order: parseInt(dashboardData.order) || this.getNextOrder(),
                widgets: [],
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                ...dashboardData
            };
            
            // Add to collection
            this.dashboards[id] = dashboard;
            
            // Save to storage
            this.saveToStorage();
            
            // Emit event
            EventBus.emit('dashboard:created', dashboard);
            
            console.log('✅ Dashboard created:', dashboard.name);
            return dashboard;
            
        } catch (error) {
            console.error('❌ Failed to create dashboard:', error);
            throw error;
        }
    }
    
    // Get dashboard by ID
    get(id) {
        return this.dashboards[id] || null;
    }
    
    // Get all dashboards
    getAll() {
        return Object.values(this.dashboards).sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    
    // Update dashboard
    update(id, updateData) {
        try {
            const dashboard = this.dashboards[id];
            if (!dashboard) {
                throw new Error('Dashboard not found');
            }
            
            // Update dashboard
            Object.assign(dashboard, updateData, {
                lastModified: new Date().toISOString()
            });
            
            // Save to storage
            this.saveToStorage();
            
            // Update current dashboard if it's the one being updated
            if (this.currentDashboard && this.currentDashboard.id === id) {
                this.currentDashboard = dashboard;
            }
            
            // Emit event
            EventBus.emit('dashboard:updated', dashboard);
            
            console.log('✅ Dashboard updated:', dashboard.name);
            return dashboard;
            
        } catch (error) {
            console.error('❌ Failed to update dashboard:', error);
            throw error;
        }
    }
    
    // Delete dashboard
    delete(id) {
        try {
            const dashboard = this.dashboards[id];
            if (!dashboard) {
                throw new Error('Dashboard not found');
            }
            
            const dashboardName = dashboard.name;
            
            // Remove from collection
            delete this.dashboards[id];
            
            // Clear current dashboard if it's the one being deleted
            if (this.currentDashboard && this.currentDashboard.id === id) {
                this.currentDashboard = null;
                Utils.removeLocalStorage(this.currentDashboardKey);
            }
            
            // Save to storage
            this.saveToStorage();
            
            // Emit event
            EventBus.emit('dashboard:deleted', { id, dashboard });
            
            console.log('✅ Dashboard deleted:', dashboardName);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to delete dashboard:', error);
            throw error;
        }
    }
    
    // Set current dashboard
    setCurrent(id) {
        const dashboard = this.dashboards[id];
        if (!dashboard) {
            throw new Error('Dashboard not found');
        }
        
        this.currentDashboard = dashboard;
        Utils.setLocalStorage(this.currentDashboardKey, id);
        
        EventBus.emit('dashboard:current:changed', dashboard);
        
        console.log('📌 Current dashboard set:', dashboard.name);
        return dashboard;
    }
    
    // Get current dashboard
    getCurrent() {
        return this.currentDashboard;
    }
    
    // Generate unique dashboard ID
    generateId(name) {
        const base = name.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
            
        let id = base;
        let counter = 1;
        
        while (this.dashboards[id]) {
            id = `${base}-${counter}`;
            counter++;
        }
        
        return id;
    }
    
    // Get next order number
    getNextOrder() {
        const orders = Object.values(this.dashboards).map(d => d.order || 1);
        return orders.length > 0 ? Math.max(...orders) + 1 : 1;
    }
    
    // Duplicate dashboard
    duplicate(id) {
        try {
            const original = this.dashboards[id];
            if (!original) {
                throw new Error('Dashboard not found');
            }
            
            const duplicateData = {
                ...original,
                name: `${original.name} (Copy)`,
                order: this.getNextOrder()
            };
            
            delete duplicateData.id;
            delete duplicateData.createdAt;
            delete duplicateData.lastModified;
            
            return this.create(duplicateData);
            
        } catch (error) {
            console.error('❌ Failed to duplicate dashboard:', error);
            throw error;
        }
    }
    
    // Search dashboards
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.getAll().filter(dashboard => 
            dashboard.name.toLowerCase().includes(searchTerm) ||
            dashboard.description.toLowerCase().includes(searchTerm) ||
            dashboard.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Export dashboard
    export(id) {
        const dashboard = this.dashboards[id];
        if (!dashboard) {
            throw new Error('Dashboard not found');
        }
        
        const exportData = {
            ...dashboard,
            exportedAt: new Date().toISOString(),
            version: AppConfig.version || '1.0.0'
        };
        
        return exportData;
    }
    
    // Import dashboard
    import(dashboardData) {
        try {
            // Validate import data
            if (!dashboardData.name) {
                throw new Error('Invalid dashboard data');
            }
            
            // Remove system fields
            const importData = { ...dashboardData };
            delete importData.id;
            delete importData.createdAt;
            delete importData.lastModified;
            delete importData.exportedAt;
            
            // Create dashboard
            return this.create(importData);
            
        } catch (error) {
            console.error('❌ Failed to import dashboard:', error);
            throw error;
        }
    }
    
    // Get dashboard stats
    getStats() {
        const dashboards = this.getAll();
        const stats = {
            total: dashboards.length,
            byCategory: {},
            totalWidgets: 0,
            lastModified: null
        };
        
        dashboards.forEach(dashboard => {
            // Count by category
            stats.byCategory[dashboard.category] = (stats.byCategory[dashboard.category] || 0) + 1;
            
            // Count widgets
            stats.totalWidgets += (dashboard.widgets || []).length;
            
            // Find last modified
            if (!stats.lastModified || dashboard.lastModified > stats.lastModified) {
                stats.lastModified = dashboard.lastModified;
            }
        });
        
        return stats;
    }
}

// Export for global use
window.DashboardService = DashboardService;
