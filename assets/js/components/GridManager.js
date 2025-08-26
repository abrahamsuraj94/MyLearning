// assets/js/components/GridManager.js

class GridManager {
    constructor() {
        this.grid = null;
        this.isEditMode = false;
        this.gridOptions = {
            cellHeight: 70,
            verticalMargin: 10,
            horizontalMargin: 10,
            resizable: {
                handles: 'e, se, s, sw, w'
            },
            draggable: {
                handle: '.grid-stack-item-content'
            },
            animate: true,
            float: false,
            removable: false,
            acceptWidgets: true,
            alwaysShowResizeHandle: false
        };
        
        console.log('🔲 GridManager constructor called');
        this.init();
    }

    init() {
        console.log('🔲 Initializing Grid System...');
        this.createGridContainer();
        this.initializeGridStack();
        this.bindEvents();
        this.setupResponsiveHandling();
        console.log('✅ Grid System initialized');
    }

    createGridContainer() {
    if (document.getElementById('gridStack')) {
        console.log('📦 Grid container already exists');
        return;
    }

    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) {
        console.error('❌ Dashboard content container not found');
        return;
    }

    // Create grid container with proper styling
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-stack';
    gridContainer.id = 'gridStack';
    gridContainer.style.cssText = `
        display: none;
        position: relative;
        width: 100%;
        min-height: 400px;
        padding: 0;
        margin: 0;
        z-index: 10;
    `;
    
    // Insert grid at the beginning of dashboard-content
    dashboardContent.insertBefore(gridContainer, dashboardContent.firstChild);
    
