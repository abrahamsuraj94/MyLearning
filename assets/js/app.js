// ========================================
// Main App Initialization
// ========================================

class FieldMonitorApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.state = {
            theme: 'dark',
            currentDashboard: null,
            isEditMode: false
        };
        
        console.log('🏗️ FieldMonitorApp constructor called');
        
        // Don't initialize immediately, wait for dependencies
        this.checkDependenciesAndInit();
    }
    
    checkDependenciesAndInit() {
        console.log('🔍 Checking dependencies...');
        
        // Check if all dependencies are loaded
        const dependencies = {
            'AppConfig': window.AppConfig,
            'Utils': window.Utils,
            'EventBus': window.EventBus
        };
        
        const missing = [];
        const invalid = [];
        
        Object.entries(dependencies).forEach(([name, obj]) => {
            if (!obj) {
                missing.push(name);
            } else if (name === 'EventBus' && typeof obj.emit !== 'function') {
                invalid.push(`${name} (emit method missing)`);
            } else if (name === 'Utils' && typeof obj.debounce !== 'function') {
                invalid.push(`${name} (debounce method missing)`);
            }
        });
        
        if (missing.length > 0 || invalid.length > 0) {
            console.log('⏳ Dependencies not ready:', { missing, invalid });
            console.log('🔄 Retrying in 100ms...');
            // Retry after a short delay
            setTimeout(() => this.checkDependenciesAndInit(), 100);
            return;
        }
        
        console.log('✅ All dependencies ready');
        
        // All dependencies loaded, now initialize
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing FieldMonitor App...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                console.log('⏳ Waiting for DOM...');
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            console.log('📄 DOM ready');
            
            // Verify dependencies are still available
            if (!this.verifyDependencies()) {
                throw new Error('Required dependencies not available');
            }
            
            // Initialize core systems
            this.initializeEventListeners();
            this.loadSettings();
            this.setupErrorHandling();
            
            // Log successful initialization
            console.log('✅ FieldMonitor App initialized successfully');
            console.log('📊 App State:', this.state);
            console.log('🔧 EventBus Debug:', EventBus.getDebugInfo());
            
            this.isInitialized = true;
            
            // Test EventBus before emitting
            if (typeof EventBus.emit === 'function') {
                EventBus.emit('app:initialized');
                console.log('📡 app:initialized event emitted');
            } else {
                console.error('❌ EventBus.emit is not a function!', typeof EventBus.emit);
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleCriticalError(error);
        }
    }
    
    verifyDependencies() {
        console.log('🔍 Verifying dependencies...');
        
        const required = {
            'AppConfig': window.AppConfig,
            'Utils': window.Utils,
            'EventBus': window.EventBus
        };
        
        // 🆕 NEW: Check for GridStack (optional, won't fail if missing)
        const optional = {
            'GridStack': window.GridStack
        };
        
        const missing = [];
        const details = {};
        
        Object.entries(required).forEach(([name, obj]) => {
            if (!obj) {
                missing.push(name);
            } else {
                details[name] = {
                    type: typeof obj,
                    isFunction: typeof obj === 'function',
                    hasEmit: obj.emit ? typeof obj.emit : 'not found',
                    constructor: obj.constructor ? obj.constructor.name : 'no constructor'
                };
            }
        });
        
        // 🆕 NEW: Log optional dependencies
        Object.entries(optional).forEach(([name, obj]) => {
            details[name] = obj ? 'available' : 'not loaded';
        });
        
        console.log('🔍 Dependency details:', details);
        
        if (missing.length > 0) {
            console.error('❌ Missing dependencies:', missing);
            return false;
        }
        
        // Special check for EventBus
        if (typeof EventBus.emit !== 'function') {
            console.error('❌ EventBus.emit is not a function:', typeof EventBus.emit);
            console.error('EventBus object:', EventBus);
            return false;
        }
        
        return true;
    }
    
    initializeEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        try {
            // Test EventBus first
            if (typeof EventBus.emit !== 'function') {
                throw new Error('EventBus.emit is not a function');
            }
            
            // Theme change events
            EventBus.on('theme:change', (theme) => {
                this.setTheme(theme);
            });
            
            // App state events
            EventBus.on('app:state:update', (newState) => {
                this.updateState(newState);
            });
            
            // Window events
            window.addEventListener('beforeunload', () => {
                this.saveSettings();
            });
            
            // Use Utils.debounce with fallback
            const debounce = Utils.debounce || this.createDebounce();
            
            window.addEventListener('resize', debounce(() => {
                EventBus.emit('window:resize');
            }, 250));
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                this.handleKeyboardShortcuts(e);
            });
            
            console.log('✅ Event listeners initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize event listeners:', error);
            throw error;
        }
    }
    
    // Fallback debounce implementation
    createDebounce() {
        return function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }
    
    loadSettings() {
        console.log('📄 Loading settings...');
        
        try {
            const savedTheme = Utils.getLocalStorage(AppConfig.storageKeys.theme, AppConfig.defaults.theme);
            this.setTheme(savedTheme);
            
            const savedSettings = Utils.getLocalStorage(AppConfig.storageKeys.settings, {});
            this.state = { ...this.state, ...savedSettings };
            
            console.log('✅ Settings loaded:', this.state);
        } catch (error) {
            console.warn('⚠️ Failed to load settings:', error);
            // Use defaults
            this.setTheme(AppConfig.defaults.theme);
        }
    }
    
    saveSettings() {
        try {
            Utils.setLocalStorage(AppConfig.storageKeys.theme, this.state.theme);
            Utils.setLocalStorage(AppConfig.storageKeys.settings, this.state);
            
            console.log('💾 Settings saved');
        } catch (error) {
            console.warn('⚠️ Failed to save settings:', error);
        }
    }
    
    setTheme(theme) {
        if (!['dark', 'light'].includes(theme)) {
            console.warn('⚠️ Invalid theme:', theme, 'using default');
            theme = AppConfig.defaults.theme;
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        
        if (typeof EventBus.emit === 'function') {
            EventBus.emit('theme:changed', theme);
        }
        
        console.log(`🎨 Theme changed to: ${theme}`);
    }
    
    updateState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        if (typeof EventBus.emit === 'function') {
            EventBus.emit('app:state:changed', {
                oldState,
                newState: this.state,
                changes: newState
            });
        }
        
        console.log('🔄 State updated:', newState);
    }
    
    handleKeyboardShortcuts(e) {
        // Prevent shortcuts if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const shortcuts = {
            // Ctrl/Cmd + S - Save
            's': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    EventBus.emit('shortcut:save');
                    console.log('⌨️ Save shortcut triggered');
                }
            },
            
            // Ctrl/Cmd + N - New Dashboard
            'n': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    EventBus.emit('shortcut:new-dashboard');
                    console.log('⌨️ New dashboard shortcut triggered');
                }
            },
            
            // Ctrl/Cmd + E - Toggle Edit Mode
            'e': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    EventBus.emit('shortcut:toggle-edit');
                    console.log('⌨️ Toggle edit shortcut triggered');
                }
            },
            
            // Escape - Cancel/Close
            'Escape': () => {
                EventBus.emit('shortcut:escape');
                console.log('⌨️ Escape shortcut triggered');
            },
            
            // Ctrl/Cmd + T - Toggle Theme (for testing)
            't': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
                    this.setTheme(newTheme);
                    console.log('⌨️ Theme toggle shortcut triggered');
                }
            }
        };
        
        const handler = shortcuts[e.key];
        if (handler) {
            try {
                handler(e);
            } catch (error) {
                console.error('Error in keyboard shortcut handler:', error);
            }
        }
    }
    
    setupErrorHandling() {
        console.log('🛡️ Setting up error handling...');
        
        window.addEventListener('error', (event) => {
            console.error('🚨 Global error:', event.error);
            if (typeof EventBus.emit === 'function') {
                EventBus.emit('app:error', {
                    type: 'javascript',
                    error: event.error,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled promise rejection:', event.reason);
            if (typeof EventBus.emit === 'function') {
                EventBus.emit('app:error', {
                    type: 'promise',
                    error: event.reason
                });
            }
        });
        
        console.log('✅ Error handling initialized');
    }
    
    handleCriticalError(error) {
        console.error('🚨 Critical error - showing fallback UI:', error);
        
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: #1a1a1a;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <h1 style="color: #ef4444; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Application Error
                </h1>
                <p style="margin-bottom: 2rem; color: #a0a0a0;">
                    Something went wrong. Please refresh the page to try again.
                </p>
                <button onclick="window.location.reload()" style="
                    padding: 12px 24px;
                    background: #4ade80;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-bottom: 1rem;
                ">
                    Reload Application
                </button>
                <button onclick="localStorage.clear(); window.location.reload();" style="
                    padding: 8px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    Clear Data & Reload
                </button>
                <details style="margin-top: 2rem; text-align: left; max-width: 600px;">
                    <summary style="cursor: pointer; color: #a0a0a0;">
                        Error Details
                    </summary>
                    <pre style="
                        background: #2a2a2a;
                        padding: 1rem;
                        border-radius: 4px;
                        overflow: auto;
                        margin-top: 1rem;
                        font-size: 12px;
                        color: #ffffff;
                    ">${error.stack || error.message || error}</pre>
                </details>
            </div>
        `;
    }
    
    // Public API methods
    getState() {
        return { ...this.state };
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    // Enhanced test method
    test() {
        console.log('🧪 Running comprehensive tests...');
        
        try {
            // Test EventBus
            console.log('Testing EventBus...');
            if (typeof EventBus.emit !== 'function') {
                throw new Error('EventBus.emit is not a function');
            }
            
            let eventReceived = false;
            const unsubscribe = EventBus.on('test:event', (data) => {
                console.log('✅ Test event received:', data);
                eventReceived = true;
            });
            
            EventBus.emit('test:event', 'Hello from test!');
            
            if (!eventReceived) {
                throw new Error('Test event was not received');
            }
            
            unsubscribe();
            console.log('✅ EventBus test passed');
            
            // Test Utils
            console.log('Testing Utils...');
            console.log('Utils.generateId():', Utils.generateId('test'));
            console.log('Utils.formatDate():', Utils.formatDate());
            console.log('✅ Utils test passed');
            
            // Test theme toggle
            console.log('Testing theme toggle...');
            const currentTheme = this.state.theme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            
            setTimeout(() => {
                this.setTheme(currentTheme);
                console.log('✅ Theme toggle test passed');
                console.log('🎉 All tests completed successfully!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        }
    }
    
    destroy() {
        if (typeof EventBus.removeAllListeners === 'function') {
            EventBus.removeAllListeners();
        }
        this.saveSettings();
        console.log('🧹 App destroyed');
    }
}

// Initialize app when script loads
try {
    window.App = new FieldMonitorApp();
} catch (error) {
    console.error('❌ Failed to create App instance:', error);
}

// Export for development/debugging
setTimeout(() => {
    if (window.AppConfig && AppConfig.isDevelopment) {
        window.FieldMonitor = {
            App: window.App,
            EventBus: window.EventBus,
            Utils: window.Utils,
            Config: window.AppConfig
        };
        
        // Add test function to global scope for easy testing
        window.testApp = () => {
            if (window.App && typeof window.App.test === 'function') {
                return window.App.test();
            } else {
                console.error('❌ App or test method not available');
            }
        };
        
        console.log('🔬 Development mode enabled. Try: testApp()');
        console.log('🔍 Available: window.FieldMonitor, testApp()');
    }
}, 1000);

// ========================================
// Manual Component Initialization (Simple & Reliable)
// ========================================

function initializeComponents() {
    console.log('🎭 Starting manual component initialization...');
    
    try {
        // Initialize Header
        if (typeof HeaderComponent !== 'undefined') {
            console.log('🏗️ Initializing Header...');
            window.headerInstance = new HeaderComponent();
        } else {
            console.error('❌ HeaderComponent not found');
        }
        
        // Initialize Sidebar  
        if (typeof SidebarComponent !== 'undefined') {
            console.log('🏗️ Initializing Sidebar...');
            window.sidebarInstance = new SidebarComponent();
        } else {
            console.error('❌ SidebarComponent not found');
        }
        
        // Initialize Dashboard
        if (typeof DashboardComponent !== 'undefined') {
            console.log('🏗️ Initializing Dashboard...');
            window.dashboardInstance = new DashboardComponent();
        } else {
            console.error('❌ DashboardComponent not found');
        }
        
        // 🆕 NEW: Initialize Grid Manager
        if (typeof GridManager !== 'undefined' && typeof GridStack !== 'undefined') {
            console.log('🏗️ Initializing Grid Manager...');
            window.gridManagerInstance = new GridManager();
        } else {
            console.error('❌ GridManager or GridStack not found');
        }
        
        // Initialize Create Dashboard Modal
        if (typeof CreateDashboardModal !== 'undefined') {
            console.log('🏗️ Initializing Create Dashboard Modal...');
            window.createDashboardModalInstance = new CreateDashboardModal();
        } else {
            console.error('❌ CreateDashboardModal not found');
        }
        
        // Initialize Edit Dashboard Modal
        if (typeof EditDashboardModal !== 'undefined') {
            console.log('🏗️ Initializing Edit Dashboard Modal...');
            window.editDashboardModalInstance = new EditDashboardModal();
        } else {
            console.error('❌ EditDashboardModal not found');
        }
        
        console.log('✅ Component initialization complete');
        
    } catch (error) {
        console.error('❌ Component initialization failed:', error);
    }
}

// ========================================
// Service Initialization
// ========================================

// Initialize Dashboard Service
EventBus.on('app:initialized', function() {
    console.log('📊 Initializing Dashboard Service...');
    
    if (window.DashboardService) {
        window.dashboardService = new DashboardService();
        console.log('✅ Dashboard Service initialized');
        
        // 🆕 NEW: Bind grid events after dashboard service is ready
        bindGridEvents();
    }
});

// 🆕 NEW: Grid Event Bindings
function bindGridEvents() {
    console.log('🔲 Binding grid events...');
    
    try {
        // Listen for edit mode changes from dashboard
        EventBus.on('dashboard:mode:changed', (mode) => {
            if (window.gridManagerInstance) {
                window.gridManagerInstance.setEditMode(mode === 'edit');
                console.log(`🔲 Grid edit mode: ${mode === 'edit' ? 'enabled' : 'disabled'}`);
            }
        });
        
        // Listen for dashboard save requests to capture widget positions
        EventBus.on('dashboard:save:requested', () => {
            if (window.gridManagerInstance) {
                const widgets = window.gridManagerInstance.getGridState();
                EventBus.emit('dashboard:widgets:updated', widgets);
                console.log('🔲 Grid state saved:', widgets.length, 'widgets');
            }
        });
        
        // Listen for widget add requests
        EventBus.on('widget:add:requested', (widgetData) => {
            if (window.gridManagerInstance) {
                window.gridManagerInstance.addWidget(widgetData);
                console.log('🔲 Widget added to grid:', widgetData.type);
            }
        });
        
        // Listen for dashboard load to restore widgets
        EventBus.on('dashboard:loaded', (dashboard) => {
            if (window.gridManagerInstance) {
                window.gridManagerInstance.loadDashboardWidgets(dashboard);
                console.log('🔲 Dashboard widgets loaded:', dashboard.widgets?.length || 0);
            }
        });
        
        // Listen for dashboard clear
        EventBus.on('dashboard:cleared', () => {
            if (window.gridManagerInstance) {
                window.gridManagerInstance.clearGrid();
                console.log('🔲 Grid cleared');
            }
        });
        
        console.log('✅ Grid events bound');
        
    } catch (error) {
        console.error('❌ Failed to bind grid events:', error);
    }
}

// Fallback: Initialize after a delay if app event didn't fire
setTimeout(() => {
    if (!window.headerInstance && !window.sidebarInstance && !window.dashboardInstance) {
        console.log('🔄 Fallback component initialization...');
        initializeComponents();
    }
}, 2000);

// Development helpers
if (window.AppConfig && AppConfig.isDevelopment) {
    window.FieldMonitor = {
        App: window.App,
        EventBus: window.EventBus,
        Utils: window.Utils,
        Config: window.AppConfig,
        Components: {
            header: () => window.headerInstance,
            sidebar: () => window.sidebarInstance, 
            dashboard: () => window.dashboardInstance,
            // 🆕 NEW: Add grid manager to dev tools
            grid: () => window.gridManagerInstance
        }
    };
    
    window.testApp = () => {
        if (window.App && typeof window.App.test === 'function') {
            return window.App.test();
        } else {
            console.error('❌ App or test method not available');
        }
    };
    
    window.debugComponents = () => {
        console.log('🔍 Component Debug Info:');
        console.log('Header:', window.headerInstance);
        console.log('Sidebar:', window.sidebarInstance);
        console.log('Dashboard:', window.dashboardInstance);
        console.log('Grid Manager:', window.gridManagerInstance); // 🆕 NEW
        console.log('DOM Elements:');
        console.log('- app-header:', document.querySelector('#app-header'));
        console.log('- app-sidebar:', document.querySelector('#app-sidebar'));
        console.log('- app-main:', document.querySelector('#app-main'));
        console.log('- gridStack:', document.querySelector('#gridStack')); // 🆕 NEW
    };
    
    // 🆕 NEW: Grid testing helper
    window.testGrid = () => {
        if (window.gridManagerInstance) {
            console.log('🧪 Testing grid...');
            
            // Test adding a widget
            const testWidget = {
                id: 'test-widget-' + Date.now(),
                type: 'gauge',
                x: 0, y: 0, w: 3, h: 3,
                config: { title: 'Test Widget' }
            };
            
            window.gridManagerInstance.addWidget(testWidget);
            console.log('✅ Test widget added');
            
            // Test getting grid state
            setTimeout(() => {
                const state = window.gridManagerInstance.getGridState();
                console.log('✅ Grid state:', state);
            }, 1000);
            
        } else {
            console.error('❌ Grid manager not available');
        }
    };
    
    console.log('🔬 Development mode enabled. Try: testApp(), debugComponents(), testGrid()');
}

// Initialize components after app is ready
if (window.App) {
    // window.ComponentManager = new ComponentManager();
} else {
    console.warn('⚠️ App not found, components not initialized');
}
