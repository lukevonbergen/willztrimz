# Law Enforcement Search Area Tracker

A React-based application for coordinating and monitoring area searches with real-time tracking and playback capabilities. Designed for law enforcement to efficiently manage search operations with visual coverage tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

### Core Functionality

- **Interactive Map System**
  - Powered by Leaflet for precise mapping
  - Grayscale areas transition to color as officers search them
  - Street-level detail tracking
  - Color-coded officer coverage visualization

- **Admin Area Definition Tool**
  - Draw custom search area polygons directly on the map
  - Save, edit, and delete defined areas
  - Label areas with names and set priority levels
  - Configure time thresholds for completion

- **GPS Simulation & Officer Tracking**
  - ID-based device assignment (no complex authentication)
  - Multiple GPS device simulation with realistic movement patterns
  - Real-time officer position tracking
  - Coverage detection as officers move through areas
  - Unique color coding per officer

- **Timeline & Playback System**
  - Timeline slider to review search progression
  - Play/pause controls with speed adjustment (0.5x, 1x, 2x, 4x)
  - Complete historical playback of officer movements
  - Timestamp display during playback

- **Real-time Dashboard**
  - Live overview of all active search operations
  - Coverage percentage with visual progress bars
  - Active officer status monitoring
  - Statistics: total area, covered area, time elapsed
  - Officer-specific coverage breakdown

- **Intelligent Alert System**
  - Green notifications when areas reach 100% coverage
  - Warning alerts when areas fall behind schedule
  - Configurable time thresholds per area
  - Automatic schedule tracking

## Technology Stack

- **React 18+** - Modern functional components with hooks
- **Vite** - Fast development server and build tool
- **React Leaflet** - Interactive mapping with Leaflet integration
- **Leaflet Draw** - Drawing tools for area creation
- **Turf.js** - Geospatial calculations (coverage, areas, point-in-polygon)
- **Tailwind CSS** - Utility-first styling
- **date-fns** - Date/time formatting and manipulation
- **LocalStorage** - Session-based state persistence

## Installation

### Prerequisites

- Node.js 16+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/law-enforcement-search-tracker.git
   cd law-enforcement-search-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Getting Started

1. **Initial Setup** (First-time use)
   - The app automatically loads with demo data (2 search areas, 3 officers)
   - You can start the simulation immediately to see it in action

2. **Creating a Search Area**
   - Click "Draw Search Area" in the header
   - Use the polygon or rectangle tool to define the search zone
   - Enter area name, priority, and time threshold when prompted
   - The system automatically generates a coverage grid

3. **Adding Officers**
   - Navigate to the "Officers" tab in the sidebar
   - Click "+ Add Officer"
   - Enter officer name and save
   - Officers are automatically assigned unique colors

4. **Running a Simulation**
   - Ensure at least one search area and one officer are configured
   - Click "Start Simulation" in the header
   - Officers will begin moving through search areas
   - Watch real-time coverage updates on the map and dashboard

5. **Playback & Review**
   - Use the playback controls at the bottom of the screen
   - Click play to review the search progression
   - Adjust speed with the speed controls
   - Use the timeline slider to jump to specific moments

### Key Features Explained

#### Coverage Grid System
- Each search area is divided into a grid of 10m x 10m cells
- As officers move, cells are marked as "covered" with their assigned color
- Coverage percentage is calculated as: (covered cells / total cells) × 100

#### Search Patterns
Officers use different search patterns:
- **Grid Search**: Systematic back-and-forth pattern
- **Perimeter Search**: Walking the boundary then spiraling inward
- **Random Search**: Random waypoint movement

#### Alert System
- **Success Alerts** (Green): Area reaches 100% coverage
- **Warning Alerts** (Yellow/Orange): Area is more than 25% behind schedule
- Alerts appear in the sidebar and can be dismissed individually

#### Data Management
- **Export**: Save current search data as JSON
- **Import**: Load previously saved search operations
- **Reset**: Clear all data and start fresh
- Data is automatically saved to browser localStorage

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── MainDashboard.jsx      # Main stats and overview
│   │   └── AlertPanel.jsx         # Alert notifications
│   ├── Map/
│   │   ├── MapView.jsx            # Main map container
│   │   ├── AreaDrawingTool.jsx    # Polygon drawing tool
│   │   ├── OfficerMarkers.jsx     # Officer position markers
│   │   ├── CoverageLayer.jsx      # Coverage grid visualization
│   │   └── SearchAreaPolygons.jsx # Search area boundaries
│   ├── Timeline/
│   │   ├── PlaybackControls.jsx   # Play/pause controls
│   │   └── TimelineSlider.jsx     # Timeline scrubber
│   └── Management/
│       ├── DeviceManager.jsx      # Officer management
│       └── AreaList.jsx           # Search area list
├── context/
│   └── SearchContext.jsx          # Global state management
├── hooks/
│   └── useSimulation.js           # Simulation logic hook
├── utils/
│   ├── geoUtils.js               # Geospatial calculations
│   └── gpsSimulation.js          # GPS movement simulation
├── App.jsx                        # Main app component
├── main.jsx                       # React entry point
└── index.css                      # Global styles
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Key Components

**SearchContext**: Central state management
- Manages search areas, officers, alerts
- Provides actions for creating, updating, deleting entities
- Handles localStorage persistence

**useSimulation Hook**: Simulation engine
- Controls officer movement simulation
- Updates coverage grid in real-time
- Generates alerts based on progress
- Respects playback mode (doesn't simulate during playback)

**geoUtils**: Geospatial utilities
- Grid generation for search areas
- Coverage calculations
- Point-in-polygon checks
- Distance and area calculations

**gpsSimulation**: Movement simulation
- Generates realistic officer movement patterns
- Calculates next positions based on waypoints
- Simulates walking speed (~5 km/h)

## Configuration

### Cell Size
Default grid cell size is 10m x 10m. To change:
```javascript
// In App.jsx, line ~65
const gridData = generateGridForArea(areaData.coordinates, 15); // Change to 15m
```

### Simulation Speed
Adjustable in UI (0.5x - 4x) or modify base interval:
```javascript
// In hooks/useSimulation.js, line ~64
const baseInterval = 3000; // Change from 3000ms (3 seconds)
```

### Officer Colors
Configure in SearchContext.jsx:
```javascript
const OFFICER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  // Add more colors...
];
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Known Limitations

- GPS simulation is client-side only (no backend integration)
- Data persists in browser localStorage only (not synchronized across devices)
- Map requires internet connection for tile loading
- Large search areas (>1km²) may experience performance degradation

## Future Enhancements

- [ ] Backend API integration for real GPS devices
- [ ] Multi-user collaboration with WebSockets
- [ ] Offline map tile caching
- [ ] Mobile responsive design
- [ ] PDF report generation
- [ ] Heatmap visualization mode
- [ ] Voice alerts for critical updates

## Troubleshooting

**Map tiles not loading**
- Check internet connection
- Try refreshing the page
- Clear browser cache

**Simulation not starting**
- Ensure at least one search area is created
- Ensure at least one officer is added and active
- Check browser console for errors

**Performance issues**
- Reduce number of active officers
- Use smaller search areas
- Reduce grid cell size (larger cells = fewer calculations)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with** ❤️ **for law enforcement professionals**