    console.log('📦 Grid container created at beginning of dashboard-content');
}

    initializeGridStack() {
        const gridElement = document.getElementById('gridStack');
        if (!gridElement) {
            console.error('Grid container not found');
            return;
        }

        this.grid = GridStack.init(this.gridOptions, gridElement);
        this.setupGridEvents();
        this.setEditMode(false); // Start in view mode
        console.log('✅ GridStack initialized');
    }

    setupGridEvents() {
        if (!this.grid) return;

        // Drag stop event
        this.grid.on('dragstop', (event, element) => {
            if (this.isEditMode) {
                EventBus.emit('grid:widget:moved', {
                    widgetId: element.getAttribute('data-widget-id'),
                    position: this.getWidgetPosition(element)
                });
                EventBus.emit('notification:show', 'Widget position updated', 'success');
            }
        });

        // Resize stop event
        this.grid.on('resizestop', (event, element) => {
            if (this.isEditMode) {
                EventBus.emit('grid:widget:resized', {
                    widgetId: element.getAttribute('data-widget-id'),
                    size: this.getWidgetSize(element)
                });
                EventBus.emit('notification:show', 'Widget resized', 'success');
            }
        });

        // Widget added event
        this.grid.on('added', (event, items) => {
            items.forEach(item => {
                console.log('Widget added to grid:', item.el.getAttribute('data-widget-id'));
            });
        });

        // Widget removed event
        this.grid.on('removed', (event, items) => {
            items.forEach(item => {
                console.log('Widget removed from grid:', item.el.getAttribute('data-widget-id'));
                EventBus.emit('grid:widget:removed', {
                    widgetId: item.el.getAttribute('data-widget-id')
                });
            });
        });
    }

    setupResponsiveHandling() {
        this.handleResponsiveGrid();
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResponsiveGrid();
            }, 250);
        });
    }

    handleResponsiveGrid() {
        if (!this.grid) return;

        const screenWidth = window.innerWidth;
        
        if (screenWidth < 768) {
            // Mobile: Make widgets stack vertically
            this.grid.column(1, false);
        } else if (screenWidth < 1024) {
            // Tablet: 6 columns
            this.grid.column(6, false);
        } else {
            // Desktop: 12 columns
            this.grid.column(12, false);
        }
    }

    bindEvents() {
        // Listen for mode changes
        EventBus.on('dashboard:mode:changed', (mode) => {
            this.setEditMode(mode === 'edit');
        });

        // Listen for widget addition requests
        EventBus.on('widget:add:requested', (widgetData) => {
            this.addWidget(widgetData);
        });

        // Listen for widget deletion requests
        EventBus.on('widget:delete:requested', (widgetId) => {
            this.removeWidget(widgetId);
        });

        // Listen for dashboard load
        EventBus.on('dashboard:loaded', (dashboard) => {
            this.loadDashboardWidgets(dashboard);
        });

        // Listen for dashboard clear
        EventBus.on('dashboard:cleared', () => {
            this.clearGrid();
        });
    }

    setEditMode(enabled) {
        this.isEditMode = enabled;
        
        if (!this.grid) return;

        // Enable/disable grid interactions
        this.grid.enableMove(enabled);
        this.grid.enableResize(enabled);

        // Update cursor styles
        const gridItems = document.querySelectorAll('.grid-stack-item-content');
        gridItems.forEach(item => {
            item.style.cursor = enabled ? 'move' : 'default';
        });

        // Show/hide widget controls
        this.toggleWidgetControls(enabled);

        console.log(`Grid edit mode: ${enabled ? 'enabled' : 'disabled'}`);
    }

    toggleWidgetControls(show) {
        const widgetActions = document.querySelectorAll('.widget-actions');
        widgetActions.forEach(actions => {
            actions.style.display = show ? 'flex' : 'none';
        });
    }

    addWidget(widgetData) {
    if (!this.grid) {
        console.error('Grid not initialized');
        return null;
    }

    const widgetElement = this.createWidgetElement(widgetData);
    this.grid.addWidget(widgetElement);
    
    // ✨ ADD THIS: Force hide empty states immediately
    setTimeout(function() {
        document.querySelectorAll('.empty-dashboard').forEach(function(el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
        });
        
        document.querySelector('.grid-stack').style.display = 'block';
        console.log('🔄 Empty state force-hidden after widget add');
    }, 50);
    
    this.showGrid();
    
    EventBus.emit('grid:widget:added', widgetData);
    EventBus.emit('notification:show', `${widgetData.type} widget added`, 'success');
    return widgetElement;
}

    createWidgetElement(widgetData) {
        const element = document.createElement('div');
        element.className = 'grid-stack-item';
        element.setAttribute('data-widget-id', widgetData.id);
        element.setAttribute('data-widget-type', widgetData.type);
        element.setAttribute('data-widget-config', JSON.stringify(widgetData.config));
        element.setAttribute('gs-x', widgetData.x || 0);
        element.setAttribute('gs-y', widgetData.y || 0);
        element.setAttribute('gs-w', widgetData.w || 3);
        element.setAttribute('gs-h', widgetData.h || 3);

        const content = document.createElement('div');
        content.className = 'grid-stack-item-content';
        content.innerHTML = this.generateWidgetHTML(widgetData);
        
        element.appendChild(content);
        return element;
    }

    generateWidgetHTML(widgetData) {
        const title = widgetData.config.title || `${widgetData.type} Widget`;
        const iconMap = {
            gauge: 'fas fa-tachometer-alt',
            chart: 'fas fa-chart-line',
            metric: 'fas fa-chart-bar',
            toggle: 'fas fa-toggle-on',
            map: 'fas fa-map-marked-alt',
            slider: 'fas fa-sliders-h'
        };
        
        const icon = iconMap[widgetData.type] || 'fas fa-cube';
        
        return `
            <div class="widget-header">
                <span class="widget-title">${title}</span>
                <div class="widget-actions" style="display: ${this.isEditMode ? 'flex' : 'none'};">
                    <button class="widget-btn" onclick="GridManager.editWidget('${widgetData.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="widget-btn danger" onclick="GridManager.deleteWidget('${widgetData.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content">
                <div class="widget-placeholder widget-${widgetData.type}">
                    <i class="${icon}"></i>
                    <p>${widgetData.type.charAt(0).toUpperCase() + widgetData.type.slice(1)} Widget</p>
                    <small>Configure to display data</small>
                </div>
            </div>
        `;
    }

    removeWidget(widgetId) {
        if (!this.grid) return false;

        const element = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (element) {
            this.grid.removeWidget(element);
            
            // Hide grid if no widgets remain
            if (this.getWidgetCount() === 0) {
                this.hideGrid();
            }
            
            return true;
        }
        return false;
    }

    getWidgetCount() {
        return this.grid ? this.grid.engine.nodes.length : 0;
    }

