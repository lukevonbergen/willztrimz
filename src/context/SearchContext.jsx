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
  const [evidenceMarkers, setEvidenceMarkers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [operations, setOperations] = useState([]);
  const [resources, setResources] = useState([]);
  const [communications, setCommunications] = useState([]);

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
        if (parsed.evidenceMarkers) setEvidenceMarkers(parsed.evidenceMarkers);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.checkpoints) setCheckpoints(parsed.checkpoints);
        if (parsed.operations) setOperations(parsed.operations);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.communications) setCommunications(parsed.communications);
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
        alerts: alerts.slice(0, 20), // Only save last 20 alerts
        evidenceMarkers,
        incidents,
        checkpoints,
        operations,
        resources,
        communications: communications.slice(0, 100) // Limit to 100 messages
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

  // Evidence marker functions
  const addEvidence = useCallback((evidence) => {
    const newEvidence = {
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...evidence,
      timestamp: evidence.timestamp || Date.now()
    };
    setEvidenceMarkers(prev => [...prev, newEvidence]);
    return newEvidence;
  }, []);

  const updateEvidence = useCallback((evidenceId, updates) => {
    setEvidenceMarkers(prev => prev.map(e =>
      e.id === evidenceId ? { ...e, ...updates } : e
    ));
  }, []);

  const deleteEvidence = useCallback((evidenceId) => {
    setEvidenceMarkers(prev => prev.filter(e => e.id !== evidenceId));
  }, []);

  // Incident functions
  const addIncident = useCallback((incident) => {
    const newIncident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...incident,
      timestamp: incident.timestamp || Date.now(),
      status: incident.status || 'open'
    };
    setIncidents(prev => [...prev, newIncident]);
    return newIncident;
  }, []);

  const updateIncident = useCallback((incidentId, updates) => {
    setIncidents(prev => prev.map(i =>
      i.id === incidentId ? { ...i, ...updates } : i
    ));
  }, []);

  const deleteIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
  }, []);

  // Checkpoint functions
  const addCheckpoint = useCallback((checkpoint) => {
    const newCheckpoint = {
      id: `checkpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...checkpoint,
      status: checkpoint.status || 'pending',
      timestamp: Date.now()
    };
    setCheckpoints(prev => [...prev, newCheckpoint]);
    return newCheckpoint;
  }, []);

  const updateCheckpoint = useCallback((checkpointId, updates) => {
    setCheckpoints(prev => prev.map(c =>
      c.id === checkpointId ? { ...c, ...updates } : c
    ));
  }, []);

  const deleteCheckpoint = useCallback((checkpointId) => {
    setCheckpoints(prev => prev.filter(c => c.id !== checkpointId));
  }, []);

  // Operation functions
  const addOperation = useCallback((operation) => {
    const newOperation = {
      id: `operation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...operation,
      createdAt: Date.now(),
      status: operation.status || 'planning'
    };
    setOperations(prev => [...prev, newOperation]);
    return newOperation;
  }, []);

  const updateOperation = useCallback((operationId, updates) => {
    setOperations(prev => prev.map(o =>
      o.id === operationId ? { ...o, ...updates } : o
    ));
  }, []);

  const deleteOperation = useCallback((operationId) => {
    setOperations(prev => prev.filter(o => o.id !== operationId));
  }, []);

  // Resource functions
  const addResource = useCallback((resource) => {
    const newResource = {
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...resource,
      createdAt: Date.now()
    };
    setResources(prev => [...prev, newResource]);
    return newResource;
  }, []);

  const updateResource = useCallback((resourceId, updates) => {
    setResources(prev => prev.map(r =>
      r.id === resourceId ? { ...r, ...updates } : r
    ));
  }, []);

  const deleteResource = useCallback((resourceId) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  }, []);

  // Communication functions
  const addCommunication = useCallback((communication) => {
    const newCommunication = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...communication,
      timestamp: communication.timestamp || Date.now()
    };
    setCommunications(prev => [newCommunication, ...prev].slice(0, 200)); // Keep last 200
    return newCommunication;
  }, []);

  // Reset entire application
  const resetAll = useCallback(() => {
    // Batch state updates to reduce re-renders
    // Clear localStorage first
    localStorage.removeItem('searchTrackerState');

    // Use React's automatic batching (React 18+)
    // These will be batched into a single re-render
    setSearchAreas([]);
    setOfficers([]);
    setAlerts([]);
    setEvidenceMarkers([]);
    setIncidents([]);
    setCheckpoints([]);
    setOperations([]);
    setResources([]);
    setCommunications([]);
    setIsSimulationRunning(false);
    setIsPlaybackMode(false);
    setPlaybackTime(null);
    setCurrentTime(Date.now());
  }, []);

  // Export data
  const exportData = useCallback(() => {
    return {
      searchAreas,
      officers,
      alerts,
      evidenceMarkers,
      incidents,
      checkpoints,
      operations,
      resources,
      communications,
      exportedAt: Date.now()
    };
  }, [searchAreas, officers, alerts, evidenceMarkers, incidents, checkpoints, operations, resources, communications]);

  // Import data
  const importData = useCallback((data) => {
    if (data.searchAreas) setSearchAreas(data.searchAreas);
    if (data.officers) setOfficers(data.officers);
    if (data.alerts) setAlerts(data.alerts);
    if (data.evidenceMarkers) setEvidenceMarkers(data.evidenceMarkers);
    if (data.incidents) setIncidents(data.incidents);
    if (data.checkpoints) setCheckpoints(data.checkpoints);
    if (data.operations) setOperations(data.operations);
    if (data.resources) setResources(data.resources);
    if (data.communications) setCommunications(data.communications);
  }, []);

  const value = {
    // State
    searchAreas,
    officers,
    isSimulationRunning,
    simulationSpeed,
    currentTime,
    alerts,
    evidenceMarkers,
    incidents,
    checkpoints,
    operations,
    resources,
    communications,
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
    addEvidence,
    updateEvidence,
    deleteEvidence,
    addIncident,
    updateIncident,
    deleteIncident,
    addCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
    addOperation,
    updateOperation,
    deleteOperation,
    addResource,
    updateResource,
    deleteResource,
    addCommunication,
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
