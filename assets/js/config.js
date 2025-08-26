 // ========================================
// App Configuration
// ========================================

window.AppConfig = {
    // App Info
    name: 'FieldMonitor',
    version: '1.0.0',
    description: 'IoT Dashboard Application',
    
    // Environment
    isDevelopment: true,
    apiBaseUrl: 'https://api.fieldmonitor.com',
    
    // Features
    features: {
        realTimeUpdates: true,
        offlineMode: true,
        exportImport: true,
        themes: true,
        notifications: true
    },
    
    // Default Settings
    defaults: {
        theme: 'dark',
        autoSave: true,
        updateInterval: 5000, // 5 seconds
        gridCellHeight: 70,
        gridVerticalMargin: 10,
        gridHorizontalMargin: 10
    },
    
    // Widget Types
    widgetTypes: {
        gauge: { name: 'Gauge', icon: 'fas fa-tachometer-alt', defaultSize: { w: 3, h: 3 } },
        metric: { name: 'Metric', icon: 'fas fa-calculator', defaultSize: { w: 2, h: 2 } },
        chart: { name: 'Chart', icon: 'fas fa-chart-line', defaultSize: { w: 6, h: 4 } },
        toggle: { name: 'Toggle', icon: 'fas fa-toggle-on', defaultSize: { w: 2, h: 2 } },
        slider: { name: 'Slider', icon: 'fas fa-sliders-h', defaultSize: { w: 2, h: 3 } },
        map: { name: 'Map', icon: 'fas fa-map', defaultSize: { w: 4, h: 3 } },
        pie: { name: 'Pie Chart', icon: 'fas fa-chart-pie', defaultSize: { w: 3, h: 3 } },
        table: { name: 'Table', icon: 'fas fa-table', defaultSize: { w: 4, h: 3 } },
        status: { name: 'Status', icon: 'fas fa-info-circle', defaultSize: { w: 3, h: 2 } }
    },
    
    // Dashboard Categories
    categories: [
        { value: 'agriculture', label: 'Agriculture' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'home', label: 'Home Automation' },
        { value: 'environmental', label: 'Environmental' },
        { value: 'custom', label: 'Custom' }
    ],
    
    // Data Sources
    dataSources: [
        { value: 'sensor1', label: 'Temperature Sensor' },
        { value: 'sensor2', label: 'Humidity Sensor' },
        { value: 'sensor3', label: 'Water Level Sensor' },
        { value: 'sensor4', label: 'Soil Moisture' },
        { value: 'manual', label: 'Manual Input' },
        { value: 'api', label: 'API Endpoint' }
    ],
    
    // Notification Settings
    notifications: {
        duration: 3000,
        maxVisible: 3,
        position: 'top-right'
    },
    
    // Storage Keys
    storageKeys: {
        dashboards: 'fieldmonitor_dashboards',
        currentDashboard: 'fieldmonitor_current_dashboard',
        theme: 'fieldmonitor_theme',
        settings: 'fieldmonitor_settings'
    },
    
    // Grid Settings
    grid: {
        cellHeight: 70,
        verticalMargin: 10,
        horizontalMargin: 10,
        animate: true,
        float: false,
        columns: 12,
        mobileColumns: 1,
        tabletColumns: 6
    },
    
    // Animation Durations
    animations: {
        fast: 200,
        normal: 300,
        slow: 500
    }
};

// Freeze config to prevent modifications
Object.freeze(window.AppConfig);
