# IoT Dashboard Application - Requirements Specification

## Project Overview
Develop a modern, responsive IoT Dashboard application with drag-and-drop functionality, real-time data visualization, and comprehensive dashboard management capabilities.

## Visual References
![alt text](image.png)
![alt text](image-1.png)

## Core Features & Requirements

### 1. Layout Structure

#### Header Component
- **Fixed positioning** at the top of the application
- **Responsive design** that adapts to all screen sizes (mobile, tablet, desktop)
- Should contain:
  - Application branding/logo
  - User profile/authentication controls
  - Navigation controls for sidebar toggle
  - Breadcrumb navigation
  - Search functionality (global)
  - Notification center
  - Settings/preferences access

#### Left Sidebar
- **Collapsible/expandable** sidebar with smooth animations
- **Persistent state** - remembers open/closed state across sessions
- **Responsive behavior**:
  - Desktop: Sidebar can be toggled open/closed
  - Tablet: Overlay mode when opened
  - Mobile: Full-screen overlay when opened
- **Content Structure**:
  ```
  ├── DASHBOARD (Title/Header)
  ├── Create Dashboard (Primary Action Button)
  ├── Search Bar (Filter existing dashboards)
  ├── Dashboard List
  │   ├── Recently Used
  │   ├── Favorites
  │   └── All Dashboards
  └── Additional Navigation Items (Future expansion)
  ```

#### Main Canvas Area
- **Fully responsive** drag-and-drop interface
- **Grid-based layout system** using GridStack.js
- **Component Management**:
  - Resizable components with aspect ratio maintenance
  - Drag and drop functionality
  - Auto-arrangement to prevent overlapping
  - Snap-to-grid behavior
  - Real-time collision detection

### 2. Dashboard Canvas Features

#### Grid System (GridStack.js Integration)
- **Reference Implementation**: https://gridstackjs.com/#demo
- **Grid Properties**:
  - Responsive breakpoints (xs, sm, md, lg, xl)
  - Auto-fit columns based on screen size
  - Minimum/maximum widget sizes
  - Gap/margin configuration

#### Widget/Component Features
1. **Resizing Capabilities**:
   - Maintain aspect ratios during resize
   - Minimum and maximum size constraints
   - Visual resize handles
   - Real-time preview during resize

2. **Drag & Drop Functionality**:
   - Smooth dragging with visual feedback
   - Drop zones with highlighting
   - Auto-scroll when dragging near edges
   - Undo/redo capability for movements

3. **Anti-Overlapping System**:
   - Automatic component repositioning
   - Smart gap filling
   - Collision detection and resolution
   - Compact mode for optimal space usage

#### Supported Widget Types
- **Data Visualization Widgets**:
  - Line charts, bar charts, pie charts
  - Gauge meters and KPI displays
  - Real-time data streams
  - Historical trend analysis
- **Control Widgets**:
  - Toggle switches, sliders
  - Button controls
  - Input forms
- **Information Widgets**:
  - Text displays, alerts
  - Status indicators
  - Image/media displays

### 3. Dashboard Management

#### Dashboard Creation Flow
- **Create Dashboard Button** in sidebar
- **Modal/Form Interface** with fields:
  - Dashboard Name (Required)
  - Description (Optional)
  - Category/Tags
  - Access Permissions
  - Template Selection
  - Initial Layout Configuration

#### Dashboard List Features
- **Search and Filter**:
  - Text-based search
  - Category filtering
  - Date range filtering
  - Favorites filter
- **Dashboard Actions**:
  - View/Open dashboard
  - Edit dashboard settings
  - Duplicate dashboard
  - Share dashboard
  - Delete dashboard (with confirmation)
- **List Display Options**:
  - Grid view with thumbnails
  - List view with details
  - Recently accessed sorting
  - Alphabetical sorting

### 4. Responsive Design Requirements

#### Breakpoint Strategy
```css
/* Mobile First Approach */
xs: 0px - 575px     (Mobile phones)
sm: 576px - 767px   (Large phones / small tablets)
md: 768px - 991px   (Tablets)
lg: 992px - 1199px  (Desktops)
xl: 1200px+         (Large desktops)
```

#### Responsive Behaviors
- **Grid Layout**: Automatic column adjustment based on screen size
- **Component Sizing**: Widgets resize proportionally
- **Navigation**: Sidebar transforms to overlay on smaller screens
- **Touch Support**: Optimized for touch interactions on mobile devices
- **Performance**: Smooth animations and interactions across all devices
