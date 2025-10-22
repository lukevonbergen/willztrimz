import React, { useState, useEffect } from 'react';
import { SearchProvider, useSearch } from './context/SearchContext';
import MapView from './components/Map/MapView';
import TacticalHeader from './components/Dashboard/TacticalHeader';
import MissionControlPanel from './components/Dashboard/MissionControlPanel';
import TacticalActivityLog from './components/Dashboard/TacticalActivityLog';
import OfficerManagementPanel from './components/Dashboard/OfficerManagementPanel';
import ZoneManagementPanel from './components/Dashboard/ZoneManagementPanel';
import AlertPanel from './components/Dashboard/AlertPanel';
import ConfirmModal from './components/ConfirmModal';
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
  const [activeTab, setActiveTab] = useState('mission'); // mission, zones, officers, activity
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [missionStartTime] = useState(Date.now());

  const { isRunning } = useSimulation();

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

  // No demo data - clean slate on startup

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
    <div className="flex flex-col h-screen bg-tactical-bg-primary tactical-grid-bg">
      {/* Tactical Header */}
      <TacticalHeader
        missionStartTime={missionStartTime}
        onToggleSimulation={handleToggleSimulation}
        onToggleDrawing={() => setIsDrawingMode(!isDrawingMode)}
        isDrawingMode={isDrawingMode}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tactical Sidebar */}
        {showSidebar && (
          <aside className="w-96 bg-tactical-bg-secondary border-r border-tactical-border shadow-xl overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-tactical-border bg-tactical-bg-tertiary">
              <button
                onClick={() => setActiveTab('mission')}
                className={`flex-1 px-3 py-3 text-xs font-semibold tracking-wider transition-all ${
                  activeTab === 'mission'
                    ? 'border-b-2 border-tactical-accent-primary text-tactical-accent-primary bg-tactical-bg-secondary'
                    : 'text-tactical-text-secondary hover:text-tactical-text-primary'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                MISSION
              </button>
              <button
                onClick={() => setActiveTab('zones')}
                className={`flex-1 px-3 py-3 text-xs font-semibold tracking-wider transition-all ${
                  activeTab === 'zones'
                    ? 'border-b-2 border-tactical-accent-primary text-tactical-accent-primary bg-tactical-bg-secondary'
                    : 'text-tactical-text-secondary hover:text-tactical-text-primary'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                ZONES
              </button>
              <button
                onClick={() => setActiveTab('officers')}
                className={`flex-1 px-3 py-3 text-xs font-semibold tracking-wider transition-all ${
                  activeTab === 'officers'
                    ? 'border-b-2 border-tactical-accent-primary text-tactical-accent-primary bg-tactical-bg-secondary'
                    : 'text-tactical-text-secondary hover:text-tactical-text-primary'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                OFFICERS
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-3 py-3 text-xs font-semibold tracking-wider transition-all ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-tactical-accent-primary text-tactical-accent-primary bg-tactical-bg-secondary'
                    : 'text-tactical-text-secondary hover:text-tactical-text-primary'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                ACTIVITY
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'mission' && <MissionControlPanel />}
              {activeTab === 'zones' && <ZoneManagementPanel />}
              {activeTab === 'officers' && <OfficerManagementPanel />}
              {activeTab === 'activity' && <TacticalActivityLog />}
            </div>

            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setShowSidebar(false)}
              className="p-3 border-t border-tactical-border bg-tactical-bg-tertiary hover:bg-tactical-bg-secondary text-tactical-text-secondary hover:text-tactical-accent-primary transition-all text-xs font-semibold tracking-wider"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              COLLAPSE PANEL
            </button>
          </aside>
        )}

        {/* Expand Sidebar Button (when collapsed) */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-20 left-4 z-[1000] btn-tactical"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            EXPAND
          </button>
        )}

        {/* Map */}
        <main className="flex-1 relative">
          <MapView
            isDrawingMode={isDrawingMode}
            onAreaCreated={handleAreaCreated}
          />

          {/* System Controls Overlay */}
          <div className="absolute bottom-4 right-4 z-[999] space-y-2">
            <button
              onClick={handleExport}
              className="btn-tactical block w-full text-xs"
              title="Export Data"
            >
              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              EXPORT
            </button>
            <button
              onClick={handleImport}
              className="btn-tactical block w-full text-xs"
              title="Import Data"
            >
              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              IMPORT
            </button>
            <button
              onClick={handleResetClick}
              disabled={isResetting}
              className="btn-tactical btn-tactical-danger block w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset All"
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  RESETTING
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  RESET
                </>
              )}
            </button>
          </div>
        </main>
      </div>

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
