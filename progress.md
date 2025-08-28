
## 🏗️ **Modular Architecture Plan**

### **File Structure**
```
dashboard-app/
├── index.html                    # Minimal HTML structure
├── assets/
│   ├── css/
│   │   ├── main.css             # Base styles & CSS variables
│   │   ├── components/
│   │   │   ├── header.css       # Header component styles
│   │   │   ├── sidebar.css      # Sidebar component styles
│   │   │   ├── modal.css        # Modal component styles
│   │   │   ├── widgets.css      # Widget base styles
│   │   │   └── dashboard.css    # Dashboard canvas styles
│   ├── js/
│   │   ├── app.js              # Main app initialization
│   │   ├── config.js           # App configuration
│   │   ├── utils.js            # Utility functions
│   │   ├── components/
│   │   │   ├── Header.js       # Header component
│   │   │   ├── Sidebar.js      # Sidebar component
│   │   │   ├── Dashboard.js    # Dashboard component
│   │   │   ├── Modal.js        # Modal component
│   │   │   └── GridManager.js  # Grid management
│   │   ├── widgets/
│   │   │   ├── BaseWidget.js   # Base widget class
│   │   │   ├── GaugeWidget.js  # Gauge widget
│   │   │   ├── MetricWidget.js # Metric widget
│   │   │   └── ChartWidget.js  # Chart widget
│   │   └── services/
│   │       ├── DashboardService.js # Dashboard CRUD
│   │       ├── StorageService.js   # Data persistence
│   │       └── EventBus.js         # Event management
└── lib/                        # External libraries
```

## 📋 **Development Phases**

### **Phase 1: Foundation** ⚡
- [x] Basic HTML structure
- [x] CSS setup with variables
- [x] App initialization
- [x] Event bus system
- [x] Basic configuration

### **Phase 2: Core Components** 🧩
- [x] Header component
- [x] Sidebar component
- [x] Basic dashboard canvas
- [x] Modal system

### **Phase 3: Dashboard Management** 📊
- [x] Dashboard CRUD operations
- [x] Local storage integration
- [x] Dashboard listing with order
- [x] Import/Export functionality

### **Phase 4: Grid System** 🔲
- [x] GridStack integration
- [x] Widget container management
- [x] Edit/View mode handling
- [x] Responsive grid

### **Phase 5: Widget System** 🎛️
- [x] Base widget architecture
- [x] Widget factory pattern
- [x] Gauge widget
- [x] Metric widget
- [x] Toggle widget

### **Phase 6: Advanced Features** ⚙️
- [x] Widget configuration forms
- [x] Theme system
- [x] Real-time data simulation
- [x] Alert system

### **Phase 7: Polish & Performance** ✨
- [x] Error handling
- [x] Mobile optimization
- [x] Performance monitoring
- [x] Documentation

