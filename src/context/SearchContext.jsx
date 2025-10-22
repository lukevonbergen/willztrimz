import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

// Officer colors for visual differentiation
const OFFICER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export const SearchProvider = ({ children }) => {
  // Core state
  const [searchAreas, setSearchAreas] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [alerts, setAlerts] = useState([]);

  // Playback state
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('searchTrackerState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.searchAreas) setSearchAreas(parsed.searchAreas);
        if (parsed.officers) setOfficers(parsed.officers);
        if (parsed.alerts) setAlerts(parsed.alerts);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        searchAreas: searchAreas.map(area => ({
          ...area,
          // Don't save grid cells - they're too large and will be regenerated
          gridCells: undefined,
          // Don't save coverage data - will be recalculated
          coverageData: undefined
        })),
        officers: officers.map(o => ({
          ...o,
          // Don't save real-time simulation intervals
          simulationInterval: null,
          // Limit path history to last 1000 points to save space
          path: o.path.slice(-1000)
        })),
        alerts: alerts.slice(0, 20) // Only save last 20 alerts
      };
      localStorage.setItem('searchTrackerState', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
      // If storage is full, clear old data and try again
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old data');
        localStorage.removeItem('searchTrackerState');
      }
    }
  }, [searchAreas, officers, alerts]);

  // Add a new search area
  const addSearchArea = useCallback((area) => {
    const newArea = {
      id: `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: area.name || 'Unnamed Area',
      coordinates: area.coordinates,
      createdAt: Date.now(),
      timeThreshold: area.timeThreshold || 60, // default 60 minutes
      priority: area.priority || 'medium',
      coverageData: {
        cellsCovered: new Set(),
        officerCoverage: {}
      },
      gridCells: area.gridCells || [],
      totalCells: area.totalCells || 0
    };
    setSearchAreas(prev => [...prev, newArea]);
    return newArea;
  }, []);

  // Update search area
  const updateSearchArea = useCallback((areaId, updates) => {
    setSearchAreas(prev => prev.map(area =>
      area.id === areaId ? { ...area, ...updates } : area
    ));
  }, []);

  // Delete search area
  const deleteSearchArea = useCallback((areaId) => {
    setSearchAreas(prev => prev.filter(area => area.id !== areaId));
  }, []);

  // Add officer/device
  const addOfficer = useCallback((officerData) => {
    const newOfficer = {
      id: officerData.id || `officer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      officerName: officerData.officerName || `Officer ${officers.length + 1}`,
      active: true,
      currentLocation: officerData.currentLocation || null,
      path: [],
      color: OFFICER_COLORS[officers.length % OFFICER_COLORS.length],
      startTime: Date.now()
    };
    setOfficers(prev => [...prev, newOfficer]);
    return newOfficer;
  }, [officers.length]);

  // Update officer
  const updateOfficer = useCallback((officerId, updates) => {
    setOfficers(prev => prev.map(officer =>
      officer.id === officerId ? { ...officer, ...updates } : officer
    ));
  }, []);

  // Remove officer
  const removeOfficer = useCallback((officerId) => {
    setOfficers(prev => prev.filter(officer => officer.id !== officerId));
  }, []);

  // Add location to officer's path
  const addOfficerLocation = useCallback((officerId, location) => {
    setOfficers(prev => prev.map(officer => {
      if (officer.id === officerId) {
        const newPath = [...officer.path, { ...location, timestamp: Date.now() }];
        return {
          ...officer,
          currentLocation: location,
          path: newPath
        };
      }
      return officer;
    }));
  }, []);

  // Add alert
  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...alert,
      timestamp: Date.now()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    return newAlert;
  }, []);

  // Clear alert
  const clearAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Reset entire application
  const resetAll = useCallback(() => {
    setSearchAreas([]);
    setOfficers([]);
    setAlerts([]);
    setIsSimulationRunning(false);
    setIsPlaybackMode(false);
    setPlaybackTime(null);
    setCurrentTime(Date.now());
    localStorage.removeItem('searchTrackerState');
  }, []);

  // Export data
  const exportData = useCallback(() => {
    return {
      searchAreas,
      officers,
      alerts,
      exportedAt: Date.now()
    };
  }, [searchAreas, officers, alerts]);

  // Import data
  const importData = useCallback((data) => {
    if (data.searchAreas) setSearchAreas(data.searchAreas);
    if (data.officers) setOfficers(data.officers);
    if (data.alerts) setAlerts(data.alerts);
  }, []);

  const value = {
    // State
    searchAreas,
    officers,
    isSimulationRunning,
    simulationSpeed,
    currentTime,
    alerts,
    isPlaybackMode,
    playbackTime,
    playbackSpeed,
    isPlaying,

    // Actions
    addSearchArea,
    updateSearchArea,
    deleteSearchArea,
    addOfficer,
    updateOfficer,
    removeOfficer,
    addOfficerLocation,
    addAlert,
    clearAlert,
    clearAllAlerts,
    resetAll,
    exportData,
    importData,

    // Setters
    setIsSimulationRunning,
    setSimulationSpeed,
    setCurrentTime,
    setIsPlaybackMode,
    setPlaybackTime,
    setPlaybackSpeed,
    setIsPlaying
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
