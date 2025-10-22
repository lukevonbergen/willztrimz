import React, { useState, useEffect } from 'react';
import { SearchProvider, useSearch } from './context/SearchContext';
import MapView from './components/Map/MapView';
import MainDashboard from './components/Dashboard/MainDashboard';
import AlertPanel from './components/Dashboard/AlertPanel';
import PlaybackControls from './components/Timeline/PlaybackControls';
import TimelineSlider from './components/Timeline/TimelineSlider';
import DeviceManager from './components/Management/DeviceManager';
import AreaList from './components/Management/AreaList';
import { useSimulation } from './hooks/useSimulation';
import { generateGridForArea } from './utils/geoUtils';

const AppContent = () => {
  const {
    searchAreas,
    officers,
    isSimulationRunning,
    setIsSimulationRunning,
    addSearchArea,
    addOfficer,
    updateSearchArea,
    resetAll,
    exportData,
    importData
  } = useSearch();

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, areas, devices
  const [isInitializing, setIsInitializing] = useState(false);

  const { isRunning } = useSimulation();

  // Initialize with demo data if no data exists
  useEffect(() => {
    if (searchAreas.length === 0 && officers.length === 0) {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = async () => {
    setIsInitializing(true);

    // Create a sample search area (Central Park area in NYC)
    const sampleArea1 = {
      name: 'Crime Scene Area - Zone A',
      coordinates: [
        [40.7829, -73.9654],
        [40.7829, -73.9580],
        [40.7689, -73.9580],
        [40.7689, -73.9654]
      ],
      priority: 'high',
      timeThreshold: 30
    };

    const sampleArea2 = {
      name: 'Secondary Search Zone',
      coordinates: [
        [40.7689, -73.9654],
        [40.7689, -73.9580],
        [40.7589, -73.9580],
        [40.7589, -73.9654]
      ],
      priority: 'medium',
      timeThreshold: 45
    };

    // Defer grid generation to avoid blocking UI
    setTimeout(() => {
      addSearchAreaWithGrid(sampleArea1);

      // Stagger the second area to further reduce blocking
      setTimeout(() => {
        addSearchAreaWithGrid(sampleArea2);

        // Add sample officers after areas are created
        setTimeout(() => {
          addOfficer({ officerName: 'Officer Smith' });
          addOfficer({ officerName: 'Officer Johnson' });
          addOfficer({ officerName: 'Officer Williams' });
          setIsInitializing(false);
        }, 50);
      }, 50);
    }, 50);
  };

  const addSearchAreaWithGrid = (areaData) => {
    // Generate grid in a deferred manner to avoid blocking
    setTimeout(() => {
      const gridData = generateGridForArea(areaData.coordinates, 10); // 10m cells
      const area = addSearchArea({
        ...areaData,
        gridCells: gridData.cells,
        totalCells: gridData.totalCells
      });
    }, 0);
  };

  const handleAreaCreated = (coordinates) => {
    const areaName = prompt('Enter a name for this search area:', 'Search Area');
    if (!areaName) return;

    const priority = prompt('Enter priority (high/medium/low):', 'medium');
    const timeThreshold = parseInt(prompt('Enter time threshold in minutes:', '60'));

    // Use deferred grid generation
    setTimeout(() => {
      addSearchAreaWithGrid({
        name: areaName,
        coordinates,
        priority: ['high', 'medium', 'low'].includes(priority) ? priority : 'medium',
        timeThreshold: timeThreshold || 60
      });
    }, 0);

    setIsDrawingMode(false);
  };

  const handleToggleSimulation = () => {
    if (searchAreas.length === 0) {
      alert('Please create at least one search area first');
      return;
    }
    if (officers.length === 0) {
      alert('Please add at least one officer first');
      return;
    }
    setIsSimulationRunning(!isSimulationRunning);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-tracker-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            importData(data);
            alert('Data imported successfully!');
          } catch (err) {
            alert('Error importing data: ' + err.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Law Enforcement Search Tracker
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm ${
                isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {isRunning ? 'Simulation Active' : 'Simulation Stopped'}
              </div>
              {isInitializing && (
                <div className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Initializing...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                title="Toggle Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                onClick={() => setIsDrawingMode(!isDrawingMode)}
                className={`px-4 py-2 rounded text-sm ${
                  isDrawingMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isDrawingMode ? 'Cancel Drawing' : 'Draw Search Area'}
              </button>

              <button
                onClick={handleToggleSimulation}
                className={`px-4 py-2 rounded text-sm ${
                  isSimulationRunning
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSimulationRunning ? 'Stop Simulation' : 'Start Simulation'}
              </button>

              <div className="border-l pl-2 ml-2 flex space-x-2">
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                  title="Export Data"
                >
                  Export
                </button>
                <button
                  onClick={handleImport}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                  title="Import Data"
                >
                  Import
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure? This will delete all data.')) {
                      resetAll();
                    }
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  title="Reset All"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-96 bg-white shadow-lg overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('areas')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'areas'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Areas
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'devices'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Officers
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'dashboard' && <MainDashboard />}
              {activeTab === 'areas' && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <AreaList />
                </div>
              )}
              {activeTab === 'devices' && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <DeviceManager />
                </div>
              )}
            </div>

            {/* Alerts section */}
            <div className="border-t p-4 max-h-80 overflow-hidden">
              <AlertPanel />
            </div>
          </aside>
        )}

        {/* Map */}
        <main className="flex-1 relative">
          <MapView
            isDrawingMode={isDrawingMode}
            onAreaCreated={handleAreaCreated}
          />
        </main>
      </div>

      {/* Playback controls */}
      <PlaybackControls />
      <TimelineSlider />
    </div>
  );
};

function App() {
  return (
    <SearchProvider>
      <AppContent />
    </SearchProvider>
  );
}

export default App;
