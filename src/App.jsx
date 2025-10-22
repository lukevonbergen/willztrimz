import React, { useState, useEffect } from 'react';
import { SearchProvider, useSearch } from './context/SearchContext';
import MapView from './components/Map/MapView';
import MainDashboard from './components/Dashboard/MainDashboard';
import AlertPanel from './components/Dashboard/AlertPanel';
import PlaybackControls from './components/Timeline/PlaybackControls';
import TimelineSlider from './components/Timeline/TimelineSlider';
import DeviceManager from './components/Management/DeviceManager';
import AreaList from './components/Management/AreaList';
import ConfirmModal from './components/ConfirmModal';
import EvidencePanel from './components/Evidence/EvidencePanel';
import IncidentPanel from './components/Incidents/IncidentPanel';
import OfficerStatusPanel from './components/Officer/OfficerStatusPanel';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import CheckpointPanel from './components/Checkpoints/CheckpointPanel';
import ResourcePanel from './components/Resources/ResourcePanel';
import CommunicationLog from './components/Communication/CommunicationLog';
import ZoneCreationModal from './components/Map/ZoneCreationModal';
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
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, areas, devices, evidence, incidents, checkpoints, resources, analytics, officer-status
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [pendingZoneCoordinates, setPendingZoneCoordinates] = useState(null);

  const { isRunning } = useSimulation();

  // Listen for cancel drawing event
  useEffect(() => {
    const handleCancelDrawing = () => {
      setIsDrawingMode(false);
    };
    window.addEventListener('cancelDrawing', handleCancelDrawing);
    return () => window.removeEventListener('cancelDrawing', handleCancelDrawing);
  }, []);

  // Regenerate grids for areas loaded from localStorage
  useEffect(() => {
    searchAreas.forEach(area => {
      if (area.coordinates && (!area.gridCells || area.gridCells.length === 0)) {
        console.log('Regenerating grid for area:', area.name);
        setTimeout(() => {
          const gridData = generateGridForArea(area.coordinates, 20); // 20m cells
          updateSearchArea(area.id, {
            gridCells: gridData.cells,
            totalCells: gridData.totalCells
          });
        }, 0);
      }
    });
  }, [searchAreas.length]); // Only run when number of areas changes

  // Initialize with demo data if no data exists
  useEffect(() => {
    // Check if we need to clear old data (NY coordinates) and reinitialize with London
    const appVersion = localStorage.getItem('appVersion');
    if (appVersion !== '2.0-london') {
      // Clear old data and set new version
      localStorage.removeItem('searchTrackerState');
      localStorage.setItem('appVersion', '2.0-london');
      // Force page to use London coordinates on next render
      resetAll();
    }

    if (searchAreas.length === 0 && officers.length === 0) {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = async () => {
    setIsInitializing(true);

    // Create a sample search area (Hyde Park area in London)
    const sampleArea1 = {
      name: 'Crime Scene Area - Zone A',
      coordinates: [
        [51.5074, -0.1778],
        [51.5074, -0.1578],
        [51.4974, -0.1578],
        [51.4974, -0.1778]
      ],
      priority: 'high',
      timeThreshold: 30
    };

    const sampleArea2 = {
      name: 'Secondary Search Zone',
      coordinates: [
        [51.4974, -0.1778],
        [51.4974, -0.1578],
        [51.4874, -0.1578],
        [51.4874, -0.1778]
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
      const gridData = generateGridForArea(areaData.coordinates, 20); // 20m cells (reduced from 10m to limit cell count)
      console.log(`Generated ${gridData.totalCells} cells for search area`);
      const area = addSearchArea({
        ...areaData,
        gridCells: gridData.cells,
        totalCells: gridData.totalCells
      });
    }, 0);
  };

  const handleAreaCreated = (coordinates) => {
    // Store coordinates and open modal
    setPendingZoneCoordinates(coordinates);
    setShowZoneModal(true);
    setIsDrawingMode(false);
  };

  const handleZoneModalSubmit = (zoneData) => {
    // Use deferred grid generation
    setTimeout(() => {
      addSearchAreaWithGrid({
        name: zoneData.name,
        coordinates: zoneData.coordinates,
        priority: zoneData.priority,
        timeThreshold: zoneData.timeThreshold,
        assignedOfficers: zoneData.assignedOfficers
      });
    }, 0);

    setShowZoneModal(false);
    setPendingZoneCoordinates(null);
  };

  const handleZoneModalCancel = () => {
    setShowZoneModal(false);
    setPendingZoneCoordinates(null);
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

  const handleResetClick = () => {
    // Show modal instead of blocking window.confirm
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    // Close modal first
    setShowResetConfirm(false);

    // Set loading state immediately for UI feedback
    setIsResetting(true);

    // Defer the actual reset to allow UI to update
    setTimeout(() => {
      resetAll();

      // Reset loading state after a short delay
      setTimeout(() => {
        setIsResetting(false);
      }, 100);
    }, 0);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl z-10 border-b-4 border-blue-600">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <div className="text-3xl">🚔</div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Law Enforcement Search Command
                  </h1>
                  <div className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isRunning ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-600 text-gray-200'
              }`}>
                {isRunning ? '● ACTIVE' : '○ STANDBY'}
              </div>
              {isInitializing && (
                <div className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>INITIALIZING...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm shadow-lg"
                title="Toggle Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                onClick={() => setIsDrawingMode(!isDrawingMode)}
                className={`px-4 py-2 rounded text-sm font-semibold shadow-lg transition-all ${
                  isDrawingMode
                    ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isDrawingMode ? '✕ Cancel' : '✏️ Draw Area'}
              </button>

              <button
                onClick={handleToggleSimulation}
                className={`px-4 py-2 rounded text-sm font-semibold shadow-lg transition-all ${
                  isSimulationRunning
                    ? 'bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-400'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSimulationRunning ? '⏸ Stop' : '▶ Start'}
              </button>

              <div className="border-l border-gray-600 pl-2 ml-2 flex space-x-2">
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm shadow-lg"
                  title="Export Data"
                >
                  💾 Export
                </button>
                <button
                  onClick={handleImport}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm shadow-lg"
                  title="Import Data"
                >
                  📁 Import
                </button>
                <button
                  onClick={handleResetClick}
                  disabled={isResetting}
                  className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                  title="Reset All"
                >
                  {isResetting && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isResetting ? 'Resetting...' : '🔄 Reset'}</span>
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
            {/* Tabs - scrollable */}
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('areas')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'areas'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Areas
              </button>
              <button
                onClick={() => setActiveTab('officers')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'officers'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Officers
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'status'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setActiveTab('evidence')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'evidence'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Evidence
              </button>
              <button
                onClick={() => setActiveTab('incidents')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'incidents'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Incidents
              </button>
              <button
                onClick={() => setActiveTab('checkpoints')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'checkpoints'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Checkpoints
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab('comms')}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === 'comms'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Comms
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'dashboard' && <MainDashboard />}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'areas' && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <AreaList />
                </div>
              )}
              {activeTab === 'officers' && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <DeviceManager />
                </div>
              )}
              {activeTab === 'status' && <OfficerStatusPanel />}
              {activeTab === 'evidence' && <EvidencePanel />}
              {activeTab === 'incidents' && <IncidentPanel />}
              {activeTab === 'checkpoints' && <CheckpointPanel />}
              {activeTab === 'resources' && <ResourcePanel />}
              {activeTab === 'comms' && <CommunicationLog />}
            </div>

            {/* Alerts section */}
            <div className="border-t p-4 max-h-60 overflow-hidden">
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

      {/* Reset confirmation modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Application"
        message="Are you sure you want to reset? This will delete all search areas, officers, and data. This action cannot be undone."
        confirmText="Reset All Data"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
      />

      {/* Zone creation modal */}
      <ZoneCreationModal
        isOpen={showZoneModal}
        onClose={handleZoneModalCancel}
        onSubmit={handleZoneModalSubmit}
        officers={officers}
        coordinates={pendingZoneCoordinates}
      />
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