showGrid() {
    const gridElement = document.getElementById('gridStack');
    const emptyStates = document.querySelectorAll('.empty-dashboard');
    
    console.log('🔄 Showing grid...');
    console.log('- Grid element:', gridElement);
    console.log('- Empty states found:', emptyStates.length);
    
    if (gridElement) {
        gridElement.style.display = 'block';
        gridElement.style.zIndex = '10';
        console.log('✅ Grid shown');
    }
    
    // Hide ALL empty states
    emptyStates.forEach((emptyState, index) => {
        console.log(`- Hiding empty state ${index}:`, emptyState);
        emptyState.style.display = 'none';
        emptyState.style.visibility = 'hidden';
        emptyState.style.opacity = '0';
    });
    
    console.log('✅ All empty states hidden');
}

hideGrid() {
    const gridElement = document.getElementById('gridStack');
    const emptyStates = document.querySelectorAll('.empty-dashboard');
    
    console.log('🔄 Hiding grid...');
    
    if (gridElement) {
        gridElement.style.display = 'none';
        console.log('✅ Grid hidden');
    }
    
    // Show empty states
    emptyStates.forEach((emptyState, index) => {
        console.log(`- Showing empty state ${index}:`, emptyState);
        emptyState.style.display = 'flex';
        emptyState.style.visibility = 'visible';
        emptyState.style.opacity = '1';
    });
    
    console.log('✅ Empty states shown');
}

    clearGrid() {
        if (this.grid) {
            this.grid.removeAll();
            this.hideGrid();
        }
    }

    loadDashboardWidgets(dashboard) {
        this.clearGrid();
        
        if (dashboard.widgets && dashboard.widgets.length > 0) {
            dashboard.widgets.forEach(widget => {
                this.addWidget(widget);
            });
            this.showGrid();
        } else {
            this.hideGrid();
        }
    }

    getGridState() {
        if (!this.grid) return [];

        const widgets = [];
        this.grid.engine.nodes.forEach(node => {
            const element = node.el;
            const widgetData = {
                id: element.getAttribute('data-widget-id'),
                type: element.getAttribute('data-widget-type'),
                x: node.x,
                y: node.y,
                w: node.w,
                h: node.h,
                config: JSON.parse(element.getAttribute('data-widget-config') || '{}')
            };
            widgets.push(widgetData);
        });
        
        return widgets;
    }

    getWidgetPosition(element) {
        const node = this.grid.engine.nodes.find(n => n.el === element);
        return node ? { x: node.x, y: node.y } : null;
    }

    getWidgetSize(element) {
        const node = this.grid.engine.nodes.find(n => n.el === element);
        return node ? { w: node.w, h: node.h } : null;
    }

    // Static methods for global access
    static editWidget(widgetId) {
        EventBus.emit('widget:edit:requested', widgetId);
        EventBus.emit('notification:show', 'Widget editor coming soon', 'info');
    }

    static deleteWidget(widgetId) {
        const element = document.querySelector(`[data-widget-id="${widgetId}"]`);
        const config = element ? JSON.parse(element.getAttribute('data-widget-config') || '{}') : {};
        const title = config.title || 'this widget';
        
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            EventBus.emit('widget:delete:requested', widgetId);
        }
    }

    // Utility methods
    compactGrid() {
        if (this.grid) {
            this.grid.compact();
        }
    }

    refreshGrid() {
        if (this.grid) {
            this.grid.off('dragstop resizestop added removed');
            this.setupGridEvents();
            this.handleResponsiveGrid();
        }
    }

    destroy() {
        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }
    }

    // Enhanced info method
    getInfo() {
        return {
            gridAvailable: !!this.grid,
            gridStackVersion: GridStack.version || 'unknown',
            widgetCount: this.getWidgetCount(),
            isEditMode: this.isEditMode,
            gridOptions: this.gridOptions
        };
    }
    renderNoDashboard() {
    return `
        <div class="empty-dashboard" id="empty-dashboard">
            <i class="fas fa-tachometer-alt"></i>
            <h3>No Dashboard Selected</h3>
            <p>Please select a dashboard from the sidebar or create a new one to get started.</p>
            <button class="action-btn primary" id="empty-create-btn">
                <i class="fas fa-plus"></i>
                Create New Dashboard
            </button>
        </div>
    `;
}
}

// Make it globally available
window.GridManager = GridManager;

console.log('📄 GridManager.js loaded');