**HTML file which is the reference:**
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FieldMonitor - IoT Dashboard</title>
    
    <!-- External Libraries -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@9.2.0/dist/gridstack.min.css">
    <script src="https://cdn.jsdelivr.net/npm/gridstack@9.2.0/dist/gridstack-all.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-bg: #1a1a1a;
            --secondary-bg: #2a2a2a;
            --card-bg: #3a3a3a;
            --accent-green: #4ade80;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --border-color: #4a4a4a;
            --danger-color: #ef4444;
            --warning-color: #f59e0b;
            --success-color: #10b981;
        }

        [data-theme="light"] {
            --primary-bg: #f8fafc;
            --secondary-bg: #ffffff;
            --card-bg: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--primary-bg);
            color: var(--text-primary);
            overflow-x: hidden;
            transition: all 0.3s ease;
        }

        /* Header Styles */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: var(--secondary-bg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 1000;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: bold;
            color: var(--accent-green);
        }

        .current-dashboard {
            color: var(--text-primary);
            font-weight: 500;
            font-size: 16px;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
            color: var(--text-secondary);
        }

        .header-info {
            font-size: 14px;
        }

        .header-actions {
            display: flex;
            gap: 10px;
        }

        .header-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 16px;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .header-btn:hover {
            color: var(--text-primary);
            background-color: var(--card-bg);
        }

        /* Sidebar Styles */
        .sidebar {
            position: fixed;
            left: 0;
            top: 60px;
            width: 280px;
            height: calc(100vh - 60px);
            background-color: var(--secondary-bg);
            border-right: 1px solid var(--border-color);
            padding: 20px;
            transform: translateX(0);
            transition: transform 0.3s ease;
            z-index: 999;
            overflow-y: auto;
        }

        .sidebar.collapsed {
            transform: translateX(-100%);
        }

        .sidebar-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: var(--text-primary);
        }

        .create-dashboard-btn {
            width: 100%;
            padding: 12px;
            background-color: var(--accent-green);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .create-dashboard-btn:hover {
            background-color: #22c55e;
            transform: translateY(-1px);
        }

        .search-box {
            position: relative;
            margin-bottom: 20px;
        }

        .search-input {
            width: 100%;
            padding: 10px 40px 10px 12px;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
        }

        .search-input::placeholder {
            color: var(--text-secondary);
        }

        .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }

        .dashboard-list {
            list-style: none;
        }

        .dashboard-item {
            padding: 12px;
            margin-bottom: 8px;
            background-color: var(--card-bg);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dashboard-item:hover {
            background-color: var(--border-color);
            border-left-color: var(--accent-green);
        }

        .dashboard-item.active {
            background-color: var(--accent-green);
            color: white;
        }

        .dashboard-item-content {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .dashboard-item-name {
            font-weight: 500;
            margin-bottom: 2px;
        }

        .dashboard-item-order {
            font-size: 11px;
            color: var(--text-secondary);
        }

        .dashboard-item.active .dashboard-item-order {
            color: rgba(255, 255, 255, 0.7);
        }

        .dashboard-item-actions {
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .dashboard-item:hover .dashboard-item-actions {
            opacity: 1;
        }

        .dashboard-item-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            font-size: 12px;
        }

        .dashboard-item-btn:hover {
            background-color: var(--secondary-bg);
        }

        .empty-state {
            text-align: center;
            color: var(--text-secondary);
            font-style: italic;
            margin-top: 40px;
        }

        /* Main Content */
        .main-content {
            margin-left: 280px;
            margin-top: 60px;
            padding: 20px;
            min-height: calc(100vh - 60px);
            transition: margin-left 0.3s ease;
        }

        .main-content.expanded {
            margin-left: 0;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .dashboard-title {
            font-size: 28px;
            font-weight: 600;
        }

        .dashboard-actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .mode-toggle {
            display: flex;
            background-color: var(--card-bg);
            border-radius: 25px;
            padding: 2px;
            border: 1px solid var(--border-color);
        }

        .mode-btn {
            padding: 8px 16px;
            border: none;
            background: none;
            color: var(--text-secondary);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .mode-btn.active {
            background-color: var(--accent-green);
            color: white;
        }

        .add-widget-btn {
            padding: 10px 16px;
            background-color: var(--accent-green);
            border: none;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: none;
        }

        .add-widget-btn.show {
            display: block;
        }

        .add-widget-btn:hover {
            background-color: #22c55e;
        }

        .action-btn {
            padding: 8px 12px;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .action-btn:hover {
            background-color: var(--border-color);
        }

        .action-btn.danger {
            background-color: var(--danger-color);
            border-color: var(--danger-color);
            color: white;
        }

        .action-btn.danger:hover {
            background-color: #dc2626;
        }

        /* Empty Canvas */
        .empty-canvas {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            border: 2px dashed var(--border-color);
            border-radius: 12px;
            color: var(--text-secondary);
        }

        .empty-canvas i {
            font-size: 48px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-canvas h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }

        .empty-canvas p {
            text-align: center;
            max-width: 300px;
            line-height: 1.5;
        }

        /* GridStack Styles */
        .grid-stack {
            margin-top: 20px;
        }

        .grid-stack-item {
            border-radius: 12px;
            overflow: hidden;
        }

        .grid-stack-item-content {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .widget-title {
            font-size: 16px;
            font-weight: 600;
        }

        .widget-actions {
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .grid-stack-item:hover .widget-actions {
            opacity: 1;
        }

        .widget-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .widget-btn:hover {
            color: var(--text-primary);
            background-color: var(--secondary-bg);
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2000;
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--card-bg);
            border-radius: 12px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .form-row {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
            flex: 1;
        }

        .form-group.half {
            flex: 0.5;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .form-label.required::after {
            content: ' *';
            color: var(--danger-color);
        }

        .form-input {
            width: 100%;
            padding: 12px;
            background-color: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--accent-green);
        }

        .form-textarea {
            width: 100%;
            padding: 12px;
            background-color: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
            resize: vertical;
            min-height: 80px;
            transition: border-color 0.3s ease;
        }

        .form-textarea:focus {
            outline: none;
            border-color: var(--accent-green);
        }

        .form-select {
            width: 100%;
            padding: 12px;
            background-color: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
            cursor: pointer;
        }

        .form-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }

        .form-checkbox input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--accent-green);
        }

        .form-help {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 5px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .btn-primary {
            background-color: var(--accent-green);
            color: white;
        }

        .btn-primary:hover {
            background-color: #22c55e;
        }

        .btn-secondary {
            background-color: var(--secondary-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background-color: var(--border-color);
        }

        /* Widget Configuration Sections */
        .config-section {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .config-section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-primary);
        }

        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .color-picker {
            width: 40px;
            height: 35px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            background: transparent;
        }

        .unit-input-wrapper {
            display: flex;
            gap: 10px;
        }

        .unit-input-wrapper .form-input {
            flex: 2;
        }

        .unit-input-wrapper .form-select {
            flex: 1;
        }

        /* Widget Library Grid */
        .widget-library {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .widget-option {
            padding: 20px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: var(--card-bg);
        }

        .widget-option:hover {
            border-color: var(--accent-green);
            background-color: var(--secondary-bg);
        }

        .widget-option.selected {
            border-color: var(--accent-green);
            background-color: var(--accent-green);
            color: white;
        }

        .widget-option i {
            font-size: 32px;
            margin-bottom: 10px;
            color: var(--accent-green);
        }

        .widget-option.selected i {
            color: white;
        }

        .widget-option h4 {
            margin-bottom: 5px;
            font-size: 14px;
        }

        .widget-option p {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .widget-option.selected p {
            color: rgba(255, 255, 255, 0.8);
        }

        /* Notification */
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px 20px;
            max-width: 300px;
            z-index: 1500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            border-left: 4px solid var(--success-color);
        }

        .notification.error {
            border-left: 4px solid var(--danger-color);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .sidebar {
                width: 100%;
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
            }

            .header-info {
                display: none;
            }

            .dashboard-header {
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }

            .current-dashboard {
                font-size: 14px;
            }

            .form-row {
                flex-direction: column;
            }

            .modal-content {
                width: 95%;
                padding: 20px;
            }
        }

        /* Loading Animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid var(--text-secondary);
            border-radius: 50%;
            border-top-color: var(--accent-green);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Scrollbar Styles */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--secondary-bg);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary);
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-left">
            <button class="header-btn" id="sidebarToggle">
                <i class="fas fa-bars"></i>
            </button>
            <div class="logo">
                <i class="fas fa-leaf"></i>
                FieldMonitor
            </div>
            <div class="current-dashboard" id="currentDashboardName">No Dashboard Selected</div>
        </div>
        <div class="header-right">
            <div class="header-info">26 Jul, 2024 1:30 PM</div>
            <div class="header-actions">
                <button class="header-btn" id="importDashboard" title="Import Dashboard">
                    <i class="fas fa-file-import"></i>
                </button>
                <button class="header-btn" id="exportDashboard" title="Export Dashboard">
                    <i class="fas fa-file-export"></i>
                </button>
                <button class="header-btn" title="Grid View">
                    <i class="fas fa-th"></i>
                </button>
                <button class="header-btn" title="Share">
                    <i class="fas fa-share"></i>
                </button>
                <button class="header-btn" title="Security">
                    <i class="fas fa-lock"></i>
                </button>
                <button class="header-btn" title="Notifications">
                    <i class="fas fa-bell"></i>
                </button>
                <button class="header-btn" title="Comments">
                    <i class="fas fa-comment"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <h2 class="sidebar-title">SAHAYAK DASHBOARD</h2>
        <button class="create-dashboard-btn" id="createDashboardBtn">
            <i class="fas fa-plus"></i> Create Dashboard
        </button>
        
        <div class="search-box">
            <input type="text" class="search-input" placeholder="Search Dashboards" id="searchInput">
            <i class="fas fa-search search-icon"></i>
        </div>

        <ul class="dashboard-list" id="dashboardList">
            <!-- Dashboards will be added here dynamically -->
        </ul>

        <div class="empty-state" id="emptyState">
            <i class="fas fa-plus-circle"></i>
            <p>No dashboards yet. Create your first dashboard to get started.</p>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" id="mainContent">
        <div class="dashboard-header">
            <h1 class="dashboard-title" id="dashboardTitle">No Dashboard Selected</h1>
            <div class="dashboard-actions">
                <div class="mode-toggle">
                    <button class="mode-btn active" id="viewMode">VIEW</button>
                    <button class="mode-btn" id="editMode">EDIT</button>
                </div>
                <button class="add-widget-btn" id="addWidgetBtn">
                    <i class="fas fa-plus"></i> Add Widget
                </button>
                <button class="action-btn" id="saveBtn" style="display: none;">
                    <i class="fas fa-save"></i>
                </button>
                <button class="action-btn" id="settingsBtn">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="action-btn danger" id="deleteBtn" style="display: none;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <!-- Empty Canvas -->
        <div class="empty-canvas" id="emptyCanvas">
            <i class="fas fa-layer-group"></i>
            <h3>Your dashboard is empty</h3>
            <p>Add widgets to start monitoring your IoT devices. Switch to EDIT mode and click "Add Widget" to begin.</p>
        </div>

        <!-- GridStack Container -->
        <div class="grid-stack" id="gridStack" style="display: none;">
            <!-- Widgets will be added here dynamically -->
        </div>
    </main>

    <!-- Create Dashboard Modal -->
    <div class="modal" id="createDashboardModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Create New Dashboard</h3>
                <button class="close-btn" onclick="closeModal('createDashboardModal')">&times;</button>
            </div>
            <form id="createDashboardForm">
                <div class="form-group">
                    <label class="form-label required">Dashboard Name</label>
                    <input type="text" class="form-input" id="dashboardName" placeholder="Enter dashboard name" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" id="dashboardCategory">
                            <option value="agriculture">Agriculture</option>
                            <option value="industrial">Industrial</option>
                            <option value="home">Home Automation</option>
                            <option value="environmental">Environmental</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="form-group half">
                        <label class="form-label">Listing Order</label>
                        <input type="number" class="form-input" id="dashboardOrder" placeholder="1" min="1" max="100" value="1">
                        <div class="form-help">Order in which dashboard appears in the list (1-100)</div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="dashboardDescription" placeholder="Enter dashboard description"></textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('createDashboardModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Dashboard</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Widget Modal -->
    <div class="modal" id="addWidgetModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Add Widget</h3>
                <button class="close-btn" onclick="closeModal('addWidgetModal')">&times;</button>
            </div>
            
            <!-- Step 1: Widget Selection -->
            <div id="widgetSelectionStep">
                <h4 style="margin-bottom: 15px; color: var(--text-primary);">Select Widget Type</h4>
                <div class="widget-library">
                    <div class="widget-option" data-widget="gauge">
                        <i class="fas fa-tachometer-alt"></i>
                        <h4>Gauge</h4>
                        <p>Display numerical values with visual gauge</p>
                    </div>
                    <div class="widget-option" data-widget="chart">
                        <i class="fas fa-chart-line"></i>
                        <h4>Line Chart</h4>
                        <p>Show trends over time</p>
                    </div>
                    <div class="widget-option" data-widget="metric">
                        <i class="fas fa-calculator"></i>
                        <h4>Metric</h4>
                        <p>Simple numerical display</p>
                    </div>
                    <div class="widget-option" data-widget="toggle">
                        <i class="fas fa-toggle-on"></i>
                        <h4>Toggle</h4>
                                                <p>ON/OFF control switch</p>
                    </div>
                    <div class="widget-option" data-widget="slider">
                        <i class="fas fa-sliders-h"></i>
                        <h4>Slider</h4>
                        <p>Adjustable value control</p>
                    </div>
                    <div class="widget-option" data-widget="map">
                        <i class="fas fa-map"></i>
                        <h4>Map</h4>
                        <p>Location visualization</p>
                    </div>
                    <div class="widget-option" data-widget="pie">
                        <i class="fas fa-chart-pie"></i>
                        <h4>Pie Chart</h4>
                        <p>Percentage distribution</p>
                    </div>
                    <div class="widget-option" data-widget="table">
                        <i class="fas fa-table"></i>
                        <h4>Data Table</h4>
                        <p>Structured data display</p>
                    </div>
                    <div class="widget-option" data-widget="status">
                        <i class="fas fa-info-circle"></i>
                        <h4>Status</h4>
                        <p>Show status indicators</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('addWidgetModal')">Cancel</button>
                    <button type="button" class="btn btn-primary" id="nextStepBtn" disabled onclick="showWidgetConfig()">Next: Configure</button>
                </div>
            </div>

            <!-- Step 2: Widget Configuration -->
            <div id="widgetConfigStep" style="display: none;">
                <form id="widgetConfigForm">
                    <!-- Basic Configuration -->
                    <div class="config-section">
                        <div class="config-section-title">Basic Settings</div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required">Widget Title</label>
                                <input type="text" class="form-input" id="widgetTitle" placeholder="Enter widget title" required>
                            </div>
                            <div class="form-group half">
                                <label class="form-label">Data Source</label>
                                <select class="form-select" id="widgetDataSource">
                                    <option value="sensor1">Temperature Sensor</option>
                                    <option value="sensor2">Humidity Sensor</option>
                                    <option value="sensor3">Water Level Sensor</option>
                                    <option value="sensor4">Soil Moisture</option>
                                    <option value="manual">Manual Input</option>
                                    <option value="api">API Endpoint</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <input type="text" class="form-input" id="widgetDescription" placeholder="Brief description of this widget">
                            </div>
                            <div class="form-group half">
                                <label class="form-label">Update Interval (sec)</label>
                                <select class="form-select" id="widgetUpdateInterval">
                                    <option value="5">5 seconds</option>
                                    <option value="10">10 seconds</option>
                                    <option value="30" selected>30 seconds</option>
                                    <option value="60">1 minute</option>
                                    <option value="300">5 minutes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Size & Position -->
                    <div class="config-section">
                        <div class="config-section-title">Size & Position</div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Width (Grid Units)</label>
                                <select class="form-select" id="widgetWidth">
                                    <option value="1">1 unit</option>
                                    <option value="2">2 units</option>
                                    <option value="3" selected>3 units</option>
                                    <option value="4">4 units</option>
                                    <option value="6">6 units</option>
                                    <option value="12">12 units (Full width)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Height (Grid Units)</label>
                                <select class="form-select" id="widgetHeight">
                                    <option value="2">2 units</option>
                                    <option value="3" selected>3 units</option>
                                    <option value="4">4 units</option>
                                    <option value="5">5 units</option>
                                    <option value="6">6 units</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Widget-Specific Configuration -->
                    <div id="specificConfig">
                        <!-- Gauge Configuration -->
                        <div class="config-section widget-config" data-widget="gauge" style="display: none;">
                            <div class="config-section-title">Gauge Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Minimum Value</label>
                                    <input type="number" class="form-input" id="gaugeMin" value="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Maximum Value</label>
                                    <input type="number" class="form-input" id="gaugeMax" value="100">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Current Value</label>
                                    <input type="number" class="form-input" id="gaugeValue" value="50">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Unit</label>
                                    <input type="text" class="form-input" id="gaugeUnit" placeholder="%, °C, L, etc.">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Color</label>
                                    <div class="color-picker-wrapper">
                                        <input type="color" class="color-picker" id="gaugeColor" value="#4ade80">
                                        <span>Gauge color</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Metric Configuration -->
                        <div class="config-section widget-config" data-widget="metric" style="display: none;">
                            <div class="config-section-title">Metric Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Value</label>
                                    <div class="unit-input-wrapper">
                                        <input type="number" class="form-input" id="metricValue" placeholder="42" step="any">
                                        <select class="form-select" id="metricUnit">
                                            <option value="">No unit</option>
                                            <option value="°C">°C</option>
                                            <option value="°F">°F</option>
                                            <option value="%">%</option>
                                            <option value="L">Liters</option>
                                            <option value="kg">Kilograms</option>
                                            <option value="ppm">PPM</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Decimal Places</label>
                                    <select class="form-select" id="metricDecimals">
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" selected>2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Value Color</label>
                                    <div class="color-picker-wrapper">
                                        <input type="color" class="color-picker" id="metricColor" value="#4ade80">
                                        <span>Text color for the value</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Font Size</label>
                                    <select class="form-select" id="metricFontSize">
                                        <option value="24">Small (24px)</option>
                                        <option value="32">Medium (32px)</option>
                                        <option value="48" selected>Large (48px)</option>
                                        <option value="64">Extra Large (64px)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Toggle Configuration -->
                        <div class="config-section widget-config" data-widget="toggle" style="display: none;">
                            <div class="config-section-title">Toggle Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Default State</label>
                                    <select class="form-select" id="toggleState">
                                        <option value="false">OFF</option>
                                        <option value="true">ON</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Control Type</label>
                                    <select class="form-select" id="toggleType">
                                        <option value="manual">Manual Control</option>
                                        <option value="automated">Automated</option>
                                        <option value="readonly">Read Only</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">ON Label</label>
                                    <input type="text" class="form-input" id="toggleOnLabel" value="ON">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">OFF Label</label>
                                    <input type="text" class="form-input" id="toggleOffLabel" value="OFF">
                                </div>
                            </div>
                        </div>

                        <!-- Chart Configuration -->
                        <div class="config-section widget-config" data-widget="chart" style="display: none;">
                            <div class="config-section-title">Chart Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Chart Type</label>
                                    <select class="form-select" id="chartType">
                                        <option value="line">Line Chart</option>
                                        <option value="bar">Bar Chart</option>
                                        <option value="area">Area Chart</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Time Range</label>
                                    <select class="form-select" id="chartTimeRange">
                                        <option value="1h">Last 1 Hour</option>
                                        <option value="6h">Last 6 Hours</option>
                                        <option value="24h" selected>Last 24 Hours</option>
                                        <option value="7d">Last 7 Days</option>
                                        <option value="30d">Last 30 Days</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Line Color</label>
                                    <div class="color-picker-wrapper">
                                        <input type="color" class="color-picker" id="chartColor" value="#4ade80">
                                        <span>Chart line/bar color</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-checkbox">
                                        <input type="checkbox" id="chartShowGrid" checked>
                                        <label>Show Grid Lines</label>
                                    </div>
                                    <div class="form-checkbox">
                                        <input type="checkbox" id="chartShowPoints" checked>
                                        <label>Show Data Points</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Map Configuration -->
                        <div class="config-section widget-config" data-widget="map" style="display: none;">
                            <div class="config-section-title">Map Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Latitude</label>
                                    <input type="number" class="form-input" id="mapLat" placeholder="0.0" step="any">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Longitude</label>
                                    <input type="number" class="form-input" id="mapLng" placeholder="0.0" step="any">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Zoom Level</label>
                                    <select class="form-select" id="mapZoom">
                                        <option value="10">City Level (10)</option>
                                        <option value="15" selected>Street Level (15)</option>
                                        <option value="18">Building Level (18)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Marker Color</label>
                                    <div class="color-picker-wrapper">
                                        <input type="color" class="color-picker" id="mapMarkerColor" value="#4ade80">
                                        <span>Location marker color</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Slider Configuration -->
                        <div class="config-section widget-config" data-widget="slider" style="display: none;">
                            <div class="config-section-title">Slider Settings</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Minimum Value</label>
                                    <input type="number" class="form-input" id="sliderMin" value="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Maximum Value</label>
                                    <input type="number" class="form-input" id="sliderMax" value="100">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Step Size</label>
                                    <input type="number" class="form-input" id="sliderStep" value="1">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Default Value</label>
                                    <input type="number" class="form-input" id="sliderValue" value="50">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Orientation</label>
                                    <select class="form-select" id="sliderOrientation">
                                        <option value="vertical" selected>Vertical</option>
                                        <option value="horizontal">Horizontal</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Alerts Configuration -->
                    <div class="config-section">
                        <div class="config-section-title">Alerts & Thresholds</div>
                        <div class="form-checkbox">
                            <input type="checkbox" id="enableAlerts">
                            <label>Enable Alerts</label>
                        </div>
                        <div id="alertsConfig" style="display: none; margin-top: 15px;">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">High Threshold</label>
                                    <input type="number" class="form-input" id="highThreshold" placeholder="Enter high limit">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Low Threshold</label>
                                    <input type="number" class="form-input" id="lowThreshold" placeholder="Enter low limit">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Alert Message</label>
                                <input type="text" class="form-input" id="alertMessage" placeholder="Value out of range">
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="showWidgetSelection()">Back</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal('addWidgetModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Widget</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal" id="settingsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Dashboard Settings</h3>
                <button class="close-btn" onclick="closeModal('settingsModal')">&times;</button>
            </div>
            <div class="config-section">
                <div class="config-section-title">Theme</div>
                <div style="display: flex; gap: 15px;">
                    <div class="widget-option theme-option" data-theme="dark" style="flex: 1; padding: 15px;">
                        <i class="fas fa-moon"></i>
                        <h4>Dark Mode</h4>
                        <p>Dark theme for better focus</p>
                    </div>
                    <div class="widget-option theme-option" data-theme="light" style="flex: 1; padding: 15px;">
                        <i class="fas fa-sun"></i>
                        <h4>Light Mode</h4>
                        <p>Light theme for daytime use</p>
                    </div>
                </div>
            </div>
            <div class="config-section">
                <div class="config-section-title">Dashboard Settings</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Auto-Save</label>
                        <select class="form-select">
                            <option value="enabled" selected>Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Grid Snap</label>
                        <select class="form-select">
                            <option value="10">10px</option>
                            <option value="20" selected>20px</option>
                            <option value="30">30px</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal('settingsModal')">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="saveSettings()">Save Settings</button>
            </div>
        </div>
    </div>

    <!-- Hidden file input for import -->
    <input type="file" id="importFileInput" class="file-input" accept=".json" />

    <!-- Notification Container -->
    <div class="notification" id="notification">
        <div id="notificationMessage"></div>
    </div>

    <script>
        // Global Variables
        let grid;
        let currentDashboard = null;
        let isEditMode = false;
        let dashboards = {};
        let widgetCounter = 0;
        let selectedWidgetType = null;

        // Initialize Application
        document.addEventListener('DOMContentLoaded', function() {
            initializeGridStack();
            initializeEventListeners();
            updateDateTime();
            setInterval(updateDateTime, 60000);
            loadTheme();
            updateUI();
        });

        // GridStack Initialization
        function initializeGridStack() {
            grid = GridStack.init({
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
            });

            grid.on('dragstop', function(event, element) {
                if (isEditMode) {
                    showNotification('Widget position updated', 'success');
                    saveDashboardState();
                }
            });

            grid.on('resizestop', function(event, element) {
                if (isEditMode) {
                    showNotification('Widget resized', 'success');
                    saveDashboardState();
                }
            });

            toggleGridEditMode(false);
        }

        // Event Listeners
        function initializeEventListeners() {
            // Sidebar toggle
            document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
            
            // Mode toggle
            document.getElementById('viewMode').addEventListener('click', () => setMode('view'));
            document.getElementById('editMode').addEventListener('click', () => setMode('edit'));
            
            // Dashboard actions
            document.getElementById('saveBtn').addEventListener('click', saveDashboard);
            document.getElementById('deleteBtn').addEventListener('click', deleteDashboard);
            document.getElementById('settingsBtn').addEventListener('click', openSettings);
            document.getElementById('addWidgetBtn').addEventListener('click', openAddWidgetModal);
            
            // Create dashboard
            document.getElementById('createDashboardBtn').addEventListener('click', openCreateDashboardModal);
            document.getElementById('createDashboardForm').addEventListener('submit', createDashboard);
            
            // Widget configuration
            document.getElementById('widgetConfigForm').addEventListener('submit', addConfiguredWidget);
            
            // Import/Export
            document.getElementById('importDashboard').addEventListener('click', importDashboard);
            document.getElementById('exportDashboard').addEventListener('click', exportDashboard);
            document.getElementById('importFileInput').addEventListener('change', handleImportFile);
            
            // Search functionality
            document.getElementById('searchInput').addEventListener('input', filterDashboards);
            
            // Widget type selection
            document.querySelectorAll('.widget-option').forEach(option => {
                option.addEventListener('click', function() {
                    selectWidgetType(this.getAttribute('data-widget'));
                });
            });

            // Theme selector
            document.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', function() {
                    const theme = this.getAttribute('data-theme');
                    setTheme(theme);
                });
            });

            // Enable alerts checkbox
            document.getElementById('enableAlerts').addEventListener('change', function() {
                document.getElementById('alertsConfig').style.display = this.checked ? 'block' : 'none';
            });
        }

        // Dashboard Management Functions
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }

        function setMode(mode) {
            isEditMode = mode === 'edit';
            
            document.getElementById('viewMode').classList.toggle('active', mode === 'view');
            document.getElementById('editMode').classList.toggle('active', mode === 'edit');
            
            document.getElementById('saveBtn').style.display = isEditMode ? 'block' : 'none';
            document.getElementById('deleteBtn').style.display = currentDashboard ? 'block' : 'none';
            document.getElementById('addWidgetBtn').classList.toggle('show', isEditMode && currentDashboard);
            
            toggleGridEditMode(isEditMode);
            showNotification(`${mode.toUpperCase()} mode activated`, 'success');
        }

        function toggleGridEditMode(enabled) {
            if (grid) {
                grid.enableMove(enabled);
                grid.enableResize(enabled);
                
                document.querySelectorAll('.grid-stack-item-content').forEach(item => {
                    item.style.cursor = enabled ? 'move' : 'default';
                });
            }
        }

        function createDashboard(e) {
            e.preventDefault();
            
            const name = document.getElementById('dashboardName').value.trim();
            const description = document.getElementById('dashboardDescription').value.trim();
            const category = document.getElementById('dashboardCategory').value;
            const order = parseInt(document.getElementById('dashboardOrder').value) || 1;
            
            if (!name) {
                showNotification('Dashboard name is required', 'error');
                return;
            }
            
            const dashboardId = generateDashboardId(name);
            
            dashboards[dashboardId] = {
                id: dashboardId,
                name,
                description,
                category,
                order,
                widgets: [],
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            addDashboardToSidebar(dashboardId, dashboards[dashboardId]);
            sortDashboardList();
            
            closeModal('createDashboardModal');
            loadDashboard(dashboardId);
            
            document.getElementById('createDashboardForm').reset();
            document.getElementById('dashboardOrder').value = getNextOrderNumber();
            
            showNotification(`Dashboard "${name}" created successfully`, 'success');
        }

        function addDashboardToSidebar(dashboardId, dashboard) {
            const dashboardList = document.getElementById('dashboardList');
            const emptyState = document.getElementById('emptyState');
            
            emptyState.style.display = 'none';
            
            const newItem = document.createElement('li');
            newItem.className = 'dashboard-item';
            newItem.setAttribute('data-dashboard', dashboardId);
            newItem.setAttribute('data-order', dashboard.order);
            newItem.innerHTML = `
                <div class="dashboard-item-content">
                    <div class="dashboard-item-name">${dashboard.name}</div>
                    <div class="dashboard-item-order">Order: ${dashboard.order}</div>
                </div>
                <div class="dashboard-item-actions">
                    <button class="dashboard-item-btn" onclick="editDashboardName('${dashboardId}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="dashboard-item-btn" onclick="deleteDashboardFromSidebar('${dashboardId}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            newItem.addEventListener('click', function(e) {
                if (!e.target.closest('.dashboard-item-actions')) {
                    loadDashboard(dashboardId);
                }
            });
            
            dashboardList.appendChild(newItem);
        }

        function sortDashboardList() {
            const dashboardList = document.getElementById('dashboardList');
            const items = Array.from(dashboardList.children);
            
            items.sort((a, b) => {
                const orderA = parseInt(a.getAttribute('data-order')) || 999;
                const orderB = parseInt(b.getAttribute('data-order')) || 999;
                return orderA - orderB;
            });
            
            items.forEach(item => dashboardList.appendChild(item));
        }

        function getNextOrderNumber() {
            const orders = Object.values(dashboards).map(d => d.order || 1);
            return orders.length > 0 ? Math.max(...orders) + 1 : 1;
        }

        function loadDashboard(dashboardId) {
            if (!dashboards[dashboardId]) return;
            
            currentDashboard = dashboardId;
            
            document.querySelectorAll('.dashboard-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-dashboard') === dashboardId);
            });
            
            const dashboard = dashboards[dashboardId];
            document.getElementById('dashboardTitle').textContent = dashboard.name;
            document.getElementById('currentDashboardName').textContent = dashboard.name;
            
            if (grid) {
                grid.removeAll();
            }
            
            if (dashboard.widgets && dashboard.widgets.length > 0) {
                dashboard.widgets.forEach(widget => {
                    createWidgetElement(widget);
                });
                showCanvas();
            } else {
                showEmptyCanvas();
            }
            
            updateUI();
            showNotification(`Dashboard "${dashboard.name}" loaded`, 'success');
        }

        // Widget Management
        function openAddWidgetModal() {
            if (!currentDashboard) {
                showNotification('Please select a dashboard first', 'error');
                return;
            }
            
            selectedWidgetType = null;
            showWidgetSelection();
            document.getElementById('addWidgetModal').style.display = 'block';
        }

        function selectWidgetType(type) {
            selectedWidgetType = type;
            
            // Update UI selection
            document.querySelectorAll('.widget-option').forEach(option => {
                option.classList.toggle('selected', option.getAttribute('data-widget') === type);
            });
            
            document.getElementById('nextStepBtn').disabled = false;
        }

        function showWidgetSelection() {
            document.getElementById('widgetSelectionStep').style.display = 'block';
            document.getElementById('widgetConfigStep').style.display = 'none';
            
            // Reset selection
            document.querySelectorAll('.widget-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.getElementById('nextStepBtn').disabled = true;
        }

        function showWidgetConfig() {
            if (!selectedWidgetType) return;
            
            document.getElementById('widgetSelectionStep').style.display = 'none';
            document.getElementById('widgetConfigStep').style.display = 'block';
            
            // Hide all widget-specific configurations
            document.querySelectorAll('.widget-config').forEach(config => {
                config.style.display = 'none';
            });
            
            // Show specific configuration for selected widget type
            const specificConfig = document.querySelector(`.widget-config[data-widget="${selectedWidgetType}"]`);
            if (specificConfig) {
                specificConfig.style.display = 'block';
            }
            
            // Set default widget title
            const defaultTitles = {
                gauge: 'Gauge Widget',
                chart: 'Chart Widget',
                metric: 'Metric Widget',
                toggle: 'Toggle Control',
                slider: 'Slider Control',
                map: 'Location Map',
                pie: 'Pie Chart',
                table: 'Data Table',
                status: 'Status Widget'
            };
            
            document.getElementById('widgetTitle').value = defaultTitles[selectedWidgetType] || 'New Widget';
            
            // Set default size based on widget type
            const defaultSizes = {
                gauge: { w: 3, h: 3 },
                chart: { w: 6, h: 4 },
                metric: { w: 2, h: 2 },
                toggle: { w: 2, h: 2 },
                slider: { w: 2, h: 3 },
                map: { w: 4, h: 3 },
                pie: { w: 3, h: 3 },
                table: { w: 4, h: 3 },
                status: { w: 3, h: 2 }
            };
            
            const size = defaultSizes[selectedWidgetType] || { w: 3, h: 3 };
            document.getElementById('widgetWidth').value = size.w;
            document.getElementById('widgetHeight').value = size.h;
        }

        function addConfiguredWidget(e) {
            e.preventDefault();
            
            if (!currentDashboard || !selectedWidgetType) return;
            
            widgetCounter++;
            const widgetId = `widget-${selectedWidgetType}-${widgetCounter}`;
            
            // Collect basic configuration
            const basicConfig = {
                title: document.getElementById('widgetTitle').value,
                description: document.getElementById('widgetDescription').value,
                dataSource: document.getElementById('widgetDataSource').value,
                updateInterval: parseInt(document.getElementById('widgetUpdateInterval').value),
                width: parseInt(document.getElementById('widgetWidth').value),
                height: parseInt(document.getElementById('widgetHeight').value)
            };
            
            // Collect widget-specific configuration
            const specificConfig = collectSpecificConfig(selectedWidgetType);
            
            // Collect alerts configuration
            const alertsConfig = {
                enabled: document.getElementById('enableAlerts').checked,
                highThreshold: parseFloat(document.getElementById('highThreshold').value) || null,
                lowThreshold: parseFloat(document.getElementById('lowThreshold').value) || null,
                message: document.getElementById('alertMessage').value || 'Value out of range'
            };
            
            const widget = {
                id: widgetId,
                type: selectedWidgetType,
                x: 0,
                y: 0,
                w: basicConfig.width,
                h: basicConfig.height,
                config: {
                    ...basicConfig,
                    ...specificConfig,
                    alerts: alertsConfig
                }
            };
            
            createWidgetElement(widget);
            showCanvas();
            saveDashboardState();
            
            closeModal('addWidgetModal');
            showNotification(`${basicConfig.title} added successfully`, 'success');
        }

        function collectSpecificConfig(widgetType) {
            const config = {};
            
            switch(widgetType) {
                case 'gauge':
                    config.min = parseFloat(document.getElementById('gaugeMin').value) || 0;
                    config.max = parseFloat(document.getElementById('gaugeMax').value) || 100;
                    config.value = parseFloat(document.getElementById('gaugeValue').value) || 50;
                    config.unit = document.getElementById('gaugeUnit').value || '';
                    config.color = document.getElementById('gaugeColor').value || '#4ade80';
                    break;
                    
                case 'metric':
                    config.value = parseFloat(document.getElementById('metricValue').value) || 0;
                    config.unit = document.getElementById('metricUnit').value || '';
                    config.decimals = parseInt(document.getElementById('metricDecimals').value) || 2;
                    config.color = document.getElementById('metricColor').value || '#4ade80';
                    config.fontSize = parseInt(document.getElementById('metricFontSize').value) || 48;
                    break;
                    
                case 'toggle':
                    config.state = document.getElementById('toggleState').value === 'true';
                    config.type = document.getElementById('toggleType').value || 'manual';
                    config.onLabel = document.getElementById('toggleOnLabel').value || 'ON';
                    config.offLabel = document.getElementById('toggleOffLabel').value || 'OFF';
                    break;
                    
                case 'chart':
                    config.chartType = document.getElementById('chartType').value || 'line';
                    config.timeRange = document.getElementById('chartTimeRange').value || '24h';
                    config.color = document.getElementById('chartColor').value || '#4ade80';
                    config.showGrid = document.getElementById('chartShowGrid').checked;
                    config.showPoints = document.getElementById('chartShowPoints').checked;
                    break;
                    
                case 'map':
                    config.lat = parseFloat(document.getElementById('mapLat').value) || 0;
                    config.lng = parseFloat(document.getElementById('mapLng').value) || 0;
                    config.zoom = parseInt(document.getElementById('mapZoom').value) || 15;
                    config.markerColor = document.getElementById('mapMarkerColor').value || '#4ade80';
                    break;
                    
                case 'slider':
                    config.min = parseFloat(document.getElementById('sliderMin').value) || 0;
                    config.max = parseFloat(document.getElementById('sliderMax').value) || 100;
                    config.step = parseFloat(document.getElementById('sliderStep').value) || 1;
                    config.value = parseFloat(document.getElementById('sliderValue').value) || 50;
                    config.orientation = document.getElementById('sliderOrientation').value || 'vertical';
                    break;
            }
            
            return config;
        }

        function createWidgetElement(widget) {
            const widgetElement = document.createElement('div');
            widgetElement.className = 'grid-stack-item';
            widgetElement.setAttribute('data-widget-id', widget.id);
            widgetElement.setAttribute('data-widget-type', widget.type);
            widgetElement.setAttribute('data-widget-config', JSON.stringify(widget.config));
            widgetElement.setAttribute('gs-x', widget.x);
            widgetElement.setAttribute('gs-y', widget.y);
            widgetElement.setAttribute('gs-w', widget.w);
            widgetElement.setAttribute('gs-h', widget.h);
            
            const content = createWidgetContent(widget.type, widget.config);
            widgetElement.innerHTML = `<div class="grid-stack-item-content">${content}</div>`;
            
            if (grid) {
                grid.addWidget(widgetElement);
            }
        }

        function createWidgetContent(type, config) {
            const widgetName = config.title || getDefaultWidgetConfig(type).name;
            
            switch(type) {
                case 'gauge':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="text-align: center; padding: 20px;">
                            <div style="font-size: 48px; color: ${config.color || '#4ade80'}; margin-bottom: 10px;">
                                ${(config.value || 75).toFixed(0)}${config.unit || '%'}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 14px;">
                                Range: ${config.min || 0} - ${config.max || 100}
                            </div>
                            ${config.description ? `<div style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">${config.description}</div>` : ''}
                        </div>
                    `;
                
                case 'metric':
                    const formattedValue = (config.value || 42).toFixed(config.decimals || 2);
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="text-align: center; padding: 20px;">
                            <div style="font-size: ${config.fontSize || 48}px; color: ${config.color || '#4ade80'}; margin-bottom: 5px;">
                                ${formattedValue}${config.unit || ''}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 14px;">
                                ${config.dataSource || 'Manual Input'}
                            </div>
                            ${config.description ? `<div style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">${config.description}</div>` : ''}
                        </div>
                    `;
                
                case 'toggle':
                    const isOn = config.state || false;
                    const isReadonly = config.type === 'readonly';
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="text-align: center; padding: 20px;">
                            <div class="toggle-switch ${isOn ? 'active' : ''}" ${!isReadonly ? 'onclick="toggleWidget(this)"' : ''} style="margin: 0 auto; ${isReadonly ? 'opacity: 0.7; cursor: not-allowed;' : ''}">
                                <div class="toggle-handle"></div>
                            </div>
                            <div style="margin-top: 15px; font-weight: bold; font-size: 16px;">
                                ${isOn ? (config.onLabel || 'ON') : (config.offLabel || 'OFF')}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">
                                ${config.type === 'automated' ? 'Automated' : config.type === 'readonly' ? 'Read Only' : 'Manual Control'}
                            </div>
                            ${config.description ? `<div style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">${config.description}</div>` : ''}
                        </div>
                    `;
                
                case 'chart':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="height: calc(100% - 60px); padding: 10px;">
                            <canvas id="chart-${Date.now()}"></canvas>
                        </div>
                    `;
                
                case 'map':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="height: calc(100% - 60px); background: var(--secondary-bg); border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-map-marker-alt" style="color: ${config.markerColor || '#4ade80'}; font-size: 32px;"></i>
                            <div style="position: absolute; bottom: 10px; left: 10px; font-size: 12px; color: var(--text-secondary);">
                                ${config.lat || 0}, ${config.lng || 0}
                            </div>
                        </div>
                    `;
                
                case 'slider':
                    const percentage = ((config.value - config.min) / (config.max - config.min)) * 100;
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="padding: 20px; display: flex; ${config.orientation === 'horizontal' ? 'flex-direction: row; align-items: center;' : 'flex-direction: column; align-items: center; justify-content: center;'}">
                            <div style="font-size: 24px; font-weight: bold; color: var(--accent-green); ${config.orientation === 'horizontal' ? 'margin-right: 15px;' : 'margin-bottom: 15px;'}">
                                ${config.value || 50}
                            </div>
                            <div class="slider-container" style="${config.orientation === 'horizontal' ? 'width: 100px; height: 6px; flex: 1;' : 'height: 100px; width: 6px;'}">
                                <div class="slider-track" style="${config.orientation === 'horizontal' ? `width: ${percentage}%;` : `height: ${percentage}%;`}"></div>
                                <div class="slider-handle" style="${config.orientation === 'horizontal' ? `left: ${percentage}%;` : `bottom: ${percentage}%;`}"></div>
                            </div>
                            <div style="color: var(--text-secondary); font-size: 12px; ${config.orientation === 'horizontal' ? 'margin-left: 15px;' : 'margin-top: 10px;'}">
                                ${config.min || 0} - ${config.max || 100}
                            </div>
                        </div>
                    `;
                
                case 'pie':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; height: calc(100% - 60px);">
                            <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--accent-green) 0deg ${(config.value || 65) * 3.6}deg, var(--secondary-bg) ${(config.value || 65) * 3.6}deg 360deg); display: flex; align-items: center; justify-content: center; position: relative;">
                                <div style="width: 80px; height: 80px; background-color: var(--card-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span style="font-size: 24px; font-weight: bold;">${config.value || 65}%</span>
                                </div>
                            </div>
                        </div>
                    `;
                
                case 'table':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="height: calc(100% - 60px); overflow-y: auto;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: var(--secondary-bg);">
                                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Name</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Temperature</td><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">25°C</td></tr>
                                    <tr><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Humidity</td><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">60%</td></tr>
                                    <tr><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Pressure</td><td style="padding: 6px; border-bottom: 1px solid var(--border-color);">1013 hPa</td></tr>
                                </tbody>
                            </table>
                        </div>
                    `;
                
                case 'status':
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="padding: 20px; display: flex; align-items: center; justify-content: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: var(--success-color); animation: pulse 2s infinite;"></div>
                                <span style="font-size: 18px; font-weight: 500;">Online</span>
                            </div>
                        </div>
                    `;
                
                default:
                    return `
                        <div class="widget-header">
                            <span class="widget-title">${widgetName}</span>
                            <div class="widget-actions">
                                <button class="widget-btn" onclick="editWidget(this)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="widget-btn" onclick="deleteWidget(this)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                            <i class="fas fa-cube" style="font-size: 48px; margin-bottom: 10px;"></i>
                            <div>${type} Widget</div>
                        </div>
                    `;
            }
        }

        function getDefaultWidgetConfig(type) {
            const configs = {
                gauge: { name: 'Gauge Widget', defaultSize: { w: 3, h: 3 } },
                chart: { name: 'Chart Widget', defaultSize: { w: 6, h: 4 } },
                metric: { name: 'Metric Widget', defaultSize: { w: 2, h: 2 } },
                toggle: { name: 'Toggle Widget', defaultSize: { w: 2, h: 2 } },
                slider: { name: 'Slider Widget', defaultSize: { w: 2, h: 3 } },
                map: { name: 'Map Widget', defaultSize: { w: 4, h: 3 } },
                pie: { name: 'Pie Chart', defaultSize: { w: 3, h: 3 } },
                table: { name: 'Data Table', defaultSize: { w: 4, h: 3 } },
                status: { name: 'Status Widget', defaultSize: { w: 3, h: 2 } }
            };
            
            return configs[type] || configs.metric;
        }

        function deleteWidget(button) {
            if (!isEditMode) return;
            
            const widgetElement = button.closest('.grid-stack-item');
            const widgetConfig = JSON.parse(widgetElement.getAttribute('data-widget-config'));
            
            if (confirm(`Are you sure you want to delete "${widgetConfig.title}"?`)) {
                if (grid && widgetElement) {
                    grid.removeWidget(widgetElement);
                    showNotification('Widget removed', 'success');
                    
                    if (grid.engine.nodes.length === 0) {
                        showEmptyCanvas();
                    }
                    
                    saveDashboardState();
                }
            }
        }

        function editWidget(button) {
            showNotification('Widget editor coming soon', 'success');
        }

        function toggleWidget(toggleElement) {
            if (!isEditMode) return;
            
            toggleElement.classList.toggle('active');
            const widgetElement = toggleElement.closest('.grid-stack-item');
            const config = JSON.parse(widgetElement.getAttribute('data-widget-config'));
            
            // Update the label
            const labelElement = toggleElement.parentElement.querySelector('div:nth-child(2)');
            if (labelElement) {
                labelElement.textContent = toggleElement.classList.contains('active') ? 
                    (config.onLabel || 'ON') : (config.offLabel || 'OFF');
            }
            
            // Update config
            config.state = toggleElement.classList.contains('active');
            widgetElement.setAttribute('data-widget-config', JSON.stringify(config));
            
            saveDashboardState();
            showNotification('Toggle updated', 'success');
        }

        // Dashboard Management
        function deleteDashboard() {
            if (!currentDashboard) return;
            
            const dashboard = dashboards[currentDashboard];
            if (confirm(`Are you sure you want to delete "${dashboard.name}"?`)) {
                delete dashboards[currentDashboard];
                
                const dashboardItem = document.querySelector(`[data-dashboard="${currentDashboard}"]`);
                if (dashboardItem) {
                    dashboardItem.remove();
                }
                
                if (Object.keys(dashboards).length === 0) {
                    document.getElementById('emptyState').style.display = 'block';
                }
                
                currentDashboard = null;
                updateUI();
                
                showNotification('Dashboard deleted', 'success');
            }
        }

        function deleteDashboardFromSidebar(dashboardId) {
            event.stopPropagation();
            
            const dashboard = dashboards[dashboardId];
            if (confirm(`Are you sure you want to delete "${dashboard.name}"?`)) {
                delete dashboards[dashboardId];
                
                const dashboardItem = document.querySelector(`[data-dashboard="${dashboardId}"]`);
                if (dashboardItem) {
                    dashboardItem.remove();
                }
                
                if (currentDashboard === dashboardId) {
                    currentDashboard = null;
                    updateUI();
                }
                
                if (Object.keys(dashboards).length === 0) {
                    document.getElementById('emptyState').style.display = 'block';
                }
                
                showNotification('Dashboard deleted', 'success');
            }
        }

        function saveDashboard() {
            if (!currentDashboard) return;
            
            saveDashboardState();
            showNotification('Dashboard saved successfully', 'success');
        }

        function saveDashboardState() {
            if (!currentDashboard || !grid) return;
            
            const widgets = [];
            grid.engine.nodes.forEach(node => {
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
            
            dashboards[currentDashboard].widgets = widgets;
            dashboards[currentDashboard].lastModified = new Date().toISOString();
        }

        // Import/Export Functions
        function importDashboard() {
            document.getElementById('importFileInput').click();
        }

        function handleImportFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const dashboardData = JSON.parse(e.target.result);
                    
                    if (!dashboardData.name || !dashboardData.id) {
                        throw new Error('Invalid dashboard file format');
                    }
                    
                    let newId = dashboardData.id;
                    if (dashboards[newId]) {
                        newId = generateDashboardId(dashboardData.name);
                        dashboardData.id = newId;
                    }
                    
                    dashboards[newId] = {
                        ...dashboardData,
                        importedAt: new Date().toISOString()
                    };
                    
                    addDashboardToSidebar(newId, dashboards[newId]);
                    sortDashboardList();
                    loadDashboard(newId);
                    
                    showNotification(`Dashboard "${dashboardData.name}" imported successfully`, 'success');
                    
                } catch (error) {
                    showNotification('Error importing dashboard: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
            event.target.value = '';
        }

        function exportDashboard() {
            if (!currentDashboard) {
                showNotification('No dashboard selected to export', 'error');
                return;
            }
            
            saveDashboardState();
            
            const dashboard = dashboards[currentDashboard];
            const exportData = {
                ...dashboard,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${dashboard.name.replace(/\s+/g, '-').toLowerCase()}-dashboard.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Dashboard exported successfully', 'success');
        }

        // Settings Functions
        function openSettings() {
            document.getElementById('settingsModal').style.display = 'block';
        }

        function saveSettings() {
            showNotification('Settings saved successfully', 'success');
            closeModal('settingsModal');
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('dashboard-theme', theme);
            
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.toggle('selected', option.getAttribute('data-theme') === theme);
            });
            
            showNotification(`${theme} mode activated`, 'success');
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
            setTheme(savedTheme);
        }

                // Utility Functions
        function updateUI() {
            const hasCurrentDashboard = !!currentDashboard;
            const hasAnyDashboards = Object.keys(dashboards).length > 0;
            
            if (hasCurrentDashboard) {
                const dashboard = dashboards[currentDashboard];
                document.getElementById('dashboardTitle').textContent = dashboard.name;
                document.getElementById('currentDashboardName').textContent = dashboard.name;
            } else {
                document.getElementById('dashboardTitle').textContent = 'No Dashboard Selected';
                document.getElementById('currentDashboardName').textContent = hasAnyDashboards ? 'Select Dashboard' : 'No Dashboard Selected';
            }
            
            document.getElementById('deleteBtn').style.display = hasCurrentDashboard ? 'block' : 'none';
            document.getElementById('addWidgetBtn').classList.toggle('show', isEditMode && hasCurrentDashboard);
            document.getElementById('emptyState').style.display = hasAnyDashboards ? 'none' : 'block';
            
            if (!hasCurrentDashboard) {
                showEmptyCanvas();
            }
        }

        function showCanvas() {
            document.getElementById('emptyCanvas').style.display = 'none';
            document.getElementById('gridStack').style.display = 'block';
        }

        function showEmptyCanvas() {
            document.getElementById('emptyCanvas').style.display = 'flex';
            document.getElementById('gridStack').style.display = 'none';
        }

        function generateDashboardId(name) {
            const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            let id = base;
            let counter = 1;
            
            while (dashboards[id]) {
                id = `${base}-${counter}`;
                counter++;
            }
            
            return id;
        }

        function filterDashboards() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const dashboardItems = document.querySelectorAll('.dashboard-item');
            
            dashboardItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            
            // Reset widget selection when closing add widget modal
            if (modalId === 'addWidgetModal') {
                selectedWidgetType = null;
                showWidgetSelection();
            }
        }

        function openCreateDashboardModal() {
            // Set next available order number
            document.getElementById('dashboardOrder').value = getNextOrderNumber();
            document.getElementById('createDashboardModal').style.display = 'block';
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const messageElement = document.getElementById('notificationMessage');
            
            messageElement.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function updateDateTime() {
            const now = new Date();
            const options = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            };
            const formattedDate = now.toLocaleDateString('en-US', options);
            document.querySelector('.header-info').textContent = formattedDate;
        }

        function editDashboardName(dashboardId) {
            event.stopPropagation();
            
            const dashboard = dashboards[dashboardId];
            const newName = prompt('Enter new dashboard name:', dashboard.name);
            
            if (newName && newName.trim() && newName.trim() !== dashboard.name) {
                dashboard.name = newName.trim();
                dashboard.lastModified = new Date().toISOString();
                
                // Update UI
                const dashboardItem = document.querySelector(`[data-dashboard="${dashboardId}"]`);
                if (dashboardItem) {
                    const nameElement = dashboardItem.querySelector('.dashboard-item-name');
                    if (nameElement) {
                        nameElement.textContent = dashboard.name;
                    }
                }
                
                // Update current dashboard title if it's the active one
                if (currentDashboard === dashboardId) {
                    document.getElementById('dashboardTitle').textContent = dashboard.name;
                    document.getElementById('currentDashboardName').textContent = dashboard.name;
                }
                
                showNotification(`Dashboard renamed to "${dashboard.name}"`, 'success');
            }
        }

        // Real-time Data Simulation
        function simulateDataUpdates() {
            setInterval(() => {
                if (!currentDashboard) return;
                
                // Update metric widgets
                document.querySelectorAll('[data-widget-type="metric"]').forEach(widget => {
                    const config = JSON.parse(widget.getAttribute('data-widget-config'));
                    const valueElement = widget.querySelector('[style*="font-size"]');
                    
                    if (valueElement && config.dataSource !== 'manual') {
                        const currentValue = parseFloat(valueElement.textContent) || 0;
                        const variation = (Math.random() - 0.5) * 2; // ±1 unit variation
                        const newValue = Math.max(0, currentValue + variation);
                        
                        valueElement.textContent = newValue.toFixed(config.decimals || 2) + (config.unit || '');
                        
                        // Check thresholds
                        if (config.alerts && config.alerts.enabled) {
                            if ((config.alerts.highThreshold && newValue > config.alerts.highThreshold) ||
                                (config.alerts.lowThreshold && newValue < config.alerts.lowThreshold)) {
                                showNotification(`${config.title}: ${config.alerts.message}`, 'error');
                            }
                        }
                    }
                });
                
                // Update gauge widgets
                document.querySelectorAll('[data-widget-type="gauge"]').forEach(widget => {
                    const config = JSON.parse(widget.getAttribute('data-widget-config'));
                    const valueElement = widget.querySelector('[style*="font-size: 48px"]');
                    
                    if (valueElement && config.dataSource !== 'manual') {
                        const currentValue = parseFloat(valueElement.textContent) || 0;
                        const variation = (Math.random() - 0.5) * 5; // ±2.5 unit variation
                        const newValue = Math.max(config.min || 0, Math.min(config.max || 100, currentValue + variation));
                        
                        valueElement.textContent = newValue.toFixed(0) + (config.unit || '%');
                        
                        // Check thresholds
                        if (config.alerts && config.alerts.enabled) {
                            if ((config.alerts.highThreshold && newValue > config.alerts.highThreshold) ||
                                (config.alerts.lowThreshold && newValue < config.alerts.lowThreshold)) {
                                showNotification(`${config.title}: ${config.alerts.message}`, 'error');
                            }
                        }
                    }
                });
                
                // Update status widgets (simulate connection status)
                document.querySelectorAll('[data-widget-type="status"]').forEach(widget => {
                    const statusElement = widget.querySelector('[style*="animation"]');
                    const textElement = widget.querySelector('span');
                    
                    if (statusElement && textElement) {
                        // 95% chance of staying online
                        if (Math.random() < 0.05) {
                            statusElement.style.backgroundColor = 'var(--danger-color)';
                            statusElement.style.animation = 'none';
                            textElement.textContent = 'Offline';
                        } else {
                            statusElement.style.backgroundColor = 'var(--success-color)';
                            statusElement.style.animation = 'pulse 2s infinite';
                            textElement.textContent = 'Online';
                        }
                    }
                });
                
            }, 5000); // Update every 5 seconds
        }

        // Enhanced Data Persistence
        function saveToLocalStorage() {
            try {
                localStorage.setItem('dashboard-data', JSON.stringify({
                    dashboards: dashboards,
                    currentDashboard: currentDashboard,
                    lastSaved: new Date().toISOString()
                }));
            } catch (error) {
                console.warn('Could not save to localStorage:', error);
            }
        }

        function loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('dashboard-data');
                if (saved) {
                    const data = JSON.parse(saved);
                    dashboards = data.dashboards || {};
                    
                    // Rebuild sidebar
                    Object.entries(dashboards).forEach(([id, dashboard]) => {
                        addDashboardToSidebar(id, dashboard);
                    });
                    
                    sortDashboardList();
                    
                    // Load last dashboard if it exists
                    if (data.currentDashboard && dashboards[data.currentDashboard]) {
                        loadDashboard(data.currentDashboard);
                    }
                    
                    updateUI();
                }
            } catch (error) {
                console.warn('Could not load from localStorage:', error);
            }
        }

        // Auto-save functionality
        function enableAutoSave() {
            // Save dashboards every 30 seconds
            setInterval(() => {
                if (Object.keys(dashboards).length > 0) {
                    saveToLocalStorage();
                }
            }, 30000);
            
            // Save before page unload
            window.addEventListener('beforeunload', saveToLocalStorage);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (isEditMode && currentDashboard) {
                    saveDashboard();
                }
            }
            
            // Escape to exit edit mode or close modals
            if (e.key === 'Escape') {
                // Check if any modal is open
                const openModal = document.querySelector('.modal[style*="block"]');
                if (openModal) {
                    openModal.style.display = 'none';
                } else if (isEditMode) {
                    setMode('view');
                }
            }
            
            // Ctrl/Cmd + N to create new dashboard
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                openCreateDashboardModal();
            }
            
            // Ctrl/Cmd + E to toggle edit mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                setMode(isEditMode ? 'view' : 'edit');
            }
            
            // Ctrl/Cmd + W to add widget (when in edit mode)
            if ((e.ctrlKey || e.metaKey) && e.key === 'w' && isEditMode && currentDashboard) {
                e.preventDefault();
                openAddWidgetModal();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (grid) {
                grid.compact();
            }
        });

        // Click outside modal to close
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Prevent context menu on widgets in edit mode
        document.addEventListener('contextmenu', function(e) {
            if (isEditMode && e.target.closest('.grid-stack-item')) {
                e.preventDefault();
            }
        });

        // Initialize data persistence and real-time updates
        document.addEventListener('DOMContentLoaded', function() {
            loadFromLocalStorage();
            enableAutoSave();
            simulateDataUpdates();
        });

        // Enhanced error handling
        window.addEventListener('error', function(e) {
            console.error('Application error:', e.error);
            showNotification('An error occurred. Please refresh the page.', 'error');
        });

        // Service worker registration for offline support (optional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // You can add a service worker here for offline functionality
            });
        }

        // Responsive grid handling
        function handleResponsiveGrid() {
            if (!grid) return;
            
            const screenWidth = window.innerWidth;
            
            if (screenWidth < 768) {
                // Mobile: Make widgets stack vertically
                grid.column(1, false);
            } else if (screenWidth < 1024) {
                // Tablet: 6 columns
                grid.column(6, false);
            } else {
                // Desktop: 12 columns
                grid.column(12, false);
            }
        }

        // Add responsive grid handling
        window.addEventListener('resize', debounce(handleResponsiveGrid, 250));

        // Debounce utility function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Enhanced widget interaction for mobile
        function addTouchSupport() {
            document.addEventListener('touchstart', function(e) {
                // Add touch support for widget interactions
            }, { passive: true });
        }

        // Initialize touch support
        addTouchSupport();

        // Performance monitoring
        function logPerformance() {
            if (performance.mark) {
                performance.mark('dashboard-loaded');
                console.log('Dashboard application loaded successfully');
            }
        }

        // Call performance logging
        window.addEventListener('load', logPerformance);

        // Final initialization check
        function validateInitialization() {
            const requiredElements = [
                'gridStack', 'sidebar', 'createDashboardModal', 
                'addWidgetModal', 'settingsModal'
            ];
            
            const missing = requiredElements.filter(id => !document.getElementById(id));
            
            if (missing.length > 0) {
                console.error('Missing required elements:', missing);
                showNotification('Application initialization failed', 'error');
                return false;
            }
            
            return true;
        }

        // Validate on DOM ready
        document.addEventListener('DOMContentLoaded', function() {
            if (validateInitialization()) {
                console.log('✅ Dashboard application initialized successfully');
            }
        });
    </script>
</body>
</html>

```
